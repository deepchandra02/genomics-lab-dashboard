import React, { useState, useEffect } from "react";
import { Card, Table, TableRow, TableCell, TableHead, TableHeaderCell, TableBody, BadgeDelta, MultiSelect, MultiSelectItem }
  from "@tremor/react";

const data = require('../newdata/data0.json');

const Progress = (props) => {
  // const [page, setPage] = useState(1); // [1, 2, 3, 4, 5
  // const [data, setData] = useState(null);
  // useEffect(() => {
  //   async function fetchData() {
  //     // Check if page number is not null
  //     if (page) {

  //       const response = await fetch(`http://127.0.0.1:5000/type0/${page}`);
  //       if (!response.ok) {
  //         // Handle error
  //         console.error('Server error:', response);
  //       }
  //       else {
  //         const data = await response.json();
  //         // Update the state with the fetched data
  //         setData(data);
  //       }
  //     }
  //   }
  //   fetchData();
  // }, [page]);

  const [selectedSamples, setSelectedSamples] = useState([]);
  // const [selectedFlowcells, setSelectedFlowcells] = useState([]);
  // const [selectedSubmissions, setSelectedSubmissions] = useState([]);

  const isSampleSelected = (item) =>
    selectedSamples.includes(item.sample_id) || selectedSamples.length === 0;

  // const isFlowcellSelected = (item) =>
  //   selectedFlowcells.includes(item.fc_id) || selectedFlowcells.length === 0;

  // const isSubmissionSelected = (item) =>
  //   selectedSubmissions.includes(item.submission_id) || selectedSubmissions.length === 0;

  return (
    <Card>

      {data && (<Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>
              <MultiSelect
                onValueChange={setSelectedSamples}
                placeholder="Select Samples..."
                className="max-w-xs z-10"
              >
                {data.map((item) => (
                  <MultiSelectItem key={item.sample_id} value={item.sample_id}>
                    {item.sample_id}
                  </MultiSelectItem>
                ))}
              </MultiSelect>
            </TableHeaderCell>

            {/* <TableHeaderCell>
              <MultiSelect
                onValueChange={setSelectedFlowcells}
                placeholder="Select Regions..."
                className="max-w-xs"
              >
                {Array.from(new Set(data.map((item) => item.region))).map((region) => (
                  <MultiSelectItem key={region} value={region}>
                    {region}
                  </MultiSelectItem>
                ))}
              </MultiSelect>
            </TableHeaderCell>

            <TableHeaderCell>
              <MultiSelect
                onValueChange={setSelectedSubmissions}
                placeholder="Select Status..."
                className="max-w-xs"
              >
                {Array.from(new Set(data.map((item) => item.status))).map((status) => (
                  <MultiSelectItem key={status} value={status}>
                    {status}
                  </MultiSelectItem>
                ))}
              </MultiSelect>
            </TableHeaderCell> */}
          </TableRow>
          <TableRow>
            <TableHeaderCell>Sample ID</TableHeaderCell>
            <TableHeaderCell className="text-right">Flowcell ID</TableHeaderCell>
            <TableHeaderCell className="text-right">Submission ID ($)</TableHeaderCell>
            <TableHeaderCell className="text-right">Demultiplexed</TableHeaderCell>
            <TableHeaderCell className="text-right">Staged</TableHeaderCell>
            <TableHeaderCell className="text-right">Lane fastq</TableHeaderCell>
            <TableHeaderCell className="text-right">Merged fastq</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data
            .filter((item) => isSampleSelected(item))
            .map((item) => (
              <TableRow key={item.sample_id}>
                <TableCell>{item.sample_id}</TableCell>
                <TableCell className="text-right">{item.fc_id}</TableCell>
                <TableCell className="text-right">{item.submission_id}</TableCell>
                <TableCell className="text-right">{item.loading_date}</TableCell>
                <TableCell className="text-right">{item.loading_date}</TableCell>
                <TableCell className="text-right">
                  <BadgeDelta deltaType="moderateIncrease" size="xs">
                    {item.loading_date}
                  </BadgeDelta>
                </TableCell>
                <TableCell className="text-right">
                  <BadgeDelta deltaType="unchanged" size="xs">
                    {item.loading_date}
                  </BadgeDelta>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>)}
    </Card>
  );
}

export default Progress