const express = require('express')
const authController = require('./../controllers/authController')
const reviewController = require('./../controllers/reviewController')

const router = express.Router({ mergeParams: true })

router
  .route('/')
  // GET /reviews
  .get(authController.protect, reviewController.getAllReviews)
  // POST /tours/:tourId/reviews
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  )

router
  .route('/:id')
  // GET /reviews/:id
  .get(
    authController.protect,
    reviewController.getReview
  )
  // DELETE /reviews/:id
  .delete(
    authController.protect,
    reviewController.deleteReview
  )
  // PATCH /reviews/:id
  .patch(
    authController.protect,
    reviewController.updateReview
  )

module.exports = router
