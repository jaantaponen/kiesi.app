import React, { useEffect, useRef, useState } from 'react';
import ReactMapboxGl, { Feature, GeoJSONLayer, Layer, MapContext, Marker } from 'react-mapbox-gl';

export default ({waypoints}: {waypoints?: [number, number][]}) => {

  return (
    <Layer 
      type="circle"
      paint={{
        "circle-color": "#00f",
      }}
    >
      {waypoints?.length && waypoints.map((pair: [number, number]) => {
        return <Feature coordinates={pair}/>
      })}
    </Layer>
  )
}