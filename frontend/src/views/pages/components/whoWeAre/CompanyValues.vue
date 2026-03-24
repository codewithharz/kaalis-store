<template>
    <div class="bg-gray-100 p-6 rounded-lg">
      <h3 class="text-xl font-bold mb-4">{{ t('whoWeArePage.coreValuesTitle') }}</h3>
      <div v-for="(value, index) in companyValues" :key="index" class="mb-4">
        <h4 class="text-lg font-semibold mb-2 text-[#24a6bb]">{{ value.title }}</h4>
        <p class="text-gray-700">{{ value.description }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { useI18n } from 'vue-i18n';

  export default {
    name: 'CompanyValues',
    setup() {
      const { t } = useI18n();
      return { t };
    },
    computed: {
      companyValues() {
        return [
          {
            title: this.t('whoWeArePage.value1Title'),
            description: this.t('whoWeArePage.value1Body')
          },
          {
            title: this.t('whoWeArePage.value2Title'),
            description: this.t('whoWeArePage.value2Body')
          },
          {
            title: this.t('whoWeArePage.value3Title'),
            description: this.t('whoWeArePage.value3Body')
          },
          {
            title: this.t('whoWeArePage.value4Title'),
            description: this.t('whoWeArePage.value4Body')
          }
        ]
      }
    },
  }
  </script>
