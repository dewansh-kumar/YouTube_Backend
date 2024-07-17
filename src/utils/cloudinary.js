import {v2 as cloudinary} from 'cloudinary' //store the photos, videos, or avatar 
import fs from 'fs'
       
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

console.log(process.env.CLOUDINARY_CLOUD_NAME)
const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null

        // upload the file on cloudnary
        const response = await cloudinary.uploader.upload(localFilePath, {resource_type: "auto"})
        fs.unlinkSync(localFilePath)
        // file has uploaded
        // console.log('file is uploaded on cloudinary ', response);
        return response
    }catch(error){
        fs.unlinkSync(localFilePath) // remove the locally saved temporary  file as upload got failed
        return null
    }
    
}

const deleteFromCloudinary = async(url) => {
    try{
        if(url === ""){
            return {result: "ok"}
        }else if(!url){
            return null
        }
        // extract the public ID from the Cloudinary URL
        const parts = url.split('/');
        const publicId = parts[7].split('.')[0].trim();

         // Delete the image by its public ID
        const deletionResponse = await cloudinary.uploader.destroy(publicId);
        return deletionResponse
    }catch(error){
        return null
    }
}

export {uploadOnCloudinary, deleteFromCloudinary}

