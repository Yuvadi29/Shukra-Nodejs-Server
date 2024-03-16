import express from 'express';
const router = express.Router();
// import addressController from '../controllers/addressController.js';
import { createAddress,getAllAddresses, getAddressById, updateAddressById, deleteAddressById,} from '../controllers/address.controller.js';

// Create a new address
router.post('/addresses', createAddress);

// Get all addresses
router.get('/addresses', getAllAddresses);

// Get address by ID
router.get('/addresses/:id', getAddressById);

// Update address by ID
router.put('/addresses/:id', updateAddressById);

// Delete address by ID
router.delete('/addresses/:id', deleteAddressById);

export default router;
