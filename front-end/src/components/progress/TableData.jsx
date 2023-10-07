import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
// import { Box, Button } from '@mui/material';

// const dataJson = require('../../newdata/data0.json');

const TableData = () => {
  //data and fetching state
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  // Table state
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([{ id: 'loading_date', desc: true }, { id: 'submission_id', desc: false }]);

  useEffect(() => {
    const fetchData = async () => {
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      const url = new URL(
        '/type0',
        process.env.NODE_ENV === 'production'
          ? 'https://www.material-react-table.com'
          : 'http://172.26.85.91:5001',
      );

      url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      url.searchParams.set('sorting', JSON.stringify(sorting ?? []));

      console.log(url.searchParams.toString());

      const response0 = await fetch(url.href);
      if (!response0.ok) {
        // Handle error
        setIsError(true);
        console.error('Server error:', response0);
        return;
      }
      else {
        const data = await response0.json();
        // Update the state with the fetched data
        setData(data);
        setRowCount(data.length);
      }

      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters,
    sorting,
  ]);
  console.log('rows', rowSelection);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'sample_id',
        header: 'Sample Id',
        enableHiding: false,
      },
      {
        accessorKey: 'fc_id',
        header: 'Fc Id',
        enableHiding: false,
      },
      {
        accessorKey: 'submission_id',
        header: 'Submission Id'
      },
      {
        accessorKey: 'loading_date',
        header: 'Loading Date',
        filterVariant: 'range'
      },
      {
        accessorKey: 'completion_date',
        header: 'Completion Date',
        filterVariant: 'range'
      },
      {
        accessorKey: 'demultiplex_date',
        header: 'Demultiplex Date',
        filterVariant: 'range'
      },
      {
        accessorKey: 'stage_date',
        header: 'Stage Date',
        filterVariant: 'range'
      },
      {
        accessorKey: 'process_date',
        header: 'Process Date',
        filterVariant: 'range'
      },
      {
        accessorKey: 'merged_fastq',
        header: 'Merged fastq',
        filterVariant: 'range'
      },
      {
        accessorKey: 'lane_fastq',
        header: 'Lane fastq',
        filterVariant: 'range'
      },
      {
        accessorKey: 'release_date',
        header: 'Release Date',
        filterVariant: 'range'
      },
      { accessorKey: 'sample_name', header: 'Sample Name' },
      {
        accessorKey: 'qpcr',
        header: 'Qpcr',
        filterVariant: 'range'
      },
      { 'accessorKey': 'anl', 'header': 'Anl' },
      { 'accessorKey': 'cov', 'header': 'Cov' },
      { 'accessorKey': 'data_sample', 'header': 'Data Sample' },
      { 'accessorKey': 'datatype', 'header': 'Datatype' },
      { 'accessorKey': 'error', 'header': 'Error' },
      { 'accessorKey': 'fc_type', 'header': 'Fc Type' },
      {
        'accessorKey': 'fragment',
        'header': 'Fragment',
        filterVariant: 'range'
      },
      { 'accessorKey': 'i5_id', 'header': 'I5 Id' },
      { 'accessorKey': 'i5_sequence', 'header': 'I5 Sequence' },
      { 'accessorKey': 'i7_id', 'header': 'I7 Id' },
      { 'accessorKey': 'i7_sequence', 'header': 'I7 Sequence' },
      {
        'accessorKey': 'labchip_conc',
        'header': 'Labchip Conc',
        filterVariant: 'range'
      },
      { 'accessorKey': 'lane_1', 'header': 'Lane 1' },
      { 'accessorKey': 'lane_2', 'header': 'Lane 2' },
      { 'accessorKey': 'lane_3', 'header': 'Lane 3' },
      { 'accessorKey': 'lane_4', 'header': 'Lane 4' },
      {
        'accessorKey': 'lib_qc',
        'header': 'Lib Qc',
        filterVariant: 'range'
      },
      {
        'accessorKey': 'lib_received',
        'header': 'Lib Received',
        filterVariant: 'range'
      },
      { 'accessorKey': 'loaded_by', 'header': 'Loaded By' },
      {
        'accessorKey': 'loading_conc',
        'header': 'Loading Conc',
        filterVariant: 'range'
      },
      {
        'accessorKey': 'mean_qscore',
        'header': 'Mean Qscore',
        filterVariant: 'range'
      },
      { 'accessorKey': 'order_no', 'header': 'Order No' },
      { 'accessorKey': 'pf_reads', 'header': 'Pf Reads' },
      { 'accessorKey': 'pi', 'header': 'Pi' },
      { 'accessorKey': 'pooling_id', 'header': 'Pooling Id' },
      { 'accessorKey': 'position', 'header': 'Position' },
      { 'accessorKey': 'pre_norm_well', 'header': 'Pre Norm Well' },
      { 'accessorKey': 'project_id', 'header': 'Project Id' },
      {
        'accessorKey': 'q30',
        'header': 'Q30',
        filterVariant: 'range'
      },
      { 'accessorKey': 'remark', 'header': 'Remark' },
      { 'accessorKey': 'report_dir', 'header': 'Report Dir' },
      { 'accessorKey': 'requirement', 'header': 'Requirement' },
      { 'accessorKey': 'rg', 'header': 'Rg' },
      { 'accessorKey': 'run_duration', 'header': 'Run Duration' },
      { 'accessorKey': 'sample_qc', 'header': 'Sample Qc' },
      { 'accessorKey': 'sequencer_id', 'header': 'Sequencer Id' },
      { 'accessorKey': 'srv', 'header': 'Srv' },
      {
        'accessorKey': 'submission_date',
        'header': 'Submission Date',
        filterVariant: 'range'
      },
      { 'accessorKey': 'urgent', 'header': 'Urgent' },
      { 'accessorKey': 'well', 'header': 'Well' },
      {
        'accessorKey': 'yieldq30',
        'header': 'Yieldq30',
        filterVariant: 'range'
      }]

    , []);


  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      initialState={{
        isFullScreen: true,
        showColumnFilters: true,
        columnVisibility: {
          'anl': false,
          'cov': false,
          'data_sample': false,
          'datatype': false,
          'error': false,
          'fc_type': false,
          'fragment': false,
          'i5_id': false,
          'i5_sequence': false,
          'i7_id': false,
          'i7_sequence': false,
          'labchip_conc': false,
          'lane_1': false,
          'lane_2': false,
          'lane_3': false,
          'lane_4': false,
          'lib_qc': false,
          'lib_received': false,
          'loaded_by': false,
          'loading_conc': false,
          'mean_qscore': false,
          'order_no': false,
          'pf_reads': false,
          'pi': false,
          'pooling_id': false,
          'position': false,
          'pre_norm_well': false,
          'project_id': false,
          'q30': false,
          'qpcr': false,
          'remark': false,
          'report_dir': false,
          'requirement': false,
          'rg': false,
          'run_duration': false,
          'sample_name': false,
          'sample_qc': false,
          'sequencer_id': false,
          'srv': false,
          'submission_date': false,
          'urgent': false,
          'well': false,
          'yieldq30': false
        },
        density: 'compact',
        showGlobalFilter: true,
      }}
      enableRowSelection
      //clicking anywhere on the row will select it
      muiTableBodyRowProps={({ row }) => ({
        onClick: row.getToggleSelectedHandler(),
        sx: { cursor: 'pointer' },
      })}
      onRowSelectionChange={setRowSelection}
      getRowId={(row) => row.sample_id + row.fc_id}

      //add custom action buttons to top-left of top toolbar
      // renderTopToolbarCustomActions={({ table }) => (
      //   <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
      //     <Button
      //       color="primary"
      //       disabled={!table.getIsSomeRowsSelected()}
      //       onClick={() => {
      //         const url = new URL(
      //           '/Progress/release',
      //           process.env.NODE_ENV === 'production'
      //             ? 'https://www.material-react-table.com'
      //             : 'http://172.26.85.91:5001',
      //         );

      //         url.searchParams.set('data', JSON.stringify(rowSelection ?? []));

      //         const response = fetch(url.href);
      //         console.log(response);
      //         if (!response.ok) {
      //           // Handle error
      //           console.error('Server error:', response);
      //           alert('Release Error');
      //           return;
      //         }
      //         else {
      //           alert('Released successfully!');
      //         }
      //       }}
      //       variant="contained"
      //     >
      //       Mark as released
      //     </Button>
      //   </Box >
      // )}

      enableColumnOrdering
      enableColumnResizing
      enableGrouping
      enableStickyHeader
      enablePagination={false}
      enableRowVirtualization
      enablePinning
      enableRowNumbers


      manualSorting
      isMultiSortEvent={() => true}

      manualFiltering
      onColumnFiltersChange={setColumnFilters}

      enableGlobalFilter={false}
      muiToolbarAlertBannerProps={
        isError
          ? {
            color: 'error',
            children: 'Error loading data',
          }
          : undefined
      }
      // positionToolbarAlertBanner='top'

      onSortingChange={setSorting}
      rowCount={rowCount}
      state={{
        rowSelection,
        columnFilters,
        isLoading,
        showAlertBanner: isError,
        showProgressBars: isRefetching,
        sorting,
      }}
    />
  );
}

export default TableData
