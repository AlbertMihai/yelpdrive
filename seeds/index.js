const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const DrivingSchool = require('../models/drivingschool');
const cities = require('./citites');
const {places, descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-drive', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}
const seedDB = async () => {
    await DrivingSchool.deleteMany({});
    for (let i=0; i< 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const drive = new DrivingSchool({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum, ratione dolorem porro consectetur obcaecati eius, molestias asperiores earum repellat, atque odit provident. Facere ipsum dolorum minima!",
            price: random1000,
            geometry: {type: 'Point', coordinates: [ cities[random1000].longitude, cities[random1000].latitude ]},
            author: '62a310be9a0c0f60491e1d92',
            image: [
                {
                    path: 'https://res.cloudinary.com/drphtztx6/image/upload/v1654944576/YelpDrive/h8mveipmtkkmzlgqfsp8.png',
                    filename: 'YelpDrive/h8mveipmtkkmzlgqfsp8'
                },
                {
                    path: 'https://res.cloudinary.com/drphtztx6/image/upload/v1654944576/YelpDrive/mrnhhtbeihvnvyt7vtya.jpg',
                    filename: 'YelpDrive/mrnhhtbeihvnvyt7vtya'
                }
            ]
        })
        await drive.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})