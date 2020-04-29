<template>
  <Layout>
    <ul class="post-list">
      <li v-for="{ node } in $page.allWordPressCodepen.edges" :key="node.id">
        <Codepen :pen="node" />
      </li>
    </ul>
  </Layout>
</template>

<page-query>
query Codepen ($page: Int) {
  allWordPressCodepen (page: $page, perPage: 10) @paginate {
    edges {
      node {
        title
        id
        featuredMedia {
          sourceUrl
        }
        acf {
          codpenDescription
          codepenUrl,
          comments,
          views,
          likes
        }
      }
    }
  }
}
</page-query>

<script>
import { Pager } from 'gridsome'
import Codepen from '~/components/Codepen.vue'
import Layout from '~/layouts/Default.vue';

export default {
  components: {
    Pager,
    Codepen,
    Layout
  },
  metaInfo: {
    title: 'Codepen'
  },
  data() {
    return {
      pens: []
    }
  },
}
</script>

<style scoped>
ul {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
}

@media screen and (min-width: 599px) {
  ul {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (min-width: 768px) {
  ul {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>