//code for index file
const db = require('../db')

const UserModel = require("./user")
const BookModel = require("./book")
const ReviewModel = require("./review") 

// associations 
UserModel.hasMany(ReviewModel);
UserModel.hasMany(BookModel);

BookModel.belongsTo(UserModel);
BookModel.hasMany(ReviewModel);

ReviewModel.belongsTo(BookModel);



module.exports = {
    dbConnection: db,

    models: {
        UserModel,
        BookModel,
        ReviewModel, 
    }
};