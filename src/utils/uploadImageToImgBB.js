import axios from 'axios';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_API_URL = "https://api.imgbb.com/1/upload";

export const uploadImageToImgBB = async (imageFile) => {
    if (!IMGBB_API_KEY) {
        throw new Error("IMGBB API key is missing. Please set VITE_IMGBB_API_KEY in your .env file.");
    }
    try {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await axios.post(
            `${IMGBB_API_URL}?key=${IMGBB_API_KEY}`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        const data = response.data;
        if (data.success) {
            return { success: true, url: data.data.url };
        } else {
            throw new Error(data.error?.message || "Upload failed");
        }
    } catch (error) {
        throw new Error(
            error?.response?.data?.error?.message ||
            error?.message ||
            "Image upload failed"
        );
    }
};