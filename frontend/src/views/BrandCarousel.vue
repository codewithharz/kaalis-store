<template>
    <div class="mx-auto w-1/2">
        <div class="brand-carousel-inner">
            <Carousel class="w-full max-w-fit" :opts="{
                align: 'start',
                slidesToShow: 4, // or any number that suits your design
            }">
                <CarouselContent class="-ml-1">
                    <CarouselItem v-for="brand in brands" :key="brand.name" class="pl-1 md:basis-1/2 lg:basis-1/3">
                        <div class="p-1">
                            <Card>
                                <CardContent class="flex aspect-square items-center justify-center p-0">
                                    <img :src="brand.logo" :alt="brand.name" class="brand-logo" />
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    </div>
</template>

<script>
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'

export default {
    name: 'BrandCarousel',
    components: {
        Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
        Card, CardContent
    },
    data() {
        return {
            brands: [
                { name: 'Hoodie Native Abuja', logo: 'https://firebasestorage.googleapis.com/v0/b/kaalis-store.appspot.com/o/products%2FIMG-20240517-WA0047.jpg?alt=media&token=165d693c-d2dd-4dd2-a7c7-760f9876d681' },
                { name: 'Hoodie Native Lagos', logo: 'https://firebasestorage.googleapis.com/v0/b/kaalis-store.appspot.com/o/products%2FIMG-20240517-WA0048.jpg?alt=media&token=01acc4ac-f1d8-44f5-b579-9b45fee89289' },
                { name: 'Hoodie Native Niger', logo: 'https://firebasestorage.googleapis.com/v0/b/kaalis-store.appspot.com/o/products%2FIMG-20240517-WA0049.jpg?alt=media&token=9251a7ba-1711-460c-9ae6-4357e8f7a93b' },
                { name: 'Hoodie Native Kogi', logo: 'https://firebasestorage.googleapis.com/v0/b/kaalis-store.appspot.com/o/products%2FIMG-20240517-WA0050.jpg?alt=media&token=32047e8d-e0e5-425d-b866-fe64e0573e02' },
                { name: 'Hoodie Native Abia', logo: 'https://firebasestorage.googleapis.com/v0/b/kaalis-store.appspot.com/o/products%2FIMG-20240517-WA0051.jpg?alt=media&token=f3e94ceb-4d9f-435c-a32e-8a12b4787e2c' },
                { name: 'Hoodie Native Delta', logo: 'https://firebasestorage.googleapis.com/v0/b/kaalis-store.appspot.com/o/products%2FIMG-20240517-WA0052.jpg?alt=media&token=5d7c7ef4-bbf5-479a-99a0-aaebaa761771' },
                { name: 'Hoodie Native Jos', logo: 'https://firebasestorage.googleapis.com/v0/b/kaalis-store.appspot.com/o/products%2FIMG-20240517-WA0053.jpg?alt=media&token=e2e06305-18a0-4623-9fb8-01d9f0dc3c8c' },
                { name: 'Hoodie Native Rivers', logo: 'https://firebasestorage.googleapis.com/v0/b/kaalis-store.appspot.com/o/products%2FIMG-20240517-WA0054.jpg?alt=media&token=66afa422-a48e-44a9-8336-902d549f0648' },
                { name: 'Hoodie Native Kano', logo: 'https://firebasestorage.googleapis.com/v0/b/kaalis-store.appspot.com/o/products%2FIMG-20240517-WA0055.jpg?alt=media&token=101a765f-5e8c-4f1d-9590-db9cb582f3a9' },
                { name: 'Hoodie Native Kebbi', logo: 'https://firebasestorage.googleapis.com/v0/b/kaalis-store.appspot.com/o/products%2FIMG-20240517-WA0056.jpg?alt=media&token=c7bd1be6-cb29-47ca-85d7-5ef8e43ff49f' },
                { name: 'Hoodie Native Kaduna', logo: 'https://firebasestorage.googleapis.com/v0/b/kaalis-store.appspot.com/o/products%2FIMG-20240517-WA0057.jpg?alt=media&token=522ef34c-e8a1-4e69-a869-9b9d4070afcd' },
                { name: 'Hoodie Native Taraba', logo: 'https://firebasestorage.googleapis.com/v0/b/kaalis-store.appspot.com/o/products%2FIMG-20240517-WA0058.jpg?alt=media&token=282c4218-25fa-4ff0-bff6-586dd5429c9e' },
                { name: 'Hoodie Native Oyo', logo: 'https://firebasestorage.googleapis.com/v0/b/kaalis-store.appspot.com/o/products%2FIMG-20240517-WA0059.jpg?alt=media&token=48b15ddc-d3c8-4415-9530-e9a8f43bf028' }
            ],
        }
    }
}
</script>

<style scoped>
.brand-carousel {
    display: flex;
    overflow: hidden;
    padding: 20px 0;
    background-color: #f7f7f7;
}

.brand-carousel-inner {
    display: flex;
    transition: transform 0.3s ease-in-out;
}

.brand-item {
    flex: 0 0 auto;
    margin: 0 10px;
}

.card-content {
    padding: 0;
    /* Remove padding to make the image fill the card */
}

.brand-logo {
    width: 95%;
    height: auto;
    /* Maintain aspect ratio */
    object-fit: cover;
    /* Ensure the image covers the container */
}
</style>
