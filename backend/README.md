# 🔧 Food Delivery Backend — OOP Architecture

The backend is a **Node.js / Express.js REST API** built entirely with Object-Oriented Programming principles. Every file — routes, controllers, models, services, middleware, factories, and strategies — is a **class** with clear responsibilities. The codebase implements **5 design patterns**: Singleton, Strategy, Factory, MVC, and a Service Layer.

---

## 📋 Table of Contents

- [🔧 Food Delivery Backend — OOP Architecture](#-food-delivery-backend--oop-architecture)
  - [📋 Table of Contents](#-table-of-contents)
  - [🏗️ Architecture Overview](#️-architecture-overview)
    - [Layered Architecture Diagram](#layered-architecture-diagram)
    - [Layer Responsibilities](#layer-responsibilities)
    - [Request Lifecycle — Step by Step](#request-lifecycle--step-by-step)
  - [🎨 Design Patterns — In-Depth](#-design-patterns--in-depth)
    - [1. Singleton Pattern](#1-singleton-pattern)
    - [2. Strategy Pattern (File Upload Validation)](#2-strategy-pattern-file-upload-validation)
    - [3. Factory Pattern (Upload Middleware)](#3-factory-pattern-upload-middleware)
    - [How Factory + Strategy Compose](#how-factory--strategy-compose)
    - [4. MVC Pattern](#4-mvc-pattern)
    - [5. Service Layer Pattern](#5-service-layer-pattern)
  - [🧱 OOP Principles Applied](#-oop-principles-applied)
  - [📁 Project Structure](#-project-structure)
  - [💾 Data Models (Schemas)](#-data-models-schemas)
    - [Food Schema](#food-schema)
    - [User Schema](#user-schema)
    - [Order Schema](#order-schema)
  - [📚 API Reference](#-api-reference)
    - [Base URL](#base-url)
    - [Authentication](#authentication)
    - [Response Format](#response-format)
    - [👤 User Routes — `/api/user`](#-user-routes--apiuser)
      - [`POST /api/user/register`](#post-apiuserregister)
      - [`POST /api/user/login`](#post-apiuserlogin)
      - [`GET /api/user/profile` 🔒](#get-apiuserprofile-)
    - [🍕 Food Routes — `/api/food`](#-food-routes--apifood)
      - [`POST /api/food/add`](#post-apifoodadd)
      - [`GET /api/food/list`](#get-apifoodlist)
      - [`POST /api/food/remove`](#post-apifoodremove)
      - [`PUT /api/food/update/:id`](#put-apifoodupdateid)
      - [`GET /api/food/search?query=pizza`](#get-apifoodsearchquerypizza)
    - [🛒 Cart Routes — `/api/cart`](#-cart-routes--apicart)
      - [`POST /api/cart/add` 🔒](#post-apicartadd-)
      - [`POST /api/cart/remove` 🔒](#post-apicartremove-)
      - [`POST /api/cart/get` 🔒](#post-apicartget-)
      - [`POST /api/cart/clear` 🔒](#post-apicartclear-)
    - [📦 Order Routes — `/api/order`](#-order-routes--apiorder)
      - [`POST /api/order/place` 🔒](#post-apiorderplace-)
      - [`POST /api/order/verify`](#post-apiorderverify)
      - [`POST /api/order/userorders` 🔒](#post-apiorderuserorders-)
      - [`GET /api/order/list`](#get-apiorderlist)
      - [`POST /api/order/status`](#post-apiorderstatus)
      - [`GET /api/order/:id`](#get-apiorderid)
      - [`POST /api/order/cancel` 🔒](#post-apiordercancel-)
    - [Static Files](#static-files)
  - [🚀 Installation \& Setup](#-installation--setup)
    - [Prerequisites](#prerequisites)
    - [Install](#install)
    - [Dependencies Installed](#dependencies-installed)
  - [⚙️ Configuration](#️-configuration)
  - [🏃 Running](#-running)
    - [Development (auto-reload on file changes)](#development-auto-reload-on-file-changes)
    - [Production](#production)
    - [Verify it works](#verify-it-works)
  - [🔧 Troubleshooting](#-troubleshooting)

---

## 🏗️ Architecture Overview

### Layered Architecture Diagram

```
                         ┌─────────────────────┐
                         │    HTTP Request      │
                         └──────────┬──────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│  ROUTE LAYER                                                         │
│  FoodRoute.js  │  UserRoute.js  │  CartRoute.js  │  OrderRoute.js   │
│                                                                      │
│  • Defines HTTP method + URL path                                    │
│  • Attaches middleware (auth, file upload)                            │
│  • Delegates to Controller methods                                   │
│  • Each route is a class with its own Express Router                 │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│  MIDDLEWARE LAYER                                                     │
│  AuthMiddleware.js  │  FileUploadMiddleware.js                       │
│                                                                      │
│  AuthMiddleware:                                                     │
│    • Extracts JWT from req.headers.token                             │
│    • Verifies token with jwt.verify()                                │
│    • Injects userId into req.body                                    │
│                                                                      │
│  FileUploadMiddleware:                                               │
│    • Uses UploadMiddlewareFactory (Factory Pattern)                  │
│    • Factory selects a ValidationStrategy (Strategy Pattern)         │
│    • Multer parses multipart data and saves file to /uploads         │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│  CONTROLLER LAYER                                                    │
│  FoodController.js │ UserController.js │ CartController.js │ Order… │
│                                                                      │
│  • Reads parsed req.body, req.params, req.query, req.file           │
│  • Calls Model methods (CRUD) or Service methods (business logic)   │
│  • Formats and sends res.json({ success, data/message })            │
│  • Handles errors with try/catch → error responses                  │
│  • Each controller is a Singleton class                              │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│  SERVICE LAYER                                                       │
│  UserService.js │ CartService.js │ OrderService.js │ FoodService.js │
│  StripeService.js │ EmailService.js                                  │
│                                                                      │
│  • Pure business logic — no req/res objects                          │
│  • UserService: validation, password hashing, JWT generation         │
│  • CartService: cart operations with availability checks             │
│  • OrderService: order creation, payment processing, validation      │
│  • FoodService: food CRUD with image lifecycle management            │
│  • StripeService: Stripe Checkout session creation                   │
│  • EmailService: transactional email via Nodemailer                  │
│  • Accept model dependencies via constructor (Dependency Inversion)  │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│  MODEL LAYER                                                         │
│  FoodModel.js  │  UserModel.js  │  OrderModel.js                    │
│                                                                      │
│  • Mongoose schema definition with validations                       │
│  • Data access methods: create, findById, findAll, updateById,      │
│    deleteById, plus domain-specific methods (findByEmail, etc.)     │
│  • Each model is a Singleton — prevents Mongoose OverwriteModelError│
│  • Schema indexes for text search (FoodModel)                        │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│  DATA LAYER                                                          │
│                                                                      │
│  ┌─────────────────────┐        ┌─────────────────────┐             │
│  │  MongoDB             │        │  File System         │             │
│  │  (Database.js        │        │  /uploads directory  │             │
│  │   Singleton)         │        │  (Multer diskStorage)│             │
│  └─────────────────────┘        └─────────────────────┘             │
└──────────────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Knows About | Does NOT Know About |
|---|---|---|
| **Routes** | URL paths, HTTP methods, which middleware to apply, which controller method to call | Business logic, database queries, response formatting |
| **Middleware** | `req`/`res`/`next`, JWT tokens, file validation rules | Business logic, specific controller implementations |
| **Controllers** | `req`/`res`, which model/service methods to call, how to format responses | Database internals, Mongoose queries, hashing algorithms |
| **Services** | Business rules, validation logic, external APIs (Stripe, email) | HTTP layer (`req`/`res`), Express, routing |
| **Models** | Mongoose schemas, database CRUD operations, indexes | HTTP, business rules, controllers |
| **Config** | Connection strings, environment variables | Everything else |

### Request Lifecycle — Step by Step

Here is the **complete journey** of a `POST /api/order/place` request:

```
1.  Client sends POST /api/order/place
    Headers: { token: "eyJhbGciOi..." }
    Body: { items: [...], amount: 25.99, address: {...} }

2.  Express matches URL → OrderRoute
    OrderRoute.initializeRoutes() registered:
      this.router.post("/place", this.authMiddleware.authenticate, this.controller.placeOrder)

3.  AuthMiddleware.authenticate(req, res, next)
    → Reads req.headers.token
    → jwt.verify(token, process.env.JWT_SECRET)
    → Injects decoded user ID: req.body.userId = token_decode.id
    → Calls next()

4.  OrderController.placeOrder(req, res)
    → Reads req.body: { userId, items, amount, address }
    → Calls this.orderModel.create({ userId, items, amount, address })
    → Calls this.userModel.updateById(userId, { cartData: {} })  // clear cart
    → If payment method is "cod": returns { success: true, message: "Order Placed" }
    → Otherwise:
        → Calls this.stripeService.formatLineItems(items)
        → Calls this.stripeService.createCheckoutSession(lineItems, order._id)
        → Returns { success: true, session_url: session.url }

5.  OrderModel.create(orderData)
    → new this.model(orderData)  // creates Mongoose document
    → await food.save()          // validates schema + writes to MongoDB
    → Returns saved document with _id

6.  StripeService.createCheckoutSession(lineItems, orderId)
    → this.stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: `${FRONTEND_URL}/verify?success=true&orderId=${orderId}`,
        cancel_url:  `${FRONTEND_URL}/verify?success=false&orderId=${orderId}`,
      })
    → Returns Stripe session with redirect URL

7.  Client receives { success: true, session_url: "https://checkout.stripe.com/..." }
    → Frontend redirects user to Stripe Checkout
    → After payment, Stripe redirects to /verify?success=true&orderId=xxx
    → Frontend calls POST /api/order/verify to confirm payment
```

---

## 🎨 Design Patterns — In-Depth

### 1. Singleton Pattern

> **Intent:** Ensure a class has only one instance throughout the application lifecycle.

**Where:** Every Model, Controller, Service, and Middleware in the backend.

**Implementation approach:** The class is instantiated once at module level, and the instance is exported as the default export.

```
┌──────────────────────────────────────────────────────────────┐
│  class Database {                                             │
│    constructor() { this.connection = null; }                  │
│    async connect() { ... }                                   │
│    getConnection() { return this.connection; }                │
│  }                                                           │
│  export default new Database();  ◄── THE singleton instance  │
│                                                              │
│  // Every import gets the SAME object:                       │
│  import Database from './config/Database.js';                │
│  // Database.connection is shared across the entire app      │
└──────────────────────────────────────────────────────────────┘
```

**Complete list of backend Singletons:**

| Singleton | File | Why? |
|---|---|---|
| `Database` | `config/Database.js` | One MongoDB connection pool for the entire process |
| `FoodModel` | `models/FoodModel.js` | One Mongoose model registration per schema (prevents `OverwriteModelError`) |
| `UserModel` | `models/UserModel.js` | Same reason |
| `OrderModel` | `models/OrderModel.js` | Same reason |
| `FoodController` | `controllers/FoodController.js` | Stateless — no reason for multiple instances |
| `UserController` | `controllers/UserController.js` | Stateless |
| `CartController` | `controllers/CartController.js` | Stateless |
| `OrderController` | `controllers/OrderController.js` | Stateless |
| `AuthMiddleware` | `middleware/AuthMiddleware.js` | Stateless JWT operations |
| `FileUploadMiddleware` | `middleware/FileUploadMiddleware.js` | Holds single Multer storage config + Factory instance |
| `StripeService` | `services/StripeService.js` | One Stripe client per API key |
| `EmailService` | `services/EmailService.js` | One Nodemailer configuration |

**Note:** `UserService`, `CartService`, `OrderService`, and `FoodService` are exported as **classes** (not instances) because they accept constructor dependencies for testability:
```javascript
class CartService {
  constructor(userModel = null, foodModel = null) {
    this.userModel = userModel || UserModel;   // default to singleton, or inject mock
    this.foodModel = foodModel || FoodModel;
  }
}
export default CartService;  // exported as class, not instance
```

---

### 2. Strategy Pattern (File Upload Validation)

> **Intent:** Define a family of interchangeable algorithms, encapsulate each one in its own class, and select the appropriate one at runtime.

**Problem:** Different upload scenarios need different validation:
- Food images: JPEG, JPG, PNG, WebP — max 5 MB
- User avatars: Same types — max 2 MB
- Documents: PDF only — max 10 MB

Without Strategy, you'd write:
```javascript
// ❌ BAD: Giant if/else that violates Open/Closed Principle
if (type === 'image') { ... }
else if (type === 'avatar') { ... }
else if (type === 'document') { ... }
// Adding a new type means modifying this function
```

**Solution — Class hierarchy:**

```
BaseValidationStrategy                    ◄── Abstract interface
│
│   validate(file) {
│     throw new Error('must be implemented');  // forces subclasses to override
│   }
│
├── ImageValidationStrategy               ◄── Concrete strategy A
│   │   allowedTypes: [jpeg, jpg, png, webp]
│   │   validate(file) → checks mimetype
│   │
│   └── AvatarValidationStrategy          ◄── Inherits from Image (same types)
│         (size limit is controlled by Factory, not Strategy)
│
└── DocumentValidationStrategy            ◄── Concrete strategy B
      allowedTypes: [application/pdf]
      validate(file) → checks mimetype
```

**Key design decisions:**

1. **`BaseValidationStrategy.validate()` throws by default** — this is the "abstract method" pattern in JavaScript. Any subclass that forgets to implement `validate()` will fail loudly at runtime.

2. **`AvatarValidationStrategy` extends `ImageValidationStrategy`** — avatars accept the same file types as images. The only difference (2 MB vs 5 MB size limit) is controlled by the Factory's preset configuration, not the Strategy. This avoids duplicating MIME-type logic.

3. **`ImageValidationStrategy` accepts `allowedTypes` via constructor** — this makes it configurable. You could create a custom image strategy that also accepts GIFs:
   ```javascript
   new ImageValidationStrategy({ allowedTypes: ['image/jpeg', 'image/gif'] })
   ```

4. **Strategies throw errors** (not return booleans) — this integrates cleanly with Multer's `fileFilter(req, file, cb)` callback pattern, where errors reject the upload.

---

### 3. Factory Pattern (Upload Middleware)

> **Intent:** Centralise object creation logic. The caller specifies *what* it wants (a preset name), and the Factory figures out *how* to build it.

```
┌──────────────────────────────────────────────────────────────────┐
│  UploadMiddlewareFactory                                          │
│                                                                   │
│  Presets Map:                                                     │
│  ┌──────────┬─────────────────────────────┬────────────────────┐ │
│  │  Preset  │  Strategy                   │  File Size Limit   │ │
│  ├──────────┼─────────────────────────────┼────────────────────┤ │
│  │  image   │  ImageValidationStrategy    │  5 MB              │ │
│  │  avatar  │  AvatarValidationStrategy   │  2 MB              │ │
│  │  document│  DocumentValidationStrategy │  10 MB             │ │
│  └──────────┴─────────────────────────────┴────────────────────┘ │
│                                                                   │
│  create({ preset, fieldName }) → Multer middleware instance       │
│                                                                   │
│  The create() method:                                             │
│  1. Looks up the preset in the map                                │
│  2. Gets the Strategy + limits                                    │
│  3. Configures Multer with storage, limits, fileFilter            │
│  4. Returns multer(...).single(fieldName)                         │
└──────────────────────────────────────────────────────────────────┘
```

**Usage flow:**

```javascript
// FileUploadMiddleware.js (consumes the Factory)
class FileUploadMiddleware {
  constructor() {
    this.storage = multer.diskStorage({
      destination: 'uploads',
      filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}-${random}.${ext}`);
      }
    });
    this.factory = new UploadMiddlewareFactory({ storage: this.storage });
  }

  upload(fieldName = 'image') {
    return this.factory.create({ fieldName, preset: 'image' });
  }

  uploadWithPreset(preset, fieldName = 'file') {
    return this.factory.create({ preset, fieldName });
  }
}

// FoodRoute.js (one-liner to create middleware)
this.router.post("/add", FileUploadMiddleware.upload("image"), this.controller.addFood);
```

**Extensibility:** To add a new upload type (e.g. video), you:
1. Create `VideoValidationStrategy extends BaseValidationStrategy`
2. Add a `video` preset to the Factory's map
3. Done. No changes to routes, controllers, or middleware.

### How Factory + Strategy Compose

```
Route calls:  FileUploadMiddleware.upload("image")
                     │
                     ▼
FileUploadMiddleware calls:  this.factory.create({ preset: 'image', fieldName: 'image' })
                     │
                     ▼
UploadMiddlewareFactory.create():
  1. Looks up preset 'image' → { strategy: ImageValidationStrategy, limits: 5MB }
  2. Creates Multer instance with:
     - storage:    diskStorage (saves to /uploads)
     - limits:     { fileSize: 5 * 1024 * 1024 }
     - fileFilter: (req, file, cb) => {
                     strategy.validate(file);   ◄── STRATEGY called here
                     cb(null, true);
                   }
  3. Returns multer.single('image')
                     │
                     ▼
Express calls the returned middleware on the incoming request
  → Multer parses multipart data
  → fileFilter calls ImageValidationStrategy.validate(file)
  → If valid: file saved, req.file populated
  → If invalid: Error thrown, upload rejected
```

---

### 4. MVC Pattern

> **Intent:** Separate concerns into Model (data), View (presentation), and Controller (orchestration).

Since this is a REST API, there are no HTML views. The "View" is the JSON response format:

| MVC Layer | Implementation | Example |
|---|---|---|
| **Model** | `FoodModel.js` — schema + `create()`, `findAll()`, `deleteById()` | `await this.model.find({})` |
| **Controller** | `FoodController.js` — reads `req`, calls model, sends `res` | `res.json({ success: true, data: foods })` |
| **View** | JSON response contract | `{ success: boolean, message?: string, data?: any }` |
| **Router** | `FoodRoute.js` — maps URL → middleware → controller | `router.get("/list", controller.listFood)` |

**Consistent response format across all endpoints:**

```javascript
// Success
{ success: true, message: "Operation description", data: { ... } }

// Error
{ success: false, message: "What went wrong" }
```

---

### 5. Service Layer Pattern

> **Intent:** Extract business logic from controllers into dedicated service classes, keeping controllers thin.

| Service | Responsibility | Key Methods |
|---|---|---|
| `UserService` | Registration validation, password hashing (bcrypt, 10 rounds), JWT generation, login verification | `register()`, `login()`, `getProfile()` |
| `CartService` | Cart operations with food availability checks, quantity management | `addToCart()`, `removeFromCart()`, `getCart()`, `clearCart()` |
| `OrderService` | Order creation, item validation, payment processing, status management | `createOrder()`, `verifyPayment()`, `updateOrderStatus()`, `cancelOrder()` |
| `FoodService` | Food CRUD with image lifecycle (upload new → delete old on update/remove) | `addFood()`, `updateFood()`, `deleteFood()`, `searchFoods()` |
| `StripeService` | Stripe Checkout session creation, line item formatting, payment intents | `createCheckoutSession()`, `formatLineItems()`, `createPaymentIntent()` |
| `EmailService` | Transactional email via Nodemailer (lazy transporter creation) | `sendEmail()`, `sendOrderStatusUpdate()` |

**Dependency Injection in Services:**

Services accept their dependencies via constructor parameters with defaults:

```javascript
class OrderService {
  constructor(orderModel = null, userModel = null, foodModel = null) {
    this.orderModel = orderModel || OrderModel;   // use singleton by default
    this.userModel  = userModel  || UserModel;     // or inject a mock for testing
    this.foodModel  = foodModel  || FoodModel;
  }
}
```

This follows the **Dependency Inversion Principle** — services depend on abstractions (the model interface), not concrete implementations. In tests, you can inject mock models.

---

## 🧱 OOP Principles Applied

| Principle | Where & How |
|---|---|
| **Encapsulation** | Models wrap Mongoose operations behind clean methods (`create`, `findById`). Controllers never access `mongoose.model()` directly. `StripeService` hides the Stripe SDK behind `createCheckoutSession()`. |
| **Inheritance** | `AvatarValidationStrategy → ImageValidationStrategy → BaseValidationStrategy`. Avatar inherits image validation rules without duplicating code. |
| **Polymorphism** | All strategies implement `validate(file)`. The Factory and Multer call `strategy.validate()` without knowing the concrete class. You can swap `ImageValidationStrategy` for a `StrictImageValidationStrategy` and nothing else changes. |
| **Abstraction** | `BaseValidationStrategy` defines an abstract interface. Models provide a uniform CRUD interface regardless of the underlying schema. |
| **Single Responsibility** | `StripeService` only handles Stripe. `EmailService` only sends emails. `AuthMiddleware` only verifies JWTs. `FoodController` only handles food HTTP requests. |
| **Open/Closed** | Adding new file validation = new Strategy class + new Factory preset. Zero changes to existing code. |
| **Dependency Inversion** | Services accept model dependencies via constructor injection. The `Server` class accepts `Database` as a dependency. |

---

## 📁 Project Structure

```
backend/
├── 📄 package.json                           ◄── Dependencies & scripts
├── 📄 README.md                              ◄── You are here
├── 📄 test-connection.js                     ◄── MongoDB connection test utility
│
├── 📂 src/
│   ├── 📄 server.js                          ◄── Server class — entry point
│   │     • Initialises Express, CORS, JSON parsing
│   │     • Mounts all route groups under /api/*
│   │     • Serves static files from /uploads via /images
│   │     • Connects to MongoDB via Database singleton
│   │
│   ├── 📂 config/
│   │   └── 📄 Database.js                    ◄── Singleton
│   │         • MongoDB connection management
│   │         • connect(), disconnect(), getConnection()
│   │
│   ├── 📂 routes/                            ◄── URL → Middleware → Controller
│   │   ├── 📄 FoodRoute.js                   POST /add, GET /list, POST /remove, PUT /update/:id, GET /search
│   │   ├── 📄 UserRoute.js                   POST /register, POST /login, GET /profile
│   │   ├── 📄 CartRoute.js                   POST /add, POST /remove, POST /get, POST /clear
│   │   └── 📄 OrderRoute.js                  POST /place, POST /verify, POST /userorders, GET /list, POST /status, GET /:id, POST /cancel
│   │
│   ├── 📂 middleware/
│   │   ├── 📄 AuthMiddleware.js              ◄── Singleton
│   │   │     • authenticate(): JWT verification, injects userId
│   │   │     • generateToken(): creates 7-day JWT
│   │   │     • verifyToken(): stateless token validation
│   │   │
│   │   └── 📄 FileUploadMiddleware.js        ◄── Singleton
│   │         • Configures Multer diskStorage (destination, unique filenames)
│   │         • Creates UploadMiddlewareFactory instance
│   │         • upload(fieldName): returns middleware for image preset
│   │         • uploadWithPreset(preset, fieldName): returns middleware for any preset
│   │
│   ├── 📂 controllers/                       ◄── All Singletons
│   │   ├── 📄 FoodController.js              addFood, listFood, updateFood, removeFood, searchFood
│   │   ├── 📄 UserController.js              login, register, getUserProfile
│   │   ├── 📄 CartController.js              addToCart, removeFromCart, getCart, clearCart
│   │   └── 📄 OrderController.js             placeOrder, verifyOrder, getUserOrders, listOrders, updateStatus, getOrderById, cancelOrder
│   │
│   ├── 📂 services/
│   │   ├── 📄 UserService.js                 ◄── Class (not singleton) — DI-ready
│   │   ├── 📄 CartService.js                 ◄── Class (not singleton) — DI-ready
│   │   ├── 📄 OrderService.js                ◄── Class (not singleton) — DI-ready
│   │   ├── 📄 FoodService.js                 ◄── Class (not singleton) — DI-ready
│   │   ├── 📄 StripeService.js               ◄── Singleton — Stripe SDK wrapper
│   │   └── 📄 EmailService.js                ◄── Singleton — Nodemailer wrapper
│   │
│   ├── 📂 models/                            ◄── All Singletons
│   │   ├── 📄 FoodModel.js                   Schema: name, description, price, image, category, isAvailable
│   │   ├── 📄 UserModel.js                   Schema: name, email, password, cartData, resetPasswordToken/Expire
│   │   └── 📄 OrderModel.js                  Schema: userId, items, amount, address, status, date, payment
│   │
│   ├── 📂 factories/
│   │   └── 📄 UploadMiddlewareFactory.js     ◄── Factory Pattern
│   │         • Presets: image (5MB), avatar (2MB), document (10MB)
│   │         • create(): builds Multer middleware with Strategy + limits
│   │
│   └── 📂 strategies/
│       └── 📂 fileUpload/                    ◄── Strategy Pattern
│           ├── 📄 BaseValidationStrategy.js   Abstract base — validate() throws
│           ├── 📄 ImageValidationStrategy.js  JPEG, JPG, PNG, WebP
│           ├── 📄 AvatarValidationStrategy.js Extends Image (same types, smaller limit via Factory)
│           └── 📄 DocumentValidationStrategy.js PDF only
│
└── 📂 uploads/                               ◄── Multer file storage (gitignored)
    └── image-1772639007411-281590379.png      ◄── Example uploaded file
```

---

## 💾 Data Models (Schemas)

### Food Schema

| Field | Type | Required | Default | Validation |
|---|---|---|---|---|
| `name` | String | ✅ | — | "Food name is required" |
| `description` | String | ✅ | — | "Description is required" |
| `price` | Number | ✅ | — | min: 0, "Price must be a positive number" |
| `image` | String | ✅ | — | "Image URL is required" |
| `category` | String | ✅ | — | "Category is required" |
| `isAvailable` | Boolean | ❌ | `true` | — |
| `createdAt` | Date | auto | — | Mongoose timestamps |
| `updatedAt` | Date | auto | — | Mongoose timestamps |

**Indexes:** Full-text index on `name`, `description`, `category` for search.

### User Schema

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `name` | String | ✅ | — | — |
| `email` | String | ✅ | — | `unique: true` |
| `password` | String | ✅ | — | bcrypt hash (10 salt rounds) |
| `cartData` | Object | ❌ | `{}` | `{ itemId: quantity }` map |
| `resetPasswordToken` | String | ❌ | — | For password reset flow |
| `resetPasswordExpire` | Date | ❌ | — | Token expiration |
| `createdAt` | Date | auto | — | Mongoose timestamps |
| `updatedAt` | Date | auto | — | Mongoose timestamps |

**Options:** `minimize: false` — preserves empty `cartData: {}` in MongoDB.

### Order Schema

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `userId` | String | ✅ | — | References user who placed order |
| `items` | Array | ✅ | — | `[{ name, quantity, price, _id }]` |
| `amount` | Number | ✅ | — | Total order amount |
| `address` | Object | ✅ | — | `{ firstName, lastName, street, city, state, country, zipcode, phone }` |
| `status` | String | ❌ | `"Food Processing"` | One of: Food Processing, Out for Delivery, Delivered, Cancelled |
| `date` | Date | ❌ | `Date.now` | Order creation timestamp |
| `payment` | Boolean | ❌ | `false` | `true` after Stripe confirms payment |

---

## 📚 API Reference

### Base URL
```
http://localhost:4000
```

### Authentication
Protected endpoints require a JWT in the `token` header:
```
token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
Tokens are valid for **7 days**.

### Response Format
```javascript
// Success
{ "success": true, "message": "Description", "data": { ... } }

// Error
{ "success": false, "message": "What went wrong" }
```

---

### 👤 User Routes — `/api/user`

#### `POST /api/user/register`
Register a new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Success (200):**
```json
{ "success": true, "token": "eyJhbGciOi..." }
```

**Errors:**
| Condition | Response |
|---|---|
| Missing fields | `{ success: false, message: "Please provide name, email and password" }` |
| Invalid email | `{ success: false, message: "Enter a Valid Email" }` |
| Weak password | `{ success: false, message: "Enter a strong password" }` |
| Duplicate email | `{ success: false, message: "User Already Exists" }` |

#### `POST /api/user/login`
Authenticate and receive a JWT.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Success (200):**
```json
{ "success": true, "token": "eyJhbGciOi..." }
```

#### `GET /api/user/profile` 🔒
Get the authenticated user's profile (password excluded).

**Headers:** `token: <jwt>`

**Success (200):**
```json
{
  "success": true,
  "data": {
    "_id": "6612abc...",
    "name": "John Doe",
    "email": "john@example.com",
    "cartData": {},
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 🍕 Food Routes — `/api/food`

#### `POST /api/food/add`
Add a new food item with image upload.

**Request:** `multipart/form-data`

| Field | Type | Required |
|---|---|---|
| `name` | string | ✅ |
| `description` | string | ❌ |
| `price` | number | ✅ |
| `category` | string | ❌ (default: "other") |
| `image` | file | ✅ (JPEG/PNG/WebP, max 5MB) |

**Success (201):**
```json
{
  "success": true,
  "message": "Food item added successfully",
  "data": {
    "_id": "6612abc...",
    "name": "Margherita Pizza",
    "description": "Classic Italian pizza",
    "price": 12.99,
    "category": "Pasta",
    "image": "image-1772639007411-281590379.png",
    "isAvailable": true
  }
}
```

#### `GET /api/food/list`
Get all food items.

**Success (200):**
```json
{
  "success": true,
  "data": [
    { "_id": "...", "name": "...", "price": 12.99, "image": "...", ... },
    ...
  ]
}
```

#### `POST /api/food/remove`
Delete a food item and its image file.

**Request:**
```json
{ "id": "6612abc..." }
```

#### `PUT /api/food/update/:id`
Update a food item. Supports optional image replacement.

**Request:** `multipart/form-data` — any food field + optional new `image` file.

#### `GET /api/food/search?query=pizza`
Full-text search across name, description, and category.

---

### 🛒 Cart Routes — `/api/cart`

All cart routes require authentication (`token` header).

#### `POST /api/cart/add` 🔒
Add one quantity of an item to the cart.

**Request:**
```json
{ "itemId": "6612abc..." }
```

#### `POST /api/cart/remove` 🔒
Remove one quantity of an item from the cart.

**Request:**
```json
{ "itemId": "6612abc..." }
```

#### `POST /api/cart/get` 🔒
Get the authenticated user's cart.

**Success (200):**
```json
{
  "success": true,
  "cartData": {
    "6612abc...": 2,
    "6612def...": 1
  }
}
```

#### `POST /api/cart/clear` 🔒
Clear all items from the cart.

---

### 📦 Order Routes — `/api/order`

#### `POST /api/order/place` 🔒
Place a new order. Creates a Stripe Checkout session for card payments, or confirms immediately for COD.

**Request:**
```json
{
  "items": [
    { "_id": "6612abc...", "name": "Pizza", "price": 12.99, "quantity": 2 }
  ],
  "amount": 27.98,
  "address": {
    "firstName": "John",
    "lastName": "Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "US",
    "zipcode": "10001",
    "phone": "555-0123"
  },
  "paymentMethod": "card"
}
```

**Success — Card payment (200):**
```json
{ "success": true, "session_url": "https://checkout.stripe.com/c/pay/..." }
```

**Success — COD (200):**
```json
{ "success": true, "message": "Order Placed" }
```

#### `POST /api/order/verify`
Verify payment after Stripe redirect.

**Request:**
```json
{ "orderId": "6612abc...", "success": "true" }
```

If `success` is `"true"` → marks order as paid.  
If `success` is `"false"` → deletes the order.

#### `POST /api/order/userorders` 🔒
Get all orders for the authenticated user.

#### `GET /api/order/list`
Get all orders (admin endpoint).

#### `POST /api/order/status`
Update order status.

**Request:**
```json
{
  "orderId": "6612abc...",
  "status": "Out for Delivery"
}
```

**Valid statuses:** `Food Processing`, `Out for Delivery`, `Delivered`, `Cancelled`

#### `GET /api/order/:id`
Get a single order by ID.

#### `POST /api/order/cancel` 🔒
Cancel an order (only if status is "Food Processing").

### Static Files

| URL | Serves |
|---|---|
| `GET /images/<filename>` | Files from the `uploads/` directory |

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v16+
- MongoDB v5+ (local or MongoDB Atlas)
- Stripe account with test API key

### Install
```bash
cd backend
npm install
```

### Dependencies Installed
| Package | Version | Purpose |
|---|---|---|
| express | 4.18 | HTTP framework |
| mongoose | 8.1 | MongoDB ODM |
| cors | 2.8 | Cross-origin requests |
| dotenv | 16.4 | Environment variables |
| jsonwebtoken | 9.0 | JWT auth |
| bcryptjs | 2.4 | Password hashing |
| validator | 13.11 | Email validation |
| multer | 1.4.5 | File upload parsing |
| stripe | 14.14 | Payment processing |
| nodemailer | 8.0 | Email sending |
| nodemon | 3.0 | Dev auto-reload (devDep) |

---

## ⚙️ Configuration

Create a `.env` file in the `backend/` root:

```env
# Server
PORT=4000

# MongoDB (local or Atlas connection string)
MONGODB_URI=mongodb://localhost:27017/food-delivery

# JWT Secret (use a long random string, min 32 chars)
JWT_SECRET=your_secure_random_string_here

# Stripe (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Frontend URL (Stripe redirects here after payment)
FRONTEND_URL=http://localhost:5173

# Email (optional — for order status notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | ❌ | `4000` | Server listen port |
| `MONGODB_URI` | ✅ | — | MongoDB connection string |
| `JWT_SECRET` | ✅ | — | Secret key for signing JWTs |
| `STRIPE_SECRET_KEY` | ✅ | — | Stripe secret key (starts with `sk_test_` or `sk_live_`) |
| `FRONTEND_URL` | ✅ | — | Frontend URL for Stripe success/cancel redirects |
| `SMTP_HOST` | ❌ | `smtp.gmail.com` | SMTP server hostname |
| `SMTP_PORT` | ❌ | `587` | SMTP server port |
| `EMAIL_USER` | ❌ | — | Email sender address |
| `EMAIL_PASSWORD` | ❌ | — | Email sender password/app password |

---

## 🏃 Running

### Development (auto-reload on file changes)
```bash
npm run dev
```
Server starts on `http://localhost:4000`. Nodemon watches for changes.

### Production
```bash
npm start
```

### Verify it works
```bash
curl http://localhost:4000
# Response: "API Working Successfully"
```

---

## 🔧 Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| `MongoDB connection error` | MongoDB not running or wrong URI | Start `mongod` service; check `MONGODB_URI` |
| `EADDRINUSE: port 4000` | Port occupied | `npx kill-port 4000` or change `PORT` in `.env` |
| `Stripe session creation failed` | Invalid API key | Verify `STRIPE_SECRET_KEY` starts with `sk_test_` |
| `Image upload fails` | Missing directory | Create `backend/uploads/` with write permissions |
| `OverwriteModelError` | Mongoose model registered twice | Models use `mongoose.models.X \|\| mongoose.model()` guard |
| `JWT Error: Not Authorized` | Token expired or malformed | Login again (tokens last 7 days) |
| `CORS errors` | Origin not allowed | Backend uses `cors()` with no restrictions by default |
| `Cannot cancel order` | Wrong status | Only `"Food Processing"` orders can be cancelled |
| `DNS resolution errors` | Network issues | Server sets DNS to `8.8.8.8`, `1.1.1.1` (see `server.js`) |

---

<p align="center">Built with ❤️ using OOP and Design Patterns</p>
