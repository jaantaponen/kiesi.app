import React, { useEffect, useState } from 'react';
import { Grid, FormControl, FormHelperText, Input, InputLabel, Select, TextField, Button, List, ListItem, Divider, Modal, Paper } from '@material-ui/core';
import './PoolTool.css';
import Geocode from "react-geocode";
import ReactMapboxGl, { GeoJSONLayer, Layer, MapContext } from 'react-mapbox-gl';
import { addPool, searchPools, useDebounce } from './util';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyDP3c1RZFI28zKdx37IqDN1q2h8ALDHv3k");
Geocode.setLanguage("fi");

const Pool = (props: any) => {
  return (
    <div>{props.name}</div>
  );
};

export default () => {
  const [originQuery, setOriginQuery] = useState<string>("");
  const [originCoords, setOriginCoords] = useState<[number, number]>();
  const [destinationQuery, setDestinationQuery] = useState<string>("");
  const [destinationCoords, setDestinationCoords] = useState<[number, number]>();
  const originDebounced = useDebounce(originQuery, 500);
  const destinationDebounced = useDebounce(destinationQuery, 500);
  const [arrDep, setArrDep] = useState<string>();


  const [routeName, setRouteName] = useState<string>("");
  const [pools, setPools] = useState<any>(undefined);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
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
    <>
      <ToastContainer />
      <Grid spacing={1} alignContent={"flex-start"} container={true} direction={"column"}>
        <Grid style={{ width: "75vw", marginTop: "20px !important" }} item={true}>
          <InputLabel htmlFor="origin">Origin address</InputLabel>
          <Input id="origin" onChange={(ev: any) => {
            console.log(ev.target.value);
            setOriginQuery(ev.target.value);
          }} />
        </Grid>
        <Grid style={{ width: "75vw" }} item={true}>
          <InputLabel htmlFor="destination">Destination address</InputLabel>
          <Input id="destination" onChange={(ev: any) => {
            setDestinationQuery(ev.target.value);
          }} />
        </Grid>
        <Grid container={true} item={true}>
          <Select
            className={"select123"}
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
              style={{ height: "30px" }}
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
          <Button color="primary" onClick={() => {
            (async () => {
              if (originCoords?.length && destinationCoords?.length) {
                const ans = await searchPools(originCoords, destinationCoords);
                const p = ans.map((a: any) => { return { name: a.name, id: a.poolid } });
                setPools(p);
              }
            })();
          }}>
            Search pools
          </Button>
        </Grid>

        {pools &&
          <>
          {pools.length > 0 ?
            <Grid item={true}>
              <List>
                {pools.map((pool: any) => {
                  return (<ListItem>
                    {pool.name}
                  </ListItem>)
                })}
              </List>
            </Grid> : <Grid item={true}>No routes found</Grid>}
            <Grid item={true}>
              <Button onClick={() => {
                setModalOpen(true);
              }}>Create new pool</Button>
            </Grid>
          </>}
      </Grid>
      <Modal
        open={modalOpen}
      //onClose={handleClose}
      >
        <Paper style={{ position: "absolute", left: "10vw", top: "10vw", height: "80vh", width: "80vw" }}>
          <Grid direction="column" container={true}>
            <Grid style={{ border: "0px" }} item={true}>
              <Button color="primary" onClick={() => {
                (async () => {
                  if (originCoords && destinationCoords && routeName) {
                    const status = addPool(originCoords, destinationCoords, routeName);
                    if (!status) {
                      console.error("cant post");
                    }
                  } else {
                    console.error("cant post");
                  }
                })();
              }}>save</Button>
              <Button color="secondary" onClick={() => {
                setModalOpen(false);
              }}>close</Button>
            </Grid>
            <Grid style={{ border: "0px" }} item={true}>
              Origin: {originQuery}
            </Grid>
            <Grid style={{ border: "0px" }} item={true}>
              Destination: {destinationQuery}
            </Grid>
            <Grid style={{ border: "0px" }} item={true}>
              Route name: <Input id="name" onChange={(ev: any) => {
                setRouteName(ev.target.value);
              }} />
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </>
  )
}