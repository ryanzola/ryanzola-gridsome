<template>
  <Home>
      <h1>Ryan Zola</h1>
    <div id="container"></div>

 
    <script id="vertex" type="x-shader/x-vertex">
      precision highp float;

      attribute vec3 offset;
      attribute vec4 color;
      attribute vec3 position;
      attribute vec4 orientationStart;
      attribute vec4 orientationEnd;

      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform float sineTime;

      varying vec4 vColor;
      varying vec3 vPosition;

      void main() {
        vColor = color;
        //vPosition = offset * max( abs( sineTime * 2.0 + 1.0 ), 0.5 ) + position;
        vPosition = offset * max( abs( 2.0 + 1.0 ), 0.5 ) + position;
        vec4 orientation = normalize( mix( orientationStart, orientationEnd, sineTime ) );
        vec3 vcV = cross( orientation.xyz, vPosition );
        vPosition = vcV * ( 2.0 * orientation.w ) + ( cross( orientation.xyz, vcV ) * 2.0 + vPosition );

        gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
      }
    </script>

    <script id="fragment" type="x-shader/x-fragment">
      precision highp float;
      varying vec4 vColor;
      varying vec3 vPosition;

      uniform float time;
      uniform float sineTime;

      void main() {
        vec4 color = vColor;

        color.r = 0.0;
        color.g = 0.0;
        color.b += (sin( 5.0 + time ) * 0.05) - 0.5;

        gl_FragColor = color;
      }
    </script>
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
      instances: 50000,
      vertexShader: null,
      fragmentShader: null,
      text: null,
      mesh: null,
      dummy: null,
    }
  },
  mounted() {
    this.threeInit();
    this.createParticles();
    this.resize();
    this.render();
    
  },
  methods: {
    threeInit() {
      if(!!document) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.vertexShader = document.getElementById('vertex').textContent;
        this.fragmentShader = document.getElementById('fragment').textContent;

        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x000010, 1);

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

        this.setupResize();

        this.dummy = new THREE.Object3D();
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
    createParticles() {
      var vector = new THREE.Vector4();

      let offsets = [];
      let positions = [];
      var colors = [];
      var orientationsStart = [];
      var orientationsEnd = [];

      // positions.push( 0.02, - 0.02, 0 );
      // positions.push( - 0.02, 0.02, 0 );
      // positions.push( 0, 0, 0.02 );

      // front
      positions.push(0, 0, 0);
      positions.push(0, 0.02, 0);
      positions.push(-0.02, 0.01, 0);



      for(let i = 0; i < this.instances; i++) {
        offsets.push(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
        colors.push( Math.random(), Math.random(), Math.random(), Math.random() );

        vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
        vector.normalize();

        orientationsStart.push( vector.x, vector.y, vector.z, vector.w );

        vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
        vector.normalize();

        orientationsEnd.push( vector.x, vector.y, vector.z, vector.w );
      }

      var geometry = new THREE.InstancedBufferGeometry();
      geometry.maxInstancedCount = this.instances;

      geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
      geometry.setAttribute( 'offset', new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 3 ) );
      geometry.setAttribute( 'color', new THREE.InstancedBufferAttribute( new Float32Array( colors ), 4 ) );
      geometry.setAttribute( 'orientationStart', new THREE.InstancedBufferAttribute( new Float32Array( orientationsStart ), 4 ) );
      geometry.setAttribute( 'orientationEnd', new THREE.InstancedBufferAttribute( new Float32Array( orientationsEnd ), 4 ) );


      let material = new THREE.RawShaderMaterial({
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader,
        uniforms: {
          time: { type: 'f', value: 1.0 },
          sineTime: { type: 'f', value: 1.0 },
        },
        side: THREE.DoubleSide,
        transparent: true
      });

      let mesh = new THREE.Mesh(geometry, material);

      this.scene.add(mesh);
    },
    loadFont() {
      let loader = new THREE.FontLoader();
      loader.load(
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1116884/alegreya_sans_thin_regular.typeface.json",
        res => {
          this.createText(res);
          // this.render();
        }
      );
    },
    createText(font) {
      let textMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0 });
      let textGeo = new THREE.TextGeometry("Ryan Zola", {
        font: font,
        size: 0.298,
        height: 0.001,
        curveSegments: 10,
        bevelEnabled: false,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelOffset: 0,
        bevelSegments: 0
      });
      textGeo.computeBoundingBox();
      textGeo.computeVertexNormals();

      this.text = new THREE.Mesh(textGeo, textMat);
      this.text.position.y = (-textGeo.boundingBox.max.y / 2) + 0.058 ;
      this.text.position.x = (-textGeo.boundingBox.max.x / 2) - 0.01;
      this.text.position.z = 1;
      this.scene.add(this.text);

	  },
    render() {
      let time = performance.now() * 0.3;

      // for create particles 1
      var object = this.scene.children[ 0 ];
      object.rotation.x = time * 0.0005;
      object.rotation.y = time * 0.0005;
      object.rotation.z = time * 0.0005;

      object.material.uniforms[ "time" ].value = time * 0.005;
      object.material.uniforms[ "sineTime" ].value = Math.sin( object.material.uniforms[ "time" ].value * 0.05 );

      requestAnimationFrame(this.render);
      this.renderer.render(this.scene, this.camera);
    }
  }
}
</script>


<style>
.container {
  min-height: 100vh;
  position: relative;
  top: 0;
  left: 0;
}

h1 {
  position: absolute;
  width: 100%;
  top: 50%;
  left: 50%;
  color: white;
  font-weight: 100;
  font-size: 20vw;
  text-align: center;
  transform-style: preserve-3d;
  transform:  translate(-50%, -50%) perspective(1000px) translateZ(1000px);
  opacity: 0;
  animation: transZ 4000ms ease-in-out forwards;
  will-change: transform;
}

@keyframes transZ {
  to {
    transform: translate(-50%, -50%) perspective(1000px) translateZ(0px);
    opacity: 1;
  }
}
</style>
