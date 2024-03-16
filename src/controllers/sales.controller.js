import asyncHandler from "../services/asyncHandler.js";
import Order from "../models/order.schema.js";
import Product from "../models/product.schema.js";
import User from "../models/user.schema.js";
import Sale from "../models/sales.schema.js";

export const salesreport = asyncHandler(async (req, res) => {
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

  const allOrders = await Order.find(filter);

  const productSales = await Promise.all(
    allOrders.map(async (order) => {
      const productSalesInfo = await Promise.all(
        order.product.map(async (productInfo) => {
          const product = await Product.findById(productInfo.productId);
          return {
            productId: productInfo.productId,
            productName: product ? product.productName : "Unknown Product",
            quantity: productInfo.count,
            totalAmount: productInfo.count * productInfo.price,
          };
        })
      );

      const sale = new Sale({
        products: productSalesInfo,
        productName: order.productName,
        quantity: order.product.reduce(
          (total, productInfo) => total + productInfo.count,
          0
        ),
        totalAmount: order.amount,
      });

      await sale.save();

      return productSalesInfo;
    })
  );

  const flattenedProductSales = productSales.flat();

  res.json({ productSales: flattenedProductSales });
});
