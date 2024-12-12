/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Map, { Marker, Source } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./DeviceMap.css"; 

interface DeviceMapProps {
  latitude: number | null; 
  longitude: number | null; 
  address: any; 
}

export const DeviceMap: React.FC<DeviceMapProps> = ({
  latitude,
  longitude,
  address,
}) => {
  const [viewState, setViewState] = useState({
    latitude: latitude || 0,
    longitude: longitude || 0,
    zoom: 16,
  });

  const [currentLocation, setCurrentLocation] = useState({
    latitude: latitude || 0,
    longitude: longitude || 0,
  });

  const [isLoading, setIsLoading] = useState(true); 
  const [hasError, setHasError] = useState(false); 

  const mapboxAccessToken =
    "pk.eyJ1IjoibGF6bG9wYW5hZmxleCIsImEiOiJja3ZzZHJ0ZzYzN2FvMm9tdDZoZmJqbHNuIn0.oQI_TrJ3SvJ6e5S9_CnzFw";

  useEffect(() => {
    if (latitude && longitude) {
      setHasError(false);
      setCurrentLocation({ latitude, longitude });
      setViewState((prevState) => ({
        ...prevState,
        latitude,
        longitude,

      }));
    
      setIsLoading(true);
      const loadingTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(loadingTimeout);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  }, [latitude, longitude]);

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <div
        style={{
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          overflow: "hidden",
          margin: "0 auto",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          position: "relative",
        }}
      >
      {isLoading ? (
  <div className="loading-container">
    <img
      src="Imagenes/iconosatelite.webp"
      alt="Cargando ubicación"
      className="loading-image"
    />
    <p className="loading-text">Cargando ubicación...</p>
  </div>
) : hasError ? (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      backgroundColor: "#f8d7da",
      color: "#721c24",
      textAlign: "center",
      padding: "10px",
    }}
  >
    <p>Ubicación no disponible</p>
  </div>
) : (
  <Map
    {...viewState}
    mapboxAccessToken={mapboxAccessToken}
    mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
    terrain={{ source: "mapbox-dem", exaggeration: 1.5 }}
    interactive={false}
    style={{
      width: "100%",
      height: "100%",
    }}
  >
    <Source
      id="mapbox-dem"
      type="raster-dem"
      url="mapbox://mapbox.mapbox-terrain-dem-v1"
      tileSize={512}
    />
    <Marker
      latitude={currentLocation.latitude}
      longitude={currentLocation.longitude}
    >
      <img
        src="Imagenes/centralmeteorologica.png"
        alt="Custom Marker"
        style={{
          width: "30px",
          height: "30px",
          transform: "translate(-50%, -100%)",
        }}
      />
    </Marker>
  </Map>
)}
      </div>

      {!isLoading && !hasError && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            display: "inline-block",
          }}
        >
          <h3 style={{ margin: "0", fontSize: "18px" }}>Ubicación</h3>
          <p style={{ margin: "0", fontSize: "14px", color: "#555" }}>
            {address}
          </p>
        </div>
      )}
    </div>
  );
};
