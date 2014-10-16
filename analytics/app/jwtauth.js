var moment = require('moment'),
    jwt = require('jwt-simple'),
    url = require('url');

/**
 * Set the secret for encoding/decoding JWT tokens
 */
var jwtTokenSecret = process.env.JWT_SECRET || "Jo0p3GrKE5ecojUnjKzU";
var masterToken = process.env.MASTER_TOKEN || "gE216KPqDIjGxu6uSTpO";

module.exports = {
    /**
     * A simple middleware to restrict access to authenticated users.
     */
    requireAuth: function (req, res, next) {
        if (!req.user) {
            return res.send('Not authorized', 401)
        } else {
            next()
        }
    },
    /**
     * A simple middleware to restrict access to authenticated users.
     */
    requireSuperuser: function (req, res, next) {
        if (req.user && req.user.username == 'admin') {
            return next()
        }
        return res.send('Forbidden', 403)
    },

    /**
     * Validate user credentials and return new token (JWT)
     * */
    getToken: function (req, res) {

        /**
         * This is dummy validation. It validates that user is 'admin' and password is '123'.
         * It should be replaced with real validation.
         * */
        if (req.headers.username && req.headers.password &&
            req.headers.username == "admin" &&
            req.headers.password == "123") {

            var user = {
                id: "admin",
                username: "admin"
            };
            var expires = moment().add('days', 7).valueOf();
            var token = jwt.encode(
                {
                    iss: user.id,
                    exp: expires
                },
                jwtTokenSecret
            );
            res.json({
                token: token,
                expires: expires
                //user: user.toJSON()
            });
        } else {
            // No username provided, or invalid POST request. For simplicity, just return a 401
            res.send('Authentication error', 401)
        }
    },

    /**
     * Verify token, decode it and put user model into req.user
     * */
    checkToken: function (req, res, next) {
        /**
         * Take the token from:
         *
         *  - the POST value access_token
         *  - the GET parameter access_token
         *  - the x-access-token header
         *    ...in that order.
         */
        var query = url.parse(req.url, true).query;
        var token = (req.body && req.body.access_token) || query.access_token || req.headers["x-access-token"];

        if (token) {

            // if it is master token then we don't need to extract user from DB
            if (token == masterToken) {
                req.user = {
                    username: 'admin'
                };
                return next()
            }

            try {
                var decoded = jwt.decode(token, jwtTokenSecret);

                if (decoded.exp <= Date.now()) {
                    return res.end('Access token has expired', 400)
                }

                /**
                 * This is dummy code. Extract user model here, using decode.iss
                 * */
                req.user = {
                    username: decoded.iss
                };
                return next()


            } catch (err) {
                return next()
            }
        } else {
            next()
        }
    },

    /**
     * Decode string using secret
     * */
    decodeToken: function(token) {
        return jwt.decode(token, jwtTokenSecret);
    },

    /**
     * Encode string using secret
     * */
    encodeToken: function(obj) {
        return jwt.encode(obj, jwtTokenSecret);
    }
};