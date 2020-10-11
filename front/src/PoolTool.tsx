import React, { useEffect, useState } from 'react';
import { Grid, Input, InputLabel, Select, TextField, Button, List, ListItem, Modal, Paper } from '@material-ui/core';
import './PoolTool.css';
import Geocode from "react-geocode";
import { addPool, joinPool, searchPools, useDebounce } from './util';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';
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
  const history = useHistory();

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
  return (
    <div id="tool-container">
      <Grid spacing={5} alignContent={"flex-start"} container={true} direction={"column"}>
        <Grid item>
          <h1>Find a ride</h1>
        </Grid>
        <Grid className="big-textfield" item container>
          <InputLabel htmlFor="origin">Origin address</InputLabel>
          <Input id="origin" onChange={(ev: any) => {
            console.log(ev.target.value);
            setOriginQuery(ev.target.value);
          }} />
        </Grid>
        <Grid className="big-textfield" item container>
          <InputLabel htmlFor="destination">Destination address</InputLabel>
          <Input id="destination" onChange={(ev: any) => {
            setDestinationQuery(ev.target.value);
          }} />
        </Grid>
        <Grid spacing={0} wrap="nowrap" justify="space-between" container item>
          <Grid item>
            <Select
              className={"time-type-select"}
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
          </Grid>
          <Grid item>
            <p style={{marginTop: "6px"}}>Mon-Fri at:</p>
          </Grid>
          <Grid item>
            <TextField
              style={{ height: "30px", width: "80px" }}
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
        <Grid item>
          <Button className="search-button" onClick={() => {
            (async () => {
              if (originCoords?.length && destinationCoords?.length) {
                const ans = await searchPools(originCoords, destinationCoords);
                const p = ans.map((a: any) => { return { name: a.name, poolid: a.poolid } });
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
                  return (<ListItem key={pool.poolid}>
                    {pool.name} <Button style={{color: "#FF650F"}} variant="outlined" onClick={() => {
                      if (originCoords?.length && destinationCoords?.length) {
                        toast("Joining pool");
                        joinPool(originCoords, destinationCoords, pool.poolid);
                      } else {
                        toast("Joining failed");
                      }
                      history.push("/");
                    }} >Join pool</Button>
                  </ListItem>)
                })}
              </List>
            </Grid> : <Grid item={true}>No routes found</Grid>}
            <Grid item={true}>
              <Button style={{color: "#FF650F", fontWeight: "bold"}} onClick={() => {
                setModalOpen(true);
              }}>Create new pool</Button>
            </Grid>
          </>}
      </Grid>
      <Modal
        open={modalOpen}
      //onClose={handleClose}
      >
        <Paper style={{ width: "400px", marginTop: "40px", marginLeft: "auto", marginRight: "auto", maxHeight: "80vh", maxWidth: "80vw" }}>
          <Grid direction="column" container style={{padding: "20px"}}>
            <Grid style={{ border: "0px" }} item>
              Origin: {originQuery}
            </Grid>
            <Grid style={{ border: "0px" }} item>
              Destination: {destinationQuery}
            </Grid>
            <Grid style={{ border: "0px", marginTop: "10px" }} item>
              Route name: <Input id="name" onChange={(ev: any) => {
                setRouteName(ev.target.value);
              }} />
            </Grid>
          </Grid>
          <Grid justify="flex-end" style={{ border: "0px", marginBottom: "20px" }} item container>
            <Button color="secondary" onClick={() => {
              setModalOpen(false);
            }}>close</Button>
            <Button color="primary" onClick={() => {
              try {
                (async () => {
                if (originCoords && destinationCoords && routeName) {
                  const status = addPool(originCoords, destinationCoords, routeName);
                  if (!status) {
                    console.error("cant post");
                    toast("Failed to create a route :/");
                  } else {
                    toast("New carpool route created!");
                    history.push("/");
                  }
                } else {
                  console.error("cant post");
                  toast("Failed to create a route :/")
                }
              })()
            } catch (e) { console.error(e); };
            }}>save</Button>
          </Grid>
        </Paper>
      </Modal>
    </div>
  )
}
