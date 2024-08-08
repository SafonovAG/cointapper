const User = require('../models/userModel');

const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ where: { telegramId: req.params.id } });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Юзер не найден' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { telegramId, firstName, photoUrl, referrerId } = req.body;
        const [user, created] = await User.findOrCreate({
            where: { telegramId },
            defaults: { firstName, photoUrl, referrerId }
        });
        if (created && referrerId) {
            const referrer = await User.findOne({ where: { telegramId: referrerId } });
            if (referrer) {
                referrer.update({ friendsCount: referrer.friendsCount + 1 });
            }
        }
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserCoins = async (req, res) => {
    try {
        const { coins } = req.body;
        const user = await User.findOne({ where: { telegramId: req.params.id } });
        if (user) {
            user.update({ coins });
            res.json(user);
        } else {
            res.status(404).json({ message: 'Юзер не найден' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFriends = async (req, res) => {
    try {
        const user = await User.findOne({ where: { telegramId: req.params.id } });
        if (user) {
            const friends = await User.findAll({ where: { referrerId: req.params.id }, limit: 20 });
            res.json(friends);
        } else {
            res.status(404).json({ message: 'Юзер не найден' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLeaders = async (req, res) => {
    try {
        const leaders = await User.findAll({
            order: [['coins', 'DESC']],
            limit: 100
        });
        res.json(leaders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUser,
    createUser,
    updateUserCoins,
    getFriends,
    getLeaders
};
