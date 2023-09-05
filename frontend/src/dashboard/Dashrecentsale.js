import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Button, Grid, Typography, OutlinedInput, FormControl, MenuItem, Select, Table, TableBody, TableContainer, TableHead, } from "@mui/material";
import { StyledTableRow, StyledTableCell } from "../components/Table";
import { userStyle } from '../pages/PageStyle';
import { ExportXL, ExportCSV } from '../pages/Export';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';


function Dashrecentsale({pos}) {

  const [exceldata, setExceldata] = useState([]);

  // Datatable 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");

  // Sorting
  const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
    setSorting({ column, direction });
  };

  const renderSortingIcon = (column) => {
    if (sorting.column !== column) {
      return <>
        <Box sx={{ color: '#bbb6b6' }}>
          <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
            <ArrowDropUpOutlinedIcon />
          </Grid>
          <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
            <ArrowDropDownOutlinedIcon />
          </Grid>
        </Box>
      </>;
    } else if (sorting.direction === 'asc') {
      return <>
        <Box >
          <Grid sx={{ height: '6px' }}>
            <ArrowDropUpOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
          </Grid>
          <Grid sx={{ height: '6px' }}>
            <ArrowDropDownOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
          </Grid>
        </Box>
      </>;
    } else {
      return <>
        <Box >
          <Grid sx={{ height: '6px' }}>
            <ArrowDropUpOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
          </Grid>
          <Grid sx={{ height: '6px' }}>
            <ArrowDropDownOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
          </Grid>
        </Box>
      </>;
    }
  };

  // Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const filteredDatas = pos?.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(pos?.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'HIPOS | RECENT SALE',
    pageStyle: 'print'
  });

  //  PDF
  const downloadPdf = () => {
    const doc = new jsPDF()
    autoTable(doc, { html: '#recentsalePDF' })
    doc.save('recentsale.pdf')
  }

  // Export Excel
  const fileName = 'recentsale'
  // get perticular columns for export excel
  const getexcelDatas = async () => {
    var data = pos.map(t => ({
      Reference: t.referenceno,
      Location: t.businesslocation,
      Customer: t.customer,
      "Grand Total": t.aftergranddisctotal,
      Paid: t.amountgain,
      Due: t.dueamount,
      "Payment Status": t.paymentstatus,

    }));
    setExceldata(data);
  }

  useEffect(() => {
    getexcelDatas();
  }, [pos]);

  return (
    <Box>
      <Box sx={userStyle.container}>
        <Typography variant='h6'>Recent Sales</Typography>
        <br /><br />

        <Grid style={userStyle.dataTablestyle}>
          <Box>
            <label htmlFor="pageSizeSelect">Show&ensp;</label>
            <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={(pos?.length)}>All</MenuItem>
            </Select>
            <label htmlFor="pageSizeSelect">&ensp;entries</label>
          </Box>
          <Box>
            <Grid sx={{ display: 'flex' }}>
              <Grid><Typography sx={{ marginTop: '6px' }}>Search:&ensp;</Typography></Grid>
              <FormControl fullWidth size="small" >
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </FormControl>
            </Grid>
          </Box>
        </Grid><br />
        <Grid container sx={userStyle.gridcontainer}>
          <Grid>
            <ExportCSV csvData={exceldata} fileName={fileName} />
            <ExportXL csvData={exceldata} fileName={fileName} />
            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
            <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
          </Grid>
        </Grid><br />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="tableRef">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell onClick={() => handleSorting('reference')}><Box sx={userStyle.tableheadstyle}><Box>Reference</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('reference')}</Box></Box></StyledTableCell>
                <StyledTableCell onClick={() => handleSorting('customer')}><Box sx={userStyle.tableheadstyle}><Box>Customer</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('customer')}</Box></Box></StyledTableCell>
                <StyledTableCell onClick={() => handleSorting('grandtotal')}><Box sx={userStyle.tableheadstyle}><Box>Grand Total</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('grandtotal')}</Box></Box></StyledTableCell>
                <StyledTableCell onClick={() => handleSorting('paid')}><Box sx={userStyle.tableheadstyle}><Box>Paid</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('paid')}</Box></Box></StyledTableCell>
                <StyledTableCell onClick={() => handleSorting('due')}><Box sx={userStyle.tableheadstyle}><Box>Due</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('due')}</Box></Box></StyledTableCell>
                <StyledTableCell onClick={() => handleSorting('paymentstatus')}><Box sx={userStyle.tableheadstyle}><Box>Payment Status</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('paymentstatus')}</Box></Box></StyledTableCell>

              </StyledTableRow>
            </TableHead>
            <TableBody>
              {filteredData?.length > 0 ?
                (filteredData.map((item, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell align="left">{item.referenceno}</StyledTableCell>
                    <StyledTableCell align="left">{item.customer}</StyledTableCell>
                    <StyledTableCell align="left">{item.aftergranddisctotal}</StyledTableCell>
                    <StyledTableCell align="left">{item.amountgain}</StyledTableCell>
                    <StyledTableCell align="left">{item.dueamount}</StyledTableCell>
                    <StyledTableCell align="left">{item.paymentstatus}</StyledTableCell>
                  </StyledTableRow>
                )))
                : <StyledTableRow><StyledTableCell colSpan={7} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
              }
            </TableBody>
          </Table>
        </TableContainer><br />
        { /* ****** Print ****** */}
        <Box sx={userStyle.printcls} >
          <Box>
            <Typography variant='h5' >Recent Sale</Typography>
          </Box>
          <>
            <Box>
              <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="simple table" id="recentsalePDF" ref={componentRef}>
                  <TableHead sx={{ fontWeight: "600" }} >
                    <StyledTableRow>
                      <StyledTableCell align="left">Reference</StyledTableCell>
                      <StyledTableCell align="left">Customer</StyledTableCell>
                      <StyledTableCell align="left">Location</StyledTableCell>
                      <StyledTableCell align="left">Grand Total</StyledTableCell>
                      <StyledTableCell align="left">Paid</StyledTableCell>
                      <StyledTableCell align="left">Due</StyledTableCell>
                      <StyledTableCell align="left">Payment Status</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {pos && (
                      pos.map((row, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="left">{row.referenceno}</StyledTableCell>
                          <StyledTableCell align="left">{row.customer}</StyledTableCell>
                          <StyledTableCell align="left">{row.businesslocation}</StyledTableCell>
                          <StyledTableCell align="left">{row.aftergranddisctotal}</StyledTableCell>
                          <StyledTableCell align="left">{row.amountgain}</StyledTableCell>
                          <StyledTableCell align="left">{row.dueamount}</StyledTableCell>
                          <StyledTableCell align="left">{row.paymentstatus}</StyledTableCell>
                        </StyledTableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </>
        </Box>
        <Box style={userStyle.dataTablestyle}>
          <Box>
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, pos?.length)} of {pos?.length} entries
          </Box>
          <Box>
            <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={{ textTransform: 'capitalize', color: 'black' }}>
              Prev
            </Button>
            {pageNumbers?.map((pageNumber) => (
              <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={((page)) === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
                {pageNumber}
              </Button>
            ))}
            {lastVisiblePage < totalPages && <span>...</span>}
            <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={{ textTransform: 'capitalize', color: 'black' }}>
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashrecentsale;