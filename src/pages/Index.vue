<template>
  <Home>
    <div id="container"></div>
    <div class="content">
      <div class="links" ref="links">
        <g-link to="/codepen">3D Animation</g-link>
        <g-link to="/codepen">2D Animation</g-link>
        <g-link to="/codepen">SVG Animation</g-link>
        <g-link to="/codepen">Data Viz</g-link>
      </div>

    </div>
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

      void main() {
        vec4 color = vColor;

        color.r = 0.0;
        color.g = 0.01;
        color.b += (sin(  10.0 + time ) * 0.05) - 0.5;

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
      width: window.innerWidth,
      height: window.innerHeight,
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
    this.loadFont();
    this.createParticles();
  },
  methods: {
    threeInit() {
      if(!!document) {
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer()
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
        
        this.camera.position.set(0, 0, 2);
        this.dummy = new THREE.Object3D();
      }
    },
    createParticles2() {
      let geometry = new THREE.SphereBufferGeometry(0.01, 16, 16);
      // let material = new THREE.RawShaderMaterial({
      //   fragmentShader: this.fragmentShader,
      //   vertexShader: this.vertexShader, 
      //   uniforms: {
      //     time: { type: 'f', value: 1.0 },
      //     sineTime: { type: 'f', value: 1.0 },
      //   },
      //   side: THREE.DoubleSide });
      let material = new THREE.MeshBasicMaterial({ color: 0x000055 })

      this.mesh = new THREE.InstancedMesh(geometry, material, this.instances);
      this.mesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame

      this.scene.add(this.mesh);
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
          this.render();
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
      this.text.position.z = -3;
      this.scene.add(this.text);

	  },
    render() {
      let time = performance.now() * 0.3;

      // animate text
      if(this.text.position.z < -0.32) {
        this.text.position.z += 0.015;
        this.text.material.opacity < 1 ? this.text.material.opacity += 0.005 : 1;
      }

      // for create particles 1
      var object = this.scene.children[ 0 ];
      object.rotation.x = time * 0.0005;
      object.rotation.y = time * 0.0005;
      object.rotation.z = time * 0.0005;

      object.material.uniforms[ "time" ].value = time * 0.005;
      object.material.uniforms[ "sineTime" ].value = Math.sin( object.material.uniforms[ "time" ].value * 0.05 );
      
      // for create particles 2
      // if(this.mesh) {
			// 		this.mesh.rotation.x = Math.sin( time / 4 );
			// 		this.mesh.rotation.y = Math.sin( time / 2 );

			// 		var i = 0;
			// 		var offset = ( 10 - 1 ) / 2;

			// 		for ( var x = 0; x < 10; x ++ ) {

			// 			for ( var y = 0; y < 10; y ++ ) {

			// 				for ( var z = 0; z < 10; z ++ ) {

			// 					this.dummy.position.set( offset - x, offset - y, offset - z );
			// 					this.dummy.rotation.y = ( Math.sin( x / 4 + time ) + Math.sin( y / 4 + time ) + Math.sin( z / 4 + time ) );
			// 					this.dummy.rotation.z = this.dummy.rotation.y * 2;

			// 					this.dummy.updateMatrix();

			// 					this.mesh.setMatrixAt( i ++, this.dummy.matrix );

			// 				}

			// 			}

			// 		}

			// 		this.mesh.instanceMatrix.needsUpdate = true;
      // }


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

canvas {
  position: absolute;
  min-height: 100vh;
  width: 100%;
  z-index: -1;
}

.header {
    position: absolute;
  top: 0;
  left: 0;
  height: 100px;
  width: 100%;
  border: 1px solid red;
}

.content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.content a {
  font-size: 1.2rem;
  color: white;
  text-decoration: none;
  margin: auto 1rem;


}

.links {
  opacity: 0;
  transition: opacity 1000ms ease-in-out;
  transition-delay: 500ms;
}

.content a:hover {
  font-weight: bold;
}

h1 {
  color: white;
  font-size: 8rem;
  font-weight: 100;
  /* opacity: 0; */
  text-align: center;
  letter-spacing: 1.3px;
  transition: opacity 2000ms ease-in-out;
  pointer-events: none;
  user-select: none;
}

.show {
  opacity: 1;
}
</style>
