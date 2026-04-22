const express = require('express');
const router = express.Router();
const { chat, getHistory } = require('../controllers/chatController');
const protect = require('../middleware/authMiddleware');

router.post('/message', protect, chat);
router.get('/history', protect, getHistory);

module.exports = router;