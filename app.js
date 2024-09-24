const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const destinationBookRoutes = require('./routes/destinationBookRoutes');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/traveltogether_db') // use 127.0.0.1 instead of localhost to avoid IPv6 issues
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
        process.exit(1); // Exit the application if the database connection fails
    });

app.use(express.static(path.join(__dirname, 'public'), { maxAge: '30d' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { maxAge: '30d' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    name: 'session',
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = {
            _id: req.session.user._id,
            username: req.session.user.username,
            name: req.session.user.name,
            photo: req.session.user.photo
        };
        res.cookie('userCookie', req.session.user.username, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
    }

    if (req.session.admin) {
        res.locals.admin = {
            _id: req.session.admin._id,
            username: req.session.admin.username,
            name: req.session.admin.name
        };
        res.cookie('adminCookie', req.session.admin.username, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
    }

    next();
});

app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/booking', bookingRoutes);
app.use('/desBook', destinationBookRoutes);

// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).send("Sorry, the requested page doesn't exist.");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
