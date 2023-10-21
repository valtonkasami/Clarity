import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

import { firebaseConfig } from "../firebase.config.js";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

initializeApp(firebaseConfig);
const storage = getStorage();

export const register = async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body;

        const storageRef = ref(storage, req.file.originalname)
        await uploadBytes(storageRef, req.file.buffer).then((snapshot) => {
        console.log("file uploaded")
        })
        const picturePath = await getDownloadURL(storageRef);

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