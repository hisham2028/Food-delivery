import express from "express";
import UserController from "../controllers/UserController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";

class UserRoute {
  constructor() {
    this.router = express.Router();
    this.controller = UserController;
    this.authMiddleware = AuthMiddleware;
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/register", this.controller.register);
    this.router.post("/login", this.controller.login);
    this.router.get("/profile", this.authMiddleware.authenticate, this.controller.getUserProfile);
  }

  getRouter() {
    return this.router;
  }
}

export default new UserRoute().getRouter();
