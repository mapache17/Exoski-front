// SceneInit.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Canyon_Rock_002_basecolor from '../assets/textures/Canyon_Rock_002_basecolor.jpg';
import Concrete_Muddy_001_AmbientOcclusion from '../assets/textures/Concrete_Muddy_001_AmbientOcclusion.jpg';
import Concrete_Muddy_001_BaseColor from '../assets/textures/Concrete_Muddy_001_BaseColor.jpg';
import Concrete_Muddy_001_Height from '../assets/textures/Concrete_Muddy_001_Height.png';
import Concrete_Muddy_001_Normal from '../assets/textures/Concrete_Muddy_001_Normal.jpg';
import Concrete_Muddy_001_Roughness from '../assets/textures/Concrete_Muddy_001_Roughness.jpg';
import Ground_wet_003_height from '../assets/textures/Ground_wet_003_height.png';
import Lapis_Lazuli_002_basecolor from '../assets/textures/Lapis_Lazuli_002_basecolor.jpg';
import Malachite_001_basecolor from '../assets/textures/Malachite_001_basecolor.jpg';
import Orange_001_COLOR from '../assets/textures/Orange_001_COLOR.jpg';
import Rock_039_baseColor from '../assets/textures/Rock_039_baseColor.jpg';
import Sand_002_COLOR from '../assets/textures/Sand 002_COLOR.jpg';
import Sand_007_basecolor from '../assets/textures/Sand_007_basecolor.jpg';
import Sand_007_height from '../assets/textures/Sand_007_height.png';
import Stylized_Lava_001_basecolor from '../assets/textures/Stylized_Lava_001_basecolor.png';
import Stylized_Sand_001_basecolor from '../assets/textures/Stylized_Sand_001_basecolor.jpg';
import Substance_Graph_BaseColor from '../assets/textures/Substance_Graph_BaseColor.jpg';
import Wall_Plaster_001_basecolor from '../assets/textures/Wall_Plaster_001_basecolor.jpg';
import Wall_Plaster_002_BaseColor from '../assets/textures/Wall_Plaster_002_BaseColor.jpg';
import Wallpaper_001_COLOR from '../assets/textures/Wallpaper_001_COLOR.jpg';



export default class SceneInit {
  constructor(canvasId, planets, searchedPlanet) {
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
    this.myTextures = []
    this.fov = 45;
    this.nearPlane = 0.1;
    this.farPlane = 1000;
    this.canvasId = canvasId;

    this.clock = new THREE.Clock();
    this.controls = undefined;

    this.ambientLight = undefined;
    this.directionalLight = undefined;
    
    this.planets = planets; // Acepta los planetas en el constructor
    this.searchedPlanet = searchedPlanet; // Guardar el planeta buscado
  }

  initialize() {
    const text1 = new THREE.TextureLoader().load(Canyon_Rock_002_basecolor);
    const text2 = new THREE.TextureLoader().load(Concrete_Muddy_001_AmbientOcclusion);
    const text3 = new THREE.TextureLoader().load(Concrete_Muddy_001_BaseColor);
    const text4 = new THREE.TextureLoader().load(Concrete_Muddy_001_Height);
    const text5 = new THREE.TextureLoader().load(Concrete_Muddy_001_Normal);
    const text6 = new THREE.TextureLoader().load(Concrete_Muddy_001_Roughness);
    const text7 = new THREE.TextureLoader().load(Ground_wet_003_height);
    const text8 = new THREE.TextureLoader().load(Lapis_Lazuli_002_basecolor);
    const text9 = new THREE.TextureLoader().load(Malachite_001_basecolor);
    const text10 = new THREE.TextureLoader().load(Orange_001_COLOR);
    const text11 = new THREE.TextureLoader().load(Rock_039_baseColor);
    const text12 = new THREE.TextureLoader().load(Sand_002_COLOR);
    const text13 = new THREE.TextureLoader().load(Sand_007_basecolor);
    const text14 = new THREE.TextureLoader().load(Sand_007_height);
    const text15 = new THREE.TextureLoader().load(Stylized_Lava_001_basecolor);
    const text16 = new THREE.TextureLoader().load(Stylized_Sand_001_basecolor);
    const text17 = new THREE.TextureLoader().load(Substance_Graph_BaseColor);
    const text18 = new THREE.TextureLoader().load(Wall_Plaster_001_basecolor);
    const text19 = new THREE.TextureLoader().load(Wall_Plaster_002_BaseColor);
    const text20 = new THREE.TextureLoader().load(Wallpaper_001_COLOR);

    this.myTextures = [text1,text2,text3,text4,text5,text6,text7,text8,text9,text10,text11,text12,text13,text14,text15,text16,text17,text18,text19,text20]


    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, this.nearPlane, this.farPlane);
    this.camera.position.set(-40, -1000, -500); // Posición inicial de la cámara

    const canvas = document.getElementById(this.canvasId);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enablePan = true;
    this.controls.enableZoom = true;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 2;

    // Ajustes para reducir la velocidad del zoom
    //this.controls.zoomSpeed = 2; // Disminuir la velocidad de zoom (valor predeterminado es 1)
    //this.controls.minDistance = 10; // Distancia mínima de la cámara al objeto
    //this.controls.maxDistance = 500; // Distancia máxima de la cámara al objeto'
    //this.controls.rotateSpeed = 2; // Disminuir la velocidad de rotación (valor predeterminado es 1)
    //this.controls.panSpeed = 2; // Disminuir la velocidad del paneo (valor predeterminado es 1)

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.ambientLight.castShadow = true;
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(0, 32, 64);
    this.scene.add(this.directionalLight);

    this.addPlanets();
    this.addSpecificPlanet(this.searchedPlanet); // Añadir un planeta específico a la escena
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }
  
  
  addSpecificPlanet(planetName) {
    const geometry = new THREE.SphereGeometry(1, 20, 32);
    // Cambiar 'myTextures' a 'this.myTextures'
    const randomTexture = this.myTextures[Math.floor(Math.random() * this.myTextures.length)];
    const material = new THREE.MeshStandardMaterial({ map: randomTexture });
    const sphere = new THREE.Mesh(geometry, material);

    const planet = this.planets.find(p => p.pl_name === planetName);
    
    if (planet) {
      sphere.position.set(planet.position.x, planet.position.y, planet.position.z);
      this.scene.add(sphere);
      const new_positions = new THREE.Vector3(
        planet.position.x, planet.position.y, planet.position.z
      );
      this.moveCameraToPlanet(new_positions);
    } else {
      console.warn(`Planeta ${planetName} no encontrado en la lista.`);
    }
  }

  moveCameraToPlanet(position) {
    const distanceFactor = 5; // Ajusta este factor para controlar qué tan cerca está la cámara
    const newPosition = new THREE.Vector3(
      position.x,
      position.y + distanceFactor,  // Posicionar la cámara sobre el planeta
      position.z
    );
    
    this.camera.position.copy(newPosition);
    this.camera.lookAt(position.x, position.y, position.z); // Mirar hacia el planeta
    
    // Deshabilitar los controles de traslación (panning) y zoom, pero permitir la rotación
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
    this.controls.target.set(position.x, position.y, position.z); // Fijar el objetivo en el planeta
    this.controls.update();
  }
  
  addPlanets() {
    this.planets.forEach(planet => {
      const geometry = new THREE.SphereGeometry(1, planet.converted_radius, 32);
      const randomColor = Math.floor(Math.random() * 16777215).toString(16); // 16777215 es el valor máximo para color hex (#FFFFFF)
      //const material = new THREE.MeshStandardMaterial({ color: `#${randomColor}` });
      const material = new THREE.MeshStandardMaterial({ color: `#${randomColor}` });

      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(planet.position.x, planet.position.y, planet.position.z);
      this.scene.add(sphere);
      console.log(`Pintando ${planet.pl_name} con color #${randomColor}`);
    });
}

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.controls.update();
  }

  render() {
   this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
