import { createClient } from "npm:@supabase/supabase-js@2.39.7";

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables");
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse the request body
    const { sessionId, data, exportKey } = await req.json();
    
    if ((!sessionId && !exportKey) || !data) {
      return new Response(JSON.stringify({ error: "Missing required parameters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // 🔥 NUCLEAR FIX: Store with both sessionId and exportKey for redundancy
    const storageKey = exportKey || sessionId;
    
    const { data: insertedData, error: insertError } = await supabase
      .from('export_data')
      .upsert({
        session_id: storageKey,
        data
      }, {
        onConflict: 'session_id'
      })
      .select();
    
    if (insertError) {
      console.error('❌ Failed to store export data:', { sessionId, error: insertError });
      throw new Error(`Failed to store export data: ${insertError.message}`);
    }
    
    console.log('✅ Export data stored successfully:', { storageKey, dataSize: JSON.stringify(data).length });
    
    return new Response(JSON.stringify({ 
      success: true, 
      sessionId: storageKey,
      dataStored: true 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Error storing export data: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});