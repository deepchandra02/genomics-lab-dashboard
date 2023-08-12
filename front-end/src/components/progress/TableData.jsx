import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Typography } from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from '@tanstack/react-query';

const columns = [
  // Define your columns here
  {
    accessorKey: 'sample_id',
    header: 'Sample ID',
  },
  {
    accessorKey: 'fc_id',
    header: 'Flowcell ID',
  },
  {
    accessorKey: 'submission_id',
    header: 'Submission ID',
  },
  {
    accessorKey: 'demultiplex_date',
    header: 'Demultiplexed',
  },
  {
    accessorKey: 'stage_date',
    header: 'Staged',
  },
  {
    accessorKey: 'process_date',
    header: 'Processed',
  },
  // {
  //   accessorKey: 'lane_fastq',
  //   header: 'Lane fastq',
  // },
  // {
  //   accessorKey: 'merged_fastq',
  //   header: 'Merged fastq',
  // },
  // {
  //   accessorKey: 'releasing_date',
  //   header: 'Released',
  // },
];

const fetchSize = 25;

const PreTableData = () => {
  const tableContainerRef = useRef(null); //we can get access to the underlying TableContainer element and react to its scroll events
  const rowVirtualizerInstanceRef = useRef(null); //we can get access to the underlying Virtualizer instance and call its scrollToIndex method

  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState();
  const [sorting, setSorting] = useState([]);

  const { data, fetchNextPage, isError, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ['table-data', columnFilters, globalFilter, sorting],
      queryFn: async ({ pageParam = 0 }) => {
        const url = new URL(
          '/type0', // Update this to your API endpoint
          process.env.NODE_ENV === 'production'
            ? 'https://www.your-production-domain.com' // Update this to your production domain
            : 'http://127.0.0.1:5000',
        );
        url.searchParams.set('start', `${pageParam * fetchSize}`);
        url.searchParams.set('size', `${fetchSize}`);
        url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
        url.searchParams.set('globalFilter', globalFilter ?? '');
        url.searchParams.set('sorting', JSON.stringify(sorting ?? []));

        const response = await fetch(url.href);
        const json = await response.json();
        return json;
      },
      getNextPageParam: (_lastGroup, groups) => groups.length,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    });
  const flatData = useMemo(
    () => data?.pages.flatMap((page) => page) ?? [], // Adjusted to match your response structure
    [data],
  );

  const totalDBRowCount = flatData.length; // Adjusted to match your response structure
  const totalFetched = flatData.length;

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 400px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 400 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
  );

  //scroll to top of table when sorting or filters change
  useEffect(() => {
    //scroll to the top of the table when the sorting changes
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting, columnFilters, globalFilter]);

  //a check on mount to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  return (
    <MaterialReactTable
      columns={columns}
      data={flatData}
      enablePagination={false}
      enableRowNumbers
      enableRowVirtualization //optional, but recommended if it is likely going to be more than 100 rows
      manualFiltering
      manualSorting
      muiTableContainerProps={{
        ref: tableContainerRef, //get access to the table container element
        sx: { maxHeight: '600px' }, //give the table a max height
        onScroll: (
          event, //add an event listener to the table container element
        ) => fetchMoreOnBottomReached(event.target),
      }}
      muiToolbarAlertBannerProps={
        isError
          ? {
            color: 'error',
            children: 'Error loading data',
          }
          : undefined
      }
      onColumnFiltersChange={setColumnFilters}
      onGlobalFilterChange={setGlobalFilter}
      onSortingChange={setSorting}
      renderBottomToolbarCustomActions={() => (
        <Typography>
          Fetched {totalFetched} of {totalDBRowCount} total rows.
        </Typography>
      )}
      state={{
        columnFilters,
        globalFilter,
        isLoading,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        sorting,
      }}
      rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //get access to the virtualizer instance
      rowVirtualizerProps={{ overscan: 4 }}
    />
  )
}

const queryClient = new QueryClient();

const TableData = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PreTableData />
    </QueryClientProvider>
  )
}

export default TableData
