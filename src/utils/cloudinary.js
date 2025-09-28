// this is a service which we can store our files(images,videos etc) in the cloud and can access it from anywhere in the world
// there are two ways in which we can do this 
// 1. directly using the cloudinary api
// 2. storing the files in our server and then uploading it to cloudinary using the cloudinary api
import { v2 as cloudinary } from 'cloudinary'
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadToCloudinary = async (filepath) =>{
    try {
        if(!filepath) return null;
        // upload function have two parameters
        // 1. filepath: path of the file which we want to upload
        // 2. options: options for uploading the file like resource_type, folder etc
        const response =  await cloudinary.uploader.upload(filepath,{ 
            resource_type: "auto", // this will automatically detect the type of file(image,video etc)
        })
        console.log("cloudinary response",response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(filepath); // delete the file from the server if there is an error
        console.log("cloudinary upload error",error);
        return null;
    }
}

export default uploadToCloudinary;
