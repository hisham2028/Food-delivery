import OrderService from "../services/OrderService.js";

class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  placeOrder = async (req, res) => {
    try {
      const result = await this.orderService.createOrder({
        userId: req.body.userId,
        items: req.body.items,
        amount: req.body.amount,
        address: req.body.address,
        paymentMethod: req.body.paymentMethod || 'card'
      });

      if (result.payment.type === 'cod') {
        return res.json({ success: true, message: result.payment.message });
      }

      res.json({ success: true, session_url: result.payment.session_url });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error placing order" });
    }
  }

  verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
      const result = await this.orderService.verifyPayment(orderId, success);
      res.json(result);
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error verifying order" });
    }
  }

  getUserOrders = async (req, res) => {
    try {
      const orders = await this.orderService.getUserOrders(req.body.userId);
      res.json({ success: true, data: orders });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error fetching user orders" });
    }
  }

  listOrders = async (req, res) => {
    try {
      const orders = await this.orderService.getAllOrders();
      res.json({ success: true, data: orders });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error collecting orders" });
    }
  }

  updateStatus = async (req, res) => {
    try {
      const { orderId, status } = req.body;
      await this.orderService.updateOrderStatus(orderId, status);
      res.json({ success: true, message: "Status Updated" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message || "Error updating status" });
    }
  }

  getOrderById = async (req, res) => {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      res.json({ success: true, data: order });
    } catch (error) {
      console.log(error);
      if (error.message === 'Order not found') {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      res.json({ success: false, message: "Error fetching order" });
    }
  }

  cancelOrder = async (req, res) => {
    try {
      const { orderId } = req.body;
      await this.orderService.cancelOrder(orderId, req.body.userId);
      res.json({ success: true, message: "Order cancelled successfully" });
    } catch (error) {
      console.log(error);
      if (error.message === 'Order not found') {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      res.json({ success: false, message: error.message || "Error cancelling order" });
    }
  }
}

export default new OrderController();
