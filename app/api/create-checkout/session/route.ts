import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set.");
}

if (!baseUrl) {
  throw new Error("NEXT_PUBLIC_BASE_URL environment variable is not set.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const full_name = body.full_name ?? "No full name provided";
    const email = body.email ?? "no-email@example.com";
    const ticket_name = body.ticket_name ?? "Unnamed Ticket";
    const price = typeof body.price === "number" ? body.price : 0;
    const quantity = typeof body.quantity === "number" ? body.quantity : 1;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `🎟 ${ticket_name}`,
            },
            unit_amount: price * 100,
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      customer_email: email !== "no-email@example.com" ? email : undefined,
      metadata: {
        full_name,
        ticket_name,
      },
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/checkout`,
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
