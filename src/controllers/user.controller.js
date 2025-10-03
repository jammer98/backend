import asyncHandler from "./../utils/asyncHandler.js"
import ApiErrors from "../utils/apiErrors.js";
import {user} from "../models/user.models.js";
import uploadToCloudinary  from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js";



const gerateAccessAndRefreshToken = async(userId) =>{
    try {
        const user = await user.findById(userId) // this user is the user model imported from the user.models.js file and the user Schema is defined in that file "const user" is the diffrent variable from the user model variable
        const accessToken = user.genrateAccessToken()
       const refreshToken = user.genrateRefreshToken()

       user.refreshTokens = refreshToken
       await user.save({validateBeforeSave:false}) // this will save the refresh token in the database and validateBeforeSave:false this will skip the validation of the user schema like required fields etc


       return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiErrors(500,"Something went wrong while generating tokens")
    }
}


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
    console.log("👉 req.body:", req.body);
    console.log("👉 req.files:", req.files);
    console.log("*********************")

    // console.log("username :",username )

    // 2. validate user details (!empty , email valid etc)
    if([username,fullname,email,password].some((field) => field?.trim() === "")){
        // this condition for every field mentioned in the array , some method will check is field is empty or not and if field is true then trim it if after trim its empty then return true
        throw new ApiErrors(400,"All fields are required");
    }
    if(email && !email.includes("@")){
        // this check if email is empty and if email is not empty then check for @ in email
        // email.include("@") this will check if email has @ or not and ! marks tells if email does not have @ then throw error
        throw new ApiErrors(400,"Please enter a valid email address");
    }

    // 3. check is user already exits via username and email
    const userExist = await user.findOne({
        $or : [{username},{email}]
    })

    if(userExist){
        throw new ApiErrors(409,"User already exists with this username or email");
    }

    // 4.check for the avatar
    // multer middleware will add the file to the request object
    const avatarLocalPath = req.files?.avatar[0]?.path; // this will give the path of the avatar which is stored in the local server via multer middleware
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;

        // this is for is the user dont send a coverimage then to handel it without error
    }


    console.log("👉 avatarLocalPath:", avatarLocalPath);
    console.log("👉 coverImageLocalPath:", coverImageLocalPath);


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

    const newuser = await user.create({
        username:username.toLowerCase(),
        fullname:fullname.toLowerCase(),
        email:email.toLowerCase(),
        avatar:avatar.url,
        coverImage:coverimage?.url || "",
        password,
    })

    // 8.check user created or not
    const createdUser = await user.findById(newuser._id).select("-password -refreshToken")

    // this is the user model this with this model we have cteated a new instance of the user callled the newuser 
    // model have access to many methods like findById , findOne , create etc
    // but instance of the model have access to ismodified etc etc



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

const loginUser = asyncHandler(async (req,res,next) =>{
    // 1.get user detail from req.body
    // 2.validate user details
    // 3.check user exist or not via email or username
    // 4.if user not exist send error to client
    // 5.if user exist then check for the password
    // 6.if password is incorrect send error to client
    // 7.if password is correct then genrate access and refresh token and keep with myself and give it to the user 
    // 8.send secure cookies and success response to client with token

    // ******************************************************************************************************************************

    // 1.get user detail from req.body
    const {username,email,password} = req.body;

    // 2.validate user details
    if(!username || !email ){
        throw new ApiErrors(400,"username or email is required");
    }


    // find the user via email or username
    const loggedinUser = await user.findOne({
        $or :[{username},{email}]
    })

    if(!loggedinUser){
        throw new ApiErrors(404,"User not found with this username or email");
    }

    // 5.if user exist then check for the password
    const isPasswordValid = await loggedinUser.isPasswordCorrect(password)
    // this password which is passed inside the function is via req.body password

    if(!isPasswordValid){
        throw new ApiErrors(401,"Invalid password");
    }

    // 7.if password is correct then genrate access and refresh token and keep with myself and give it to the user
    const {accessToken,refreshToken} = await gerateAccessAndRefreshToken(loggedinUser._id);

    // optional step to update the user model and remove the password and refresh token from the user object
    const userData = await user.findById(loggedinUser._id).select("-password -refreshToken");


    // 8.send secure cookies and success response to client with token
    const options = {
        httpOnly:true, // this will prevent the client side javascript to access the cookie
        secure : true, // this will only allow the cookie to be sent via https
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,"User logged in successfully",{user:userData,accessToken,refreshToken}))






})

const logoutUser = asyncHandler(async (req,res) =>{
    
}) 

export default registerUser;