import React, { useState, useContext, useEffect, useRef, createRef } from 'react';
import { Box, MenuItem, OutlinedInput, Button, Grid, Typography, FormControl, Select, Table, TableBody, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { Link } from 'react-router-dom';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { SERVICE } from '../../../services/Baseservice';
import { ExportXL, ExportCSV } from '../../Export';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import { toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import { FaPrint, FaFilePdf, } from 'react-icons/fa';

function Stocklisttable() {

  const { auth, setngs } = useContext(AuthContext);
  const [exceldata, setExceldata] = useState([]);
  // Access
  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);

  // Datatable 
  const [page, setPage] = useState(1);
  const [isLoader, setIsLoader] = useState(false);
  const [isProducts, setProducts] = useState([]);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);

  // get all products
  const fetchProduct = async () => {
    try {
      let res = await axios.post(SERVICE.PRODUCTSTOCK, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid),
        role: String(isUserRoleAccess.role),
        userassignedlocation: [isUserRoleAccess.businesslocation]
      });
      setProducts(res?.data?.products);
      setIsLoader(true)

    } catch (err) {
      setIsLoader(true)
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  }

  useEffect(
    () => {
      fetchProduct();
    }, []
  )

  // Excel
  const fileName = 'Stock'
  // get particular columns for export excel
  const getexcelDatas = async () => {
    var data = isProducts?.map(t => ({
      "Product ID": t.sku,
      "Product Name": t.productname,
      "Current Stock": t.currentstock,
      "Max Stock Limit": t.maxquantity
    }));
    setExceldata(data);
  }

  useEffect(
    () => {
      getexcelDatas();
    }, [isProducts]
  )

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'HIPOS | STOCK LIST',
    pageStyle: 'print'
  });

  const ref = createRef();
  const options = {
    orientation: 'portrait',
    unit: 'in'
  };

  const columns = [
    { title: "Product ID", field: "sku" },
    { title: "Product Name", field: "productname" },
    { title: "Current Stock", field: "currentstock" },
    { title: "Maximum Stock Limit", field: "maxquantity" },
  ]

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 5,
      },
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: isProducts,
    });
    doc.save("Stock.pdf");
  };

  const addSerialNumber = () => {
    const itemsWithSerialNumber = isProducts?.map((item, index) => ({ ...item, sno: index + 1 }));
    setItems(itemsWithSerialNumber);
  }

  useEffect(() => {
    addSerialNumber();
  }, [isProducts])

  //table sorting
  const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
    setSorting({ column, direction });
  };

  const sortedData = items.sort((a, b) => {
    if (sorting.direction === 'asc') {
      return a[sorting.column] > b[sorting.column] ? 1 : -1;
    } else if (sorting.direction === 'desc') {
      return a[sorting.column] < b[sorting.column] ? 1 : -1;
    }
    return 0;
  });

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
  const filteredDatas = items?.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box>
      <Headtitle title={'Stocks'} />
      { /* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Stock <Typography component="span" sx={userStyle.SubHeaderText}>Manage your Stocks</Typography></Typography>
      { /* ****** Table Start ****** */}
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography sx={userStyle.importheadtext}>Manage Stock</Typography>
          </Grid>
        </Grid><br /><br />
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
              <MenuItem value={(isProducts?.length)}>All</MenuItem>
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
        </Grid><br /><br />
        <Grid container sx={{ justifyContent: "center" }} >
          <Grid>
            {isUserRoleCompare[0]?.csvstock && (
              <>
                <ExportCSV csvData={exceldata} fileName={fileName} />
              </>
            )}
            {isUserRoleCompare[0]?.excelstock && (
              <>
                <ExportXL csvData={exceldata} fileName={fileName} />
              </>
            )}
            {isUserRoleCompare[0]?.printstock && (
              <>
                <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
              </>
            )}
            {isUserRoleCompare[0]?.pdfstock && (
              <>
                <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
              </>
            )}
          </Grid>
        </Grid><br /><br />
        {isLoader ? (
          <Box>
            <TableContainer component={Paper} >
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow align="left">
                    <StyledTableCell onClick={() => handleSorting('sno')}><Box sx={userStyle.tableheadstyle}><Box>S.No</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sno')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('sku')}><Box sx={userStyle.tableheadstyle}><Box>Product ID</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sku')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('productname')}><Box sx={userStyle.tableheadstyle}><Box>Product Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('productname')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('currentstock')}><Box sx={userStyle.tableheadstyle}><Box>Current Stock</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('currentstock')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('maxquantity')}><Box sx={userStyle.tableheadstyle}><Box>Maximum Stock Limit</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('maxquantity')}</Box></Box></StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.length > 0 ?
                    (filteredData.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="left">{row.sno}</StyledTableCell>
                        <StyledTableCell align="left">{row.sku}</StyledTableCell>
                        <StyledTableCell align="left">{row.productname}</StyledTableCell>
                        <StyledTableCell align="left">{row.currentstock}</StyledTableCell>
                        <StyledTableCell align="left">{row.maxquantity}</StyledTableCell>
                        <StyledTableCell align="left">
                          {isUserRoleCompare[0]?.astock && (
                            <>
                              <Link to={`/product/stock/create/${row.sku}/${row.maxquantity}`} style={{ textDecoration: 'none', color: 'white' }}><Button variant="contained" size='small' sx={userStyle.buttonview}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                            </>
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    )))
                    : <StyledTableRow><StyledTableCell colSpan={7} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                  }
                </TableBody>
              </Table>
            </TableContainer><br /><br />
            <Box style={userStyle.dataTablestyle}>
              <Box>
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
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
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
            </Box>
          </>
        )}


        {/* <Grid container sx={userStyle.gridcontainer}>
          <Grid >
            <Button sx={userStyle.buttonadd} type="submit" >Print Label</Button>
          </Grid>
        </Grid> */}
      </Box>

      { /* ****** Print ****** */}
      <Box sx={userStyle.printcls} >
        <Box>
          <Typography variant='h5' >Stock</Typography>
        </Box>
        <>
          <Box>
            <TableContainer component={Paper} sx={userStyle.printcls}>
              <Table aria-label="simple table" id="stocktablepdf" ref={componentRef}>
                <TableHead sx={{ fontWeight: "600" }} >
                  <StyledTableRow >
                    <StyledTableCell>Product ID</StyledTableCell>
                    <StyledTableCell>Product Name</StyledTableCell>
                    <StyledTableCell>Current Stock</StyledTableCell>
                    <StyledTableCell>Maximum Stock Limit</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {isProducts.length > 0 && (
                    isProducts.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="left">{row.sku}</StyledTableCell>
                        <StyledTableCell align="left">{row.productname}</StyledTableCell>
                        <StyledTableCell align="left">{row.currentstock}</StyledTableCell >
                        <StyledTableCell align="left">{row.maxquantity}</StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      </Box>
    </Box>
  );

}

const Stocklist = () => {
  return (
    <>
<Stocklisttable /><br /><br /><br /><br />
            <Footer />
    </>
  );
}

export default Stocklist;