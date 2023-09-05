import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Grid, Select, MenuItem, FormControl, OutlinedInput, Dialog, DialogContent, DialogActions, Paper, Table, TableBody, TableHead, TableContainer, Button } from '@mui/material';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { userStyle } from "../../PageStyle";
import axios from 'axios';
import jsPDF from "jspdf";
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ExportXL, ExportCSV } from '../../Export';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from "../../../components/header/Headtitle";
import { ThreeDots } from 'react-loader-spinner';

function Racklisttable() {

  const [racklist, setRacklist] = useState([]);
  const [exceldata, setExceldata] = useState([]);

  const [isLoader, setIsLoader] = useState(false);
  const [isLocations, setIsLocations] = useState([]);
  const [checkProdRack, setCheckProdRack] = useState([])
  const [checkStockRack, setCheckStockRack] = useState([])

  // Datatable 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");

  // Access
  const { isUserRoleAccess, isUserRoleCompare, allLocations, } = useContext(UserRoleAccessContext);
  const { auth, setngs } = useContext(AuthContext);

  // Delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => { setIsDeleteOpen(true); };
  const handleClose = () => { setIsDeleteOpen(false); };

  // check delete
  const [isCheckOpen, setIsCheckOpen] = useState(false);
  const handleClickOpenCheck = () => { setIsCheckOpen(true); };
  const handleCloseCheck = () => { setIsCheckOpen(false); };

  // get all products
  const fetchRacks = async () => {
    try {
      let res = await axios.post(SERVICE.RACK, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid),
        role: String(isUserRoleAccess.role),
        userassignedlocation: [isUserRoleAccess.businesslocation]
      });
      setRacklist(res?.data?.racks);
      setIsLocations(allLocations);
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
      fetchRacks();
    }, [])

  const [prid, setPrid] = useState({});

  // delete function api
  const rowData = async (id, subrackcode) => {
    try {
      const [
        res,
        reqprod, reqstock
      ] = await Promise.all([
        axios.get(`${SERVICE.RACK_SINGLE}/${id}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
        }),
        axios.post(SERVICE.PRODUCT_DELETE_RACK_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checkrack: [...subrackcode]
        }),
        axios.post(SERVICE.STOCK_DELETE_RACK_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checkrack: [...subrackcode]
        })
      ])
      setPrid(res?.data?.srack);
      setCheckProdRack(reqprod?.data?.products)
      setCheckStockRack(reqstock?.data?.stock)
      if ((reqprod?.data?.products).length > 0 || (reqstock?.data?.stock).length > 0) {
        handleClickOpenCheck();
      }
      else {
        handleClickOpen();
      }
      //set function to get particular row
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  }

  //alert delete popup
  let rackid = prid._id;
  const deleteProd = async (rackid) => {
    try {
      let res = await axios.delete(`${SERVICE.RACK_SINGLE}/${rackid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      await fetchRacks();
      handleClose();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };


  // Excel
  const fileName = "Rack";

  // get perticular columns for export excel
  const productexcel = async () => {
    var data = racklist.map((t, index) => ({
      "Sno": index + 1,
      'Bussiness Location': t.businesslocation,
      'Main Rack': t.mainrack,
      'Rack Display': t.combinerack.map(t => t.subrackcode).join(","),
    }));
    setExceldata(data);
  }

  useEffect(
    () => {
      productexcel();
    }, [racklist]
  )

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Products',
    pageStyle: 'print'
  });

  // PDF
  const downloadPdf = () => {
    const doc = new jsPDF();
    autoTable(doc, { html: '#racktablepdf' });
    doc.save('Racks.pdf')
  }
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = racklist?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  }

  useEffect(() => {
    addSerialNumber();
  }, [racklist])

  // Sorting
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
      value?.toString().toLowerCase().startsWith(searchQuery.toLowerCase())
    )
  );

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box >
      <Headtitle title={'Rack'} />
      { /* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Rack <Typography component="span" sx={userStyle.SubHeaderText}>Manage your racklist</Typography></Typography>
      { /* ****** Table Start ****** */}
      <>
        <Box sx={userStyle.container} >
          { /* Header Content */}
          <Grid container spacing={2}>
            <Grid item md={2} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              <Typography sx={userStyle.importheadtext}>Racklist</Typography>
            </Grid>
            <Grid item md={8} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              <Grid>
                {isUserRoleCompare[0]?.csvracks && (
                  <>
                    <ExportCSV csvData={exceldata} fileName={fileName} />
                  </>
                )}
                {isUserRoleCompare[0]?.excelracks && (
                  <>
                    <ExportXL csvData={exceldata} fileName={fileName} />
                  </>
                )}
                {isUserRoleCompare[0]?.printracks && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                  </>
                )}
                {isUserRoleCompare[0]?.pdfracks && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={downloadPdf}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                  </>
                )}
              </Grid>
            </Grid>
            <Grid item md={2} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              {isUserRoleCompare[0]?.aracks && (
                <>
                  <Link to="/product/rack/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
                </>
              )}
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
                <MenuItem value={(filteredDatas.length)}>All</MenuItem>
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
          { /* Table Start */}
          <Box>

            <>
              <TableContainer component={Paper} >
                <Table aria-label="simple table">
                  <TableHead sx={{ fontWeight: "600", fontSize: "14px" }} >
                    <StyledTableRow >
                      <StyledTableCell onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting('businesslocation')}><Box sx={userStyle.tableheadstyle}><Box> Bussiness Location</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('businesslocation')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting('mainrack')}><Box sx={userStyle.tableheadstyle}><Box>Main Rack</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('mainrack')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting('combinerack')}><Box sx={userStyle.tableheadstyle}><Box>Rack Display</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('combinerack')}</Box></Box></StyledTableCell>
                      <StyledTableCell>Action</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.length > 0 ?
                      (filteredData.map((row, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{row.serialNumber}</StyledTableCell>
                          <StyledTableCell >{isLocations.map((data, i) => data.locationid.includes(row.businesslocation) ? data.name + " " : "")}</StyledTableCell>
                          <StyledTableCell >{row.mainrack}</StyledTableCell>
                          <StyledTableCell >{row.combinerack.map(t => t.subrackcode).join(",")}</StyledTableCell>
                          <StyledTableCell component="th" scope="row" colSpan={1}>
                            <Grid sx={{ display: 'flex' }}>
                              {isUserRoleCompare[0]?.eracks && (
                                <>
                                  <Link to={`/product/rack/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonedit} style={{ minWidth: '0px' }}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                </>
                              )}
                              {isUserRoleCompare[0]?.vracks && (
                                <>
                                  <Link to={`/product/rack/view/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                </>
                              )}
                              {isUserRoleCompare[0]?.dracks && (
                                <>
                                  <Button sx={userStyle.buttondelete} onClick={(e) => {
                                    const subrackCodes = row.combinerack.map(item => item.subrackcode);
                                    // subrackCodes.forEach(subrackCode => {
                                    rowData(row._id, row.combinerack);
                                    // });
                                  }} ><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                                </>
                              )}
                            </Grid>
                          </StyledTableCell>
                        </StyledTableRow>
                      )))
                      : <StyledTableRow><StyledTableCell colSpan={6} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                    }
                  </TableBody>
                </Table>
              </TableContainer><br /><br />
              <Box style={userStyle.dataTablestyle}>
                <Box>
                Showing {filteredData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                </Box>
                <Box>
                <Button onClick={() => setPage(1)} disabled={page === 1} sx={{ textTransform: 'capitalize', color: 'black' }}>
                  First
                </Button>
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
                  <Button onClick={() => setPage((totalPages))} disabled={page === totalPages} sx={{ textTransform: 'capitalize', color: 'black' }}>
                  Last
                </Button>
                </Box>
              </Box>
              <br />  <br />
              {pageSize != 1 ? <Grid >
                {isUserRoleCompare[0]?.aracks && (
                  <>
                    <Link to="/product/rack/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
                  </>
                )}<br /><br />
              </Grid> : null}
            </>
          </Box>

          { /* Table End */}
        </Box>
      </>
      { /* ****** Table End ****** */}
      {/* Print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="racktablepdf" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600", fontSize: "14px" }} >
            <StyledTableRow >
              <StyledTableCell>Sno</StyledTableCell>
              <StyledTableCell >Bussiness Location</StyledTableCell>
              <StyledTableCell >Main Rack</StyledTableCell>
              <StyledTableCell >Rack Display</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {racklist.length > 0 ? (
              racklist.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell >{isLocations.map((data, i) => data.locationid.includes(row.businesslocation) ? data.name + " " : "")}</StyledTableCell>
                  <StyledTableCell >{row.mainrack}</StyledTableCell>
                  <StyledTableCell >{row.combinerack.map(t => t.subrackcode).join(",")}</StyledTableCell>
                </StyledTableRow>
              ))
            ) : (<StyledTableCell colSpan={8}><Typography>No data available in table</Typography></StyledTableCell>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* printlayout ends */}
      {/* ALERT DIALOG */}
      <Dialog
        open={isDeleteOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"

      >
        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
          <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
          <Button autoFocus onClick={(e) => deleteProd(rackid)} variant="contained" color='error'> OK </Button>
        </DialogActions>
      </Dialog>

      {/* check delete */}
      <Dialog
        open={isCheckOpen}
        onClose={handleCloseCheck}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
          <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>
            {checkProdRack?.length > 0 && checkStockRack?.length > 0
              ? (
                <>
                  <span style={{ fontWeight: '700', color: '#777' }}>
                    {`${checkProdRack?.map(t => t.rack)} `}
                  </span>
                  was linked in <span style={{ fontWeight: '700' }}>Product & Stock</span>
                </>
              ) : checkProdRack?.length > 0 || checkStockRack?.length > 0
                ? (
                  <>
                    <span style={{ fontWeight: '700', color: '#777' }}>
                      {`${checkProdRack?.map(t => t.rack)} `}
                    </span>
                    was linked in{' '}
                    <span style={{ fontWeight: '700' }}>
                      {checkProdRack?.length ? ' Product' : ''}
                      {checkStockRack?.length ? ' Stock' : ''}
                    </span>
                  </>
                ) : (
                  ''
                )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCheck} autoFocus variant="contained" color='error'> OK </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function Racklist() {
  return (
    <>
      <Racklisttable /><br /><br /><br /><br />
          <Footer />
    </>
  );
}
export default Racklist;