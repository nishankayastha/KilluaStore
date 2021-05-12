const cloudinary = require('cloudinary')
const Product = require("../models/product");
const ErrorHandler = require("../utils/error-handler");
const catchAsyncErrors = require("../middlewares/catch-async-errors");
const ApiFeature = require("../utils/apiFeatures");

// Create new product => /api/v1/product/new
exports.create = catchAsyncErrors(async (req, res, next) => {
  let images = []
  if (typeof req.body.images === 'string') {
    images.push(req.body.images)
  } else {
      images = req.body.images
  }
  let imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: 'products'
    });

    imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url
    })
  }
  req.body.images = imagesLinks
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// Get all product => /api/v1/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 4;
  const productCount = await Product.countDocuments();

  const apiFeature = new ApiFeature(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);

  const products = await apiFeature.query;
  res.status(200).json({
    success: true,
    count: productCount,
    products,
  });
});

// Get all products (Admin)  =>   /api/v1/admin/products
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {

  const products = await Product.find();

  res.status(200).json({
      success: true,
      products
  })

})

// Get product details => /api/v1/product/:id
exports.find = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
  }
  return res.status(200).json({
    success: true,
    product,
  });
});

// Update product => /api/v1/admin/product/:id
exports.update = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  let images = []
  if (typeof req.body.images === 'string') {
      images.push(req.body.images)
  } else {
      images = req.body.images
  }

  if (images !== undefined) {

      // Deleting images associated with the product
      for (let i = 0; i < product.images.length; i++) {
          const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
      }

      let imagesLinks = [];

      for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
              folder: 'products'
          });

          imagesLinks.push({
              public_id: result.public_id,
              url: result.secure_url
          })
      }

      req.body.images = imagesLinks

  }


  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  return res.status(200).json({
    success: true,
    product,
  });
});

// Delete product => /api/v1/admin/product/:id
exports.delete = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  await product.remove();
  return res.status(200).json({
    success: true,
    message: "Product is deleted",
  });
});

// Create new review   =>   /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

  const { rating, comment, productId } = req.body;

  const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
  }

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
  )

  if (isReviewed) {
      product.reviews.forEach(review => {
          if (review.user.toString() === req.user._id.toString()) {
              review.comment = comment;
              review.rating = rating;
          }
      })

  } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length
  }

  product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
      success: true
  })

})


// Get Product Reviews   =>   /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  res.status(200).json({
      success: true,
      reviews: product.reviews
  })
})

// Delete Product Review   =>   /api/v1/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {

  const product = await Product.findById(req.query.productId);

  console.log(product);

  const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

  const numOfReviews = reviews.length;

  const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

  await Product.findByIdAndUpdate(req.query.productId, {
      reviews,
      ratings,
      numOfReviews
  }, {
      new: true,
      runValidators: true,
      useFindAndModify: false
  })

  res.status(200).json({
      success: true
  })
})