const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        if (!email) {
          return done(new Error("Google account did not return an email."));
        }

        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        user = await User.findOne({ email });
        if (user) {
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        const randomPwd = crypto.randomBytes(32).toString("hex");
        const hashed = await bcrypt.hash(randomPwd, 10);
        user = await User.create({
          name: profile.displayName || email.split("@")[0],
          email,
          password: hashed,
          googleId: profile.id,
        });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

module.exports = passport;
