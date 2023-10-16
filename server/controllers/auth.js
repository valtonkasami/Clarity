import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const register = async (req, res) => {
    try {
        const {
            username,
            password,
            picturePath,
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        
        const newUser = await User.create({
            username,
            password: passwordHash,
            picturePath,
        })
        
        res.status(201).json(newUser);
    } catch (err) {
      console.error(err); 
      res.status(500).json({ error: err.message });
  }
}

export const login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = await User.findOne({ where: { username } });
  
      if (!user) {
        return res.status(400).json({ msg: 'User does not exist.' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials.' });
      }
  
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  
      delete user.dataValues.password;
  
      res.status(200).json({ token, user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };