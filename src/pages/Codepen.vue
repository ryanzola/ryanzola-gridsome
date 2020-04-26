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
          codepenUrl
        }
      }
    }
  }
}
</page-query>

<script>
import { Pager } from 'gridsome'
import Codepen from '~/components/Codepen.vue'

export default {
  components: {
    Pager,
    Codepen
  },
  metaInfo: {
    title: 'Welcome to my blog :)'
  }
}
</script>
