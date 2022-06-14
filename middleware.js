const DrivingSchool = require('./models/drivingschool');
const Joi = require('joi');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be authenticated!');
        return res.redirect('/login');
    }
    next();
}
module.exports.validateCampground = (req, res, next) => {
    const schoolSchema = Joi.object({
        school: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            // image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required()
        }).required(),
        deleteImages: Joi.array()
    })
    const {error} = schoolSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const school = await DrivingSchool.findById(id);
        if (!school.author._id.equals(req.user._id)) {
            req.flash('error', 'You dont have permission to do that!');
            return res.redirect(`/schools/${id}`)
        }
        next();
}

module.exports.validateReview = (req, res, next) => {
    const reviewSchema = Joi.object({
        review: Joi.object({
            body: Joi.string().required(),
            rating: Joi.number().required().min(1).max(5)
        }).required()
    })
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    console.log(review.author)
        if (!review.author._id.equals(req.user._id)) {
            req.flash('error', 'You dont have permission to do that!');
            return res.redirect(`/schools/${id}`)
        }
        next();
}