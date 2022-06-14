if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const DrivingSchool = require('./models/drivingschool');
const res = require('express/lib/response');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const { stat } = require('fs');
const Review = require('./models/review')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const MongoDBStore = require('connect-mongo');

// ===========SECURITY========
const mongoSanitize = require('express-mongo-sanitize');


const userRoutes = require('./routes/users');
const schoolsRoutes = require('./routes/schools')
const reviewsRoutes = require('./routes/reviews')

const dbUrl = process.env.DB_URL ||'mongodb://localhost:27017/yelp-drive'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());

// const sessionConfig = {
//     store: MongoDBStore.create({
//         client: dbUrl,
//     }),
//     secret: 'thisshouldbeabettersecret',
//     resave: false,
//     saveUnintialized: true,
//     cookie: {
//         httpOnly: true,
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//         maxAge: 1000 * 60 * 60 * 24 * 7
//     }
// }
// app.use(session(sessionConfig))

app.use(session({
    store: MongoDBStore.create({ mongoUrl: dbUrl }),
    secret: 'thisshouldbeabettersecret',
     resave: false,
     saveUnintialized: true,
     cookie: {
        httpOnly: true,
         expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
         maxAge: 1000 * 60 * 60 * 24 * 7
     }

  }));
app.use(flash());

// =========PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/schools', schoolsRoutes)
app.use('/', reviewsRoutes)
app.use('/', userRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode=500} = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error.ejs', {err});
})

app.listen(3000, () => {
    console.log("serving on port 3000")
})