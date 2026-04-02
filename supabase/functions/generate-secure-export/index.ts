import { Stripe } from "npm:stripe@12.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import { jsPDF } from "npm:jspdf@3.0.1";
import { autoTable } from "npm:jspdf-autotable@5.0.2";
import { XLSX } from "npm:xlsx@0.18.5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 200,
    });
  }
  
  try {
    // Get environment variables
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!stripeSecretKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables");
    }
    
    // Initialize Stripe and Supabase clients
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse the request body
    const { sessionId, exportKey, format, filename, toolId } = await req.json();
    
    if ((!sessionId && !exportKey) || !format || !filename) {
      return new Response(JSON.stringify({ error: "Missing required parameters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    console.log('🔍 Looking for export data with:', { sessionId, exportKey });
    
    let exportData;
    
    // 🔥 NUCLEAR FIX: Try multiple data retrieval methods
    if (exportKey) {
      // Method 1: Try to get data using export_key from export_data table
      const { data: exportRecord, error: fetchError } = await supabase
        .from('export_data')
        .select('data')
        .eq('session_id', exportKey)
        .single();
      
      if (exportRecord && exportRecord.data) {
        exportData = exportRecord.data;
        console.log('✅ Export data found using export_key');
      } else {
        console.log('⚠️ Export data not found with export_key, trying sessionId');
      }
    }
    
    // Method 2: Fallback to sessionId lookup
    if (!exportData && sessionId) {
      const { data: sessionRecord, error: sessionError } = await supabase
        .from('export_data')
        .select('data')
        .eq('session_id', sessionId)
        .single();
      
      if (sessionRecord && sessionRecord.data) {
        exportData = sessionRecord.data;
        console.log('✅ Export data found using sessionId');
      }
    }
    
    if (!exportData) {
      console.error('❌ Export data not found with any method');
      throw new Error(`Export data not found for session: ${sessionId || exportKey}`);
    }
    
    console.log('✅ Export data retrieved from database:', { sessionId, exportKey, hasData: !!exportData });
    
    // Generate the export file based on the format
    let fileContent;
    let contentType;
    
    switch (format) {
      case 'json':
        fileContent = JSON.stringify(exportData, null, 2);
        contentType = 'application/json';
        break;
        
      case 'csv':
        if (!exportData.csvData || !Array.isArray(exportData.csvData)) {
          throw new Error("CSV data not available");
        }
        
        const headers = Object.keys(exportData.csvData[0]);
        const csvContent = [
          headers.join(','),
          ...exportData.csvData.map(row => 
            headers.map(header => {
              const value = row[header];
              if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value;
            }).join(',')
          )
        ].join('\n');
        
        fileContent = csvContent;
        contentType = 'text/csv';
        break;
        
      case 'txt':
        let content = `${exportData.title || filename}\n`;
        content += `Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n`;
        content += `Created with ToolsWeNeed.com\n`;
        content += '='.repeat(60) + '\n\n';
        
        if (exportData.summary || exportData.totals || exportData.results) {
          content += 'SUMMARY\n';
          content += '-'.repeat(20) + '\n';
          
          const summaryData = exportData.summary || exportData.totals || exportData.results;
          Object.entries(summaryData).forEach(([key, value]) => {
            const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            content += `${displayKey}: ${value}\n`;
          });
          content += '\n';
        }
        
        fileContent = content;
        contentType = 'text/plain';
        break;
        
      // Add other formats as needed
        
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
    
    // Record the successful export in the database
    await supabase
      .from('export_downloads')
      .insert({
        session_id: sessionId,
        tool_id: toolId,
        format,
        filename,
        customer_email: session.customer_details?.email,
        amount: session.amount_total,
        downloaded_at: new Date().toISOString()
      });
    
    // Return the file content
    return new Response(fileContent, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}.${format}"`,
      },
    });
  } catch (error) {
    console.error(`Error generating secure export: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});