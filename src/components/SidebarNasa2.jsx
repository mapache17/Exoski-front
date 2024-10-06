import React, { useState } from 'react';
import './SidebarNasa.css';
import openMenu from '../assets/openMenu.png';
import closeMenu from '../assets/closeMenu.png';
import iconoBuscar from '../assets/iconoBuscar.png';
import iconoRandom from '../assets/iconoRandom.png';
import { planetNames } from '../planetNames'; // Importar los nombres de planetas

function SidebarNasa2({ onSearch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlanets, setFilteredPlanets] = useState([]);  // Lista de planetas filtrados

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = () => {
    if (searchTerm) {
      onSearch(searchTerm);  // Llamar a la función pasada desde App con el término de búsqueda
    }
  };

  const handleRandomPlanet = () => {
    const randomIndex = Math.floor(Math.random() * planetNames.length);  // Obtener un índice aleatorio
    const randomPlanet = planetNames[randomIndex];  // Seleccionar un nombre de planeta
    onSearch(randomPlanet);  // Llamar a la función de búsqueda con el planeta aleatorio
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filtrar planetas en función del valor ingresado
    const filtered = planetNames.filter((planet) =>
      planet.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPlanets(filtered);  // Actualizar la lista de planetas filtrados
  };

  const handleSelectPlanet = (planet) => {
    setSearchTerm(planet);  // Establecer el planeta seleccionado como término de búsqueda
    setFilteredPlanets([]);  // Limpiar las sugerencias después de seleccionar un planeta
    onSearch(planet);  // Buscar el planeta seleccionado
  };

  return (
    <div>
      <button className={`toggle-btn ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}>
        <img src={isOpen ? closeMenu : openMenu} alt={isOpen ? 'Close Sidebar' : 'Open Sidebar'} />
      </button>

      <div className={`sidebar2 ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <h1>Planet Search</h1>
          <div className="search-bar">
            <input
              className="search-input"
              type="text"
              placeholder="Search for planets..."
              value={searchTerm}
              onChange={handleInputChange}  // Actualizar el término de búsqueda y filtrar planetas
            />
            <button className="icon-btn" onClick={handleSearch}>
              <img src={iconoBuscar} alt="Search Icon" />
            </button>
          </div>

          {/* Mostrar sugerencias de planetas filtrados */}
          {filteredPlanets.length > 0 && (
            <ul className="autocomplete-suggestions">
              {filteredPlanets.map((planet, index) => (
                <li key={index} onClick={() => handleSelectPlanet(planet)}>
                  {planet}
                </li>
              ))}
            </ul>
          )}

          {/* Botón Random */}
          <button className="random-btn" onClick={handleRandomPlanet}>
            Random Planet
            <img src={iconoRandom} alt="Random Icon" className="random-icon" />
          </button>

          <hr />

          <h2>Filters</h2>
          <div className="slider-container">
            <div className="slider-group">
              <label>Size</label>
              <input type="range" min="1" max="100" />
            </div>
            <div className="slider-group">
              <label>Intensity</label>
              <input type="range" min="1" max="100" />
            </div>
            <div className="slider-group">
              <label>Distance</label>
              <input type="range" min="1" max="100" />
            </div>
          </div>

          <hr />

          <h2>Export Image</h2>
          <div className="export-section">
            <button className="export-btn">Export Image</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarNasa2;
