import mongoose from "mongoose";

class FoodModel {
  constructor() {
    this.schema = new mongoose.Schema({
      name: {
        type: String,
        required: [true, 'Food name is required'],
      },
      description: {
        type: String,
        required: [true, 'Description is required'],
      },
      price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number']
      },
      image: {
        type: String,
        required: [true, 'Image URL is required']
      },
      category: {
        type: String,
        required: [true, 'Category is required'],
      },
      isAvailable: {
        type: Boolean,
        default: true
      }
    }, {
      timestamps: true
    });

    this.schema.index({ name: 'text', description: 'text', category: 'text' });
    this.model = mongoose.models.Food || mongoose.model('Food', this.schema);
  }

  async create(foodData) {
    const food = new this.model(foodData);
    return await food.save();
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  async findAll(filter = {}) {
    return await this.model.find(filter);
  }

  async updateById(id, updateData, options = {}) {
    return await this.model.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true,
      ...options 
    });
  }

  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async search(searchTerm) {
    return await this.model.find({ $text: { $search: searchTerm } });
  }

  getModel() {
    return this.model;
  }
}

export default new FoodModel();
