const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  invoiceDate: {
    type: Date,
    default: Date.now,
  },
  customer: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    // Other customer details like address, phone, etc. can be added here
  },
  lineItems: [
    {
      description: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      unitPrice: {
        type: Number,
        required: true,
      },
      // Other fields related to line items like taxes, discounts, etc. can be added here
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  // Other fields specific to invoices can be added here
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;