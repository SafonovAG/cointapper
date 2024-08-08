const express = require('express');
const {
    getUser,
    createUser,
    updateUserCoins,
    getFriends,
    getLeaders
} = require('../controllers/userController');

const router = express.Router();

router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id/coins', updateUserCoins);
router.get('/:id/friends', getFriends);
router.get('/leaders', getLeaders);

module.exports = router;
