import React, { useState, useEffect } from "react";
import { Table, TableRow, TableCell, TableHead, TableHeaderCell, TableBody, Badge, Select, SelectItem, MultiSelect, MultiSelectItem }
  from "@tremor/react";
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon } from "@heroicons/react/solid";
const data = require('../data/data0_updated.json');

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
  const [selectedDemultiplexed, setSelectedDemultiplexed] = useState([]);
  const [selectedStaging, setSelectedStaging] = useState([]);
  const [selectedStagingError, setSelectedStagingError] = useState([]);
  const [selectedProcessing, setSelectedProcessing] = useState([]);
  const [selectedLanefastq, setSelectedLanefastq] = useState([]);
  const [selectedMergedfastq, setSelectedMergedfastq] = useState([]);
  const [selectedReleasing, setSelectedReleasing] = useState([]);

  const isSampleSelected = (item) =>
    selectedSamples.includes(item.sample_id) || selectedSamples.length === 0;
  const isFlowcellSelected = (item) =>
    selectedFlowcells.includes(item.fc_id) || selectedFlowcells.length === 0;
  const isSubmissionSelected = (item) =>
    selectedSubmissions.includes(item.submission_id) || selectedSubmissions.length === 0;
  const isDemultiplexeddateSelected = (item) =>
    selectedDemultiplexed.includes(item.loading_date) || selectedDemultiplexed.length === 0;
  const isStageddateSelected = (item) =>
    selectedStaging.includes(item.staging_date) || selectedStaging.length === 0;
  const isStagingErrorSelected = (item) =>
    selectedStagingError.includes((item.staging_error || false).toString()) || selectedStagingError.length === 0;
  const isProcessingdateSelected = (item) =>
    selectedProcessing.includes(item.processing_date) || selectedProcessing.length === 0;
  const isLanefastqSelected = (item) =>
    selectedLanefastq.includes(item.lane_fastq) || selectedLanefastq.length === 0;
  const isMergedfastqSelected = (item) =>
    selectedMergedfastq.includes(item.merged_fastq) || selectedMergedfastq.length === 0;
  const isReleasingdateSelected = (item) =>
    selectedReleasing.includes(item.releasing_date) || selectedReleasing.length === 0;


  return (
    <div>

      {data && (<Table className="pt-6 px-4 min-h-screen">
        <TableHead>
          <TableRow className="">
            <TableHeaderCell />
            <TableHeaderCell className="z-10 px-2 text-center">
              <MultiSelect
                onValueChange={setSelectedSamples}
                placeholder="Samples..."
                className="min-w-0 w-[8rem] z-10 text-xs"
              >
                {data.map((item) => (
                  <MultiSelectItem key={item.sample_id} value={item.sample_id} className="text-xs">
                    {item.sample_id}
                  </MultiSelectItem>
                ))}
              </MultiSelect>
            </TableHeaderCell>

            <TableHeaderCell className="z-10 px-2 text-center">
              <MultiSelect
                onValueChange={setSelectedFlowcells}
                placeholder="Flowcells..."
                className="min-w-0 w-[8rem] text-xs"
              >
                {Array.from(new Set(data.map((item) => item.fc_id))).map((fc_id) => (
                  <MultiSelectItem key={fc_id} value={fc_id} className="text-xs">
                    {fc_id}
                  </MultiSelectItem>
                ))}
              </MultiSelect>
            </TableHeaderCell>

            <TableHeaderCell className="z-10 px-2">
              <MultiSelect
                onValueChange={setSelectedSubmissions}
                placeholder="Submissions..."
                className="w-[20rem] text-xs"
              >
                {Array.from(new Set(data.map((item) => item.submission_id))).map((submission_id) => (
                  <MultiSelectItem key={submission_id} value={submission_id} className="text-xs">
                    {submission_id}
                  </MultiSelectItem>
                ))}
              </MultiSelect>
            </TableHeaderCell>
            <TableHeaderCell className="z-10 px-2">
              <MultiSelect
                onValueChange={setSelectedDemultiplexed}
                placeholder="Date..."
                className="min-w-0 w-[8rem] text-xs"
              >
                {Array.from(new Set(data.map((item) => item.loading_date)))
                  .sort((a, b) => {
                    if (a === "_") return -1;
                    if (b === "_") return 1;
                    return new Date(b) - new Date(a);  // sorts dates in descending order
                  })
                  .map((loading_date) => (
                    <MultiSelectItem key={loading_date} value={loading_date} className="text-xs">
                      {loading_date === "_" ? "Not demultiplexed" : loading_date}
                    </MultiSelectItem>
                  ))}
              </MultiSelect>
            </TableHeaderCell>
            <TableHeaderCell className="z-10 px-2">
              <div className="flex flex-col space-y-1">
                <MultiSelect
                  onValueChange={setSelectedStaging}
                  placeholder="Date..."
                  className="min-w-0 w-[8rem] text-xs"
                >
                  {Array.from(new Set(data.map((item) => item.staging_date)))
                    .sort((a, b) => {
                      if (a === "_") return -1;
                      if (b === "_") return 1;
                      return new Date(b) - new Date(a);  // sorts dates in descending order
                    })
                    .map((staging_date) => (
                      <MultiSelectItem key={staging_date} value={staging_date} className="text-xs">
                        {staging_date === "_" ? "Not staged" : staging_date}
                      </MultiSelectItem>
                    ))}

                </MultiSelect>
                <Select
                  onValueChange={setSelectedStagingError}
                  placeholder="Error"
                  className="min-w-0 w-[8rem] text-xs"
                  enableClear={true}
                >
                  {Array.from(new Set(data.map((item) => (item.staging_error || false).toString()))).map((staging_error) => (
                    <SelectItem key={staging_error} value={staging_error} className="text-xs">
                      {staging_error}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </TableHeaderCell>
            <TableHeaderCell className="z-10 px-2">
              <MultiSelect
                onValueChange={setSelectedProcessing}
                placeholder="Date..."
                className="min-w-0 w-[8rem] text-xs"
              >
                {Array.from(new Set(data.map((item) => item.processing_date)))
                  .sort((a, b) => {
                    if (a === "_") return -1;
                    if (b === "_") return 1;
                    return new Date(b) - new Date(a);  // sorts dates in descending order
                  })
                  .map((processing_date) => (
                    <MultiSelectItem key={processing_date} value={processing_date} className="text-xs">
                      {processing_date === "_" ? "Not processed" : processing_date}
                    </MultiSelectItem>
                  ))}
              </MultiSelect>
            </TableHeaderCell>
            <TableHeaderCell className="z-10 px-2">
              <MultiSelect
                onValueChange={setSelectedLanefastq}
                placeholder="Date..."
                className="min-w-0 w-[8rem] text-xs"
              >
                {Array.from(new Set(data.map((item) => item.lane_fastq)))
                  .sort((a, b) => {
                    if (a === "_") return -1;
                    if (b === "_") return 1;
                    return new Date(b) - new Date(a);  // sorts dates in descending order
                  })
                  .map((lane_fastq) => (
                    <MultiSelectItem key={lane_fastq} value={lane_fastq} className="text-xs">
                      {lane_fastq === "_" ? "No info" : lane_fastq}
                    </MultiSelectItem>
                  ))}
              </MultiSelect>
            </TableHeaderCell>
            <TableHeaderCell className="z-10 px-2">
              <MultiSelect
                onValueChange={setSelectedMergedfastq}
                placeholder="Date..."
                className="min-w-0 w-[8rem] text-xs"
              >
                {Array.from(new Set(data.map((item) => item.merged_fastq)))
                  .sort((a, b) => {
                    if (a === "_") return -1;
                    if (b === "_") return 1;
                    return new Date(b) - new Date(a);  // sorts dates in descending order
                  })
                  .map((merged_fastq) => (
                    <MultiSelectItem key={merged_fastq} value={merged_fastq} className="text-xs">
                      {merged_fastq === "_" ? "Not merged" : merged_fastq}
                    </MultiSelectItem>
                  ))}
              </MultiSelect>
            </TableHeaderCell>
            <TableHeaderCell className="z-10 px-2">
              <MultiSelect
                onValueChange={setSelectedReleasing}
                placeholder="Date..."
                className="min-w-0 w-[8rem] text-xs"
              >
                {Array.from(new Set(data.map((item) => item.releasing_date)))
                  .sort((a, b) => {
                    if (a === "_") return -1;
                    if (b === "_") return 1;
                    return new Date(b) - new Date(a);  // sorts dates in descending order
                  })
                  .map((releasing_date) => (
                    <MultiSelectItem key={releasing_date} value={releasing_date} className="text-xs">
                      {releasing_date === "_" ? "Not released" : releasing_date}
                    </MultiSelectItem>
                  ))}
              </MultiSelect>
            </TableHeaderCell>
          </TableRow>
          <TableRow>
            <TableHeaderCell className="p-2 text-center">S.No.</TableHeaderCell>
            <TableHeaderCell className="p-2 text-center">Sample ID</TableHeaderCell>
            <TableHeaderCell className="p-2 text-center">Flowcell ID</TableHeaderCell>
            <TableHeaderCell className="p-2">Submission ID</TableHeaderCell>
            <TableHeaderCell className="p-2 text-center">Demultiplexed</TableHeaderCell>
            <TableHeaderCell className="p-2 text-center">Staged</TableHeaderCell>
            <TableHeaderCell className="p-2 text-center">Processed</TableHeaderCell>
            <TableHeaderCell className="p-2 text-center">Lane fastq</TableHeaderCell>
            <TableHeaderCell className="p-2 text-center">Merged fastq</TableHeaderCell>
            <TableHeaderCell className="p-2 text-center">Released</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data
            .filter((item) => (isSampleSelected(item) &&
              isFlowcellSelected(item) &&
              isSubmissionSelected(item) &&
              isDemultiplexeddateSelected(item) &&
              isStageddateSelected(item) &&
              isStagingErrorSelected(item) &&
              isProcessingdateSelected(item) &&
              isLanefastqSelected(item) &&
              isMergedfastqSelected(item) &&
              isReleasingdateSelected(item)))
            .map((item, index) => (
              <TableRow key={item.sample_id} className="text-xs hover:bg-slate-100">
                <TableCell className="p-2 text-center w-2">{index + 1}</TableCell>
                <TableCell className="p-2 text-center">{item.sample_id}</TableCell>
                <TableCell className="p-2 text-center">{item.fc_id}</TableCell>
                <TableCell className="p-2">{item.submission_id}</TableCell>
                <TableCell className="p-2 text-center">{item.loading_date !== "_" ?
                  (<Badge icon={CheckCircleIcon} color="emerald" size="xs">{item.loading_date}</Badge>)
                  : (<Badge icon={XCircleIcon} color="red" size="xs">Not demultiplexed </Badge>)}</TableCell>
                <TableCell className="p-2 text-center">{item.staging_date !== "_" ?
                  (
                    item.staging_error ?
                      (<Badge icon={XCircleIcon} color="red" size="xs">{item.staging_date}</Badge>)
                      : (<Badge icon={CheckCircleIcon} color="emerald" size="xs">{item.staging_date}</Badge>)
                  )
                  : (<Badge icon={ExclamationCircleIcon} color="amber" size="xs">Not staged</Badge>)}
                </TableCell>
                <TableCell className="p-2 text-center">{item.processing_date !== "_" ?
                  (<Badge icon={CheckCircleIcon} color="emerald" size="xs">{item.processing_date}</Badge>)
                  : (<Badge icon={ExclamationCircleIcon} color="amber" size="xs">Not processed </Badge>)}
                </TableCell>
                <TableCell className="p-2 text-center">{item.lane_fastq !== "_" ?
                  (<Badge icon={CheckCircleIcon} color="emerald" size="xs">{item.lane_fastq}</Badge>)
                  : (<Badge icon={ExclamationCircleIcon} color="amber" size="xs">Not info </Badge>)}
                </TableCell>
                <TableCell className="p-2 text-center">{item.merged_fastq !== "_" ?
                  (<Badge icon={CheckCircleIcon} color="emerald" size="xs">{item.merged_fastq}</Badge>)
                  : (<Badge icon={ExclamationCircleIcon} color="amber" size="xs">Not merged </Badge>)}
                </TableCell>
                <TableCell className="p-2 text-center">{item.releasing_date !== "_" ?
                  (<Badge icon={CheckCircleIcon} color="emerald" size="xs">{item.releasing_date}</Badge>)
                  : (<Badge icon={ExclamationCircleIcon} color="amber" size="xs">Not released </Badge>)}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>)}
    </div>
  );
}

export default Progress