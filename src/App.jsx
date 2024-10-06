import React, { Component } from 'react';
import axios from 'axios';
import * as THREE from 'three';
import SceneInit from './lib/SceneInit';
import SidebarNasa from './components/SidebarNasa';
import SidebarNasa2 from './components/SidebarNasa2';
import PlanetInfo from './components/PlanetInfo.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      planets: [],
      searchedPlanet: 'Kepler-811 b',  // Establecer un planeta por defecto
      currentPlanet: null, // Añadir un estado para el planeta actual
    };
  }

  fetchAPI = async (planetName) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8080/api/visible_planets?name=${encodeURIComponent(planetName)}`);
      console.log(response.data);  // Mostrar datos de respuesta en consola

      // Suponiendo que la respuesta tiene la estructura correcta
      this.setState({ 
        planets: response.data,
        searchedPlanet: planetName,
        currentPlanet: response.data[0] // Asumiendo que el primer elemento es el que se está viendo
      });
    } catch (error) {
      console.error("Error fetching planets:", error);
    }
  };

  initializeScene = () => {
    const { planets, searchedPlanet } = this.state;
    const sceneInit = new SceneInit('myThreeJsCanvas', planets, searchedPlanet);
    sceneInit.initialize();
    sceneInit.animate();

    window.addEventListener('resize', sceneInit.onWindowResize);
  };

  componentDidMount() {
    this.fetchAPI(this.state.searchedPlanet);  // Buscar el planeta por defecto
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.planets !== this.state.planets) {
      this.initializeScene();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.initializeScene);
  }

  handleSearchPlanet = (planetName) => {
    this.fetchAPI(planetName);  // Llamar a la API con el nombre del planeta
  };

  render() {
    const { searchedPlanet, currentPlanet } = this.state;  // Obtener el planeta buscado y el actual del estado

    return (
      <div className="app-container">
        <div><SidebarNasa id="BYE" onSearch={this.handleSearchPlanet} /> </div>
        {/* <div><SidebarNasa2 id="HOLA" onSearch={this.handleSearchPlanet} /> </div> */}
        <div ><canvas id="myThreeJsCanvas" /></div>
        <div style={{ position: "absolute", padding: "10px" }} ><PlanetInfo planet={currentPlanet}/></div>
      </div>
    );
  }
}

export default App;
