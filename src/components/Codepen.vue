<template>
  <div class="pen">
    <a :href="pen.acf.codepenUrl" target="_blank">
    <img class="pen__preview-image" :src="pen.featuredMedia.sourceUrl" alt="">
    <h2 class="pen__title" v-html="pen.title" />
    </a>

    <footer class="pen__footer">
      <button>
        <svg id="heart" width="16" height="16" viewBox="0 0 100 92"><path d="M85.24 2.67C72.29-3.08 55.75 2.67 50 14.9 44.25 2 27-3.8 14.76 2.67 1.1 9.14-5.37 25 5.42 44.38 13.33 58 27 68.11 50 86.81 73.73 68.11 87.39 58 94.58 44.38c10.79-18.7 4.32-35.24-9.34-41.71z"></path></svg>
        {{ pen.acf.likes }}
      </button>
      <button>
        <svg id="comment" width="20" height="20" viewBox="-405.9 238 56.3 54.8"><path d="M-391 291.4c0 1.5 1.2 1.7 1.9 1.2 1.8-1.6 15.9-14.6 15.9-14.6h19.3c3.8 0 4.4-.8 4.4-4.5v-31.1c0-3.7-.8-4.5-4.4-4.5h-47.4c-3.6 0-4.4.9-4.4 4.5v31.1c0 3.7.7 4.4 4.4 4.4h10.4v13.5z"></path></svg>
        {{ pen.acf.comments }}
      </button>
      <button>
        <svg id="eye" width="20" height="20" viewBox="0 0 30.5 16.5"><path d="M15.3 0C8.9 0 3.3 3.3 0 8.3c3.3 5 8.9 8.3 15.3 8.3s12-3.3 15.3-8.3C27.3 3.3 21.7 0 15.3 0zm0 14.5c-3.4 0-6.2-2.8-6.2-6.2C9 4.8 11.8 2 15.3 2c3.4 0 6.2 2.8 6.2 6.2 0 3.5-2.8 6.3-6.2 6.3z"></path></svg>
        {{ pen.acf.views }}
      </button>
    </footer>
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
}
</script>

<style scoped>
.pen {
  position: relative;
  /* border: 1px solid #1f2229; */
  border-radius: 0.25rem;
  padding: 1rem;
  cursor: pointer;
}



.pen::after {
  position: absolute;
  content: '';
  top: 5.4px;
  left: 0;
  right: 0;
  bottom: 0;
  background: #1f2229;
  z-index: -1;
  contain: strict;
  overflow: hidden;
  border-radius: 10px;
  transform-origin: center;
  transform: scale(0.944);
  will-change: transform;
  transition: transform 0.3s ease-in-out, top 0.3s ease-in-out;
}

.pen:hover::after {
  top: 0;
  transform: scale(1);
  transition: transform 0.3s ease, top 0.3s ease-in-out;
}

.pen__title {
  color: white;
  margin-top: 0;
  margin-bottom: 0.25rem;
  padding-left: 1rem;
  font-size: 17px;
  transition: padding 0.3s ease-in-out;
}

.pen:hover .pen__title {
  padding-left: 0;
}

.pen__preview-image {
  border-radius: 10px 10px 0 0;
  margin-bottom: 0.25rem;
}

.pen a {
  text-decoration: none;
}

.pen__footer {
  padding-left: 1rem;
  transition: padding 0.3s ease-in-out;
}

.pen:hover .pen__footer {
  padding-left: 0;
}

.pen__footer button {
  background: rgba(0, 0, 0.9);
  border: none;
  border-radius: 4px;
  margin-right: 5px;
  padding: 0.25rem 0.5rem 0.2rem;
  color: white;
  cursor: pointer;
}

.pen__footer button:hover {
  background: white;
  color: rgba(0, 0, 0.9);
}

.pen__footer button svg {
  width: 12px;
  height: 12px;
  display: inline-block;
  position: relative;
  top: -1px;
  vertical-align: middle;
  margin-right: 5px;
  fill: white;
}

svg#eye {
  top: -2px;
  width: 17px;
}

.pen__footer button:hover svg#comment,
.pen__footer button:hover svg#eye {
  fill: #4ece77;
}

.pen__footer button:hover svg#heart {
  fill: #f19994;
}

@media screen and (min-width: 599px) {
.pen::after {
  transform: scaleX(0.89) scaleY(0.9);
}
}

@media screen and (min-width: 768px) {
  .pen::after {
    transform: scaleX(0.922) scaleY(0.91);

  }
}
</style>