import { Sequelize, Op } from "sequelize";
import Post from "../models/Post.js";
import User from "../models/User.js";

import { firebaseConfig } from "../firebase.config.js";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

initializeApp(firebaseConfig);
const storage = getStorage();

export const createPost = async (req, res) => {
    try {
        const { userId, description } = req.body
        const user = await User.findOne({ where: { id: userId } });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
    }

    
    let picturePath = null;

    if (req.file) {
      const storageRef = ref(storage, req.file.originalname)
      await uploadBytes(storageRef, req.file.buffer).then((snapshot) => {
        console.log("file uploaded");
      });

      picturePath = await getDownloadURL(storageRef);
    }

        const newPost = await Post.create({
            userId,
            username: user.username,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            stars: [],
            thoughts: []
        })
        
        
        
          
          const followingIds = user.following.map((follow) => follow);
          const whereClause = {
            userId: user.id, 
          };
          
          if (followingIds.length > 0) {
            whereClause.userId = {
              [Op.in]: [user.id, ...followingIds], 
            };
          }
          
          const feedPosts = await Post.findAll({
            where: whereClause,
            order: [["createdAt", "DESC"]],
          });
      
          res.status(201).json(feedPosts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}




export const getFeedPosts = async (req, res) => {
    try {

      const { id } = req.params
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
          }

    
          const followingIds = user.following.map((follow) => follow);
          const whereClause = {
            userId: user.id, // Always include the user's own id
          };
          
          if (followingIds.length > 0) {
            whereClause.userId = {
              [Op.in]: [user.id, ...followingIds], 
            };
          }
          
          const feedPosts = await Post.findAll({
            where: whereClause,
            order: [["createdAt", "DESC"]],
          });
      
          res.status(200).json(feedPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params
        const userPost = await Post.findAll({ where: { userId }, order: [["createdAt", "DESC"]],})
        if (userPost.length === 0) {
            return res.status(404).json({ message: "No posts found for this user" });
          }

          res.status(200).json(userPost);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      };


// delete & comment & like & edit