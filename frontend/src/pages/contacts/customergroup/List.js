import React, { useState, useEffect, useContext, useRef } from 'react';
import { Button, Grid, Typography, Box, FormControl, OutlinedInput, Select, MenuItem, Table, TableBody, TableContainer, TableHead, Paper, Dialog, DialogContent, DialogActions } from '@mui/material';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import { FaPrint, FaFilePdf } from "react-icons/fa";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Footer from '../../../components/footer/Footer';
import { userStyle } from '../../PageStyle';
import { Link } from 'react-router-dom';
import { ExportXL, ExportCSV } from '../../Export';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { useReactToPrint } from "react-to-print";
import axios from 'axios';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { toast } from 'react-toastify';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Headtitle from '../../../components/header/Headtitle';
import { ThreeDots } from 'react-loader-spinner';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import { UserRoleAccessContext } from '../../../context/Appcontext';

function CustomerGroupsListtable() {

  const { auth, setngs } = useContext(AuthContext);
  const [isLoader, setIsLoader] = useState(false)
  const [exceldata, setExceldata] = useState([]);
  const [cgroups, setCgroups] = useState([]);
  const [cusgrp, setCusgrp] = useState({});
  const [checkCustomerGroup, setCheckCustomerGroup] = useState([])

  // Datatable 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");

  // User Access
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  //Delete modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => { setIsDeleteOpen(true); };
  const handleClose = () => { setIsDeleteOpen(false); };

  // check delete
  const [isCheckOpen, setIsCheckOpen] = useState(false);
  const handleClickOpenCheck = () => { setIsCheckOpen(true); };
  const handleCloseCheck = () => { setIsCheckOpen(false); };

  const fetchHandler = async () => {
    try {
      let res = await axios.post(SERVICE.CUSTOMER_GROUP, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      setCgroups(res?.data?.cgroups);
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

  useEffect(() => {
    fetchHandler();
  }, []);

  //set function to get particular row
  const rowData = async (id, cusgroupname) => {
    try {
      const [
        res, req
      ] = await Promise.all([
        axios.get(`${SERVICE.CUSTOMER_GROUP_SINGLE}/${id}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          }
        }),
        axios.post(SERVICE.CUSTOMER_DELETE_CUSTOMERGRP_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checkcustomergroup: String(cusgroupname)
        })
      ])

      setCusgrp(res?.data?.scgroup);
      setCheckCustomerGroup(req?.data?.customers)
      if ((req?.data?.customers).length > 0) {
        handleClickOpenCheck();
      }
      else {
        handleClickOpen();
      }
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
  let cgrpid = cusgrp._id;
  const deleteCgrp = async (cgrpid) => {
    try {
      let response = await axios.delete(`${SERVICE.CUSTOMER_GROUP_SINGLE}/${cgrpid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      await fetchHandler();
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

  const fileName = 'Customer Groups'
  const getexcelDatas = async () => {
    var data = cgroups.length > 0 && cgroups.map((t,index) => ({ "Sno": index + 1,"Customer Group ID": t.cusgroupid, "Customer Group Name": t.cusgroupname }));
    setExceldata(data);
  }

  useEffect(() => {
    getexcelDatas();
  }, [cgroups])

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = cgroups?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  }

  useEffect(() => {
    addSerialNumber();
  }, [cgroups])

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'HIPOS | CUSTOMER GROUP LIST',
    pageStyle: 'print'
  });

  //  PDF
  const downloadPdf = () => {
    const doc = new jsPDF()
    autoTable(doc, { html: '#cutomergrouptablePDF' })
    doc.save('Customer Group.pdf')
  }

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

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

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
      <Headtitle title={'Customer groups'} />
      <Typography sx={userStyle.HeaderText}>Customer Groups <Typography component="span" sx={userStyle.SubHeaderText}></Typography></Typography>
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item md={2} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={userStyle.importheadtext}>All Customer Groups </Typography>
          </Grid>
          <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center" }} >
            <Grid>
              {isUserRoleCompare[0]?.csvcustomergrp && (
                <>
                  <ExportCSV csvData={exceldata} fileName={fileName} />
                </>
              )}
              {isUserRoleCompare[0]?.excelcustomergrp && (
                <>
                  <ExportXL csvData={exceldata} fileName={fileName} />
                </>
              )}
              {isUserRoleCompare[0]?.printcustomergrp && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                </>
              )}
              {isUserRoleCompare[0]?.pdfcustomergrp && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                </>
              )}
            </Grid>

          </Grid>
          {isUserRoleCompare[0]?.acustomergrp && (
            <>
              <Grid item md={2} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center" }}>
                <Link to="/contact/customergroup/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd} >ADD</Button></Link>
              </Grid>
            </>
          )}
        </Grid> <br /><br />
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
        {isLoader ? (
          <>
            <Box>
              <TableContainer component={Paper} sx={userStyle.tablecontainer}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="roletable">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>Action</StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting('cusgroupid')}><Box sx={userStyle.tableheadstyle}><Box>Customer Group Code</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('cusgroupid')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting('cusgroupname')}><Box sx={userStyle.tableheadstyle}><Box>Customer Group Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('cusgroupname')}</Box></Box></StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody align="left">
                    {filteredData.length > 0 ?
                      (filteredData.map((row, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="left">
                            <Grid sx={{ display: 'flex' }}>
                              {isUserRoleCompare[0]?.ecustomergrp && (<Link to={`/contact/customergroup/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonedit} style={{ minWidth: '0px' }}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>)}
                              {isUserRoleCompare[0]?.dcustomergrp && (<Button sx={userStyle.buttondelete} onClick={(e) => { rowData(row._id, row.cusgroupname) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>)}
                              {isUserRoleCompare[0]?.vcustomergrp && (<Link to={`/contact/customergroup/view/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>)}
                            </Grid>
                          </StyledTableCell>
                          <StyledTableCell component="th" scope="row"> {row.serialNumber} </StyledTableCell>
                          <StyledTableCell component="th" scope="row"> {row.cusgroupid} </StyledTableCell>
                          <StyledTableCell component="th" scope="row"> {row.cusgroupname} </StyledTableCell>
                        </StyledTableRow>
                      )))
                      : <StyledTableRow><StyledTableCell colSpan={4} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
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
              <br /><br />
              {pageSize != 1 ? <Grid >
                {isUserRoleCompare[0]?.acustomergrp && (
                  <>
                    <Grid >
                      <Link to="/contact/customergroup/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd} >ADD</Button></Link>
                    </Grid>
                  </>
                )}<br /><br />
              </Grid> : null}
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
            </Box>
          </>
        )}
      </Box>

      { /* ****** Print ****** */}
      <Box sx={userStyle.printcls} >
        <Box>
          <Typography variant='h5' >Customer Groups </Typography>
        </Box>
        <>
          <Box>
            <TableContainer component={Paper} sx={userStyle.printcls}>
              <Table aria-label="simple table" id="cutomergrouptablePDF" ref={componentRef}>
                <TableHead sx={{ fontWeight: "600" }} >
                  <StyledTableRow >
                  <StyledTableCell> Sno</StyledTableCell>
                    <StyledTableCell>Customer Group Code</StyledTableCell>
                    <StyledTableCell>Customer Group Name</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {cgroups.length > 0 && (
                    cgroups.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell component="th" scope="row"> {row.cusgroupid} </StyledTableCell>
                        <StyledTableCell component="th" scope="row"> {row.cusgroupname} </StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      </Box>

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
          <Button onClick={(e) => deleteCgrp(cgrpid)} autoFocus variant="contained" color='error'> OK </Button>
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
            {checkCustomerGroup?.length > 0 ? (
              <>
                <span style={{ fontWeight: '700', color: '#777' }}>
                  {`${cusgrp.cusgroupname} `}
                </span>
                was linked in <span style={{ fontWeight: '700' }}>Customer</span>
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

function CustomerGroupsList() {
  return (
    <>
      <CustomerGroupsListtable /><br /><br /><br /><br />
          <Footer />
    </>
  );
}
export default CustomerGroupsList;