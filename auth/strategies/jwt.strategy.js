const { Strategy, /*ExtractJwt*/ } = require('passport-jwt');

const options = {
    // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    jwtFromRequest: (req) => req.cookies.session,
    secretOrKey: process.env.JWT_LOGIN_SECRET,
};

const jwtStrategy = new Strategy(options,
    (jwtPayload, done) => {
        const { exp } = jwtPayload;
        const now = String( Date.now() ).slice(0, -3);

        if (now > exp) done('Unauthorized', false);

        return done(null, jwtPayload);
    }
);

module.exports = jwtStrategy;