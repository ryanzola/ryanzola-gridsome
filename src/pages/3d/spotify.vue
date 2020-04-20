<template>
  <Home>
    <div id="container" ref="container"></div>
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
      clock: null,
      width: null,
      height: null,
      container: null,
      coin: null,
      coins: []
    }
  },
  mounted() {
    this.threeInit();
    // this.createLights();
    // this.resize();
    // this.mesh = new THREE.Mesh(
    //   new THREE.BoxGeometry(1,1,1),
    //   new THREE.MeshNormalMaterial({
    //     side: THREE.DoubleSide
    //   })
    // )

    // this.scene.add(this.mesh)
  },
  methods: {
    threeInit() {
      if(!!document) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.container = document.getElementById("container");
        this.container.appendChild( this.renderer.domElement );

        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;


        this.camera = new THREE.PerspectiveCamera(
          60, 
          window.innerWidth / window.innerHeight, 
          0.1,
          100
        );
        
        this.camera.position.set(0, 0, 3);
        this.camera.lookAt(new THREE.Vector3());

        this.setupResize();
      }
    },
    createLights() {
      let ambient = new THREE.AmbientLight(0xffffff, 100)
      this.scene.add(ambient);

      let light1 = new THREE.DirectionalLight(0xffffff, 2);
      light1.position.set(-10, 0, 0);

      let light2 = new THREE.DirectionalLight(0xffffff, 2);
      light2.position.set(10, 0, 0);
        
      this.scene.add(light1);
      this.scene.add(light2);
    },
    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.renderer.setSize(this.width, this.height);
      this.camera.aspect = this.width / this.height;
      
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
    createSpotifyLogo(numOfCoins) {
      let that = this;
      let Coin = {
        x: that.randomInRange(-7, 7) * 3,
        y: that.randomInRange(10, 30) * 3,
        z: (that.randomInRange(0, -9) * 3) - 2,
        rotation: {
          x: that.randomInRange(-0.03, 0.03),
          y: that.randomInRange(-0.03, 0.03)
        },
        bottom: -30,
        over: false,
        coinMaterial: new THREE.MeshStandardMaterial({
          color: 0x1DB954,
          roughness: 0.5,
          metalness: 1.0,
        }),
        
        waveMaterial: new THREE.MeshStandardMaterial({
          color: 0x000000,
          roughness: 0.1,
          metalness: 0.8,
        }),
        coinMesh: null,
        object: null,
        

        getMesh: () => {
          return this.coinMesh;
        },
        
        draw: () => {
          
          function generateCoinShape() {
            //cylinder
            let cylinderGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.5, 64);
            cylinderGeometry.rotateX(Math.PI / 2);
            
            // torus
            let torusGeometry = new THREE.TorusGeometry(2.5, 0.25, 16, 64)
            
            // combine
            let combinedGeometry = new THREE.Geometry();
            combinedGeometry.merge(torusGeometry);
            combinedGeometry.merge(cylinderGeometry);
            
            // buffer geometry
            let coinBufferGeo = new THREE.BufferGeometry().fromGeometry(combinedGeometry);
            
            that.coinMesh = new THREE.Mesh(coinBufferGeo, that.coinMaterial);
          };

          function generateWaves(s) {
            // base shape
            let geometry = new THREE.TorusGeometry(4.2, 0.2, 100, 100, Math.PI / 4);
            let geometrysL = new THREE.SphereGeometry(0.2, 30, 30);
            let geometrysR = new THREE.SphereGeometry(0.2, 30, 30);
            geometry.rotateZ(20);
            geometrysL.translate(1.7, 3.84, 0);
            geometrysR.translate(-1.5, 3.92, 0);
            
            // merge geos
            let combinedGeometry = new THREE.Geometry();
            combinedGeometry.merge(geometry);
            combinedGeometry.merge(geometrysL);
            combinedGeometry.merge(geometrysR);
            combinedGeometry.scale(s, s, s);
            let waveBufferGeo = new THREE.BufferGeometry().fromGeometry(combinedGeometry);
            
            return waveBufferGeo;
          }
          
          // main coin shape
          generateCoinShape();
          
          // wave shapes
          let waveGroupFront = new THREE.Group();
          let waveGroupBack = new THREE.Group();
          
          let buffer = generateWaves(1.0);
          let wave = new THREE.Mesh(buffer, this.waveMaterial);
          wave.position.y = -3;
          waveGroupFront.add(wave);

          buffer = generateWaves(0.8);
          wave = new THREE.Mesh(buffer, this.waveMaterial);
          wave.position.y = -3.1;
          waveGroupFront.add(wave);

          
          buffer = generateWaves(0.64);
          wave = new THREE.Mesh(buffer, this.waveMaterial);
          wave.position.y = -3.35;
          waveGroupFront.add(wave);

          waveGroupBack.copy(waveGroupFront, true);

          waveGroupFront.position.z = -0.3;
          waveGroupBack.position.z = 0.3;

          this.coinMesh.add(waveGroupFront);
          this.coinMesh.add(waveGroupBack);
          this.coinMesh.position.set(this.x, this.y, this.z);
          
          this.object = this.coinMesh;
          // that.scene.add(this.coinMesh);
        },
        
        update:() => {
          this.object.position.y -= 0.25;
          this.object.rotation.x += this.rotation.x;
          this.object.rotation.y += this.rotation.y;
          
          if(this.object.position.y < this.bottom) {
            this.over = true;
          }
        },
      }

      for(let i = 0; i < numOfCoins; i++) {
        that.coins.push(Coin);
      }
    },
    update() {
      let time = performance.now() * 0.3;

      if(this.coins.length) {
        this.coins.forEach((coin, index) => {
          coin.update()
          
          if(coin.over) {
            coin.object.position.set(
              randomInRange(-7, 7) * 3,
              randomInRange(10, 20) * 3,
              (randomInRange(0, -9) * 3) - 2
            )
            coin.over = false;
          }
        })
      }
    },
    render() {
      this.update();
      requestAnimationFrame(this.render);
      this.renderer.render(this.scene, this.camera);
    },
    randomInRange(to, from) {
      let x = Math.random() * (to - from);
      return x + from;
    }
  }
}
</script>

<style>

</style>