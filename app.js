const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')

// these are for displaying flash massage 'You are now registered'. To display this after logging in we need to store it in a session
const flash = require('connect-flash')
const session = require('express-session')

const passport = require('passport')

const app = express()

// passport config
require('./config/passport')(passport)

// DB connect
mongoose.connect('mongodb://localhost/auth1', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
 .then(() => console.log('mongodb connected'))
 .catch(err => console.log(err))

// ejs
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Bodyparser(to get data from ui's form)
app.use(express.urlencoded({ extended: false }))

// express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash())

// global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

// routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

app.listen(3000, () => console.log(`listening on port 3000`))