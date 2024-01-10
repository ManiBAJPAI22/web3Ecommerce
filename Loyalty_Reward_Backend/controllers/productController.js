import productModel from '../models/productModel.js';
import categoryModel from '../models/categoryModel.js';
import orderModel from '../models/orderModel.js';
import sellerModel from '../models/sellerModel.js';

import fs from 'fs';
import slugify from 'slugify';
import dotenv from 'dotenv';

dotenv.config();

export const createProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      imgUrl,
      sellerId,
    } = req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: 'Name is Required' });
      case !description:
        return res.status(500).send({ error: 'Description is Required' });
      case !price:
        return res.status(500).send({ error: 'Price is Required' });
      case !category:
        return res.status(500).send({ error: 'Category is Required' });
      case !quantity:
        return res.status(500).send({ error: 'Quantity is Required' });
      case !imgUrl:
        return res.status(500).send({ error: 'Image Url is Required' });
      case !sellerId:
        return res.status(500).send({ error: 'Seller Id is Required' });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: 'photo is Required and should be less then 1mb' });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    await products.save();
    res.status(201).send({
      success: true,
      message: 'Product Created Successfully',
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error in crearing product',
    });
  }
};

//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate('category')
      .select('-photo')
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: 'AllProducts ',
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Erorr in getting products',
      error: error.message,
    });
  }
};
// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select('-photo')
      .populate('category');
    const sellerId = product.sellerId;
    const seller = await sellerModel.findById(sellerId);
    if (!seller) {
      return res.status(500).send({ error: 'Seller not found' });
    }
    const sellerDetails = {
      name: seller.name,
      phone: seller.phone,
    };

    res.status(200).send({
      success: true,
      message: 'Single Product Fetched',
      product,
      sellerDetails,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error while getting single product',
      error,
    });
  }
};

// get photo
export const productPhotoController = async (req, res) => {
  try {
    const imgUrl = await productModel.findById(req.params.pid).select('imgUrl');
    if (imgUrl) {
      return res.status(200).send(imgUrl);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Erorr while getting photo',
      error,
    });
  }
};

//delete controller
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select('-photo');
    res.status(200).send({
      success: true,
      message: 'Product Deleted successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error while deleting product',
      error,
    });
  }
};

//upate producta
export const updateProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      imgUrl,
      sellerId,
    } = req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: 'Name is Required' });
      case !description:
        return res.status(500).send({ error: 'Description is Required' });
      case !price:
        return res.status(500).send({ error: 'Price is Required' });
      case !category:
        return res.status(500).send({ error: 'Category is Required' });
      case !quantity:
        return res.status(500).send({ error: 'Quantity is Required' });
      case !imgUrl:
        return res.status(500).send({ error: 'Image Url is Required' });
      case !sellerId:
        return res.status(500).send({ error: 'Seller Id is Required' });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: 'photo is Required and should be less then 1mb' });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true },
    );
    await products.save();
    res.status(201).send({
      success: true,
      message: 'Product Updated Successfully',
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error in Updte product',
    });
  }
};

export const updatestartDistanceRidden = async (req, res) => {
  try {
    console.log('hvjhvhj');
    // Extract the orderId and distanceRidden from the request body
    const { orderId, distanceStart, pickupTime } = req.body;
    console.log('====================================');
    console.log(orderId);
    console.log(distanceStart);
    console.log('====================================');
    // Perform any necessary validation (optional)
    // Example using express-validator:
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(422).json({ errors: errors.array() });
    // }

    // Find the order by its orderId in the database
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the distanceRidden field of the order
    order.distanceStart = distanceStart;
    order.pickupTime = pickupTime;

    // Save the updated order to the database
    await order.save();

    // Respond with the updated order
    res.json({ order });
  } catch (error) {
    // Handle any errors that may occur during the update process
    console.error('Error updating distanceRidden:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating distanceRidden' });
  }
};
export const updateendDistanceRidden = async (req, res) => {
  try {
    console.log('hvjhvhj');
    // Extract the orderId and distanceRidden from the request body
    const { orderId, distanceEnd, returnTime } = req.body;
    console.log('====================================');
    console.log(orderId);
    console.log(distanceEnd);
    console.log('====================================');
    // Perform any necessary validation (optional)
    // Example using express-validator:
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(422).json({ errors: errors.array() });
    // }

    // Find the order by its orderId in the database
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the distanceRidden field of the order
    order.distanceEnd = distanceEnd;
    order.returnTime = returnTime;

    // Save the updated order to the database
    await order.save();

    // Respond with the updated order
    res.json({ order });
  } catch (error) {
    // Handle any errors that may occur during the update process
    console.error('Error updating distanceRidden:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating distanceRidden' });
  }
};
export const updatestartTime = async (req, res) => {
  try {
    console.log('hvjhvhj');
    // Extract the orderId and distanceRidden from the request body
    const { orderId, pickupTime } = req.body;
    console.log('====================================');
    console.log(orderId);
    console.log(pickupTime);
    console.log('====================================');
    // Perform any necessary validation (optional)
    // Example using express-validator:
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(422).json({ errors: errors.array() });
    // }

    // Find the order by its orderId in the database
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the distanceRidden field of the order
    order.pickupTime = pickupTime;

    // Save the updated order to the database
    await order.save();

    // Respond with the updated order
    res.json({ order });
  } catch (error) {
    // Handle any errors that may occur during the update process
    console.error('Error updating distanceRidden:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating distanceRidden' });
  }
};
export const updateendTime = async (req, res) => {
  try {
    console.log('hvjhvhj');
    // Extract the orderId and distanceRidden from the request body
    const { orderId, returnTime } = req.body;
    console.log('====================================');
    console.log(orderId);
    console.log(returnTime);
    console.log('====================================');
    // Perform any necessary validation (optional)
    // Example using express-validator:
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(422).json({ errors: errors.array() });
    // }

    // Find the order by its orderId in the database
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the distanceRidden field of the order
    order.returnTime = returnTime;

    // Save the updated order to the database
    await order.save();

    // Respond with the updated order
    res.json({ order });
  } catch (error) {
    // Handle any errors that may occur during the update process
    console.error('Error updating distanceRidden:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating distanceRidden' });
  }
};

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: 'Error WHile Filtering Products',
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'Error in product count',
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select('-photo')
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: 'error in per page ctrl',
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ],
      })
      .select('-photo');
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: 'Error In Search Product API',
      error,
    });
  }
};

// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select('-photo')
      .limit(3)
      .populate('category');
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: 'error while geting related product',
      error,
    });
  }
};

// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate('category');
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: 'Error While Getting products',
    });
  }
};

//payment gateway api
//token

//payment
