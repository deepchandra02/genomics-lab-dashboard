// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { AccordionList, Accordion, AccordionHeader, AccordionBody, Icon, Table, TableRow, TableCell, TableHead, TableHeaderCell, TableBody, Badge, Select, SelectItem, MultiSelect, MultiSelectItem }
  from "@tremor/react";
import { ChevronLeftIcon, CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, XIcon } from "@heroicons/react/solid";
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
    <div>
      <TableData
        filterPoolingId={filterPoolingId}
        filterDataSample={filterDataSample}
      />
      <Filters
        setFilterPoolingId={setFilterPoolingId}
        setFilterDataSample={setFilterDataSample}
      />
    </div>
  );
};

export default Progress;


const TableData = (props) => {

  const [selectSamples, setSelectSamples] = useState([]);
  const [selectFlowcells, setSelectFlowcells] = useState([]);
  const [selectSubmissions, setSelectSubmissions] = useState([]);
  const [selectDemultiplexed, setSelectDemultiplexed] = useState([]);
  const [selectStaging, setSelectStaging] = useState([]);
  const [selectStagingError, setSelectStagingError] = useState([]);
  const [selectProcessing, setSelectProcessing] = useState([]);
  const [selectLanefastq, setSelectLanefastq] = useState([]);
  const [selectMergedfastq, setSelectMergedfastq] = useState([]);
  const [selectReleasing, setSelectReleasing] = useState([]);

  const isSampleSelect = (item) =>
    selectSamples.includes(item.sample_id) || selectSamples.length === 0;
  const isFlowcellSelect = (item) =>
    selectFlowcells.includes(item.fc_id) || selectFlowcells.length === 0;
  const isSubmissionSelect = (item) =>
    selectSubmissions.includes(item.submission_id) || selectSubmissions.length === 0;
  const isDemultiplexeddateSelect = (item) =>
    selectDemultiplexed.includes(item.loading_date) || selectDemultiplexed.length === 0;
  const isStageddateSelect = (item) =>
    selectStaging.includes(item.staging_date) || selectStaging.length === 0;
  const isStagingErrorSelect = (item) =>
    selectStagingError.includes((item.staging_error || false).toString()) || selectStagingError.length === 0;
  const isProcessingdateSelect = (item) =>
    selectProcessing.includes(item.processing_date) || selectProcessing.length === 0;
  const isLanefastqSelect = (item) =>
    selectLanefastq.includes(item.lane_fastq) || selectLanefastq.length === 0;
  const isMergedfastqSelect = (item) =>
    selectMergedfastq.includes(item.merged_fastq) || selectMergedfastq.length === 0;
  const isReleasingdateSelect = (item) =>
    selectReleasing.includes(item.releasing_date) || selectReleasing.length === 0;

  // filter variables
  const isPoolingIdFilter = (item) =>
    props.filterPoolingId.includes(item.pooling_id) || props.filterPoolingId.length === 0;
  const isDataSampleFilter = (item) =>
    props.filterDataSample.includes(item.data_sample) || props.filterDataSample.length === 0;

  return (
    <div className="relative">
      {data && (<Table className="px-4 relative overflow-visible scroll-smooth">
        <TableHead className="sticky top-0 z-10 bg-slate-700 rounded-tremor-full">
          <TableRow className="">
            <TableHeaderCell />
            <TableHeaderCell className="z-10 px-2 text-center">
              <MultiSelect
                onValueChange={setSelectSamples}
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
                onValueChange={setSelectFlowcells}
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
                onValueChange={setSelectSubmissions}
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
                onValueChange={setSelectDemultiplexed}
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
                  onValueChange={setSelectStaging}
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
                  onValueChange={setSelectStagingError}
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
                onValueChange={setSelectProcessing}
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
                onValueChange={setSelectLanefastq}
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
                onValueChange={setSelectMergedfastq}
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
                onValueChange={setSelectReleasing}
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
          <TableRow className="bg-slate-800">
            <TableHeaderCell className="p-2 text-center text-white">S.No.</TableHeaderCell>
            <TableHeaderCell className="p-2 text-center text-white">Sample ID</TableHeaderCell>
            <TableHeaderCell className="p-2 text-center text-white">Flowcell ID</TableHeaderCell>
            <TableHeaderCell className="p-2 text-white">Submission ID</TableHeaderCell>
            <TableHeaderCell className="p-2 text-center text-white">Demultiplexed</TableHeaderCell>
            <TableHeaderCell className="p-2 text-center text-white">Staged</TableHeaderCell>
            <TableHeaderCell className="p-2 text-center text-white">Processed</TableHeaderCell>
            <TableHeaderCell className="p-2 text-center text-white">Lane fastq</TableHeaderCell>
            <TableHeaderCell className="p-2 text-center text-white">Merged fastq</TableHeaderCell>
            <TableHeaderCell className="p-2 text-center text-white">Released</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody className="">
          {data
            .filter((item) => (isSampleSelect(item) &&
              isFlowcellSelect(item) &&
              isSubmissionSelect(item) &&
              isDemultiplexeddateSelect(item) &&
              isStageddateSelect(item) &&
              isStagingErrorSelect(item) &&
              isProcessingdateSelect(item) &&
              isLanefastqSelect(item) &&
              isMergedfastqSelect(item) &&
              isReleasingdateSelect(item) &&
              isPoolingIdFilter(item) &&
              isDataSampleFilter(item)
            ))
            .map((item, index) => (
              <TableRow key={item.sample_id} className="text-xs select-auto hover:bg-slate-400 hover:text-white hover:cursor-pointer">
                <TableCell className="p-2 text-center w-2">
                  <Accordion>
                    <AccordionHeader className="">
                      {index + 1}
                    </AccordionHeader>
                    <AccordionBody className="w-64 text-left">

                      Haha

                    </AccordionBody>
                  </Accordion>
                </TableCell>
                <TableCell className="p-2 text-center select-all">{item.sample_id}</TableCell>
                <TableCell className="p-2 text-center select-all">{item.fc_id}</TableCell>
                <TableCell className="p-2 select-all">{item.submission_id}</TableCell>
                <TableCell className="p-2 text-center select-all">{item.loading_date !== "_" ?
                  (<Badge icon={CheckCircleIcon} color="emerald" size="xs">{item.loading_date}</Badge>)
                  : (<Badge icon={XCircleIcon} color="red" size="xs">Not demultiplexed </Badge>)}</TableCell>
                <TableCell className="p-2 text-center select-all">{item.staging_date !== "_" ?
                  (
                    item.staging_error ?
                      (<Badge icon={XCircleIcon} color="red" size="xs">{item.staging_date}</Badge>)
                      : (<Badge icon={CheckCircleIcon} color="emerald" size="xs">{item.staging_date}</Badge>)
                  )
                  : (<Badge icon={ExclamationCircleIcon} color="amber" size="xs">Not staged</Badge>)}
                </TableCell>
                <TableCell className="p-2 text-center select-all">{item.processing_date !== "_" ?
                  (<Badge icon={CheckCircleIcon} color="emerald" size="xs">{item.processing_date}</Badge>)
                  : (<Badge icon={ExclamationCircleIcon} color="amber" size="xs">Not processed </Badge>)}
                </TableCell>
                <TableCell className="p-2 text-center select-all">{item.lane_fastq !== "_" ?
                  (<Badge icon={CheckCircleIcon} color="emerald" size="xs">{item.lane_fastq}</Badge>)
                  : (<Badge icon={ExclamationCircleIcon} color="amber" size="xs">Not info </Badge>)}
                </TableCell>
                <TableCell className="p-2 text-center select-all">{item.merged_fastq !== "_" ?
                  (<Badge icon={CheckCircleIcon} color="emerald" size="xs">{item.merged_fastq}</Badge>)
                  : (<Badge icon={ExclamationCircleIcon} color="amber" size="xs">Not merged </Badge>)}
                </TableCell>
                <TableCell className="p-2 text-center select-all">{item.releasing_date !== "_" ?
                  (<Badge icon={CheckCircleIcon} color="emerald" size="xs">{item.releasing_date}</Badge>)
                  : (<Badge icon={ExclamationCircleIcon} color="amber" size="xs">Not released </Badge>)}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>)}
    </div>
  );
};

export const Filters = (props) => {

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center px-4 mb-8">
        <div className="flex items-center">
          <Icon
            icon={ChevronLeftIcon}
            size='lg'
            className="mr-2 -ml-4 cursor-pointer"
            onClick={() => props.setFilter(false)}
          />
          <h1 className="text-xl font-bold">Filters</h1>
        </div>
        <XIcon className="h-6 w-6 cursor-pointer" onClick={() => props.setIsOpen(false)} />
      </div>
      <div className="flex-1 space-y-4">
        <AccordionList className="mx-2">
          <Accordion>
            <AccordionHeader>
              Sample
            </AccordionHeader>
            <AccordionBody className="h-96">
              <MultiSelect
                onValueChange={props.setFilterPoolingId}
                placeholder="Pooling ID..."
                className="text-sm"
              >
                {Array.from(new Set(data.map((item) => item.pooling_id))).map((pooling_id) => (
                  <MultiSelectItem key={pooling_id} value={pooling_id} className="text-xs">
                    {pooling_id}
                  </MultiSelectItem>
                ))}
              </MultiSelect>

              <MultiSelect
                onValueChange={props.setFilterDataSample}
                placeholder="Data Sample..."
                className="text-sm"
              >
                {Array.from(new Set(data.map((item) => item.data_sample))).map((data_sample) => (
                  <MultiSelectItem key={data_sample} value={data_sample} className="text-xs">
                    {data_sample}
                  </MultiSelectItem>
                ))}
              </MultiSelect>
            </AccordionBody>
          </Accordion>
        </AccordionList>
      </div>
    </div>
  )
};