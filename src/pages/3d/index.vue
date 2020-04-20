<template>
  <Home>
    <div id="container" ref="container"></div>
    <h1 class="test">
      whatever
    </h1>
  </Home>
</template>

<script>
import * as THREE from 'three';

export default {
  data() {
    return {
      scene: null,
      renderer: null,
      camera: null,
      width: null,
      height: null,
      container: null,
      mesh: null
    }
  },
  mounted() {
    this.threeInit();
    this.resize();
  },
  methods: {
    threeInit() {
      if(!!document) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer()

        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(800, 600);
        this.renderer.setClearColor(0xFF0000)

        this.container = document.getElementById("container");
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.container.appendChild( this.renderer.domElement );

        this.camera = new THREE.PerspectiveCamera(
          50,
          window.innerWidth / window.innerHeight,
          0.001,
          1000
        );
        
        this.camera.position.set(0, 0, 3);
        this.camera.lookAt(new THREE.Vector3());

        this.mesh = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshBasicMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide
          })
        )

        this.scene.add(this.mesh);

        this.setupResize();
      }
    },
    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.renderer.setSize(this.width, this.height);
      this.camera.aspect = this.width / this.height;
      console.log(this.width, this.height)
      
      // image cover
      this.imageAspect = 1;
      let a1, a2;
      
      if (this.height / this.width > this.imageAspect) {
        a1 = (this.width / this.height) * this.imageAspect;
        a2 = 1;
      } else {
        a1 = 1;
        a2 = (this.height / this.width) * this.imageAspect;
      }
      
      const dist = this.camera.position.z;
      const height = 1;
      
      this.camera.fov = 4 * (180 / Math.PI) * Math.atan(height / (2 * dist));

      this.camera.updateProjectionMatrix();
    },
    setupResize() {
      window.addEventListener('resize', this.resize.bind(this), false);
    },
    render() {
      let time = performance.now() * 0.3;


      requestAnimationFrame(this.render);
      this.renderer.render(this.scene, this.camera);
    }
  }
}
</script>

<style>
canvas {
  margin: auto;
  display: block;
  z-index: -1;
}
.test {
  position: absolute;
  top: 50%;
  left: 50%;

  transform-style: preserve-3d;
  color: white;
  transform: translate(-50%, -50%) perspective(1000px) translateZ(1000px);
  animation: transZ 3000ms ease-in-out forwards;
}

@keyframes transZ {
  to {
    transform: translate(-50%, -50%) perspective(1000px) translateZ(0px)
  }
}
</style>