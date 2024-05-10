<template>
    <div>
      <upCard @locate='locate'  @renderGeojson='renderGeojson':key="index" />
      <midCard @locate='locate'  @renderGeojson='renderGeojson' :key="index" />
      <downCard @locate='locate' @renderGeojson='renderGeojson' :key="index"/>
    </div>
  </template>
  
  <script>
  import upCard from '@/components/leftcards/upCard.vue';
  import midCard from '@/components/leftcards/midCard.vue';
  import downCard from '@/components/leftcards/downCard.vue';
  
  export default {
    components: {
        upCard,
        midCard,
        downCard,
    },
    methods: {
      locate(pos,phone) {
        this.$emit('locate',pos,phone);
      },
      renderGeojson(params){
        this.$emit('renderGeojson',params);
      }
    }
  }
  </script>
  