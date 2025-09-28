import multer from "multer";

const storage = multer.diskStorage({
    // diskStorage is a method of multer which is used to store the file on the disk
  destination: function (req, file, cb) {
    //req is the request object
    // file is the file which we are uploading(middleware will add this file to the request object)
    // cb is callback function
    cb(null,'./Public/temp')
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname)
    // file.originalname is the name of the file which we are uploading
  }
})
export const upload = multer({storage})
// multer is a middleware which is used to handle multipart/form-data, which is primarily used for uploading files 