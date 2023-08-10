import React, { useState, useEffect } from "react";
import { AccordionList, Accordion, AccordionHeader, AccordionBody, Button, Icon, Table, TableRow, TableCell, TableHead, TableHeaderCell, TableBody, Badge, Select, SelectItem, MultiSelect, MultiSelectItem }
  from "@tremor/react";
import { ChevronLeftIcon, CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, FilterIcon, XIcon } from "@heroicons/react/solid";

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
    <div className="min-w-screen w-full relative">
      {props.data && (<Table className="px-4 relative overflow-visible scroll-smooth">
        <TableHead className="sticky top-0 z-10 bg-slate-700 rounded-tremor-full">
          <TableRow className="">
            <TableHeaderCell>

              <Button
                className="cursor-pointer items-center"
                variant="secondary"
                onClick={() => props.setFilterPanelOpen(!props.filterPanelOpen)}
                icon={props.filterPanelOpen ? XIcon : FilterIcon}
              >
                Filter
              </Button>
              <span class="animate-ping absolute right-4 inline-flex h-2 w-2 rounded-full bg-violet-500 opacity-95"></span>
            </TableHeaderCell>
            <TableHeaderCell className="z-10 px-2 text-center">
              <MultiSelect
                onValueChange={setSelectSamples}
                placeholder="Samples..."
                className="min-w-0 w-[8rem] z-10 text-xs"
              >
                {props.data.map((item) => (
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
                {Array.from(new Set(props.data.map((item) => item.fc_id))).map((fc_id) => (
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
                {Array.from(new Set(props.data.map((item) => item.submission_id))).map((submission_id) => (
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
                {Array.from(new Set(props.data.map((item) => item.loading_date)))
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
                  {Array.from(new Set(props.data.map((item) => item.staging_date)))
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
                  {Array.from(new Set(props.data.map((item) => (item.staging_error || false).toString()))).map((staging_error) => (
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
                {Array.from(new Set(props.data.map((item) => item.processing_date)))
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
                {Array.from(new Set(props.data.map((item) => item.lane_fastq)))
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
                {Array.from(new Set(props.data.map((item) => item.merged_fastq)))
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
                {Array.from(new Set(props.data.map((item) => item.releasing_date)))
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
          {props.data
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
}

export default TableData