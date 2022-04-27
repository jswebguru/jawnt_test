import React from "react";
import Select from "react-select";
import Map from "./components/Map/Map";

export default function App() {
  const options = [
    { value: 'bike', label: 'Indego stations' },
    { value: 'bus', label: 'SEPTA Bus' },
    { value: 'all', label: 'All' }
  ];

  return (
    <>
      <nav>
        <div className="header__container">
          <div className="col-md-3">
            <Select
              placeholder="Please select..."
              className="transportation_selection"
              options={options}
            />
          </div>
          <div className="col-md-9 header_title">
            <span>CityCoHo Transportation Monitor System</span>
          </div>
        </div>
      </nav>
      <main>
        <Map />
      </main>
    </>
  );
}
