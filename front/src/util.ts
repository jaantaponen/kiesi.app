
import polyline from '@mapbox/polyline';
import fetch from 'node-fetch';
const decodePolyLine = (poly: string) => {
  return polyline.decode(poly);
}

const constructRoutingUrl = (coordinates: number[][], startDate: string) => {
  let urlString = '';
  coordinates.forEach((pair: number[], i: number) => {
    if (i > 0) urlString += ';';
    urlString += pair.join(',');
  });
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${urlString}?access_token=pk.eyJ1IjoicGFsaWtrIiwiYSI6ImNrNzljb2NnaTBueDIzZm55eXJpcjh0M2gifQ.DvQulSOQQxy2CpDWdytTww&depart_at=${startDate}`;
  return url;
}

export const getRoute = async (coordinates: number[][], startDate: string) => {
  const routeAns =  await fetch(constructRoutingUrl(coordinates, startDate));
  const res = await routeAns.json();
  const decodedPoly = decodePolyLine(res.routes[0].geometry);

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

export const getRouteJson = async (coordinates: number[][], startDate: string) => {
  const route = await getRoute(coordinates, startDate);
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