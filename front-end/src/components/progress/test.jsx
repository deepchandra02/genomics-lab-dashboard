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
  const isQpcrFilter = (item) =>
    props.filterQpcr.includes(item.qpcr) || props.filterQpcr.length === 0;
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
              isQpcrFilter(item) &&
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


import * as React from 'react';
import { alpha } from '@mui/material/styles';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, IconButton, Toolbar, Typography, Paper, Checkbox, Tooltip, FormControlLabel, Switch } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  return array.slice().sort(comparator);
}


function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Data
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

function TableData(props) {
  const rows = props.data.map((item, index) => ({
    s_no: index + 1,
    sample_id: item.sample_id,
    fc_id: item.fc_id,
    submission_id: item.submission_id,
    loading_date: item.loading_date,
    staging_date: item.staging_date,
    processing_date: item.processing_date,
    lane_fastq: item.lane_fastq,
    merged_fastq: item.merged_fastq,
    releasing_date: item.releasing_date,
  }));

  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('loading_date');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.s_no.toString());
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, s_no) => {
    const selectedIndex = selected.indexOf(s_no);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, s_no);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows],
  );

  // For TableHead component
  const numSelected = selected.length
  const rowCount = rows.length

  const headCells = [
    { id: 's_no', numeric: false, disablePadding: true, label: 'S.No.' },
    { id: 'sample_id', numeric: false, label: 'Sample ID' },
    { id: 'fc_id', numeric: false, label: 'Flowcell ID' },
    { id: 'submission_id', numeric: false, label: 'Submission ID' },
    { id: 'loading_date', numeric: false, label: 'Demultiplexed' },
    { id: 'staging_date', numeric: false, label: 'Staged' },
    { id: 'processing_date', numeric: false, label: 'Processed' },
    { id: 'lane_fastq', numeric: false, label: 'Lane fastq' },
    { id: 'merged_fastq', numeric: false, label: 'Merged fastq' },
    { id: 'releasing_date', numeric: false, label: 'Released' },
  ];
  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };
  return (
    <div className="min-w-screen w-full relative">
      {props.data && (
        <Box >
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer sx={{ overflow: 'visible' }}>
            <Table
              size={dense ? 'small' : 'medium'}
              sx={{ minWidth: '100%', paddingRight: 4, position: 'relative', overflow: 'visible' }}
            >
              <TableHead className="sticky top-0 z-10 bg-teal-200">
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={numSelected > 0 && numSelected < rowCount}
                      checked={rowCount > 0 && numSelected === rowCount}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  {headCells.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      align={headCell.numeric ? 'right' : 'left'}
                      padding={headCell.disablePadding ? 'none' : 'normal'}
                      sortDirection={orderBy === headCell.id ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={createSortHandler(headCell.id)}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.s_no.toString());
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.s_no.toString())}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.s_no}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.s_no}
                      </TableCell>
                      <TableCell align="right">{row.sample_id}</TableCell>
                      <TableCell align="right">{row.fc_id}</TableCell>
                      <TableCell align="right">{row.submission_id}</TableCell>
                      <TableCell align="right">{row.loading_date}</TableCell>
                      <TableCell align="right">{row.staging_date}</TableCell>
                      <TableCell align="right">{row.processing_date}</TableCell>
                      <TableCell align="right">{row.lane_fastq}</TableCell>
                      <TableCell align="right">{row.merged_fastq}</TableCell>
                      <TableCell align="right">{row.releasing_date}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={11} />
                  </TableRow>
                )}
              </TableBody>

            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[25, 50, 100, 500]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
          />
        </Box>
      )}
    </div>
  );
}

export default TableData
