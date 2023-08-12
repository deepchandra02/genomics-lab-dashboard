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
