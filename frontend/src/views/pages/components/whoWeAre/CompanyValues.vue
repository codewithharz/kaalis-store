<template>
    <div class="bg-gray-100 p-6 rounded-lg">
      <h3 class="text-xl font-bold mb-4">Our Core Values</h3>
      <div v-for="(value, index) in companyValues" :key="index" class="mb-4">
        <h4 class="text-lg font-semibold mb-2 text-[#24a6bb]">{{ value.title }}</h4>
        <p class="text-gray-700">{{ value.description }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CompanyValues',
    data() {
      return {
        companyValues: [
          {
            title: "Innovation",
            description: "We constantly push boundaries to create cutting-edge solutions in e-commerce and technology."
          },
          {
            title: "Customer-Centric",
            description: "Our customers are at the heart of everything we do, driving our decisions and improvements."
          },
          {
            title: "Sustainability",
            description: "We're committed to sustainable practices that benefit our community and the environment."
          },
          {
            title: "Empowerment",
            description: "We empower our partners, vendors, and employees to grow and succeed alongside us."
          }
        ]
      }
    }
  }
  </script>