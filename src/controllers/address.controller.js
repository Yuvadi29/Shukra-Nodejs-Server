import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import AddressModel from '../models/address.schema.js';

// Create a new address
export const createAddress = asyncHandler(async (req, res) => {
  const addressData = req.body;

  const newAddress = await AddressModel.create(addressData);

  res.status(201).json(newAddress);
});

// Get all addresses
export const getAllAddresses = asyncHandler(async (req, res) => {
  const addresses = await AddressModel.find();

  res.status(200).json(addresses);
});

// Get address by ID
export const getAddressById = asyncHandler(async (req, res) => {
  const addressId = req.params.id;

  const address = await AddressModel.findById(addressId);

  if (!address) {
    throw new CustomError('Address not found', 404);
  }

  res.status(200).json(address);
});

// Update address by ID
export const updateAddressById = asyncHandler(async (req, res) => {
  const addressId = req.params.id;

  const updatedAddress = await AddressModel.findByIdAndUpdate(
    addressId,
    req.body,
    { new: true }
  );

  if (!updatedAddress) {
    throw new CustomError('Address not found', 404);
  }

  res.status(200).json(updatedAddress);
});

// Delete address by ID
export const deleteAddressById = asyncHandler(async (req, res) => {
  const addressId = req.params.id;

  const deletedAddress = await AddressModel.findByIdAndDelete(addressId);

  if (!deletedAddress) {
    throw new CustomError('Address not found', 404);
  }

  res.status(200).json(deletedAddress);
});
