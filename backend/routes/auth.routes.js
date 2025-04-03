/**
 * Authentication Routes
 * Handles all authentication-related endpoints
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    {username, email, password}
 * @returns User object with JWT token
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 * @body    {email, password}
 * @returns User object with JWT token
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user & clear cookie
 * @access  Private
 * @returns Success message
 */
router.post('/logout', protect, authController.logout);

module.exports = router;