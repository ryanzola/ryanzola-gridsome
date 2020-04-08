<template>
  <div class="post">
    <h2 v-html="post.title" />
    <div v-html="post.excerpt" />
    <g-link :to="post.path">
      Read More
    </g-link>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.post {
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
