const moment = require("moment/moment");
const jwt = require("jsonwebtoken")

const userTypes = {
    USER_TYPE_SUPER_ADMIN: 1,
    USER_TYPE_STANDARD_ADMIN: 2,
}

const createJWTToken = (user, expTimeInHours = 6) => {
    const payload = {
        uID: user._id,
        iat: moment().unix(),
        exp: moment().add( expTimeInHours, "hours").unix(),
        claims: {
          // addional informations can be added here
          name: user.name,
          email: user.email
        }
      }
      const myPromise = new Promise((resolve, reject) => {
          jwt.sign(payload, process.env.JWT_ENCRYPTION_KEY, (err, token) => {
            if(err)  
                reject(err)
            resolve(token)
          })
      })
      return myPromise
}


module.exports = {
    userTypes,
    createJWTToken
};