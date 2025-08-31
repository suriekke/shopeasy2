import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String },
      quantity: { type: Number, default: 1 },
    }
  ],
  status: { type: String, default: "pending" },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
