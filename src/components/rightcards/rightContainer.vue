<template>
    <div>
      <upCard @locate='locate'  :key="index" />
      <midCard @locate='locate'  :key="index" />
      <downCard @locate='locate' :key="index"/>
    </div>
  </template>
  
  <script>
  import upCard from '@/components/rightcards/upCard.vue';
  import midCard from '@/components/rightcards/midCard.vue';
  import downCard from '@/components/rightcards/downCard.vue';
  
  export default {
    components: {
        upCard,
        midCard,
        downCard,
    },
    methods: {
      locate(pos,phone) {
        this.$emit('locate',pos,phone);
      }
    }
  }
  </script>
  