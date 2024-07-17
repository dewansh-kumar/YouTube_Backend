import multer from "multer"; // use to upload the file in local storage

// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp') // Destination directory for storing uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // Set the filename to the original name of the uploaded file
    }
  })
  
  // Create an instance of Multer by passing in the storage configuration
  export const upload = multer({ storage: storage })
  