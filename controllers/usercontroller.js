const router = require("express").Router()
const {models} = require('../model')

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { UniqueConstraintError } = require('sequelize/lib/errors')

router.post("/login", async (req, res) => {
    
    let { username, password } = req.body
    try {
        const loginUser = await models.UserModel.findOne({
            where: { username }
        })

        if (loginUser) {
            let pwdCompare = await bcrypt.compare(password, loginUser.password)

            if (pwdCompare) {
                let token = jwt.sign(
                    { id: loginUser.id },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: 60 * 60 * 24}
                )

                res.status(200).json({
                    message: `User logged in`,
                    user: loginUser,
                    token: token
                })
            }
        } else {
            res.status(401).json({
                messsage: `Incorrect Email or Password`
            })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err
        })
    }
})


// router.post("/register", async (req, res) => {

//     const { email, username, password, isAdmin } = req.body

//     try {
//         const newUser = await UserModel.create({
//             email,
//             username, 
//             password: bcrypt.hashSync(password, 10),
//             isAdmin
//         })
        
//         const token = jwt.sign(
//             { id: newUser.id },
//             process.env.JWT_SECRET_KEY,
//             { expiresIn: 60 * 60 * 24 }
//         )

//         res.status(201).json({
//             message: "User created",
//             user: newUser,
//             token
//         })

//     } catch(err) {
//         if (err.name === "SequelizeUniqueConstraintError") {
//             res.status(409).json({
//                 message: `Email or Username already in use.`
//             })
//         } else {
//             res.status(500).json({
//                 message: `Error`,
//                 error: err
//             })
//         }
//     }
// })

router.post("/register", async (req, res) => {

     const { email, username, password, isAdmin } = req.body

    if (isAdmin == true) {
        let adminUser = await models.UserModel.findAll({
            where: {username: username, isAdmin:true}
        })
        if (adminUser.length > 0) {
            res.json({
                message: 'already admin on account'
            })
            return
        }
    }

    



     try {
        await models.UserModel.create({
            email,
            username,
            password: bcrypt.hashSync(password, 10),
            isAdmin
        })
        .then(
            user => {
                let token = jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY, {expiresIn: 60*60*24});
                res.status(201).json({
                    user: user,
                    message: 'user created',
                    token,
                });
            }
        )
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: 'Username already in use'
            });
        } else {
            res.status(500).json({
                error: `Failed to register user: ${err}`
            });
        };
    };
});


router.get('/userinfo', async (req, res) => {
    try {
        await models.UserModel.findAll({
            include: [
                {
                    model: models.BookModel,
                    include: [
                        {
                            model: models.ReviewModel
                        }
                    ]
                }
            ]
        })
        .then(
            users => {
                res.status(200).json({
                    users: users
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            error: `Failed to retrieve users: ${err}`
        });
    };
});


module.exports=router;
