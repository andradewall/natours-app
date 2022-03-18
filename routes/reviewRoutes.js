const express = require('express')
const authController = require('./../controllers/authController')
const reviewController = require('./../controllers/reviewController')

const router = express.Router({ mergeParams: true })

router.use(authController.protect)

router
  .route('/')
  // GET /reviews
  .get(reviewController.getAllReviews)
  // POST /tours/:tourId/reviews
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  )

router
  .route('/:id')
  // GET /reviews/:id
  .get(reviewController.getReview)
  // DELETE /reviews/:id
  .delete(
    authController.restrictTo('admin', 'user'),
    reviewController.deleteReview
  )
  // PATCH /reviews/:id
  .patch(
    authController.restrictTo('admin', 'user'),
    reviewController.updateReview
  )

module.exports = router
