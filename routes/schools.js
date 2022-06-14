const express = require('express');
const router = express.Router();
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const schoolsController = require('../controllers/schools')
const multer = require('multer');
const { storage } = require('../cloudinary/cloudinary');
const upload = multer({storage: storage});

router.get('/', schoolsController.index);

router.get('/new', isLoggedIn, schoolsController.renderNewForm)

router.post('/',isLoggedIn, upload.array('image'), validateCampground ,schoolsController.createSchool)

router.get('/:id' , schoolsController.renderShowPage)

router.get('/:id/edit',isLoggedIn, isAuthor, schoolsController.renderEditSchoolForm)

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, schoolsController.editSchool)

router.delete('/:id', isLoggedIn, isAuthor, schoolsController.deleteSchool)

module.exports = router;