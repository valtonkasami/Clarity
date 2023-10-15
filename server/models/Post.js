import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Post = sequelize.define('post', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.STRING,
      picturePath: DataTypes.STRING,
      userPicturePath: DataTypes.STRING,
      stars: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), 
        defaultValue: [],
      },
      thoughts: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        defaultValue: [],
      },
    }, {
      timestamps: true,
    });
    
    export default Post;