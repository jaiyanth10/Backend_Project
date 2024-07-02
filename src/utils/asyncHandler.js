
//Here the objective of utils folder is to have some functions which will be reused allover the project

//In this project, there will be functions,which need req,res,next as parameters, for that function we also 
 //need try and catch block for error handling, for example you can think api end point functions. So instead
 //of writing the try and catch block and passing req,res,next every time for each function, I wrote below code(wrapper function)
 // which will act as wrapper and provide try,catch and parameters.

 //next keyword

//  next() is called to pass control to the next middleware function. 
//  If next() is not called, the request will be left hanging, and 
//  the subsequent middleware functions or route handlers will not be executed.


// next(err) is called with an error argument to pass control to the error-handling middleware.
// This is used to handle errors in the application.

// Version 1: using custom promise creation

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }


//Version 2 : Using try, catch and async

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }