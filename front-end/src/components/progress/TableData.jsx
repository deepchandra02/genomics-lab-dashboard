import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function TableData(props) {
  // Define columns to match your data structure
  const columns = [
    { field: 's_no', headerName: 'S.No.', width: 90, hideable: false },
    { field: 'sample_id', headerName: 'Sample ID', width: 150, hideable: false },
    { field: 'fc_id', headerName: 'Flowcell ID', width: 150, hideable: false },
    { field: 'submission_id', headerName: 'Submission ID', width: 150 },
    { field: 'loading_date', headerName: 'Demultiplexed', width: 150 },
    { field: 'staging_date', headerName: 'Staged', width: 150 },
    { field: 'processing_date', headerName: 'Processed', width: 150 },
    { field: 'lane_fastq', headerName: 'Lane fastq', width: 150 },
    { field: 'merged_fastq', headerName: 'Merged fastq', width: 150 },
    { field: 'releasing_date', headerName: 'Released', width: 150 },
  ];

  // Prepare rows to match the expected structure for DataGrid
  const rows = props.data.map((item, index) => ({
    id: index + 1,
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

  return (
    <div className="min-w-screen w-full relative">
      <Box sx={{ height: '100vh' }}>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 100,
              },
            },
          }}
          pageSizeOptions={[25, 50, 100, 500]}
          checkboxSelection
        // disableRowSelectionOnClick
        />
      </Box>
    </div>
  );
}

export default TableData;
