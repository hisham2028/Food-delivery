/**
 * FoodFormFactory — Factory Pattern
 *
 * Centralises construction, cloning and serialisation of food form data.
 * One place to add validation, transformations, or default values.
 */
export class FoodFormData {
  constructor({
    name        = '',
    description = '',
    price       = '',
    category    = 'Salad',
    image       = null,
  } = {}) {
    this.name        = name;
    this.description = description;
    this.price       = price;
    this.category    = category;
    this.image       = image;
  }

  /** Build the multipart FormData payload for the API. */
  toFormData() {
    const fd = new FormData();
    fd.append('name',        this.name);
    fd.append('description', this.description);
    fd.append('price',       Number(this.price));
    fd.append('category',    this.category);
    if (this.image) fd.append('image', this.image);
    return fd;
  }

  /** Return a blank form. */
  static createEmpty() { return new FoodFormData(); }
}

/**
 * FoodFormFactory
 * Static factory methods for creating / updating FoodFormData objects.
 */
class FoodFormFactory {
  /** Create a fresh form with optional preset values. */
  static create(overrides = {}) {
    return new FoodFormData(overrides);
  }

  /**
   * Immutable field update: returns a new FoodFormData with one field changed.
   * Keeps the React state update pure and predictable.
   */
  static withField(existing, fieldName, fieldValue) {
    return new FoodFormData({ ...existing, [fieldName]: fieldValue });
  }
}

export default FoodFormFactory;
