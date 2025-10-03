import asyncHandler from "../utils/asyncHandler";
import ApiErrors from "../utils/apiErrors.js";
import jwt from "jsonwebtoken";
import { user } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
   try {
    const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "")
     // req.cookies have accessToken as meantioned in the user.controller.js file in the loginUser function 
     // if req.cookie have accessToken then we will take that and also check the req.header used in mobile app and inside the authorization header we have Bearer token so we will replace the Bearer with empty string and get the token only
     // the authorization header is used in mobile app because mobile app does not support cookies
     // its like Authorization: Bearer <token> this is how we get the token
 
     if(!token){
         throw new ApiErrors(401,"You are not logged in, please login to access this resource");
     }
 
     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
 
     const loggedinuser = await user.findById(decodedToken?._id).select("-password -refreshToken")
 
     if(!loggedinuser){
         throw new ApiErrors(401,"The user belonging to this token does no longer exist");
     }
 
     req.user = loggedinuser; // this req.user is from the express js it is not from the user model // chat gpt
     // we are attaching the user object to the req object so that we can access it in the next middleware or controller
     next();
   } 
    catch (error) {
        throw new ApiErrors(401, error?.message || "Invalid Token or Token expired, please login again");
   }

})