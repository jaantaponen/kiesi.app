import React, { useEffect, useRef, useState } from 'react';
import ReactMapboxGl, { GeoJSONLayer, MapContext } from 'react-mapbox-gl';
import { emptyJson, getRoute, route2Geojson } from './util';
import Dropdown, { Option } from 'react-dropdown';
import {lineString} from '@turf/helpers';
import calcBbox from '@turf/bbox';
import 'react-dropdown/style.css';
import Waypoints from './Waypoints';

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoicGFsaWtrIiwiYSI6ImNqNDJ2bWZxcDB0aDgyd3Bjbzl0bnF0NmgifQ.Peq3TbCa8ALVbmbvsgfFvQ',
});

interface Pool {
  route: [number, number][];
  pairs?: [number, number][];
}

export default () => {
  const [geojson, setGeojson] = useState<any>(emptyJson);
  const [routes, setRoutes] = useState<Pool[]>([]);
  const [currentRoute, setCurrentRoute] = useState<number>(-1);
  const [center, setCenter] = useState<[number, number]>([24, 61]);

  const [waypointCoords, setWaypointCoords] = useState<[number, number][]>();

  const map = useRef(undefined);
  const options = [
    'one', 'two', 'three'
  ];

  useEffect(() => {
    (async () => {
      if (routes.length > 0) {
        const route = await getRoute(routes[currentRoute].route, routes[currentRoute].pairs);

        const line = lineString(route.swappedRoute);
        const bboxfc = calcBbox(line)
        bboxfc[1] -= 1;
        bboxfc[3] += 1;

        if (map && map.current) {
          (map.current as any).fitBounds(bboxfc);
        }
        
        setWaypointCoords(route.response.waypoints.map((w: any) => w.location))
        const geojson = route2Geojson(route.swappedRoute as [number, number][]);
        setGeojson(geojson);
      }
    })();
  }, [currentRoute])

  const dropdownChange = (v: Option) => {
    console.log(v);
    setCurrentRoute(options.indexOf(v.value));
  }

  useEffect(() => {
    setRoutes([
      {route: [
        [23, 60],
        [24, 61],
        [23, 62],
        [24, 63],
        [23, 64]
      ]},{route:[
        [23, 60],
        [24, 63],
        [23, 62],
        [24, 61],
        [23, 64]
      ]},{route:[
        [26, 61],
        [25, 60],
        [23, 60],
        [23, 63]
      ],pairs: [[2, 1]]}
  ]);
  }, [])

  const onClick = async (map: any, ev: any) => {
    //const route = await getRouteJson([[23,61], [24, 61], [25, 61], [ev.lngLat.lng, ev.lngLat.lat]], "2020-10-10T08:00")
    //setGeojson(route);
  }
  return(
    <>
      <Dropdown className="dropdown" onChange={dropdownChange} options={options} /*value={defaultOption}*/ placeholder="Select an option" />
      <Map
        style='mapbox://styles/palikk/ckg3pb2011wja19olciykhatx'
        containerStyle={{
          height: '100vh',
          width: '100vw'
        }}
        center={center}
        onMoveEnd={(map: any, _: any) => {
          const center = map.getCenter();
          setCenter([center.lng, center.lat]);
        }}
        onClick={onClick}
      >
        <MapContext.Consumer>
      {(_map) => {
        map.current = _map;
        return undefined;
        }}
       </MapContext.Consumer>
        <GeoJSONLayer
          data={geojson}
          linePaint={{
            "line-color": "#007bff",
            'line-width': 2
          }}
          lineLayout={{
            "visibility": "visible",
          }}
        />
        <Waypoints waypoints={waypointCoords}/>
      </Map>
    </>
  );
}