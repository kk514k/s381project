const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
            try {
                // Find user by email
                const user = await User.findOne({ username: username });

                // If user not found
                if (!user) {
                    return done(null, false, { message: 'That username is not registered' });
                }

                // Match password
                const isMatch = await user.comparePassword(password);
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password incorrect' });
                }
            } catch (err) {
                return done(err);
            }
        })
    );

    // Serialize user for the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize user from the session
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};
