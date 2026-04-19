import CartService from "../services/CartService.js";

class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  addToCart = async (req, res) => {
    try {
      const result = await this.cartService.addToCart(req.body.userId, req.body.itemId);
      res.json({ success: true, message: result.message });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message || "Error adding to cart" });
    }
  }

  removeFromCart = async (req, res) => {
    try {
      const result = await this.cartService.removeFromCart(req.body.userId, req.body.itemId);
      res.json({ success: true, message: result.message });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message || "Error removing from cart" });
    }
  }

  getCart = async (req, res) => {
    try {
      const result = await this.cartService.getCart(req.body.userId);
      res.json({ success: true, cartData: result.cartData });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message || "Error fetching cart" });
    }
  }

  clearCart = async (req, res) => {
    try {
      const result = await this.cartService.clearCart(req.body.userId);
      res.json({ success: true, message: result.message });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message || "Error clearing cart" });
    }
  }
}

export default new CartController();
