import Order from "../models/order.schema.js";
import asyncHandler from "../services/asyncHandler.js";
import Product from "../models/product.schema.js";
import CustomError from "../utils/customError.js";
import { v4 as uuidv4 } from "uuid";
import OrderStatus from "../utils/orderStatus.js";
// import razorpay from "../config/razorpay";
import generateOrderId from "../utils/generateOrderId.js";
import User from "../models/user.schema.js";

export const generateOrder = asyncHandler(async (req, res) => {
  const { products, user, address, phoneNumber, paymentOption, amount } =
    req.body;
  // const userId = await User.findById(user);
  // if (!userId) {
  //   throw new CustomError("User not found.", 400);
  // }
  if (!products || products.length === 0) {
    throw new CustomError("No product found", 400);
  }

  let totalAmount = 0;

  let productPriceCalculation = Promise.all(
    products.map(async (product) => {
      // console.log(product);
      const { _id, stockQuantity } = product;
      const productFromDb = await Product.findById(_id);

      if (!productFromDb) {
        throw new CustomError("No product found", 400);
      }
      if (productFromDb.stockQuantity < stockQuantity) {
        return res.status(400).json({
          error: "Product quantity not in stock",
        });
      }

      totalAmount += productFromDb.mrpPrice * stockQuantity;
    })
  );
  await productPriceCalculation;

  if (paymentOption === "ONLINE") {
    if (!products || !address || !phoneNumber) {
      throw new CustomError("Details for order are incomplete.", 400);
    } else {
      console.log(totalAmount);

      var options = {
        amount: Math.round(totalAmount),
        currency: "INR",
        receipt: `receipt_${new Date().getTime()}`,
      };
      const orderId = await generateOrderId(options);
      console.log(orderId);
      const paidOrder = await Order.create({
        address: address,
        user: user,
        product: products,
        amount: totalAmount,
        phoneNumber: phoneNumber,
        paymentOption: "ONLINE",
        orderId: orderId.id,
      });
      res.status(200).json({
        success: true,
        paidOrder,
      });
    }
  } else {
    if (!products || !user || !address || !phoneNumber || !amount) {
      throw new CustomError("Details for order are incomplete.", 400);
    } else {
      const orderId = `COD-${uuidv4()}`;
      const unpaidOrder = await Order.create({
        address: address,
        user: req.user._id,
        products: products,
        amount: totalAmount || 0,
        phoneNumber: phoneNumber,
        paymentOption: "COD",
        orderId: orderId,
      });
      res.status(200).json({
        success: true,
        unpaidOrder,
      });
    }
  }
});

// export const generateRPOrderId = asyncHandler(async (req, res) => {
//   const { amount, currency, receipt } = req.body;

//   const order = await razorpay.orders.create(options, function (err, order) {
//     console.log(order);
//   });

//   return order;
// });

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;

  if (!orderId || !orderStatus) {
    throw new CustomError("Invalid request", 400);
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true }
  );

  if (!updatedOrder) {
    throw new CustomError("Order not found", 404);
  }

  res.status(200).json({
    success: true,
    updatedOrder,
  });
});

export const getUserOrders = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const userOrders = await Order.find({ user: userId });

  res.status(200).json({
    success: true,
    userOrders,
  });
});

// export const getAllOrders = asyncHandler(async (req, res, next) => {
//   const orders = await Order.find();

//   res.status(200).json({
//     success: true,
//     orders,
//   });
// });

export const getAllOrders = asyncHandler(async (req, res, next) => {
  // Extract startDate and endDate from query parameters
  const { startDate, endDate } = req.query;

  // Build the filter object based on the presence of startDate and endDate
  const filter = {};
  if (startDate && endDate) {
    // Adjust the filter based on your actual date field in the schema
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
    };
  }

  // Fetch orders based on the filter
  const orders = await Order.find(filter);

  res.status(200).json({
    success: true,
    orders,
  });
});

// Cancel order
export const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the order by ID and update the status to "CANCELLED"
  const order = await Order.findByIdAndUpdate(
    id,
    { status: "CANCELLED" },
    { new: true }
  );

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.status(200).json({ message: "Order canceled successfully", order });
});
