const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const secret = process.env.SECRET

router.post('/register', async (req, res) => {
    const { name, emailAddress, password } = req.body;
    let user = await User.findOne({ emailAddress }).lean().exec();
    
    if (user) return res.status(400).json('Email Address Exists');

    try {
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password, salt);
        user = await new User({ userName: name, emailAddress, password: hash }).save();
        
        return res.json(user);
    } catch (ex) {
        return res.status(400).json(ex);
    }
});

router.post('/login', async (req,res) => {
    const {email, password} = req.body;
    let user = await User.findOne({ email }).lean().exec();

    if(!user)
        return res.status(400).json('No Account Found');
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) res.status(400).json("Incorrect Password");

    try {
        const payload = { id: user._id, name: user.userName};
        let token = await jwt.sign(payload, secret, {expiresIn: 36000});
        return res.json({ success: true, token: `Bearer ${token}` });
    } catch (ex) {
        return res.status(500).json({ error: "Error signing token", raw: ex });
    }
});

module.exports = router;