<template>
  <div>
    <slot/>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@100&display=swap');

html
{
  font-family: 'Alegreya Sans', sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
*, *:before, *:after
{
  box-sizing: border-box;
  margin: 0;
}

*, *:before, *:after {
  box-sizing: inherit;
}

body {
  padding: 0;
}
</style>
