import { Router } from "express";
import registerUser from "../controllers/user.controller.js";
import { upload } from "../middlewares/Multer.middlewares.js";

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

export default router;
// we will create a route for user registration