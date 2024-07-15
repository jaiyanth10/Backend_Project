import multer from "multer";

const storage = multer.diskStorage({//we are using disk storage
    destination: function (req, file, cb) {//req will have data, file will have all files, cb means call back function
      cb(null, "./public/temp")//we are storing the file in temp folder of public folder in our project 
    },
    filename: function (req, file, cb) {// this denotes how to name file while storing.
      //By using below 2 comments we can add suffix to file name of the mentioned format while saving.
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      // cb(null, file.fieldname + '-' + uniqueSuffix)
      cb(null, file.originalname)// in this project we are saving normally without adding suffix
    }
  })
  
export const upload = multer({ 
    storage, 
})//exporting the function as upload nameed variable.