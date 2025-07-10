import axios from 'axios';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "your_imgbb_api_key_here";
const IMGBB_API_URL = "https://api.imgbb.com/1/upload";

export const uploadImageToImgBB = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("key", IMGBB_API_KEY);
    const response = await axios.post(IMGBB_API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    const data = response.data;
    if (data.success) {
        return data.data.url;
    } else {
        throw new Error(data.error?.message || "Upload failed");
    }
};