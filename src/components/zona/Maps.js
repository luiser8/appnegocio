import React, { Fragment, useState } from 'react';
import '../../utils/Config';
import { GoogleMap, LoadScript, Marker, InfoWindow, Polygon, DrawingManager } from '@react-google-maps/api';

const Maps = (props) => {
  var [coords] = useState(props.coords);

    const mapStyles = {        
        height: "100vh",
        width: "100%"};
      
      const defaultCenter = {
        lat: 10.153899299991115, lng: -64.64121319999991
      }
      const paths = [
        {lat: 10.157901817617825, lng: -64.64172818413077},
        {lat: 10.154944817343763, lng: -64.64226462593375},
        {lat: 10.15519827558131, lng: -64.63773705711661},
        {lat: 10.157014720406249, lng: -64.6364925121337},
        {lat: 10.158113030876939, lng: -64.63692166557608},
        {lat: 10.158282001383787, lng: -64.63829495659171},
        {lat: 10.15931694378988, lng: -64.63934638252555},
        {lat: 10.159359186265917, lng: -64.6415350650817},
        {lat: 10.15845097180133, lng: -64.64228608360587}
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
      const onPolygonComplete = polygon => {
            const polyArray = polygon.getPath().getArray();
            let paths = [];
            polyArray.forEach(function(path){
                paths.push({Latitude: path.lat(), Longitude: path.lng()});
            });
            //console.log(paths);
            props.poligono(paths);
      }
      const onLoad = polygon => {
        //console.log("polygon: ", polygon);
      }

    return (
        <LoadScript
            libraries={['visualization', 'places', 'drawing']}
            googleMapsApiKey={global.config.appConfig.credentials.googleMapsKey}
            loadingElement={<div>Cargando</div>}
        >
                <GoogleMap
                  mapContainerStyle={mapStyles}
                  zoom={16}
                  center={coords}
                >
                    <Marker 
                        position={coords}
                    />
                     <Polygon
                        key={1}
                        onLoad={onLoad}
                        //paths={paths}
                        options={options}
                        
                        />
                         <DrawingManager drawingMode={"polygon"} options={{polygonOptions: {editable:true} }} onPolygonComplete={onPolygonComplete} />
                </GoogleMap>
     </LoadScript>
    );
}

export default Maps;