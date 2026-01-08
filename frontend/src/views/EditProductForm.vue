<template>
    <form @submit.prevent="handleSubmit" class="max-w-lg mx-auto mt-8">
        <div class="mb-4">
            <label for="name" class="block text-gray-700 font-bold mb-2">Name</label>
            <input type="text" id="name" v-model="form.name" required class="w-full px-3 py-2 border rounded-lg">
        </div>
        <div class="mb-4">
            <label for="description" class="block text-gray-700 font-bold mb-2">Description</label>
            <textarea id="description" v-model="form.description" required
                class="w-full px-3 py-2 border rounded-lg"></textarea>
        </div>
        <div class="mb-4">
            <label for="price" class="block text-gray-700 font-bold mb-2">Price</label>
            <input type="number" id="price" v-model="form.price" required class="w-full px-3 py-2 border rounded-lg">
        </div>
        <div class="mb-4">
            <label for="stock" class="block text-gray-700 font-bold mb-2">Stock</label>
            <input type="number" id="stock" v-model="form.stock" required class="w-full px-3 py-2 border rounded-lg">
        </div>
        <div class="mb-4">
            <label for="discount" class="block text-gray-700 font-bold mb-2">Discount</label>
            <input type="number" id="discount" v-model="form.discount" class="w-full px-3 py-2 border rounded-lg">
        </div>
        <div class="mb-4">
            <label for="images" class="block text-gray-700 font-bold mb-2">Images</label>
            <input type="file" id="images" @change="handleFileUpload" multiple accept="image/*"
                class="w-full px-3 py-2 border rounded-lg">
        </div>
        <div class="mb-4">
            <label for="tags" class="block text-gray-700 font-bold mb-2">Tags (comma-separated)</label>
            <input type="text" id="tags" v-model="form.tags" class="w-full px-3 py-2 border rounded-lg">
        </div>
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            {{ isEditing ? 'Update' : 'Create' }} Product
        </button>
    </form>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useProductStore } from '../store/productStore';
import { useRoute, useRouter } from 'vue-router';
import { storage } from '../utils/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'vue-sonner';

export default {
    name: 'EditProductForm',
    setup() {
        const productStore = useProductStore();
        const route = useRoute();
        const router = useRouter();
        const isEditing = ref(false);
        const loading = ref(true);  // Added loading state
        const form = ref({
            name: '',
            description: '',
            price: 0,
            stock: 0,
            discount: 0,
            images: [],
            tags: ''
        });
        const files = ref([]);

        onMounted(async () => {
            console.log(route.params)
            if (route.params.id) {
                isEditing.value = true;
                await productStore.fetchProductById(route.params.id);
                if (productStore.product) {
                    form.value = {
                        ...productStore.product,
                        tags: Array.isArray(productStore.product.tags) ? productStore.product.tags.join(', ') : ''
                    };
                }
            }
            loading.value = false;  // Stop loading when product data is loaded
        });

        const handleFileUpload = (event) => {
            files.value = Array.from(event.target.files);
        };

        const handleSubmit = async () => {
            const tagsArray = form.value.tags.split(',').map(tag => tag.trim());
            const productData = new FormData();

            // Append all form fields to FormData
            for (const [key, value] of Object.entries(form.value)) {
                if (key !== 'tags' && key !== 'images') {
                    productData.append(key, value);
                }
            }

            productData.append('tags', JSON.stringify(tagsArray));

            // Append new images
            if (files.value.length) {
                for (let i = 0; i < files.value.length; i++) {
                    productData.append('images', files.value[i]);
                }
            }

            try {
                let result;
                if (isEditing.value) {
                    result = await productStore.updateProduct(route.params.id, productData);
                    toast.success('Product updated successfully');
                } else {
                    result = await productStore.createProduct(productData);
                    toast.success('Product created successfully');
                }

                // Wait for the store to update before navigating
                await productStore.fetchProducts();
                router.push('/account/my-products');
            } catch (error) {
                console.error('Error submitting form:', error);
                toast.error(`Failed to submit form: ${error.message}`);
            }
        };


        const uploadFiles = async () => {
            const uploadedImageUrls = [];

            for (const file of files.value) {
                const fileName = `${Date.now()}_${file.name}`;
                const fileRef = storageRef(storage, `products/${fileName}`);
                await uploadBytes(fileRef, file);
                const downloadURL = await getDownloadURL(fileRef);
                uploadedImageUrls.push(downloadURL);
            }

            return uploadedImageUrls;
        };

        return {
            form,
            handleFileUpload,
            handleSubmit,
            isEditing
        };
    }
}
</script>
