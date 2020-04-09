<template>
  <div class="pen">
    <h2 v-html="pen.title" />
    <img :src="pen.featuredMedia.sourceUrl" alt="">
    <a :href="pen.acf.codepenUrl">codepen link</a>
  </div>
</template>

<script>
export default {
  props: {
    pen: {
      type: Object,
      required: true
    }
  },
  mounted() {
    console.log(this.pen)
  }
}
</script>

<style scoped>
.pen {
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  padding: 1rem;
  background-color: #f5f6f8;
}

h2 {
  color: #343537;
  margin-top: 0;
}
</style>