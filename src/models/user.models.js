import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        index:true
    },
    avatar:{
        type:String, // cloudinary url
        required:true,
    },
    coverImage:{
        type:String, // cloudinary url
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"video"
        }
    ],
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    refreshTokens:{
        type:String
    }
},{timestamps:true}) // this will give us createdAt and updatedAt fields


userSchema.pre("save", async function(next){
    //this pre is a middleware this have many types like save ,update,delete etc we are going to use pre.save which means just before saving the data in the database do this thing which is in the middelware
    // this argument inside the function is for the middelwares which is a flag and tell to exceute the next middelware as soon this one get completed

    // if(this.isModified("password")){ // this will check if the password is modified or not if it is modified then only hash it otherwise not
    //     this.password =  await bcrypt.hash(this.passsword,10) //10 is the hash rounds for the hasing of the pssword just before storing in the databse
    //     next();
    // }
    //or
    if(!this.isModified("password")) return next() // if the password is not modified then just return next middelware
    this.password = await bcrypt.hash(this.password, 10) //10 is the hash rounds for the hasing of the pssword just before storing in the databse
    next()
})
    

userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password,this.password) // this will compare the password which is given by the user and the password which is stored in the database
}

userSchema.methods.genrateAccessToken = function(){
    //jwt sign is a method which is used to genrate the token : a token is a string which is used to identify the user and to authenticate the user jwt sign will give a token and jwt verify will verify the token
    // is the token is valid then it is verified or else not verified
    return jwt.sign({
        // this is the payload(data) which we want to store in the token , this will be used to verify the user
        _id:this._id, // key:value (key is the name of payload and value is the data from the database)
        username:this.username,
        fullname:this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXIPRY
    }
    )
}

userSchema.methods.genrateRefreshToken = function(){
    //jwt sign is a method which is used to genrate the token : a token is a string which is used to identify the user and to authenticate the user jwt sign will give a token and jwt verify will verify the token
    // is the token is valid then it is verified or else not verified
    return jwt.sign({
        // this is the payload(data) which we want to store in the token , this will be used to verify the user
        _id:this._id, // key:value (key is the name of payload and value is the data from the database)
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXIPRY
    }
    )
}

export const user = mongoose.model("user",userSchema)
