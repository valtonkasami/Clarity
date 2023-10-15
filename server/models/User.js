import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
     
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      
    },
    picturePath: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    following: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: []
    },
    followers: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: []
    },
  }, {
    timestamps: true
  }
);

sequelize.sync()
  .then(() => {
    console.log('Database tables synchronized');
  })
  .catch((error) => {
    console.error('Error synchronizing database tables:', error)
  })

export default User;