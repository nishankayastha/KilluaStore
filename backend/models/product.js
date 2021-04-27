const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const schema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Please enter product name"],
    maxLength: [100, "Product length cannot exceed 100 characters"],
  },
  user: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: [true, "Please select a category"],
    enum: {
      values: [
        "Electronics",
        "Cameras",
        "Laptops",
        "Accessories",
        "Headphones",
        "Food",
        "Books",
        "Clothes/shoes",
        "Beauty/health",
        "Sports",
        "Outdoor",
        "Home",
      ],
      message: "Please select correct category",
    },
  },
  price: {
    type: Number,
    trim: true,
    default: 0.0,
    required: [true, "Please enter product name"],
    maxLength: [5, "Product length cannot exceed 5 values"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: [true, "Please enter a product description"],
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  seller: {
    type: String,
    required: [true, "Please select a seller"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter stock number"],
    maxLength: [5, "Stock value should not exceed 5"],
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Product", schema);
