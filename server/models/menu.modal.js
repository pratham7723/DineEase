import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Out of Stock"],
      default: "Available",
    },
    photo: {
      type: String,
      required: true,
    },
    arModel: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
      enum: ["Jain", "Chef's Special", "Spicy", "Bestseller", "New", "Vegan", "Gluten-Free", "Healthy"],
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      // required: true, // TODO: ENABLE BEFORE PRODUCTION
    },
  },
  {
    timestamps: true,
  }
);
const Menu = mongoose.models.Menu || mongoose.model("Menu", menuSchema);
export default Menu;
