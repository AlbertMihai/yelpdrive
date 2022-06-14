const express = require('express');
const router = express.Router();
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviewController = require('../controllers/reviews')

router.post('/schools/:id/reviews', isLoggedIn, validateReview, reviewController.createReview)

router.delete('/schools/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, reviewController.deleteReview)

module.exports = router;