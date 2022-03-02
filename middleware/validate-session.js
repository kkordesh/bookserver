const jwt = require("jsonwebtoken")
const { models } = require("../model")

const validateSession = async (req, res, next) => { 

    try {
        if (req.method === "OPTIONS") { //option method requests permitted communication options for a given URL server (checking if GET POST DELETE ETC exists in access control allow methods (headers), if it does we continue)
            return next()
        } else if (req.headers.authorization) { //checks if token has been added in headers
            const { authorization } = req.headers //desctructing so we can mess around with it
            console.log(authorization)
            const payload = authorization ? jwt.verify
            (authorization, process.env.JWT_SECRET_KEY) : undefined; //if authorization is true, we want our token verified (JWT verify method). otherwise, return undefined. 
    
            if (payload) { // if we got our payload back(tokens valid)....
                let foundUser = await models.UserModel.findOne({  // looking for user in db
                    where: {id: payload.id} // payload is wrapped in an object, so id is a property
                })
    
                if (foundUser) { //"if the user exist we..."
                    req.user = foundUser //asign found user to the request.user itself 
                    next()
                } else { //if we dont find a user...
                    res.status(400).json({
                        message: "User not found."
                    })
                }
            } else { //token not matching
                res.status(401).json({
                    message: "Invalid Token"
                })
            }
        } else { //if no token at all
        res.status(403).json({
            message: "Forbidden"
        })
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = validateSession