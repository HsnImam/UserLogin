const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('./models/User');
require('dotenv').config();

const secret = process.env.SECRET;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
};

module.exports = passport => {
    passport.use(
        new Strategy(opts, async (payload, done) => {
            const user = await User.findById(payload.id);
            if(!user) done(null, false);

            const { id, name, email } = user;
            done(null, {id, name,email});
        })
    )
};