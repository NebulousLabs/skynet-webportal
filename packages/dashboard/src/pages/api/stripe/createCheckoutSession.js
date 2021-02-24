import Stripe from "stripe";
import { StatusCodes } from "http-status-codes";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(StatusCodes.NOT_FOUND).end();
  }

  const { price } = req.body;

  if (!price) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: "Missing 'price' attribute" } });
  }

  // Create new Checkout Session for the order
  // Other optional params include:
  // [billing_address_collection] - to display billing address details on the page
  // [customer] - if you have an existing Stripe Customer ID
  // [customer_email] - lets you prefill the email input in the form
  // For full details see https://stripe.com/docs/api/checkout/sessions/create
  try {
    const stripeCustomerId = "cus_J09ECKPgFEPXoq";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price, quantity: 1 }],
      customer: stripeCustomerId,
      // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
      success_url: `${process.env.SKYNET_DASHBOARD_URL}/payments?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SKYNET_DASHBOARD_URL}/payments`,
    });

    console.log(session);

    res.json({ sessionId: session.id });
  } catch ({ message }) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: { message } });
  }
};