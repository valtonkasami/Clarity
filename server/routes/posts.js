import express from "express"
import { getFeedPosts, getUserPosts } from "../controllers/posts.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.get("/:id", verifyToken, getFeedPosts)
router.get("/:userId/posts", verifyToken, getUserPosts)

export default router