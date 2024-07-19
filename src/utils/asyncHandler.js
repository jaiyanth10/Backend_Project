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

//Version 2 : Using try, catch and async

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
    console.log(error);
  }
};

export { asyncHandler };

//there will be little confusion on how above is function is working.

//1.The above function is called high order function because it is recieving a function as parameter.
//2.The above function expects the recieved function should be async, thats why we used await keyword before fn(req, res, next).
//3. so when a function is passed, the above function will return atry catch block where the recieved function is executed in try block, with params req,res,next.
//4. confusion about params, dont think the recieving function have req,res,next already, then why why are we apssing new one, You should think
//in other angle, here req,res,next are not nrml params, they are passed by express.js, So
//They will be same through out the instance.

// lets see an example.

// In user.controller.js, I wrote the below code for user regestartion:

// const registerUser = asyncHandler((req, res) => {
//   res.status(200).json({ message: "ok" });
// });

//so in above code we are passing this function "(req, res) => {res.status(200).json({ message: "ok" });}" into asyncHandler.

//Lets see how the passed is substituted and runned in asyncHandler.

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await (req, res) => {res.status(200).json({ message: "ok" })};
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// Version 1: using custom promise creation

// const asyncHandler = (requestHandler) => {
//     return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
//     }
// }
