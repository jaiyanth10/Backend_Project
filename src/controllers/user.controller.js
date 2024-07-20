//Remeber the controllers are like bridge between the model and view, It wont contain any logic it will only instruct the model and view.
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//The custom function whcih will create refresha nd access tokens for the user, whose DB documnet ID is passed.
async function generateAccessandRefreshTokens(userId) {
  try {
    const userDocument = await User.findById(userId); //findById is ibulit method of mongoose model(User)
    const accessToken = userDocument.generateAccessToken(); //calling this customethod using the user document, see user.model.js for method structure
    const refreshToken = userDocument.generateRefreshToken(); //calling this customethod using the user document, see user.model.js for method structure

    //now save the  refresh token in the database,
    //So, in the case of session expires, when user login without password, we can use the DB saved refrsh token to valiadate with user refresh token and then log him in.
    //if the document instance dont have refresh token field below, line will automatically add the field with created refresh token
    userDocument.refreshToken = refreshToken;
    //Now save the document, but dont validate, means dont check properties like
    //is required:true,type:string sattisfied for fields like username,password,email.
    await userDocument.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new Error(500, "Cannot generate Tokens");
  }
}

//response for registering user endpoint
const registerUser = asyncHandler(async (req, res) => {
  //Now here I am sending the response to frontend by doing below tasks.
  // understand this for writing logical code
  // 1.get user details from frontend(except images - for images(4.))
  // 2.validation - not empty
  // 3.check if user already exists: username, email
  // 4.check for images, check for avatar using req.files which is available by injecting multer middle ware in user.routes
  // 5.upload them to cloudinary, avatar
  // 6.create user object - create entry in db
  // 7.remove password and refresh token field from response
  // check for succesfull user creation
  //Now, return res

  //1.
  const { fullName, email, username, password } = req.body;
  //2.
  [fullName, email, username, password].forEach((x) => {
    //use forEach for validation and map for creating new array.
    if (x.trim() === "") {
      throw new ApiError(400, "All fields are required"); //using custom ApiError fn from utils to throw error.
    }
  });
  //3.
  const existedUser = await User.findOne({
    //findOne is inbuilt function for User Model from user.model file
    $or: [{ username }, { email }], //$or is inbuilt feature which returns true if one the fields exist.
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  //console.log(req.files);

  //4.
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //like req.body, req.files will also be available as we injected multer middle ware in route of this end point.
  //check user.routes file.

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  let coverImageLocalPath;
  //checkinng if the cover image is uploaded or not.
  //array.isArray is ibuilt method of Array keyword, which returns T/F if the passed paramter is(has) array or not.
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  //5.
  const avatar = await uploadOnCloudinary(avatarLocalPath); //uploadOnCloudinary is function from cloudinary.js
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    //checking if uploaded, if no thrwing error by thinking file not uploded by user,
    throw new ApiError(400, "Avatar file is required");
  }
  //6. create a object using User model created using mongoose in user.model file.
  const user = await User.create({
    fullname: fullName, //left side variable name should be same as the one in (user.model.js)mongoose
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email: email,
    password: password,
    username: username.toLowerCase(),
  });
  //7.
  const createdUser = await User.findById(user._id).select(
    //mongo DB will assign _id for every created field, so using it to check if the user is created?
    "-password -refreshToken" // if user is created, then using this syntax with -before the fields to remove those particular fields from object.
  );

  if (!createdUser) {
    //if user is not created in DB throwing error.
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  //8.returing res
  return res.status(201).json(
    new ApiResponse(
      200,
      createdUser, //data in response
      "User registered Successfully"
    )
  );
});

//response for login user endpoint
const loginUser = asyncHandler(async (req, res) => {
  //process of logging in user
  //1.fetch user provided data from body.
  //2.check if user is registered or not
  //3.if registered then validate the password.
  //4.if password is correct, then generate the access and refresh tokens
  //5.send the tokens via cookie to user.

  //1
  const { email, username, password } = req.body;

  if (!(email || username)) {
    //user should provide atleat one of these 2
    throw new ApiError(400, "username or email is required");
  }

  //2
  //using findOne we are going through all the documents in Mongo DB, for  user with particular username or email
  //findOne will return true, if it fines either one of username or password

  const loggedin_user = await User.findOne({ $or: [{ username }, { email }] });

  if (!loggedin_user) {
    throw new ApiError(404, "User does not exist");
  }

  //if its registered user, Now loggedin_user variable has  has instance of Mongo DB document of the particular user

  //3
  //for valiadating password lets use the method(isPasswordCorrect) from user.modal.js
  //we can access it using the mongo DB document instance  of the user who loggedin.

  const isPasswordValid = await loggedin_user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Wrong Password");
  }

  //4 (lets put this step inside a custom functon, so we can use it in overall project, see at top of file for function name,generateAccessandRefreshTokens)

  //passing the current logged in user's id using his mongo DB document instance to the function "generateAccessandRefreshTokens" to create tokens.
  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    loggedin_user._id
  );

  //removing non needed field in response for security reasons
  const Updated_loggedin_user = await User.findById(loggedin_user._id).select(
    "-password -refreshToken"
  ); //select document by removing the - mentioned properties

  //5.
  const options = { httpOnly: true, secure: true }; //this 2 objects will make sure cokkie is imutable from forntend.

  //Now create the cookie with response by passing above object for configuratin purpose
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { Updated_loggedin_user, accessToken, refreshToken }, //data in response
        "User logged in Successfully"
      )
    );
});

//response for logout user endpoint
const logoutUser = asyncHandler(async (req, res) => {
  //so to logout a user we need to clear the cookies and we also need to clear the refresh token in the user document in mongo DB.
  //but to clear refresh token, we need to access that document but for that we need some data like id, username then we do something like
  //User.findById("document id"). but here we dont have any id or data, we didnt saved it during log in.
  //so to solve this we will create a new middleware called auth.middleware.js to add a new filed to req which give access for us to id of document.
  //how is it getting id? it is using the access token of user from res.cookies(which we sent to user at time of login) and fetching the id from it.
  //To understand this look auth.middleware.js file comments.

  await User.findByIdAndUpdate(
    //.findByIdandUpdate will find the doc of this user in mongo db and instantly update it with given condition
    req.user._id, // doc id
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true, // WKT, findByIdandUpdate will return the documnet instance of passed id, by using new :true, the updated and recent instance will be returned.
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options) //clearing cookie, remeber to put same name ("accessToken") which u gave while creating cookie in login function.
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

//response for end point that user clicks when he is logged out due to session expiry.
//when he wants to login agaqin without password, we will validate the refresh token he has with one in his documnent in DB.
//If its valid we will generate new access token for him and loghim in, without need of entering password.
const regenerateAccessToken = asyncHandler(async (req, res) => {
  //This function is for the endpoint, which will be clicked by user when he logged out due to session expiry.
  //So what this function do is,
  //1.it will fetch the refresh token from the user .
  //2.Decode the token with secret key we have in env,
  //3.thenfetch the user Mongo DB document id from the refresh token, whcih we added while creating it in user.model.js.
  //4.Then, validate the refresh token he has with one in his documnent in DB.
  //5.If its valid we will generate new access token and refresh token for him and loghim in, without need of entering password.

  //1.
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  //2.
  try {
    const decodedToken = jwt.verify(
      //jwt.verify will decode the token and give access to payload(data) it is carrying.
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    //3.
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    //5.
    const { accessToken, newRefreshToken } =
      await generateAccessandRefreshTokens(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

//response for change current Password endpoint

const changeCurrentPassword = asyncHandler(async (req, res) => {
  //fetching user data
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword) {
    throw new ApiError(401, "old password is required");
  }
  if (!newPassword) {
    throw new ApiError(401, "newPassword is required");
  }
  //fetching the old password of user from DB for validation
  const user = await User.findById(req.user?._id);
  //using isPasswordCorrect from user.model.js file to know validation result.
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "please provide correct old password.");
  }
  //now add new password to the user Mongo DB doc
  user.password = newPassword;
  await user.save({ validateBeforeSave: false }); // wont do validations like required:true or not and type: string or not.

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password updation success"));
});

//response for enpoint which is providing current user

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      req.user, //current user
      "current is used fetched successfully"
    )
  );
});

//respose for endpoint which update the account details
//here we are updating username and email

const updateAccountDetails = asyncHandler(async () => {
  const { fullname, email } = req.body;
  if (!username || !email) {
    throw new ApiError(400, "Both email and username are required");
  }
  //findByIdAndUpdate will find and update at onetime
  const user = User.findByIdAndUpdate(
    req.user?._id,
    { $set: { fullName: fullname, email: email } }, //$set is inbuilt methodel mongoose model(User)
    { new: true } //returns updated fields including above condition
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "username and email updation successful"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  //fetching local path from req.body which we got from multer middleware injection
  const avatarLocalPath = req.file?.path;
  //.file?.path will give the path of uploaded avatar, no need to avatar[0]. path like we did for above located registerUser function,
  //as we have single file Headers, it will fetch the pathe of uploaded file automatically.

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  //TODO: delete old image in cloudinary (go to media explorer in cloudinary  and delete the image)

  //uploading to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }
  //updating in DB DOC
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password"); //deselecting password for being returned doc instance

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  //fetching local path from req.body which we got from multer middleware injection
  const coverImageLocalPath = req.file?.path;
  //.file?.path will give the path of uploaded avatar, no need to avatar[0]. path like we did for above located registerUser function,
  //as we have single file Headers, it will fetch the pathe of uploaded file automatically.

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  //TODO: delete old image in cloudinary

  //uploading to cloudinary
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }
  //updating in DB DOC
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password"); //deselecting password for being returned doc instance

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  regenerateAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
};
