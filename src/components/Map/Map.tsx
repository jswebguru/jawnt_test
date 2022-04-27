import React, { useEffect, useState } from "react";
import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import axios from "axios";

export interface BikeStationPlace {
  name: string,
  position: LatLngExpression,
  address: string,
  availableBikes: number
}

export interface BusRoute {
  name: string,
  position: LatLngExpression,
}

const Map = () => {
  const defaultPosition: LatLngExpression = [39.9517816, -75.1795872]; // CityCoHo position
  const [bikeStations, setBikeStations] = useState<Array<BikeStationPlace>>([]);

  async function fetchBikeStationData() {
    const response = await axios.get('https://kiosks.bicycletransit.workers.dev/phl');
    const data = response.data.features;
    const results: Array<BikeStationPlace> = [];

    for (let i = 0; i < data.length; i++) {
      const bikes = data[i].properties.bikes;
      let availableBikes = 0;
      for (let j = 0; j < bikes.length; j++) {
        if (bikes[j].isAvailable === true) {
          availableBikes += 1;
        }
      }

      results.push({
        name: data[i].properties.name,
        position: [data[i].properties.coordinates[1], data[i].properties.coordinates[0]],
        address: data[i].properties.addressStreet.concat(
          " ", data[i].properties.addressCity,
          " ", data[i].properties.addressState,
          " ", data[i].properties.addressZipCode
        ),
        availableBikes: availableBikes
      });
    }

    setBikeStations(results);
  }

  // async function fetchBusData() {
  //   const response = await axios.get('https://www3.septa.org/api/TransitView/42', {
  //     headers: {"Access-Control-Allow-Origin": "*"}
  //   });

  //   const data = response.data.bus;
  //   console.log(data);
  // }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchBikeStationData();
      // fetchBusData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="map__container">
      <MapContainer
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100vh" }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {bikeStations && bikeStations.map((place: BikeStationPlace) => (
          <Marker
            key={place.name}
            position={place.position}
          >
            <Tooltip>
              <h3>{place.name}</h3>
              <p>Address: {place.address}</p>
              <p>Available Bikes: {place.availableBikes}</p>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
