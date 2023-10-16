import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer"
import helmet from "helmet"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import { register } from "./controllers/auth.js"
import sequelize from "./sequelize.js"
import { verifyToken } from "./middleware/auth.js"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import { createPost } from "./controllers/posts.js"
import { changePfp } from "./controllers/users.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(helmet.crossOriginEmbedderPolicy({ policy: 'require-corp' }))

app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))

const whitelist = ['http://localhost:3001']; // List of allowed domains

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions))


app.use("/assets", express.static(path.join(__dirname, 'public/assets')))
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage })



app.post("/auth/register", upload.single("picture"), register)
app.post("/posts/create", verifyToken, upload.single("picture"), createPost)
app.post("/users/create", verifyToken, upload.single("picture"), changePfp)

app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/posts", postRoutes)

sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch((error) => {
    console.error('Error connecting to PostgreSQL database:', error);
  });

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});