import { Stripe } from "npm:stripe@12.5.0";
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
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeSecretKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { priceId, successUrl, cancelUrl, metadata = {} } = await req.json();

    if (!priceId) {
      return new Response(JSON.stringify({ error: "Price ID is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const exportKey = `export_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // 🔥 Persist session info BEFORE sending to Stripe
    const { error: dbError } = await supabase
      .from("export_sessions")
      .insert({
        session_id: null, // Placeholder, Stripe ID will be saved later
        export_key: exportKey,
        tool_id: metadata.toolId || "default",
        filename: metadata.filename || "export",
        format: metadata.format || "pdf",
        status: "pending",
      });

    if (dbError) {
      console.error("❌ Failed to insert export session:", dbError);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${successUrl.split("?")[0]}/payment-success.html?session_id={CHECKOUT_SESSION_ID}&export_key=${exportKey}`,
      cancel_url: cancelUrl,
      metadata: {
        ...metadata,
        export_key: exportKey,
      },
    });

    // 🔁 Update session ID after Stripe returns it
    const { error: updateError } = await supabase
      .from("export_sessions")
      .update({ session_id: session.id })
      .eq("export_key", exportKey);

    if (updateError) {
      console.error("⚠️ Failed to update session_id:", updateError);
    }

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id, exportKey }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(`❌ Error in checkout session: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
