<template>
    <div class="mb-4" v-if="hasSizes">
        <!-- Header with Size Guide -->
        <div class="flex justify-between items-center mb-2">
            <h2 class="font-medium text-gray-700 capitalize">
                {{ measurementType || 'Size' }}:
            </h2>
            <!-- <button v-if="product?.category" @click="showSizeGuide = true"
                class="text-blue-500 text-sm hover:text-blue-600">
                Size Guide
            </button> -->
            <button v-if="product?.category" @click="showSizeGuide = true"
                class="text-blue-500 text-sm hover:text-blue-600">
                {{ measurementType || 'Size' }} Guide
            </button>
        </div>

        <!-- Fit Information -->
        <div class="mt-2 relative group">
            <!-- Info Icon and Text -->
            <div class="flex items-center text-sm text-gray-500 ">
                <svg class="w-4 h-4 mr-1 cursor-help" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                95% of customers say these fit true to size
            </div>

            <!-- Hover Tooltip - Now appears below -->
            <div
                class="absolute top-full left-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <!-- Tooltip Arrow - Now at top -->
                <div
                    class="absolute left-4 -top-1.5 w-3 h-3 bg-white border-l border-t border-gray-200 transform -translate-y-1/2 rotate-45">
                </div>

                <div class="bg-white rounded-lg shadow-lg p-4 border border-gray-200 w-72">
                    <h3 class="font-medium mb-3">95% of customers say these fit true to size</h3>

                    <div class="space-y-3">
                        <!-- Small fit -->
                        <div class="flex items-center justify-between">
                            <span class="text-sm w-20">Small</span>
                            <div class="flex-1 mx-3">
                                <div class="h-2 bg-gray-100 rounded-full">
                                    <div class="h-full w-[1%] bg-gray-300 rounded-full"></div>
                                </div>
                            </div>
                            <span class="text-sm w-10 text-right">1%</span>
                        </div>

                        <!-- True to size -->
                        <div class="flex items-center justify-between">
                            <span class="text-sm w-20">True to size</span>
                            <div class="flex-1 mx-3">
                                <div class="h-2 bg-gray-100 rounded-full">
                                    <div class="h-full w-[95%] bg-black rounded-full"></div>
                                </div>
                            </div>
                            <span class="text-sm w-10 text-right">95%</span>
                        </div>

                        <!-- Large fit -->
                        <div class="flex items-center justify-between">
                            <span class="text-sm w-20">Large</span>
                            <div class="flex-1 mx-3">
                                <div class="h-2 bg-gray-100 rounded-full">
                                    <div class="h-full w-[4%] bg-gray-300 rounded-full"></div>
                                </div>
                            </div>
                            <span class="text-sm w-10 text-right">4%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Size Buttons -->
        <div class="flex flex-wrap gap-2 mt-2">
            <button v-for="sizeOption in availableSizes" :key="sizeOption.size" @click="selectSize(sizeOption)"
                class="min-w-[40px] px-2 py-1 rounded-full text-sm font-medium transition-all duration-200" :class="[
                    selectedSize === sizeOption.size
                        ? 'border-2 border-gray-800 font-medium'
                        : 'border border-gray-300',
                    !sizeOption.inStock && 'opacity-50 cursor-not-allowed bg-gray-50',
                    sizeOption.inStock && 'hover:border-gray-400 cursor-pointer'
                ]" :disabled="!sizeOption.inStock">
                {{ sizeOption.size }}

                <!-- Low Stock Indicator -->
                <span v-if="sizeOption.stock <= lowStockThreshold && sizeOption.stock > 0"
                    class="absolute -top-2 -right-2 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full whitespace-nowrap">
                    {{ sizeOption.stock }} left
                </span>
            </button>
        </div>

        <!-- Stock Info -->
        <div v-if="selectedSize && getSelectedVariantStock !== null" class="mt-1 text-xs text-gray-500">
            {{ getSelectedVariantStock }} in stock
        </div>

        <!-- Size Guide Modal -->
        <AlertDialog v-model:open="showSizeGuide">
            <AlertDialogContent class="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle class="text-lg font-medium">Size Guide</AlertDialogTitle>
                    <AlertDialogDescription>
                        <div class="mt-4 overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead>
                                    <tr class="bg-gray-50">
                                        <th class="p-2 border text-left font-medium">Size</th>
                                        <th v-for="metric in sizeGuideMetrics" :key="metric"
                                            class="p-2 border text-left font-medium">
                                            {{ metric }}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="size in getSizeGuideData" :key="size.size">
                                        <td class="p-2 border">{{ size.size }}</td>
                                        <td v-for="metric in sizeGuideMetrics" :key="metric" class="p-2 border">
                                            {{ size[metric.toLowerCase()] }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel class="w-full bg-gray-100 hover:bg-gray-200">
                        Close
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>

<script>
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default {
    name: 'SizeSelector',
    components: {
        AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
    },

    props: {
        product: {
            type: Object,
            required: true
        },
        selectedColor: {
            type: String,
            default: null
        },
        selectedSize: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            selectedSize: null,
            showSizeGuide: false,
            lowStockThreshold: 5
        }
    },
    computed: {
        hasSizes() {
            const variants = this.product?.variants || [];
            console.log('Checking variants for measurements:', variants);

            const hasSizes = variants.some(variant => {
                const hasSize = variant.attributes?.some(attr => {
                    // Check for various measurement/size attributes
                    const isSizeAttribute = [
                        'size',
                        'measurement',
                        'length',
                        'width',
                        'height',
                        'shape',
                        'storage',  // Add storage to the list
                        'capacity', // You might want to add this too
                        'volume'    // And other relevant attributes
                        // Add other measurement names here
                    ].includes(attr.name.toLowerCase());

                    console.log('Attribute:', attr.name, 'Is Size/Measurement?:', isSizeAttribute);
                    return isSizeAttribute;
                });
                return hasSize;
            });

            console.log('Has sizes/measurements result:', hasSizes);
            return hasSizes;
        },

        measurementType() {
            if (!this.product?.variants?.length) return null;

            // Get the first variant with attributes
            const firstVariant = this.product.variants.find(v => v.attributes?.length > 0);
            if (!firstVariant) return null;

            // Find the measurement attribute
            const measurementAttr = firstVariant.attributes.find(attr =>
                [
                    'size',
                    'measurement',
                    'length',
                    'width',
                    'height',
                    'shape',
                    'storage',
                    'capacity',
                    'volume'
                ].includes(attr.name.toLowerCase())
            );

            return measurementAttr ? measurementAttr.name : null;
        },

        availableSizes() {
            if (!this.product?.variants) {
                console.log('No variants available');
                return [];
            }

            console.log('Processing variants for measurements:', this.product.variants);

            // Get all size/measurement variants
            const sizeVariants = this.product.variants
                .filter(variant => {
                    const hasSizeMeasurement = variant.attributes?.some(attr =>
                        [
                            'size',
                            'measurement',
                            'length',
                            'width',
                            'height',
                            'shape',
                            'storage',  // Add storage here too
                            'capacity',
                            'volume'
                            // Add other measurement names here
                        ].includes(attr.name.toLowerCase())
                    );
                    console.log('Variant has measurement?:', hasSizeMeasurement, variant);
                    return hasSizeMeasurement;
                })
                .map(variant => {
                    // Find the first matching measurement attribute
                    const measurementAttr = variant.attributes.find(attr =>
                        [
                            'size',
                            'measurement',
                            'length',
                            'width',
                            'height',
                            'shape',
                            'storage',
                            'capacity',
                            'volume'
                        ].includes(attr.name.toLowerCase())
                    );

                    return {
                        size: measurementAttr.value,      // This will be "Slim"
                        measurementType: measurementAttr.name, // Store the type of measurement
                        stock: variant.stock,
                        inStock: variant.stock > 0,
                        color: variant.color,
                        price: variant.price
                    };
                });

            console.log('Found measurement variants:', sizeVariants);

            // Group by measurement value
            const result = Object.values(sizeVariants.reduce((acc, variant) => {
                const size = variant.size;
                if (!acc[size]) {
                    acc[size] = {
                        size,
                        measurementType: variant.measurementType,
                        stock: 0,
                        inStock: false,
                        variants: []
                    };
                }
                acc[size].stock += variant.stock;
                acc[size].inStock = acc[size].inStock || variant.stock > 0;
                acc[size].variants.push(variant);
                return acc;
            }, {}));

            console.log('Final Available Measurements:', result);
            return result;
        },

        getSelectedVariantStock() {
            if (!this.selectedSize || !this.selectedColor) return null;

            const variant = this.product?.variants?.find(v =>
                v.attributes?.some(attr =>
                    attr.name.toLowerCase() === 'size' &&
                    attr.value === this.selectedSize
                ) &&
                v.color?.hexCode === this.selectedColor
            );

            return variant?.stock || null;
        },

        sizeGuideMetrics() {
            const category = this.product?.category?.name?.toLowerCase() || '';
            if (category.includes('shoe')) {
                return ['US', 'UK', 'EU', 'CM'];
            }
            if (category.includes('clothing')) {
                return ['Chest', 'Waist', 'Length'];
            }
            return ['Size', 'Measurement'];
        },
        getSizeGuideData() {
            const category = this.product?.category?.name?.toLowerCase() || '';
            return this.getSizeGuideForCategory(category, this.availableSizes);
        }
    },

    methods: {
        selectSize(sizeOption) {
            if (!sizeOption.inStock) return;

            this.selectedSize = sizeOption.size;

            // If there's only one color variant for this size, select it automatically
            const availableColors = sizeOption.variants
                .filter(v => v.stock > 0)
                .map(v => v.color?.hexCode)
                .filter(Boolean);

            if (availableColors.length === 1) {
                this.$emit('update:selectedColor', availableColors[0]);
            }

            this.$emit('update:selectedSize', sizeOption.size);
            this.updateAvailableColorsForSize(sizeOption.size);
        },

        updateAvailableColorsForSize(size) {
            const variantsForSize = this.product?.variants?.filter(v =>
                v.attributes?.some(attr =>
                    attr.name.toLowerCase() === 'size' &&
                    attr.value === size
                )
            );

            if (variantsForSize) {
                const availableColors = variantsForSize
                    .filter(v => v.stock > 0)
                    .map(v => ({
                        hexCode: v.color?.hexCode,
                        name: v.color?.name,
                        inStock: v.stock > 0
                    }));
                this.$emit('update:availableColors', availableColors);
            }
        },

        getSizeGuideForCategory(category, sizes) {
            // Implement size guide data based on your product categories
            // Check if we have shape measurements
            const hasShapeMeasurements = sizes.some(s => s.measurementType?.toLowerCase() === 'shape');

            if (hasShapeMeasurements) {
                return sizes.map(s => ({
                    size: s.size,
                    measurement: `${s.size} shape`
                }));
            }

            // Original size guides for other categories...
            const sizeGuides = {
                shoes: [
                    { size: 'S', us: '7', uk: '6', eu: '40', cm: '25' },
                    { size: 'M', us: '8', uk: '7', eu: '41', cm: '26' },
                    { size: 'L', us: '9', uk: '8', eu: '42', cm: '27' }
                ],
                clothing: [
                    { size: 'S', chest: '36-38', waist: '30-32', length: '28' },
                    { size: 'M', chest: '38-40', waist: '32-34', length: '29' },
                    { size: 'L', chest: '40-42', waist: '34-36', length: '30' }
                ]
            };

            return sizeGuides[category] || sizes.map(s => ({
                size: s.size,
                measurement: `${s.size} standard measurement`
            }));
        }
    }
}
</script>