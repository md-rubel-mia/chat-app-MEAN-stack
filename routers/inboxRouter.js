const express = require('express');
const router = express.Router();

const { storeMessage, getMessage } = require('../controllers/inboxController');

router.post('', storeMessage);
router.post('/getConversation', getMessage);

module.exports = router;