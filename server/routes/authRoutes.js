const express = require('express');
const router = express.Router();
const { loginUser, signupUser, updateProfile, getAllUsers } = require('../controllers/authController');
const { updateSettings, viewSettings } = require('../controllers/settingsController')
 
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/users', getAllUsers);
router.put('/settings/:userID', updateSettings);
router.get('/settings/:userID', viewSettings);
router.patch('/update/:id', updateProfile);

module.exports = router;