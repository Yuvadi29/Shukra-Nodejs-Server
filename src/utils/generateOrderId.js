// import razorpay from "../config/razorpay.js";
import CustomError from "./customError.js";

const generateOrderId = async (options) => {
  try {
    const order = await new Promise((resolve, reject) => {
      razorpay.orders.create(options, function (err, order) {
        if (err) {
          reject(err);
        } else {
          resolve(order);
        }
      });
    });
    console.log(order);
    return order;
  } catch (error) {
    throw new CustomError("Razorpay error: " + error);
  }
};

export default generateOrderId;
