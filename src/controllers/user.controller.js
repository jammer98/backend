import asyncHandler from "./../utils/asyncHandler.js"
import ApiErrors from "../utils/apiErrors.js";
import user from "../models/user.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js";


const registerUser = asyncHandler(async (req, res, next) =>{
    // 1. get user details
    // 2. validate user details (!empty , email valid etc)
    // 3. check is user already exits via username and email
    // 4.check for the avatar
    // 5.upload avatar to cloudinary
    // 6. create user in db
    // 7.hash the password
    // 8. generate jwt token
    // 9.check user created or not
    // 10. if user not created send error to client
    // 11. if user created send success response to client

    const {username,fullname,email,password} = req.body;
    console.log("username :",username )

    // 2. validate user details (!empty , email valid etc)
    if([username,fullname,email,password].some((field) => field?.trim() === "")){
        // this condition for every field mentioned in the array , some method will check is field is empty or not and if field is true then trim it if after trim its empty then return true
        throw new ApiErrors(400,"All fields are required");
    }
    if(email && !email.include("@")){
        // this check if email is empty and if email is not empty then check for @ in email
        // email.include("@") this will check if email has @ or not and ! marks tells if email does not have @ then throw error
        throw new ApiErrors(400,"Please enter a valid email address");
    }

    // 3. check is user already exits via username and email
    const userExist = user.findOne({
        $or : [{username},{email}]
    })

    if(userExist){
        throw new ApiErrors(409,"User already exists with this username or email");
    }

    // 4.check for the avatar
    // multer middleware will add the file to the request object
    const avatarLocalPath = req.files?.avatar[0]?.path; // this will give the path of the avatar which is stored in the local server via multer middleware
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiErrors(400,"Avatar is required");
    }

    // 5.upload avatar to cloudinary

    const avatar = await uploadToCloudinary(avatarLocalPath)
    const coverimage = await uploadToCloudinary(coverImageLocalPath)


    // 6.validate the avatar upload
    if(!avatar){
        throw new ApiErrors(400,"Avatar is required");
    }   

    // 7. create user in db

    const user = await user.create({
        username:username.toLowerCase(),
        fullname:fullname.toLowerCase(),
        email:email.toLowerCase(),
        avatar:avatar.url,
        coverImage:coverimage?.url || "",
        password,
    })

    // 8.check user created or not
    const createdUser = await user.findById(user._id).Select("-password -refreshToken")
    // whenever a user is created in monogodb it will genrate a _id for that user is that unique id is there then
    // then store it to createdUser variable 
    // .Select("-password -refreshToken") this will exclude the password and refreshToken from the user object created in the database

    if(!createdUser){
        throw new ApiErrors(500,"User not created , please try again later");
    }


    // 9. if user created send success response to client

    return res.status(200).json(
        new ApiResponse(200,"User registered successfully",createdUser
    ))
})

export default registerUser;