const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')

// welcome page
router.get('/', (req, res) => {
    res.render('welcome')
})

// dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        // dashboard is rendered only when user is logged in so we have user's info like name, email in request header
        name: req.user.name
    })
})

module.exports = router