import React, { Component } from 'react';
import axios from 'axios';
import * as THREE from 'three';
import SceneInit from './lib/SceneInit';
import SkyboxScene from './lib/SkyboxScene'; // Importar la nueva clase SkyboxScene
import SidebarNasa from './components/SidebarNasa';
import PlanetInfo from './components/PlanetInfo.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      planets: [],
      searchedPlanet: 'Kepler-811 b',  // Planeta por defecto
      currentPlanet: null,
      showSkybox: false,  // Nuevo estado para controlar si se muestra el skybox
    };
    this.sceneInit = null;  // Guardar referencia de SceneInit
    this.skyboxScene = null;  // Guardar referencia de SkyboxScene
  }

  fetchAPI = async (planetName) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8080/api/visible_planets?name=${encodeURIComponent(planetName)}`);
      this.setState({ 
        planets: response.data,
        searchedPlanet: planetName,
        currentPlanet: response.data[0] 
      });
    } catch (error) {
      console.error("Error fetching planets:", error);
    }
  };

  initializeScene = () => {
    const { planets, searchedPlanet } = this.state;
    this.sceneInit = new SceneInit('myThreeJsCanvas', planets, searchedPlanet);
    this.sceneInit.initialize();
    this.sceneInit.animate();
    window.addEventListener('resize', this.sceneInit.onWindowResize);
  };

  initializeSkybox = () => {
    this.skyboxScene = new SkyboxScene('myThreeJsCanvas');
    this.skyboxScene.initialize();
    this.skyboxScene.animate();
    window.addEventListener('resize', this.skyboxScene.onWindowResize);
  };

  componentDidMount() {
    this.fetchAPI(this.state.searchedPlanet);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.planets !== this.state.planets) {
      this.initializeScene();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.initializeScene);
    window.removeEventListener('resize', this.initializeSkybox);
  }

  handleSearchPlanet = (planetName) => {
    this.fetchAPI(planetName);
  };

  handleEnterPlanet = () => {
    this.setState({ showSkybox: true }, () => {
      this.initializeSkybox();  // Inicializar el skybox después de cambiar el estado
    });
  };

  handleExitPlanet = () => {
    // Destruir la escena del skybox y volver a la escena inicial
    if (this.skyboxScene) {
      window.removeEventListener('resize', this.skyboxScene.onWindowResize);
      this.skyboxScene = null;  // Limpiar referencia
    }

    this.setState({ showSkybox: false }, () => {
      this.initializeScene();  // Volver a inicializar la escena inicial
    });
  };

  render() {
    const { searchedPlanet, currentPlanet, showSkybox } = this.state;

    return (
      <div className="app-container">
        <div><SidebarNasa id="BYE" onSearch={this.handleSearchPlanet} /></div>
        <div><canvas id="myThreeJsCanvas" /></div>
        <div style={{ position: "absolute", padding: "10px" }}>
          <PlanetInfo planet={currentPlanet} />
        </div>
        <div style={{ position: "absolute", left: "50%", bottom: "70px", transform: "translateX(-50%)" }}>
          {showSkybox ? (
            <button
              className='enter-button'
              style={{ backgroundColor: "#F91E48", fontSize: "15px", color: "white", border: "none", padding: "10px 20px", borderRadius: "60px", width: "200px", cursor: "pointer" }}
              onClick={this.handleExitPlanet}
            >
              Salir del planeta
            </button>
          ) : (
            <button
              className='enter-button'
              style={{ backgroundColor: "#F91E48", fontSize: "15px", color: "white", border: "none", padding: "10px 20px", borderRadius: "60px", width: "200px", cursor: "pointer" }}
              onClick={this.handleEnterPlanet}
            >
              Entra al planeta
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default App;
