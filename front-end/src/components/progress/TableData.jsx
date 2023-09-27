import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';


// const dataJson = require('../../newdata/data0.json');

const TableData = () => {
  //data and fetching state
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  // Table state
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnFilterFns, setColumnFilterFns] = useState({});

  const [sorting, setSorting] = useState([]);

  console.log('ping 1');
  //if you want to avoid useEffect, look at the React Query example instead
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
          : 'http://127.0.0.1:5000',
      );

      url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      url.searchParams.set('filterFns', JSON.stringify(columnFilterFns ?? []));
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

  const columns = useMemo(
    () => [
      {
        accessorKey: 'sample_id',
        header: 'Sample Id',
        enableHiding: false,
        // columnFilterModeOptions: ['fuzzy', 'contains', 'startsWith']
      },
      { accessorKey: 'fc_id', header: 'Fc Id', enableHiding: false, },
      { accessorKey: 'submission_id', header: 'Submission Id' },
      { accessorKey: 'loading_date', header: 'Loading Date' },
      { accessorKey: 'completion_date', header: 'Completion Date' },
      { accessorKey: 'demultiplex_date', header: 'Demultiplex Date' },
      { accessorKey: 'stage_date', header: 'Stage Date' },
      { accessorKey: 'process_date', header: 'Process Date' },
      { accessorKey: 'merged', header: 'Merged' },
      { accessorKey: 'lane', header: 'Lane' },

      { accessorKey: 'sample_name', header: 'Sample Name' },
      { accessorKey: 'qpcr', header: 'Qpcr' },
      { accessorKey: 'pooling_id', header: 'Pooling Id' },
      { accessorKey: 'fragment', header: 'Fragment' },
      { accessorKey: 'labchip_conc', header: 'Labchip Conc' },
      { accessorKey: 'well', header: 'Well' },
      { accessorKey: 'pre_norm_well', header: 'Pre Norm Well' },
      { accessorKey: 'i5_id', header: 'I5 Id' },
      { accessorKey: 'i7_id', header: 'I7 Id' },
      { accessorKey: 'data_sample', header: 'Data Sample' },
      { accessorKey: 'urgent', header: 'Urgent' },
      { accessorKey: 'remark', header: 'Remark' },
      { accessorKey: 'lib_received', header: 'Lib Received' },
      { accessorKey: 'sample_qc', header: 'Sample Qc' },
      { accessorKey: 'lib_qc', header: 'Lib Qc' },
      { accessorKey: 'error', header: 'Error' },
      { accessorKey: 'pf_reads', header: 'Pf Reads' },
      { accessorKey: 'loading_conc', header: 'Loading Conc' },
      { accessorKey: 'q30', header: 'Q30' },
      { accessorKey: 'lane_1', header: 'Lane 1' },
      { accessorKey: 'lane_2', header: 'Lane 2' },
      { accessorKey: 'lane_3', header: 'Lane 3' },
      { accessorKey: 'lane_4', header: 'Lane 4' },
      { accessorKey: 'fc_type', header: 'Fc Type' },
      { accessorKey: 'loaded_by', header: 'Loaded By' },
      { accessorKey: 'order_no', header: 'Order No' },
      { accessorKey: 'sequencer_id', header: 'Sequencer Id' },
      { accessorKey: 'run_duration', header: 'Run Duration' },
      { accessorKey: 'position', header: 'Position' },
      { accessorKey: 'project_id', header: 'Project Id' },
      { accessorKey: 'date', header: 'Date' },
      { accessorKey: 'cov', header: 'Cov' },
      { accessorKey: 'srv', header: 'Srv' },
      { accessorKey: 'rg', header: 'Rg' },
      { accessorKey: 'anl', header: 'Anl' },
      { accessorKey: 'datatype', header: 'Datatype' },
      { accessorKey: 'pi', header: 'Pi' },
      { accessorKey: 'requirement', header: 'Requirement' },
      { accessorKey: 'earliest', header: 'Earliest' },
      { accessorKey: 'latest', header: 'Latest' },
      { accessorKey: 'i5_sequence', header: 'I5 Sequence' },
      { accessorKey: 'i7_sequence', header: 'I7 Sequence' }
    ], []);


  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      initialState={{
        showColumnFilters: true,
        // columnFilterFns: {
        columnVisibility: {
          sample_name: false,
          qpcr: false,
          pooling_id: false,
          fragment: false,
          labchip_conc: false,
          well: false,
          pre_norm_well: false,
          i5_id: false,
          i7_id: false,
          data_sample: false,
          urgent: false,
          remark: false,
          lib_received: false,
          sample_qc: false,
          lib_qc: false,
          error: false,
          pf_reads: false,
          loading_conc: false,
          q30: false,
          lane_1: false,
          lane_2: false,
          lane_3: false,
          lane_4: false,
          fc_type: false,
          loaded_by: false,
          order_no: false,
          sequencer_id: false,
          run_duration: false,
          position: false,
          project_id: false,
          date: false,
          cov: false,
          srv: false,
          rg: false,
          anl: false,
          datatype: false,
          pi: false,
          requirement: false,
          earliest: false,
          latest: false,
          i5_sequence: false,
          i7_sequence: false
        },
        density: 'compact',
        showGlobalFilter: true,
      }}
      enableRowSelection
      // enableColumnDragging
      enableColumnResizing
      enableGrouping
      enableStickyHeader
      enablePagination={false}
      enableRowVirtualization
      enablePinning
      enableRowNumbers

      manualSorting




      // enableColumnFilterModes

      manualFiltering
      enableColumnFilterModes
      onColumnFiltersChange={setColumnFilters}
      onColumnFilterFnsChange={setColumnFilterFns}

      muiToolbarAlertBannerProps={
        isError
          ? {
            color: 'error',
            children: 'Error loading data',
          }
          : undefined
      }

      enableGlobalFilter={false}
      // onGlobalFilterChange={setGlobalFilter}
      onSortingChange={setSorting}
      rowCount={rowCount}
      state={{
        columnFilterFns,
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
