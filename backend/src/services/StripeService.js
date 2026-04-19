import Stripe from "stripe";

class StripeService {
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async createCheckoutSession(lineItems, orderId) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/verify?success=true&orderId=${orderId}`,
        cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&orderId=${orderId}`,
      });
      return session;
    } catch (error) {
      throw new Error(`Stripe session creation failed: ${error.message}`);
    }
  }

  formatLineItems(items) {
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }));

    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Charges" },
        unit_amount: 2 * 100
      },
      quantity: 1
    });

    return lineItems;
  }

  async createPaymentIntent(amount, currency = 'usd') {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        currency: currency,
      });
      return paymentIntent;
    } catch (error) {
      throw new Error(`Payment intent creation failed: ${error.message}`);
    }
  }
}

export default new StripeService();
