import React, { useState } from 'react';
import './PlanetInfo.css';
import closeMenu from '../assets/closeMenu.png';
import infoPlanet from '../assets/infoPlanet.png';

function PlanetInfo({ planet }) { // Recibe el planeta como prop
  const [isCardOpen, setIsCardOpen] = useState(true);
  const toggleCard = () => {
    setIsCardOpen(!isCardOpen);
  };

  const extractReference = (refString) => {
    const regex = />(.*?)</; // Captura el texto entre '>' y '<'
    const match = refString.match(regex);
    return match ? match[1].trim() : refString; // Retorna el texto capturado, o el original si no hay coincidencia
  };
  
  if (!planet) return null; // Si no hay planeta, no renderiza nada

  return (
    <div className="planet-info-container">
      <div className={`planet-info-card ${isCardOpen ? '' : 'collapsed'}`}>
        {isCardOpen ? (
          <>
            {/* Close button */}
            <button className="close-btn" onClick={toggleCard}>
              <img src={closeMenu} alt="Close" />
            </button>
            {/* Card Content */}
            <div className="card-content">
              {/* Planet title */}
              <h2 className="planet-title">{planet.pl_name}</h2> {/* Muestra el nombre del planeta */}
              <hr className="divider" />
              {/* Host details */}
              <div className="detail-group">
                <span className="detail-label">Host:</span>
                <span className="detail-value">{planet.hostname}</span> {/* Usa el dato correcto de la API */}
              </div>
              <hr className="divider" />
              {/* Coordinates */}
              <div className="detail-group">
                <span className="detail-label">Coordinates:</span>
                <div className="coordinates">
                  <span className="detail-coord">RA: {planet.ra}</span> {/* Ajusta según tu API */}
                  <span className="detail-coord">DEC: {planet.dec}</span>
                  <span className="detail-coord">SY_DIST: {planet.sy_dist}</span>
                </div>
              </div>
              <hr className="divider" />
              {/* Magnitude B */}
              <div className="detail-group">
                <span className="detail-label">V Magnitude:</span>
                <span className="detail-value">{planet.sy_vmag}</span>
              </div>
              <hr className="divider" />
              {/* Method */}
              <div className="detail-group">
                <span className="detail-label">Method:</span>
                <span className="detail-value">{planet.discoverymethod}</span>
              </div>
              <hr className="divider" />
              {/* Year */}
              <div className="detail-group">
                <span className="detail-label">Year:</span>
                <span className="detail-value">{planet.disc_year}</span>
              </div>
              <hr className="divider" />
              {/* Reference */}
              <div className="detail-group">
                <span className="detail-label">Reference:</span>
                <span className="detail-value">{extractReference(planet.disc_refname)}</span>
              </div>
            </div>
          </>
        ) : (
          <img src={infoPlanet} alt="Planet Info" className="info-icon" onClick={toggleCard} />
        )}
      </div>
    </div>
  );
}

export default PlanetInfo;
