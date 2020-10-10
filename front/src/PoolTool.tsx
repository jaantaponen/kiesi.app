import React, { useEffect, useState } from 'react';
import { Grid, FormControl, FormHelperText, Input, InputLabel, Select, TextField, Button } from '@material-ui/core';
import './PoolTool.css';
import Geocode from "react-geocode";
import ReactMapboxGl, { GeoJSONLayer, Layer, MapContext } from 'react-mapbox-gl';
import { useDebounce } from './util';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyDP3c1RZFI28zKdx37IqDN1q2h8ALDHv3k");
Geocode.setLanguage("fi");

export default () => {
  const [originQuery, setOriginQuery] = useState<string>("");
  const [originCoords, setOriginCoords] = useState<[number, number]>();
  const [destinationQuery, setDestinationQuery] = useState<string>("");
  const [destinationCoords, setDestinationCoords] = useState<[number, number]>();
  const originDebounced = useDebounce(originQuery, 500);
  const destinationDebounced = useDebounce(destinationQuery, 500);
  const [arrDep, setArrDep] = useState<string>();
  useEffect(() => {
    if (originDebounced !== "") {
      (async () => {
        Geocode.fromAddress(originDebounced).then(
          (response: any) => {
            const { lat, lng } = response.results[0].geometry.location;
            if (!response.results[0].formatted_address.toLowerCase().includes("suomi")) {
              toast("Address not found in Finland");
            } else {
              setOriginCoords([lng, lat]);
              toast("Address found!");
            }
          },
          (error: any) => {
            toast("No addresses found");
          }
        );
      })();
    }
  }, [originDebounced]);
  useEffect(() => {
    if (destinationDebounced !== "") {
      (async () => {
        Geocode.fromAddress(destinationDebounced).then(
          (response: any) => {
            const { lat, lng } = response.results[0].geometry.location;
            if (!response.results[0].formatted_address.toLowerCase().includes("suomi")) {
              toast("Address not found in Finland");
            } else {
              setDestinationCoords([lng, lat]);
              toast("Address found!");
            }
          },
          (error: any) => {
            toast("No addresses found");
          }
        );
      })();
    }
  }, [destinationDebounced]);
  const [center, setCenter] = useState<[number, number]>([24, 61]);
  return (
    <Grid spacing={2} alignContent={"flex-start"} container={true} direction={"column"}>
      <ToastContainer />
      <Grid item={true}>
        <InputLabel htmlFor="origin">Origin address</InputLabel>
        <Input id="origin" onChange={(ev: any) => {
          console.log(ev.target.value);
          setOriginQuery(ev.target.value);
        }} />
      </Grid>
      <Grid item={true}>
        <InputLabel htmlFor="destination">Destination address</InputLabel>
        <Input id="destination" onChange={(ev: any) => {
          setDestinationQuery(ev.target.value);
        }} />
      </Grid>
      <Grid container={true} item={true}>
        <Select
          native
          value={arrDep}
          onChange={(ev) => {
            setArrDep(ev.target.value as any);
          }}
          inputProps={{
            name: 'arrdep',
            id: 'age-native-simple',
          }}
        >
          <option value={"arr"}>Arrival</option>
          <option value={"dep"}>Departure</option>
        </Select>

        <Grid item={true}>
          Mon-Fri at:
          <TextField
            id="time"
            type="time"
            defaultValue="07:30"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300,
            }}
          />
        </Grid>
      </Grid>
        <Grid item={true}>
          <Button onClick={() => {
            console.log(originCoords);
            console.log(destinationCoords);
          }}>
            Search pools
          </Button>
        </Grid>
    </Grid>

  )
}