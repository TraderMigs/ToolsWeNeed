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
    
    // Get query parameters
    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get('days') || '7');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const eventType = url.searchParams.get('eventType') || 'submit';
    
    // Calculate the date for filtering (e.g., 7 days ago)
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    
    // Query the database to get trending tools
    const { data, error } = await supabase
      .from('tool_analytics')
      .select('tool_id')
      .eq('event_type', eventType)
      .gte('timestamp', fromDate.toISOString())
      .limit(limit);
    
    if (error) {
      throw new Error(`Failed to get trending tools: ${error.message}`);
    }
    
    // Count occurrences of each tool_id
    const toolCounts = data.reduce((acc, item) => {
      acc[item.tool_id] = (acc[item.tool_id] || 0) + 1;
      return acc;
    }, {});
    
    // Convert to array and sort by count
    const trendingTools = Object.entries(toolCounts)
      .map(([tool_id, count]) => ({ tool_id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    
    return new Response(JSON.stringify({ 
      success: true,
      data: trendingTools,
      metadata: {
        days,
        eventType,
        fromDate: fromDate.toISOString(),
        toDate: new Date().toISOString()
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Error getting trending tools: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});