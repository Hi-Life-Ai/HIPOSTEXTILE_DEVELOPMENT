import React, { useState, useEffect, useContext, useRef, createRef } from 'react';
import { Box, Table, TableBody, Select, MenuItem, FormControl, OutlinedInput, TableContainer, TableHead, Paper, Button, Grid, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { useReactToPrint } from "react-to-print";
import { userStyle } from '../../PageStyle';
import { Link } from 'react-router-dom';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { ThreeDots } from 'react-loader-spinner';
import { ExportXL, ExportCSV } from '../../Export';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Userslisttable() {

  const [users, setUsers] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [deltUser, setDeltUser] = useState({});
  const [exceldata, setExceldata] = useState([]);
  const { auth, setngs } = useContext(AuthContext);

  // Datatable 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");

  // Access
  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);

  // Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => { setIsDeleteOpen(true); };
  const handleClose = () => { setIsDeleteOpen(false); };

  // User
  const fetchHandler = async () => {
    try {
      let res = await axios.post(`${SERVICE.USER_TERMSFALSE_LOCATION}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid),
        role: String(isUserRoleAccess.role),
        userassignedlocation: [isUserRoleAccess.businesslocation]
      });

      setUsers(res?.data?.users);
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

  //set function to get particular row
  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setDeltUser(res?.data?.suser);
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
  let userid = deltUser._id;

  const deleteUser = async (userid) => {

    try {
      let res = await axios.delete(`${SERVICE.USER_SINGLE}/${userid}`, {
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

  // Export Excel
  const fileName = 'User'
  // get perticular columns for export excel
  const getexcelDatas = async () => {
    var data = users.map((t, index) => ({ "Sno": index + 1,"Entry No": t.entrynumber, "Staff Name": t.staffname, "User Id": t.userid, "Father Name": t.fathername, "Date": t.date, "Business Location": t.businesslocation, "Role": t.role, "Counter": t.counter, "Date of Join": t.dateofjoin, "Gender": t.gender, "Blood Group": t.bloodgroup, "Date of Birth": t.dateofbirth, "Religion": t.religion, "Nationality": t.nationality, "Address": t.address, "Area/City": t.areacity, "Pincode": t.pincode, "Mobhile No": t.phonenum, "Other No": t.otherphonenum, "Active User": t.useractive, "Email": t.email, "Marital Status": t.maritalstatus, "Family details": t.familydetails, "Education details": t.educationydetails, "Job details": t.jobdetails, "Experience details": t.experiencedetails, "Aadhar No": t.aadharnumber, "Acc No": t.accnumber, "Nationality": t.country, "Remarks": t.remarks }));
    setExceldata(data);
  }

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'HIPOS | USERS',
    pageStyle: 'print'
  });

  const ref = createRef();
  const options = {
    orientation: 'portrait',
    unit: 'in'
  };

  //  PDF
  const downloadPdf = () => {
    const doc = new jsPDF()
    autoTable(doc, { html: '#usertablePDF' })
    doc.save('Users.pdf')
  }

  useEffect(() => {
    fetchHandler();
  }, []);

  useEffect(() => {
    getexcelDatas();
  }, [users]);

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = users?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  }

  useEffect(() => {
    addSerialNumber();
  }, [users])

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
  const filteredDatas = items.filter((item) =>
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

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);


  }


  return (
    <Box>
      <Headtitle title={'Users'} />
      {/* header text */}
      <Typography sx={userStyle.HeaderText}>Users <Typography component="span" sx={userStyle.SubHeaderText}>Manage Users</Typography></Typography>
      {/* content start */}
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item sm={12} xs={12} md={2}><Typography sx={userStyle.importheadtext}>All your users</Typography></Grid>
          <Grid item sm={12} xs={12} md={8} sx={{ display: "flex", justifyContent: "center" }}  >
            <Grid >
              {isUserRoleCompare[0]?.csvuser && (
                <>
                  <ExportCSV csvData={exceldata} fileName={fileName} />
                </>
              )}
              {isUserRoleCompare[0]?.exceluser && (
                <>
                  <ExportXL csvData={exceldata} fileName={fileName} />
                </>
              )}
              {isUserRoleCompare[0]?.printuser && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                </>
              )}
              {isUserRoleCompare[0]?.pdfuser && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>

                </>
              )}
            </Grid>
          </Grid>
          <Grid item sm={12} xs={12} md={2} sx={{ display: "flex", justifyContent: "center" }} >
            {isUserRoleCompare[0]?.auser && (
              <>
                <Link to="/user/user/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
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
        </Grid><br /><br /><br />
        {isLoader ? (
          <Box>
            <TableContainer component={Paper} >
              <Table sx={{ minWidth: 700, }} aria-label="customized table" id="usertable">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                    <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('staffname')}><Box sx={userStyle.tableheadstyle}><Box>User Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('staffname')}</Box></Box></StyledTableCell>
                    <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('staffname')}><Box sx={userStyle.tableheadstyle}><Box>Staff Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('staffname')}</Box></Box></StyledTableCell>
                    <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('role')}><Box sx={userStyle.tableheadstyle}><Box>Role</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('role')}</Box></Box></StyledTableCell>
                    <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('email')}><Box sx={userStyle.tableheadstyle}><Box>Email</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('email')}</Box></Box></StyledTableCell>
                    <StyledTableCell>Actions</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody align="left">
                  {filteredData.length > 0 ?
                    (filteredData.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{row.serialNumber}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{row.staffname}</StyledTableCell>
                        <StyledTableCell >{row.staffname}</StyledTableCell>
                        <StyledTableCell >{row.role}</StyledTableCell>
                        <StyledTableCell >{row.email}</StyledTableCell>
                        <StyledTableCell >
                          <Grid sx={{ display: 'flex' }}>
                            {isUserRoleCompare[0]?.euser && <Link to={`/user/user/edit/${row._id}`} style={{ textDecoration: 'none', color: 'white', }}><Button sx={userStyle.buttonedit}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>}
                            {isUserRoleCompare[0]?.vuser && <Link to={`/user/user/view/${row._id}`} style={{ textDecoration: 'none', color: 'white', }}><Button sx={userStyle.buttonview}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>}
                            {isUserRoleCompare[0]?.duser && (<Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowData(row._id) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>)}
                          </Grid>
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
            <br />
            <br />
            {pageSize != 1 ? <Grid >
              {isUserRoleCompare[0]?.auser && (
                <>
                  <Link to="/user/user/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
                </>
              )} <br /> <br />
            </Grid> : null}
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
            </Box>
          </>
        )}
      </Box>
      {/* content end */}

      {/* Delete */}
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
          <Button onClick={(e) => deleteUser(userid)} autoFocus variant="contained" color='error'> OK </Button>
        </DialogActions>
      </Dialog>

      { /* ****** Print ****** */}
      <Box sx={userStyle.printcls} >
        <Box>
          <Typography variant='h5' >Users</Typography>
        </Box>
        <>
          <Box>
            <TableContainer component={Paper} sx={userStyle.printcls}>
              <Table aria-label="simple table" id="usertablePDF" ref={componentRef}>
                <TableHead sx={{ fontWeight: "600" }} >
                  <StyledTableRow >
                  <StyledTableCell>Sno</StyledTableCell>
                    <StyledTableCell ><b>Username</b></StyledTableCell>
                    <StyledTableCell ><b>Name</b></StyledTableCell>
                    <StyledTableCell ><b>Role</b></StyledTableCell>
                    <StyledTableCell ><b>Email</b></StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {users && (
                    users.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{row.staffname}</StyledTableCell>
                        <StyledTableCell >{row.staffname}</StyledTableCell>
                        <StyledTableCell >{row.role}</StyledTableCell>
                        <StyledTableCell >{row.email}</StyledTableCell>
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

function Userslist() {
  return (
    <>
      <Userslisttable /><br /><br /><br /><br />
          <Footer />
    </>
  );
}
export default Userslist;