const DrivingSchool = require('../models/drivingschool');
const { cloudinary } = require('../cloudinary/cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

module.exports.index = async (req, res, next) => {
    try {
        const schools = await DrivingSchool.find({})
        res.render('schools/school.ejs', {schools})
    } catch (e) {
        next(e);
    }
}

module.exports.renderNewForm = (req, res, next) => {
    try {
        res.render("schools/new.ejs")
    } catch (e) {
        next (e);
    }
}

module.exports.createSchool = async (req, res, next) => {
    try {
        const geoData = await geocoder.forwardGeocode({
            query: req.body.school.location,
            limit: 1
        }).send()
        const school = new DrivingSchool(req.body.school);
        school.geometry = geoData.body.features[0].geometry;
        school.author = req.user._id;
        for (f of req.files) {
            school.image.push({path: f.path, filename: f.filename});
        }
        if (req.files) {
            await school.save();
            console.log(school)
        }
        else {
            req.flash('error', 'Could not make new school!')
            return res.redirect('/new');
        }
        req.flash('success', 'Succesfully made a new school!');
        res.redirect('/schools');
    }
    catch (e) {
        next(e);
    }
}

module.exports.renderShowPage = async (req, res, next) => {
    try {
        const {id} = req.params;
        const school = await DrivingSchool.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'author',
                model: 'User'
            }
        }).populate('author');
        if(!school) {
            req.flash('error', 'Cannot find that campground!')
            return res.redirect('/schools')
        }
        res.render('schools/show.ejs', {school})
    } catch (e) {
        next(e);
    }
}

module.exports.renderEditSchoolForm = async (req, res, next) => {
    try {
        const {id} = req.params;
        const school = await DrivingSchool.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'author',
                model: 'User'
            }
        }).populate('author');
        if(!school) {
            req.flash('error', 'Cannot find that campground!')
            return res.redirect('/schools')
        }
        res.render('schools/edit.ejs', {school})
    } catch (e) {
        next (e);
    }

}

module.exports.editSchool = async (req, res, next) => {
    try {
        const {id} = req.params;
        const school = await DrivingSchool.findById(id);
        for (f of req.files) {
            school.image.push({path: f.path, filename: f.filename});
        }
        await school.save();
        if (req.body.deleteImages) {
            for (let filename of req.body.deleteImages) {
                await cloudinary.uploader.destroy(filename);
            }
            await school.updateOne({$pull: {image: {filename: {$in: req.body.deleteImages}}}});
            console.log(school)
        }
        req.flash('success', 'Successfuly updated school!')
        res.redirect(`/schools/${id}`)
    } catch (e) {
        next(e);
    }
}

module.exports.deleteSchool = async (req, res, next) => {
    try {
        const {id} = req.params;
        const school = await DrivingSchool.findById(id);
        await DrivingSchool.findByIdAndDelete(id);
        req.flash('success', 'Successfuly deleted school!')
        res.redirect('/schools')
    } catch (e) {
        next(e);
    }
}