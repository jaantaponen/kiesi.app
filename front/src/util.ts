import polyline from '@mapbox/polyline';
import fetch from 'node-fetch';
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
  const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${urlString}?access_token=pk.eyJ1IjoicGFsaWtrIiwiYSI6ImNrNzljb2NnaTBueDIzZm55eXJpcjh0M2gifQ.DvQulSOQQxy2CpDWdytTww&roundtrip=false&source=first&destination=last${pairsString}`;
  return url;
}

export const getRoute = async (coordinates: [number, number][], pairs?: [number, number][]) => {
  const routeAns =  await fetch(constructRoutingUrl(coordinates, pairs));
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