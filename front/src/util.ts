import polyline from '@mapbox/polyline';
import fetch from 'node-fetch';
import { useEffect, useState } from 'react';
const decodePolyLine = (poly: string) => {
  return polyline.decode(poly);
}

const constructRoutingUrl = (coordinates: [number, number][], pairs?: [number, number][]) => {
  let urlString = '';
  coordinates.forEach((pair: number[], i: number) => {
    if (i > 0) urlString += ';';
    urlString += pair.join(',');
  });
  let pairsString = '';
  if (pairs?.length) {
    pairsString = '&distributions=';
    pairs.forEach((pair: [number, number], index: number) => {
      pairsString += pair.join(',');
      if (index < pairs.length - 1) pairsString += ';';
    });
  }
  const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${urlString}?overview=full&access_token=pk.eyJ1IjoicGFsaWtrIiwiYSI6ImNrNzljb2NnaTBueDIzZm55eXJpcjh0M2gifQ.DvQulSOQQxy2CpDWdytTww&roundtrip=false&source=first&destination=last${pairsString}`;
  return url;
}

export const getRoute = async (coordinates: [number, number][], pairs?: [number, number][]) => {
  const routeAns =  await fetch(constructRoutingUrl(coordinates, pairs));
  const res = await routeAns.json();
  const decodedPoly = decodePolyLine(res.trips[0].geometry);
  console.log(res)
  return {
    response: res,
    swappedRoute: decodedPoly.map((pair: number[]) => {
      return pair.reverse();
    })
  };
}

export const emptyJson  = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'properties': {},
      "geometry": {
        "type": "LineString",
        'coordinates': []
      }
    }
  ],
}

export const route2Geojson = (route: [number, number][]) => {
  return {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'properties': {},
        "geometry": {
          "type": "LineString",
          'coordinates': route
        }
      }
    ],
  }
}

export const getPools = async () => {
  const token = localStorage.getItem('token')
  const res = await fetch('/api/pools', {
    headers: {'Authorization': 'bearer ' + token},
  });
  const json = await res.json();
  const locations = [];
  const names: string[] = [];
  for (let i = 0; i < json.length; i++) {
    names.push(json[i].poolname);
    const res2 = await fetch('/api/pool-locations/' + json[i].poolid, {
      headers: {'Authorization': 'bearer ' + token},
    });
    locations.push(await res2.json());
  }
  return {names, locations};
}

export const searchPools = async (startpoint: [number, number], endpoint: [number, number]) => {
  const token = localStorage.getItem('token')
  const res = await fetch('/api/search', {
    headers: {'Authorization': 'bearer ' + token},
    method: 'POST',
    body: JSON.stringify({startpoint, endpoint})
  });
  const json = await res.json();
  return json;
}

export const addPool = async (startpoint: [number, number], endpoint: [number, number], poolname: string) => {
  const token = localStorage.getItem('token')
  const res = await fetch('/api/createpool', {
    headers: {'Authorization': 'bearer ' + token},
    method: 'POST',
    body: JSON.stringify({startpoint, endpoint, poolname})
  });
  return res.ok;
}

export const joinPool = async (startpoint: [number, number], endpoint: [number, number], poolid: string) => {
  const token = localStorage.getItem('token')
  const res = await fetch('/api/joinpool', {
    headers: {'Authorization': 'bearer ' + token},
    method: 'POST',
    body: JSON.stringify({startpoint, endpoint, poolid})
  });
  return res.ok;
}

export function useDebounce<T>(value: T, delay: number = 200) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
      () => {
          // Update debounced value after delay
          const handler = setTimeout(() => {
              setDebouncedValue(value);
          }, delay );
          // Cancel the timeout if value changes (also on delay change or unmount)
          // This is how we prevent debounced value from updating if value is changed ...
          // .. within the delay period. Timeout gets cleared and restarted.
          return () => {
              clearTimeout(handler);
          };
      },
      [value, delay], // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}
