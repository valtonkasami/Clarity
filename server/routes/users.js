import express from "express"
import {
  getUser,
  searchUser,
  followUser,
} from "../controllers/users.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()


router.get("/:id", verifyToken, getUser)
router.get("/:input/search", verifyToken, searchUser)
router.get("/:id/:userId", verifyToken, followUser)

export default router