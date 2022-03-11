const { DataTypes } = require("sequelize");
const db = require("../db");

const Review = db.define("review", {
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
    review: {
        type: DataTypes.STRING,
        allowNull: false,
      
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING, 
    
    }
    // owner_id: {
    //     type: DataTypes.INTEGER
    // }
    
});

module.exports = Review; 