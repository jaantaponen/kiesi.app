import polyline from '@mapbox/polyline';
import fetch from 'node-fetch';
const decodePolyLine = (poly: string) => {
  return polyline.decode(poly);
}

const constructRoutingUrl = (coordinates: [number, number][]) => {
  let urlString = '';
  coordinates.forEach((pair: number[], i: number) => {
    if (i > 0) urlString += ';';
    urlString += pair.join(',');
  });
  const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${urlString}?access_token=pk.eyJ1IjoicGFsaWtrIiwiYSI6ImNrNzljb2NnaTBueDIzZm55eXJpcjh0M2gifQ.DvQulSOQQxy2CpDWdytTww&roundtrip=false&source=first&destination=last`;
  return url;
}

export const getRoute = async (coordinates: [number, number][]) => {
  const routeAns =  await fetch(constructRoutingUrl(coordinates));
  const res = await routeAns.json();
  const decodedPoly = decodePolyLine(res.trips[0].geometry);
  return decodedPoly.map((pair: number[]) => {
    return pair.reverse();
  });
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

export const getRouteJson = async (coordinates: [number, number][]) => {
  const route = await getRoute(coordinates);
  const json = {
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
  return json;
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