import React, { useEffect, useRef, useState } from 'react';
import L, { icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "../styles/map.css"

const NearbyMap = () => {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(5000);
  const apiKey = import.meta.env.VITE_MAPBOX_API_KEY;

  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  const violetIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const loadMap = async (latitude, longitude, selectedRadius) => {
    setLoading(true);

    if (!mapRef.current) {
      const map = L.map('map').setView([latitude, longitude], 14);
      mapRef.current = map;

      L.tileLayer(`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${apiKey}`, {
        tileSize: 512,
        zoomOffset: -1,
        attribution: '&copy; OpenStreetMap contributors & MapTiler',
      }).addTo(map);

      L.marker([latitude, longitude], {  icon:violetIcon })
        .addTo(map)
        .bindPopup('You are here')
        .openPopup();
    }

    const map = mapRef.current;
    map.eachLayer(layer => {
      if (layer instanceof L.Marker && layer.getPopup()?.getContent() !== 'You are here') {
        map.removeLayer(layer);
      }
    });

    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["healthcare"="doctor"](around:${selectedRadius},${latitude},${longitude});
        node["amenity"="doctors"](around:${selectedRadius},${latitude},${longitude});
        node["amenity"="clinic"](around:${selectedRadius},${latitude},${longitude});
        node["amenity"="hospital"](around:${selectedRadius},${latitude},${longitude});
        node["healthcare"="clinic"](around:${selectedRadius},${latitude},${longitude});
        node["healthcare"="hospital"](around:${selectedRadius},${latitude},${longitude});
      );
      out body;
    `;
    
    const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(overpassQuery);
    const res = await fetch(url);
    const data = await res.json();

      data.elements.forEach(place => {
        const name = place.tags?.name || "Unknown";
        const type = place.tags?.amenity || place.tags?.healthcare || "Facility";
        const lowerType = type.toLowerCase();

        let icon=violetIcon
        if (lowerType.includes("hospital")) icon = blueIcon;
        else if (lowerType.includes("clinic")) icon = greenIcon;
        else if (lowerType.includes("doctor") || lowerType.includes("doctors")) icon = redIcon;

        L.marker([place.lat, place.lon], { icon })
          .addTo(map)
          .bindPopup(`<b>${name}</b><br>Type: ${type}`);
      });


    setLoading(false);
  };

  const handleRefresh = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported!');
      return;
    }
navigator.geolocation.getCurrentPosition(
  (pos) => {
    const { latitude, longitude } = pos.coords;
    console.log("Latitude:", latitude, "Longitude:", longitude);
    loadMap(latitude, longitude, radius);
  },
  (err) => {
    console.error("Geolocation error:", err.message);
  },
  {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  }
);

  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <div className='wrapper'>
      <h2 className='title'>Nearby Medical Facilities</h2>

      <div className='controls'>
        <label>Radius: </label>
        <select value={radius} onChange={(e) => setRadius(Number(e.target.value))} className='selsect'>
          <option value={1000}>1 km</option>
          <option value={3000}>3 km</option>
          <option value={5000}>5 km</option>
        </select>
        <button onClick={handleRefresh} className='button'>Refresh</button>
      </div>

      {loading && <p className='loading'>Loading nearby facilities...</p>}
      <div id="map"></div>
    </div>
  );
};

export default NearbyMap;
