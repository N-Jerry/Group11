const express = require('express');
const router = express.Router();
const { loginUser, signupUser, updateProfile, getAllUsers, deletePerformanceUsers } = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMidlware');

 
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/users', getAllUsers);
router.patch('/update/:id', updateProfile);
router.delete('/', requireAuth, deletePerformanceUsers);

module.exports = router;