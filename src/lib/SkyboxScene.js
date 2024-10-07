import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import backTexture from '../assets/skybox/backTexture.png';
import downTexture from '../assets/skybox/downTexture.png';
import frontTexture from '../assets/skybox/frontTexture.png';
import leftTexture from '../assets/skybox/leftTexture.png';
import rightTexture from '../assets/skybox/rightTexture.png';
import upTexture from '../assets/skybox/upTexture.png';

import battery_bk from '../assets/skybox/battery_bk.jpg';
import battery_dn from '../assets/skybox/battery_dn.jpg';
import battery_ft from '../assets/skybox/battery_ft.jpg';
import battery_lf from '../assets/skybox/battery_lf.jpg';
import battery_rt from '../assets/skybox/battery_rt.jpg';
import battery_up from '../assets/skybox/battery_up.jpg';

import cocoa_bk from '../assets/skybox/cocoa_bk.jpg';
import cocoa_dn from '../assets/skybox/cocoa_dn.jpg';
import cocoa_ft from '../assets/skybox/cocoa_ft.jpg';
import cocoa_lf from '../assets/skybox/cocoa_lf.jpg';
import cocoa_rt from '../assets/skybox/cocoa_rt.jpg';
import cocoa_up from '../assets/skybox/cocoa_up.jpg';

export default class SkyboxScene {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
    this.controls = undefined;
    this.fov = 75;
    this.nearPlane = 0.1;
    this.farPlane = 2000;
    this.skyboxGeo = undefined;
    this.skybox = undefined;
  }

  initialize() {
    // Crear la escena
    this.scene = new THREE.Scene();
    console.log("HIIIIIIIIIII");

    // Crear la cámara
    this.camera = new THREE.PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, this.nearPlane, this.farPlane);
    this.camera.position.set(-200, -100, -50);  // Posicionar la cámara a una distancia para ver el cubo

    // Crear el renderer
    const canvas = document.getElementById(this.canvasId);
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    const textureLoader = new THREE.TextureLoader();
    textureLoader.flipY = false;  // Desactivar flipY para CubeTexture

    // Crear materiales con colores básicos para cada cara del cubo
    const materials1 = [
      new THREE.MeshBasicMaterial({ map: textureLoader.load(rightTexture), side: THREE.BackSide }),  // Cara derecha
      new THREE.MeshBasicMaterial({ map: textureLoader.load(leftTexture), side: THREE.BackSide }),   // Cara izquierda
      new THREE.MeshBasicMaterial({ map: textureLoader.load(upTexture), side: THREE.BackSide }),     // Cara superior
      new THREE.MeshBasicMaterial({ map: textureLoader.load(downTexture), side: THREE.BackSide }),   // Cara inferior
      new THREE.MeshBasicMaterial({ map: textureLoader.load(frontTexture), side: THREE.BackSide }),  // Cara frontal
      new THREE.MeshBasicMaterial({ map: textureLoader.load(backTexture), side: THREE.BackSide })    // Cara trasera
    ];
    const materials2 = [
      new THREE.MeshBasicMaterial({ map: textureLoader.load(battery_lf), side: THREE.BackSide }),   // Cara izquierda
      new THREE.MeshBasicMaterial({ map: textureLoader.load(battery_rt), side: THREE.BackSide }),  // Cara derecha
      new THREE.MeshBasicMaterial({ map: textureLoader.load(battery_up), side: THREE.BackSide }),     // Cara superior
      new THREE.MeshBasicMaterial({ map: textureLoader.load(battery_dn), side: THREE.BackSide }),   // Cara inferior
      new THREE.MeshBasicMaterial({ map: textureLoader.load(battery_ft), side: THREE.BackSide }),  // Cara frontal
      new THREE.MeshBasicMaterial({ map: textureLoader.load(battery_bk), side: THREE.BackSide })    // Cara trasera
    ];

    const materials3 = [
      new THREE.MeshBasicMaterial({ map: textureLoader.load(cocoa_lf), side: THREE.BackSide }),   // Cara izquierda
      new THREE.MeshBasicMaterial({ map: textureLoader.load(cocoa_rt), side: THREE.BackSide }),  // Cara derecha
      new THREE.MeshBasicMaterial({ map: textureLoader.load(cocoa_up), side: THREE.BackSide }),     // Cara superior
      new THREE.MeshBasicMaterial({ map: textureLoader.load(cocoa_dn), side: THREE.BackSide }),   // Cara inferior
      new THREE.MeshBasicMaterial({ map: textureLoader.load(cocoa_ft), side: THREE.BackSide }),  // Cara frontal
      new THREE.MeshBasicMaterial({ map: textureLoader.load(cocoa_bk), side: THREE.BackSide })    // Cara trasera
    ];

    const materials = [materials1, materials2, materials3];
    const randomMaterials = materials[Math.floor(Math.random() * materials.length)];

    // Añadir luz ambiental para mantener iluminada la escena
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Luz ambiental suave
    this.scene.add(ambientLight);

    // Crear la geometría del cubo
    this.skyboxGeo = new THREE.BoxGeometry(500, 500, 500);  // Tamaño del cubo

    // Crear el cubo con los materiales aplicados
    this.skybox = new THREE.Mesh(this.skyboxGeo, randomMaterials);
    this.scene.add(this.skybox);   // Añadir el cubo a la escena

    // Crear esferas pequeñas para simular estrellas en la parte superior
    const starGeometry = new THREE.SphereGeometry(0.6, 8, 8); // Tamaño de las esferas (estrellas)
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Material para las estrellas

    for (let i = 0; i < 300; i++) {
        const star = new THREE.Mesh(starGeometry, starMaterial);
        
        // Generar posiciones aleatorias en la parte superior del cubo
        star.position.x = Math.random() * 500 - 250; // Rango de -250 a 250
        star.position.y = Math.random() * 125 + 125; // Rango de 125 a 250 para estar en la parte superior
        star.position.z = Math.random() * 500 - 250; // Rango de -250 a 250
        
        this.scene.add(star); // Añadir cada estrella a la escena
    }

    // Control de órbita para rotar la vista
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enableZoom = true;

    // Iniciar la animación
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
