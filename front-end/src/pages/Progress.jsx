// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import TableData from "../components/progress/TableData";
import FilterPanel from "../components/progress/FilterPanel";

const data = require('../data/data0_updated.json');

const Progress = () => {
  // const [page, setPage] = useState(1); // [1, 2, 3, 4, 5
  // const [data, setData] = useState(null);
  // useEffect(() => {
  //   async function fetchData() {
  //     // Check if page number is not null
  //     if (page) {

  //       const response = await fetch(`http://127.0.0.1:5000/type0/1`);
  //       if (!response.ok) {
  //         // Handle error
  //         console.error('Server error:', response);
  //       }
  //       else {
  //         const data = await response.json();
  //         // Update the state with the fetched data
  //         // setData(data);
  //       }
  //     }
  //   }
  //   fetchData();
  // }, [page]);
  // filter button
  const [filterPanelOpen, setFilterPanelOpen] = useState(true);

  // samples
  const [filterPoolingId, setFilterPoolingId] = useState([]);
  const [filterQpcr, setFilterQpcr] = useState([]);
  const [filterFragment, setFilterFragment] = useState([]);
  const [filterLabchipConc, setFilterLabchipConc] = useState([]);
  const [filterWell, setFilterWell] = useState([]);
  const [filterPreNormWell, setFilterPreNormWell] = useState([]);
  const [filterI5Id, setFilterI5Id] = useState([]);
  const [filterI7Id, setFilterI7Id] = useState([]);
  const [filterDataSample, setFilterDataSample] = useState([]);
  const [filterUrgent, setFilterUrgent] = useState([]);
  const [filterSampleQc, setFilterSampleQc] = useState([]);
  const [filterLibQc, setFilterLibQc] = useState([]);

  // flowcells
  const [filterFcType, setFilterFcType] = useState([]);
  const [filterOrderNo, setFilterOrderNo] = useState([]);
  const [filterRunDuration, setFilterRunDuration] = useState([]);
  const [filterPosition, setFilterPosition] = useState([]);

  return (
    <div className="flex justify-stretch">

      {filterPanelOpen && (<FilterPanel
        setFilterPanelOpen={setFilterPanelOpen}
        data={data}
        setFilterPoolingId={setFilterPoolingId}
        setFilterQpcr={setFilterQpcr}
        setFilterFragment={setFilterFragment}
        setFilterLabchipConc={setFilterLabchipConc}
        setFilterWell={setFilterWell}
        setFilterPreNormWell={setFilterPreNormWell}
        setFilterI5Id={setFilterI5Id}
        setFilterI7Id={setFilterI7Id}
        setFilterDataSample={setFilterDataSample}
        setFilterUrgent={setFilterUrgent}
        setFilterSampleQc={setFilterSampleQc}
        setFilterLibQc={setFilterLibQc}
        setFilterFcType={setFilterFcType}
        setFilterOrderNo={setFilterOrderNo}
        setFilterRunDuration={setFilterRunDuration}
        setFilterPosition={setFilterPosition}

      />)}
      <TableData
        filterPanelOpen={filterPanelOpen}
        setFilterPanelOpen={setFilterPanelOpen}
        data={data}
        filterPoolingId={filterPoolingId}
        filterQpcr={filterQpcr}
        filterFragment={filterFragment}
        filterLabchipConc={filterLabchipConc}
        filterWell={filterWell}
        filterPreNormWell={filterPreNormWell}
        filterI5Id={filterI5Id}
        filterI7Id={filterI7Id}
        filterDataSample={filterDataSample}
        filterUrgent={filterUrgent}
        filterSampleQc={filterSampleQc}
        filterLibQc={filterLibQc}
        filterFcType={filterFcType}
        filterOrderNo={filterOrderNo}
        filterRunDuration={filterRunDuration}
        filterPosition={filterPosition}
      />

    </div>
  );
};

export default Progress;