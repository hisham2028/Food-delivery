/**
 * Food Service - Business Logic Layer
 */

import FoodModel from '../models/FoodModel.js';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

class FoodService {
  constructor(foodModel = null) {
    this.foodModel = foodModel || FoodModel;
  }

  _resolveStoredImagePath(imageFile) {
    if (!imageFile) return null;
    return imageFile.path || imageFile.secure_url || imageFile.url || imageFile.filename || null;
  }

  _toPlain(food) {
    if (!food) return food;
    return typeof food.toObject === 'function' ? food.toObject() : food;
  }

  _normalizeImageForClient(image) {
    if (!image) return image;

    if (/^https?:\/\//i.test(image)) {
      return image;
    }

    // Supports legacy records where Cloudinary public_id was stored as image.
    if (image.includes('/') && process.env.CLOUDINARY_CLOUD_NAME) {
      return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${image}`;
    }

    return image;
  }

  _normalizeFoodForClient(food) {
    const plain = this._toPlain(food);
    if (!plain) return plain;

    return {
      ...plain,
      image: this._normalizeImageForClient(plain.image)
    };
  }

  async addFood(foodData, imageFile) {
    if (!foodData.name || !foodData.price || !imageFile) {
      throw new Error('Name, price, and image are required');
    }

    const storedImagePath = this._resolveStoredImagePath(imageFile);

    const newFood = await this.foodModel.create({
      name: foodData.name,
      description: foodData.description || '',
      price: Number(foodData.price),
      category: foodData.category || 'other',
      image: storedImagePath,
      isAvailable: foodData.isAvailable !== undefined ? foodData.isAvailable : true
    });

    return this._normalizeFoodForClient(newFood);
  }

  async getAllFoods(filters = {}) {
    const query = {};

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.isAvailable !== undefined) {
      query.isAvailable = filters.isAvailable;
    }

    const options = {
      sort: filters.sort || { createdAt: -1 },
      limit: filters.limit,
      skip: filters.skip
    };

    const foods = await this.foodModel.findAll(query, options);
    return foods.map((food) => this._normalizeFoodForClient(food));
  }

  async getFoodById(foodId) {
    const food = await this.foodModel.findById(foodId);
    if (!food) {
      throw new Error('Food item not found');
    }
    return this._normalizeFoodForClient(food);
  }

  async searchFoods(searchTerm) {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }
    const foods = await this.foodModel.search(searchTerm);
    return foods.map((food) => this._normalizeFoodForClient(food));
  }

  async updateFood(foodId, updateData, imageFile) {
    const food = await this.foodModel.findById(foodId);
    if (!food) {
      throw new Error('Food item not found');
    }

    const updates = { ...updateData };

    if (imageFile) {
      await this._deleteImage(food.image);
      updates.image = this._resolveStoredImagePath(imageFile);
    }

    if (updates.price) {
      updates.price = Number(updates.price);
    }

    const updatedFood = await this.foodModel.updateById(foodId, updates);
    return this._normalizeFoodForClient(updatedFood);
  }

  async deleteFood(foodId) {
    const food = await this.foodModel.findById(foodId);
    if (!food) {
      throw new Error('Food item not found');
    }

    await this._deleteImage(food.image);
    await this.foodModel.deleteById(foodId);

    return { message: 'Food item deleted successfully' };
  }

  async _deleteImage(filename) {
    if (!filename) return;

    const imagePath = join(process.cwd(), 'uploads', filename);
    if (existsSync(imagePath)) {
      try {
        await unlink(imagePath);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  }
}

export default FoodService;
