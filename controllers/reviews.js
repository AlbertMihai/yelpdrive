const DrivingSchool = require('../models/drivingschool');
const Review = require('../models/review')

module.exports.createReview = async(req, res, next) => {
    try {
        const school = await DrivingSchool.findById(req.params.id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        school.reviews.push(review);
        await review.save();
        await school.save();
        req.flash('success', 'Successfuly made a new review!')
        res.redirect(`/schools/${req.params.id}`);
    }
    catch (e) {
        next(e);
    }
}

module.exports.deleteReview = async (req,res,next) => {
    try {
        const {id, reviewId} = req.params;
        await DrivingSchool.findByIdAndUpdate(id, {$pull:{ reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'Successfuly deleted a review!')
        res.redirect(`/schools/${id}`)
    }
    catch (e) {
        next(e);
    }
}