import { Router } from "express";
import {registerUser ,loginUser,logoutUser} from "../controllers/user.controller.js";
import { upload } from "../middlewares/Multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

// we will use multer middleware to upload the avatar
// when this route will be hit the we will call the upload middleware via multer (upload is the instance of multer) and then we will call the registerUser controller
router.route("/register").post(upload.fields(
    [
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ])
    ,registerUser)

router.route("/login").post(loginUser)

// secured Routes
router.route("/logout").post(verifyJWT , logoutUser)

export default router;
// we will create a route for user registration