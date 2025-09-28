// this is wrapper function for async functions to handle errors
// ḷike talkiing to database we will use async so this provides a wrapper for all that functions
// so that we dont have to write try catch block again and again

// there are two ways one is handel promises using .then and .catch
// other is using async await with try catch block

// first one :

// ****************************************************************************************************************
// const asyncHandler = (functionToBeWrapped) => async (req,res,next) =>{
//     try {
//         await functionToBeWrapped(req,res,next)
        
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message || "Internal Server Error"
//         })
//     }
// }

// this will await the function passed to it and if there is any error it will catch it and send it to the client
// if no error it will just execute the function normally
// res.status(error.code || 500) this will send the error code if there is any else it will send 500
// message: error.message || "Internal Server Error" this will send the error message if there is any else it will send "Internal Server Error"
// *****************************************************************************************************************************

// second one :

const asyncHandler = (functionToBeWrapped) => (req,res,next) =>{
    return Promise.resolve(functionToBeWrapped(req,res,next))
           .catch((error) => next(error))
}

// this will return a promise which will resolve the function passed to it
// if there is any error it will catch it and pass it to the next middleware
// which will be the error handling middleware
// this is a cleaner way to handle async functions and errors
// *****************************************************************************************************************************
export default asyncHandler;



