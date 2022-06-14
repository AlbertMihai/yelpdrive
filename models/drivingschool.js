const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const review = require('./review')

const opts = {toJSON: {virtuals: true}};

const drivingSchoolSchema = new Schema({
    title: String,
    price: Number,
    image: [
        {
            path: String,
            filename: String
        }
    ],
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

drivingSchoolSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href="/schools/${this._id}">${this.title}</a></strong>
            <p>${this.description.substring(0,30)}...</p>`;
})

drivingSchoolSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('DrivingSchool', drivingSchoolSchema)