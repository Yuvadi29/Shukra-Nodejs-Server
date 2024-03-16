import Payment from "../models/paymentGateway.schema.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import crypto from "crypto";
import config from "../config/index.js"

export const createConfig = asyncHandler(async (req, res) => {
  const { paymentGatewayName, keyName, secretKey } = req.body;

  if (!paymentGatewayName || !keyName || !secretKey) {
    throw new CustomError("All fields are required", 404);
  }

  const paymentGateway = await Payment.create({
    paymentGatewayName,
    keyName,
    secretKey,
  });

  res.status(200).json({
    success: true,
    paymentGateway,
  });
});

export const showPaymentMethods = asyncHandler(async (req, res) => {
  const paymentGateway = await Payment.find();
  const paymentGatewayNames = paymentGateway.map(
    (gateway) => gateway.paymentGatewayName
  );
  res.status(200).json({
    success: true,
    paymentGatewayNames,
  });
});

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentGatewayName } = req.body;

  if (!paymentGatewayName) {
    throw new CustomError("Payment gateway name is required", 400);
  }

  await Payment.updateMany({}, { $set: { active: false } });
  await Payment.findOneAndUpdate(
    { paymentGatewayName },
    { $set: { active: true } }
  );

  res.status(200).json({
    success: true,
    message: "Payment status updated successfully",
  });
});

export const generatePaypalAccessToken = asyncHandler(async () => {
  const auth = Buffer.from(
    process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
  ).toString("base64");

  const response = await fetch(`${paypalBaseUrl.sandbox}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const data = await response.json();
  return data?.access_token;
});

export const paypalApi = async (endpoint, body = {}) => {
  const accessToken = await generatePaypalAccessToken();
  return await fetch(`${paypalBaseUrl.sandbox}/v2/checkout/orders${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
};

export const generatePayuId = asyncHandler(async (req, res) => {
  const { name, email, amount, productinfo, transactionId } = req.body;

  const data = {
    key: key,
    salt: SALT_KEY,
    txnid: transactionId,
    amount: amount,
    productinfo: "TEST PRODUCT",
    email: email,
    firstname: name,
    udf1: "details1",
    udf2: "details2",
    udf3: "details3",
    udf4: "details4",
    udf5: "details5",
  };

  const cryp = crypto.createHash("sha512");
  const string =
    data.key +
    "|" +
    data.txnid +
    "|" +
    data.amount +
    "|" +
    data -
    productinfo +
    "|" +
    data.firstname +
    "|" +
    data.email +
    "|" +
    data.udf1 +
    "|" +
    data.udf2 +
    "|" +
    data.udf3 +
    "|" +
    data.udf4 +
    "|" +
    data.udf5;

  cryp.update(string);
  const hash = cryp.digest("hex");

  return res.status(200).json({
    hash: hash,
    transactionId: transactionId,
  });
});

export const verifyTransaction = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  console.log("id==", body);

  const expectedSignature = crypto
    .createHmac("sha256", config.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    res.status(200).json({ message: "success" });
  } else {
    res.status(400).json({ message: "fail" });
  }
});