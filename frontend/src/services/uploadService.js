import apiClient from "../api/axios";
import { useUserStore } from "../store/user";

const uploadService = {
    /**
     * Upload a single image to Cloudinary via the backend
     * @param {File} file - The image file to upload
     * @returns {Promise<string>} - The Cloudinary URL of the uploaded image
     */
    async uploadImage(file) {
        try {
            const userStore = useUserStore();
            const formData = new FormData();
            formData.append("image", file);

            const response = await apiClient.post("/upload/image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${userStore.token}`,
                },
            });

            return response.data.url;
        } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            throw error;
        }
    },

    /**
     * Upload multiple images to Cloudinary via the backend
     * @param {FileList|File[]} files - The image files to upload
     * @returns {Promise<string[]>} - Array of Cloudinary URLs
     */
    async uploadImages(files) {
        try {
            const userStore = useUserStore();
            const formData = new FormData();

            const fileList = Array.from(files);
            fileList.forEach((file) => {
                formData.append("images", file);
            });

            const response = await apiClient.post("/upload/images", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${userStore.token}`,
                },
            });

            return response.data.urls;
        } catch (error) {
            console.error("Error uploading multiple images to Cloudinary:", error);
            throw error;
        }
    },
};

export default uploadService;
