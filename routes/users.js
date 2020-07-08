const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

// User model
const User = require('../models/User')

// login page
router.get('/login', (req, res) => {
    res.render('login')
})

// register page
router.get('/register', (req, res) => {
    res.render('register')
})

// register handler
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body

    let errors = []

    // check required fields
    if(!name || !email || !password || !password2){
        errors.push({ msg: 'Please fill in all fields' })
    }

    // check password match
    if(password !== password2){
        errors.push({ msg: 'Passwords don\'t match' })
    }

    // check password length
    if(password.length < 6){
        errors.push({ msg: 'Password should be at least 6 characters' })
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });   // these passed values will help to retian data in valid fields on register form even after submitting it with errors in some other fields
    } else {
        // validation passed

        // checking for email availability
        User.findOne({ email })
         .then(user => {
             if(user){
                 // user exists
                 errors.push({ msg: 'email is already registered'})
                 
                 res.render('register', {
                     errors,
                     name,
                     email,
                     password,
                     password2
                 })
              } else {
                  const newUser = new User({
                      name,
                      email,
                      password
                  })

                  // hash password
                  bcrypt.genSalt(10, (err, salt) => {
                      bcrypt.hash(newUser.password, salt, (err, hash) =>{
                          if(err) throw err;

                          // set password to hashed
                          newUser.password = hash
                          // save user
                          newUser.save()
                           .then(user => {
                               req.flash('success_msg', 'You are now registered and can log in')
                               res.redirect('/users/login')
                           })
                           .catch(err => console.log(err))
                      })
                  })

              }
         })
    }
})

// login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

// logout handler
router.get('/logout', (req, res) => {
    // these are passport middlewares
    req.logout()
    req.flash('success_msg', 'you are logged out')
    res.redirect('/users/login')
})

module.exports = router