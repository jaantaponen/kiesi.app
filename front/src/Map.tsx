import React, { useState } from 'react';
import ReactMapboxGl, { Layer, Feature, GeoJSONLayer } from 'react-mapbox-gl';
import { moveMessagePortToContext } from 'worker_threads';
import { getRoute, getRouteJson } from './util';
const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoicGFsaWtrIiwiYSI6ImNqNDJ2bWZxcDB0aDgyd3Bjbzl0bnF0NmgifQ.Peq3TbCa8ALVbmbvsgfFvQ',
});

// in render()
export default () => {
  const [geojson, setGeojson] = useState<any>(null);
  const onMove = (ev: any) => {

  }
  const onClick = async (map: any, ev: any) => {
    console.log(ev.lngLat);
    const route = await getRouteJson([[23,61], [ev.lngLat.lng, ev.lngLat.lat]], "2020-10-10T08:00")
    setGeojson(route);
  }
  return(
    <Map
      style='mapbox://styles/mapbox/streets-v9'
      containerStyle={{
        height: '100vh',
        width: '100vw'
      }}
      center={[24,61]}
      onMove={onMove}
      onClick={onClick}
    >
      {geojson !== null ? 
        <GeoJSONLayer
          data={geojson}
          linePaint={{
            "line-color": "#007bff",
            'line-width': 2
          }}
          lineLayout={{
            "visibility": "visible",
          }}
        />: <></>}
    </Map>
  );
}