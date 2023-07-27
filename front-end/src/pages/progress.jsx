import React, { useState, useEffect } from "react";
import { Card, Table, TableRow, TableCell, TableHead, TableHeaderCell, TableBody, Badge, MultiSelect, MultiSelectItem }
  from "@tremor/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";
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
  const [selectedFlowcells, setSelectedFlowcells] = useState([]);
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [selectedDdates, setSelectedDdates] = useState([]);
  const [selectedSdates, setSelectedSdates] = useState([]);

  const isSampleSelected = (item) =>
    selectedSamples.includes(item.sample_id) || selectedSamples.length === 0;

  const isFlowcellSelected = (item) =>
    selectedFlowcells.includes(item.fc_id) || selectedFlowcells.length === 0;

  const isSubmissionSelected = (item) =>
    selectedSubmissions.includes(item.submission_id) || selectedSubmissions.length === 0;

  const isDdateSelected = (item) =>
    selectedDdates.includes(item.loading_date) || selectedDdates.length === 0;

  const isSdateSelected = (item) =>
    selectedSdates.includes(item.staging_date) || selectedSdates.length === 0;

  return (
    <div>

      {data && (<Table className="pt-6 px-4 min-h-screen">
        <TableHead>
          <TableRow>
            <TableHeaderCell />
            <TableHeaderCell className="z-10 px-2">
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

            <TableHeaderCell className="z-10 px-2">
              <MultiSelect
                onValueChange={setSelectedFlowcells}
                placeholder="Select Flowcells..."
                className="max-w-xs"
              >
                {Array.from(new Set(data.map((item) => item.fc_id))).map((fc_id) => (
                  <MultiSelectItem key={fc_id} value={fc_id}>
                    {fc_id}
                  </MultiSelectItem>
                ))}
              </MultiSelect>
            </TableHeaderCell>

            <TableHeaderCell className="z-10 px-2">
              <MultiSelect
                onValueChange={setSelectedSubmissions}
                placeholder="Select Submissions..."
                className="max-w-xs"
              >
                {Array.from(new Set(data.map((item) => item.submission_id))).map((submission_id) => (
                  <MultiSelectItem key={submission_id} value={submission_id}>
                    {submission_id}
                  </MultiSelectItem>
                ))}
              </MultiSelect>
            </TableHeaderCell>
            <TableHeaderCell className="z-10 px-2">
              <MultiSelect
                onValueChange={setSelectedDdates}
                placeholder="Select Date..."
                className="max-w-xs"
              >
                {Array.from(new Set(data.map((item) => item.loading_date))).map((loading_date) => (
                  <MultiSelectItem key={loading_date} value={loading_date}>
                    {loading_date}
                  </MultiSelectItem>
                ))}
              </MultiSelect>
            </TableHeaderCell>
            <TableHeaderCell className="z-10 px-2">
              <MultiSelect
                onValueChange={setSelectedSdates}
                placeholder="Select Date..."
                className="max-w-xs"
              >
                {Array.from(new Set(data.map((item) => item.staging_date))).map((staging_date) => (
                  <MultiSelectItem key={staging_date} value={staging_date}>
                    {staging_date}
                  </MultiSelectItem>
                ))}
              </MultiSelect>
            </TableHeaderCell>
          </TableRow>
          <TableRow>
            <TableHeaderCell className="p-2 text-center">S.No.</TableHeaderCell>
            <TableHeaderCell className="p-2">Sample ID</TableHeaderCell>
            <TableHeaderCell className="p-2">Flowcell ID</TableHeaderCell>
            <TableHeaderCell className="p-2">Submission ID</TableHeaderCell>
            <TableHeaderCell className="p-2">Demultiplexed</TableHeaderCell>
            <TableHeaderCell className="p-2">Staged</TableHeaderCell>
            <TableHeaderCell className="p-2">Lane fastq</TableHeaderCell>
            <TableHeaderCell className="p-2">Merged fastq</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data
            .filter((item) => (isSampleSelected(item) && isFlowcellSelected(item) && isSubmissionSelected(item) && isDdateSelected(item) && isSdateSelected(item)))
            .map((item, index) => (
              <TableRow key={item.sample_id} className="text-xs hover:bg-slate-100">
                <TableCell className="p-2 text-center">{index + 1}</TableCell>
                <TableCell className="p-2">{item.sample_id}</TableCell>
                <TableCell className="p-2">{item.fc_id}</TableCell>
                <TableCell className="p-2">{item.submission_id}</TableCell>
                <TableCell className="p-2">{item.loading_date ?
                  (<Badge icon={CheckCircleIcon} color="emerald" size="xs">{item.loading_date}</Badge>)
                  : (<Badge icon={XCircleIcon} color="red" size="xs">Not demultiplexed </Badge>)}</TableCell>
                <TableCell className="p-2">{item.staging_date ?
                  (<Badge icon={CheckCircleIcon} color="emerald" size="xs">{item.staging_date}</Badge>)
                  : (<Badge icon={XCircleIcon} color="red" size="xs">Not staged </Badge>)}
                </TableCell>
                <TableCell className="p-2">
                </TableCell>
                <TableCell className="p-2">
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>)}
    </div>
  );
}

export default Progress