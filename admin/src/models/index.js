
// ─── OrderItem ────────────────────────────────────────────────────────────────
export class OrderItem {
  constructor({ name, quantity }) {
    this.name     = name;
    this.quantity = quantity;
  }
  toString() { return `${this.name} x ${this.quantity}`; }
}

// ─── Address ──────────────────────────────────────────────────────────────────
export class Address {
  constructor({ firstName = '', lastName = '', street = '', city = '',
                state = '', country = '', zipcode = '', phone = '' } = {}) {
    this.firstName = firstName;
    this.lastName  = lastName;
    this.street    = street;
    this.city      = city;
    this.state     = state;
    this.country   = country;
    this.zipcode   = zipcode;
    this.phone     = phone;
  }
  get fullName()    { return `${this.firstName} ${this.lastName}`.trim(); }
  get cityLine()    { return `${this.city}, ${this.state}, ${this.country} ${this.zipcode}`; }
  get singleLine()  { return `${this.street}, ${this.cityLine}`; }
}

// ─── Order ────────────────────────────────────────────────────────────────────
export const ORDER_STATUSES = {
  FOOD_PROCESSING:  'Food Processing',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED:        'Delivered',
};

export class Order {
  constructor(raw) {
    this._id     = raw._id;
    this.amount  = Number(raw.amount ?? 0);
    this.status  = raw.status ?? ORDER_STATUSES.FOOD_PROCESSING;
    this.date    = raw.date ? new Date(raw.date) : null;
    this.items   = (raw.items ?? []).map((i) => new OrderItem(i));
    this.address = new Address(raw.address ?? {});
  }

  get shortId()         { return `#${this._id.slice(-6).toUpperCase()}`; }
  get formattedAmount() { return `$${this.amount.toFixed(2)}`; }
  get formattedDate()   { return this.date ? this.date.toLocaleDateString() : '—'; }
  get itemSummary()     { return this.items.map(String).join(', '); }
  get statusClass()     { return this.status.toLowerCase().replace(/\s+/g, '-'); }

  /** Strategy helper: is this order within a given time period? */
  isWithin(period) {
    if (period === 'all' || !this.date) return true;
    const now = new Date();
    switch (period) {
      case 'day':   return this.date.toDateString() === now.toDateString();
      case 'week': {
        const ago = new Date(now.getTime() - 7 * 86_400_000);
        return this.date >= ago;
      }
      case 'month':
        return this.date.getMonth()    === now.getMonth() &&
               this.date.getFullYear() === now.getFullYear();
      case 'year':
        return this.date.getFullYear() === now.getFullYear();
      default: return true;
    }
  }
}

// ─── FoodItem ─────────────────────────────────────────────────────────────────
export const FOOD_CATEGORIES = [
  'Salad', 'Rolls', 'Deserts', 'Sandwich',
  'Cake',  'Veg',   'Pasta',   'Noodles',
];

export class FoodItem {
  constructor(raw) {
    this._id         = raw._id;
    this.name        = raw.name;
    this.description = raw.description ?? '';
    this.price       = Number(raw.price ?? 0);
    this.category    = raw.category;
    this.image       = raw.image;
  }
  get formattedPrice() { return `$${this.price.toFixed(2)}`; }
}

// ─── DashboardStats ───────────────────────────────────────────────────────────
export class DashboardStats {
  constructor(orders = []) {
    this.totalOrders     = orders.length;
    this.totalRevenue    = orders.reduce((s, o) => s + o.amount, 0);
    this.foodProcessing  = orders.filter((o) => o.status === ORDER_STATUSES.FOOD_PROCESSING).length;
    this.outForDelivery  = orders.filter((o) => o.status === ORDER_STATUSES.OUT_FOR_DELIVERY).length;
    this.delivered       = orders.filter((o) => o.status === ORDER_STATUSES.DELIVERED).length;
  }
  get formattedRevenue() { return `$${this.totalRevenue.toFixed(2)}`; }
}
