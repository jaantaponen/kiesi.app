import React, { useEffect, useRef, useState } from 'react';
import ReactMapboxGl, { GeoJSONLayer, MapContext } from 'react-mapbox-gl';
import { emptyJson, getPools, getRoute, route2Geojson } from './util';
import Dropdown, { Option } from 'react-dropdown';
import {lineString} from '@turf/helpers';
import calcBbox from '@turf/bbox';
import 'react-dropdown/style.css';
import Waypoints from './Waypoints';
import MenuButton from './MenuButton';
import Sidebar from './Sidebar';
import './Common.css';
import './Map.css';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';


interface Pool {
  route: [number, number][];
  pairs?: [number, number][];
}
const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoicGFsaWtrIiwiYSI6ImNqNDJ2bWZxcDB0aDgyd3Bjbzl0bnF0NmgifQ.Peq3TbCa8ALVbmbvsgfFvQ',
});
export default (props: any) => {


  const [geojson, setGeojson] = useState<any>(emptyJson);
  const [routes, setRoutes] = useState<Pool[]>([]);
  const [poolNames, setPoolNames] = useState<string[]>([]);
  const [currentRoute, setCurrentRoute] = useState<number>(-1);
  const [center, setCenter] = useState<[number, number]>([24, 61]);

  const [waypointCoords, setWaypointCoords] = useState<[number, number][]>();
  const map = useRef(undefined);

  useEffect(() => {
    (async () => {
      if (routes.length > 0) {
        const route = await getRoute(routes[currentRoute].route, routes[currentRoute].pairs);

        const line = lineString(route.swappedRoute);
        const bboxfc = calcBbox(line)
        bboxfc[0] -= 0.1;
        bboxfc[1] -= 0.1;
        bboxfc[2] += 0.1;
        bboxfc[3] += 0.1;

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
    setCurrentRoute((poolNames as any).indexOf(v.value));
  }

  useEffect(() => {
    (async () => {
      const pools = await getPools();
      console.log(pools);
      const routeObjects: any = [];
      const opts = [];
      for (let i = 0; i < pools.locations.length; i++) {
        const current: any = {route: []};
        const driver = pools.locations[i].filter((a: any) => a.isdriver)[0];
        const rest = pools.locations[i].filter((a: any) => !a.isdriver);
        current.route.push([driver.startlon, driver.startlat]);
        for (let a = 0; a < rest.length; a++) {
          current.route.push([rest[a].startlon, rest[a].startlat])
        }
        for (let a = 0; a < rest.length; a++) {
          current.route.push([rest[a].endlon, rest[a].endlat])
        }
        current.route.push([driver.endlon, driver.endlat]);
        routeObjects.push(current)
        opts.push(i.toString());
      }
      setRoutes(routeObjects);
      setPoolNames(pools.names);
    })();
  }, []);

  const onClick = async (map: any, ev: any) => {
    //const route = await getRouteJson([[23,61], [24, 61], [25, 61], [ev.lngLat.lng, ev.lngLat.lat]], "2020-10-10T08:00")
    //setGeojson(route);
  }

  return(
    <div>
      <Dropdown className="dropdown" onChange={dropdownChange} options={poolNames} /*value={defaultOption}*/ placeholder="Choose a ride" />
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
          map.current = (_map as any);
          return undefined;
          }}
       </MapContext.Consumer>
        <GeoJSONLayer
          data={geojson}
          linePaint={{
            "line-color": "#0C1E55",
            'line-width': 3
          }}
          lineLayout={{
            "visibility": "visible",
          }}
        />
        <Waypoints waypoints={waypointCoords}/>
      </Map>
    </div>
  );
}
