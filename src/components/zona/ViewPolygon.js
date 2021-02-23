import React, { Fragment, useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { Breadcrumbs, Link, Card, CardContent, IconButton } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
import '../../utils/Config';
import { GoogleMap, LoadScript, Marker, InfoWindow, Polygon } from '@react-google-maps/api';

const ViewPolygon = (props) => {
    var [zonaId] = useState(props.match.params.id);
    var [zona, setZona] = useState([]);
    var [latitude, setLatitude] = useState();
    var [longitude, setLongitude] = useState();
    var [poligono] = useState([]);

    console.log(JSON.stringify(props))

    const mapStyles = {
        height: "100vh",
        width: "100%"
    };

    const defaultCenter = {
        lat: 10.153899299991115, lng: -64.64121319999991
    }
    const paths = [
        { lat: 10.157901817617825, lng: -64.64172818413077 },
        { lat: 10.154944817343763, lng: -64.64226462593375 },
        { lat: 10.15519827558131, lng: -64.63773705711661 },
        { lat: 10.157014720406249, lng: -64.6364925121337 },
        { lat: 10.158113030876939, lng: -64.63692166557608 },
        { lat: 10.158282001383787, lng: -64.63829495659171 },
        { lat: 10.15931694378988, lng: -64.63934638252555 },
        { lat: 10.159359186265917, lng: -64.6415350650817 },
        { lat: 10.15845097180133, lng: -64.64228608360587 }
    ]

    const options = {
        fillColor: "transparent",
        fillOpacity: 1,
        strokeColor: "red",
        strokeOpacity: 1,
        strokeWeight: 2,
        clickable: true,
        draggable: true,
        editable: true,
        geodesic: true,
        zIndex: 1
    }

    //Consultamos lista de Zonas desde el api
    const getZona = async (zona) => {
        var result = await fetch(`${global.config.appConfig.url.dev}PPN_Zona/${zona}`, {
            method: 'GET',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json()
            } else { // si no se obtiene una respuesta
                response.json().then((json) => {
                    const { Message, StrackTraceString } = json;
                });
                return null
            }
        }).catch(e => console.log(e))
        if (result == null) {
            return "Error get";
        } else {
            return promiseMarket(result)
        }
    }

    //Obtener los datos dependiendo de donde lo llamo, para establecer el poligono
    const promiseMarket = async (req) => {
        (await Promise.all([req])).map((items) => {
            if (items) {
                items.forEach((item) => {
                    setLatitude(item.Latitude);
                    setLongitude(item.Longitude);
                });
            }
        })
    }
    //Consultamos lista de Poligonos desde el api
    const getPoligono = async (zona) => {
        var result = await fetch(`${global.config.appConfig.url.dev}PPN_Poligono/${zona}`, {
            method: 'GET',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json()
            } else { // si no se obtiene una respuesta
                response.json().then((json) => {
                    const { Message, StrackTraceString } = json;
                });
                return null
            }
        }).catch(e => console.log(e))
        if (result == null) {
            return "Error get";
        } else {
            return promisePoligono(result)
        }
    }
        //Obtener los datos dependiendo de donde lo llamo, para establecer el poligono
        const promisePoligono = async (req) => {
            (await Promise.all([req])).map((items) => {
                if (items) {
                    items.forEach((item) => {
                        poligono.push({ lat: parseFloat(item.Latitude), lng:parseFloat(item.Longitude) })
                    });
                    console.log(poligono)
                    console.log(paths)
                }
            })
        }
    useEffect(() => {
        getZona(zonaId);
        getPoligono(zonaId);
    }, []);

    return (
        <Card variant="outlined">
            <CardContent>
                <Grid container spacing={0}>
                    <Grid item xs={11} md={11} lg={11}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link color="inherit" href="/zonas" >Zonas</Link>
                            {false ? (
                                <Link color="inherit" href="#" >Categorías</Link>
                            ) : (
                                <Link color="inherit" href="#" ></Link>
                                )}
                        </Breadcrumbs>
                    </Grid>
                    <Grid item xs={1} md={1} lg={1} style={{marginTop:-16}}>
                        {true ? (
                            <IconButton href="/zonas">
                                <Cancel fontSize="large" />
                            </IconButton>
                        ) : (
                                <></>
                            )}
                    </Grid>
                </Grid>
                <Grid container spacing={0}>
                    <LoadScript
                        libraries={['visualization', 'places', 'drawing']}
                        googleMapsApiKey={global.config.appConfig.credentials.googleMapsKey}
                        loadingElement={<div>Cargando</div>}
                    >
                        <GoogleMap
                            mapContainerStyle={mapStyles}
                            zoom={14}
                            center={{
                                lat: Number(latitude), lng: Number(longitude)
                            }}

                        >
                            <Marker
                                position={{
                                    lat: Number(latitude), lng: Number(longitude)
                                }}
                            />
                            <Polygon
                                key={1}
                                paths={poligono} //poligono
                                options={options}

                            />
                        </GoogleMap>
                    </LoadScript>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default ViewPolygon;