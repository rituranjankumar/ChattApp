//google login/signup
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
       process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    "postmessage" // matches frontend flow -> require frontend to send code for verification to backend
)

module.exports = client;