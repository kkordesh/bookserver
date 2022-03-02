const { DataTypes } = require("sequelize");
const db = require("../db");

const Book = db.define("book", {

    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
        
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    summary: {
        type: DataTypes.STRING(10000),
        allowNull: false, 
    },
    image: {
        type: DataTypes.STRING(1000),
    },
    list: {
        type: DataTypes.STRING,
    },
    // owner_id: {
    //     type: DataTypes.INTEGER
    // }

    
});

module.exports = Book; 