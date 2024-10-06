// SceneInit.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class SceneInit {
  constructor(canvasId, planets, searchedPlanet) {
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;

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
    const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
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
