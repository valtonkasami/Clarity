import { Sequelize, Op } from "sequelize";
import User from "../models/User.js";
import Post from "../models/Post.js";

export const getUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const searchUser = async (req, res) => {
  
  try {
    const { input } = req.params
    
    const users = await User.findAll({
      where: {
        username: {
          [Op.iLike]: `%${input}%`,
        },
      },
    });

    res.json(users);
  } catch (error) {
    console.error('Error searching for users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}


export const followUser = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const userFollow = await User.findOne({ where: { id } });
    const user = await User.findOne({ where: { id: userId } });

    if (!user || !userFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = await User.findOne({
      where: {
        id: userId,
        following: { [Sequelize.Op.contains]: [id] },
      },
    });

    if (isFollowing) {
      // Remove 'id' from user's 'following' array
      await user.update({
        following: Sequelize.literal(`array_remove("following", ${id})`),
      });

      // Remove 'userId' from userFollow's 'followers' array
      await userFollow.update({
        followers: Sequelize.literal(`array_remove("followers", ${userId})`),
      });
    } else {
      // Add 'id' to user's 'following' array
      await user.update({
        following: Sequelize.literal(`array_append("following", ${id})`),
      });

      // Add 'userId' to userFollow's 'followers' array
      await userFollow.update({
        followers: Sequelize.literal(`array_append("followers", ${userId})`),
      });
    }

   const userToSend = await User.findOne({ where: { id } })

    res.status(200).json(userToSend);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const changePfp = async (req, res) => {
  try {
    const { id, picturePath } = req.body
    const user = await User.findOne({ where: { id } });
    const posts = await Post.findAll({ where: {userId: id} }) 

    if (!user) {
        return res.status(404).json({ message: "User not found" });
}

      await user.update({ picturePath })
      
      for (const post of posts) {
        await post.update({ userPicturePath: picturePath });
      }

      res.status(201).json({ message: "Profile picture updated successfully" });
} catch (err) {
    res.status(512).json({ error: err.message });
}
}