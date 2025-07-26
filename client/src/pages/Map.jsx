import React from 'react'
import Sidebar from '../components/Sidebar'
import NearbyMap from '../components/NearbyMap'
import "../styles/map.css"

const Map = () => {
  return (
    <div className="map">
      <Sidebar/>
        <div className="map-container">
        <NearbyMap/></div>
    </div>
  )
}

export default Map