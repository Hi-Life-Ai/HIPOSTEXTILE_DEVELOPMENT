import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Table, FormControl, Select, MenuItem, OutlinedInput, TableBody, TableContainer, TableHead, Paper, Button, Grid, Typography, Dialog, DialogContent, DialogActions, TextField } from '@mui/material';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import Footer from '../../../components/footer/Footer';
import Headtitle from '../../../components/header/Headtitle';
import { FaPrint, FaFilePdf, } from 'react-icons/fa';
import { ExportXL, ExportCSV } from '../../Export';
import { userStyle } from '../../PageStyle';
import { useReactToPrint } from "react-to-print";
import { ThreeDots } from 'react-loader-spinner';
import autoTable from 'jspdf-autotable';
import jsPDF from "jspdf";
import { Link, } from 'react-router-dom';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { toast } from 'react-toastify';
import axios from 'axios';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { SERVICE } from '../../../services/Baseservice';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { AuthContext } from '../../../context/Appcontext';

function Passwordlists() {

  //  Access
  const { auth, setngs } = useContext(AuthContext);
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  const [isLoader, setIsLoader] = useState(false);

  const [password, setPassword] = useState([]);
  const [exceldata, setExceldata] = useState([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => { setIsDeleteOpen(true) };
  const handleClose = () => { setIsDeleteOpen(false) };
  const [isPassword, setIsPassword] = useState({});
  const [ispassword, setIspassword] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Datatable 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");

  //  Fetch Password Data
  const fetchPasswords = async () => {
    try {
      let res = await axios.post(SERVICE.PASSWORD, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });

      setPassword(res?.data?.passwords);
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
    fetchPasswords();
  }, [])


  const togglePasswordVisibility = (i) => {
    setIspassword(prevState => ({
      ...prevState,
      [i]: !prevState[i]
    }));
  };

  const copyToClipboard = (password, i) => {
    navigator.clipboard.writeText(password);
    setCopySuccess(prevState => ({
      ...prevState,
      [i]: !prevState[i]
    }));

  };

  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.PASSWORD_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      })
      setIsPassword(res?.data?.spassword);//set function to get particular row
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
  let passwordid = isPassword._id;

  const deleteData = async (passwordid) => {
    try {
      await axios.delete(`${SERVICE.PASSWORD_SINGLE}/${passwordid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      })
      await fetchPasswords();
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
  const fileName = 'Passwords List'
  // get particular columns for export excel

  const getexcelDatas = async () => {
    var data = password.length > 0 && password.map(t => ({
      'Name': t.name,
      'UserName': t.username,
      'Password': t.password,
      'TOTP Key': t.totpkey,
      'Current TOTP Key': t.curtotpkey,
      'Url': t.url,
    }));
    setExceldata(data);
  }

  useEffect(() => {
    getexcelDatas();
  }, [password])

  //  Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'PASSWORDS LIST',
    pageStyle: 'print'
  });

  //  PDF
  const downloadPdf = () => {
    const doc = new jsPDF()
    autoTable(doc, { html: '#passwordtable' })
    doc.save('Passwords List.pdf')
  }

  // Sorting
  const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
    setSorting({ column, direction });
  };

  const sortedData = password.sort((a, b) => {
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
  const filteredDatas = password.length > 0 && password.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredData = filteredDatas.length > 0 && filteredDatas.slice((page - 1) * pageSize, page * pageSize);

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
      <Headtitle title={'Passwords List'} />
      {/* header text */}
      <Typography sx={userStyle.HeaderText}>Passwords<Typography sx={userStyle.SubHeaderText} component="span">Manage your passwords</Typography></Typography>
      {/* content start */}
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item md={2} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={userStyle.importheadtext}></Typography>
          </Grid>
          <Grid item md={8} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Grid >
              {isUserRoleCompare[0]?.csvpassword && (
                <>
                  <ExportCSV fileName={fileName} csvData={exceldata} />
                </>
              )}
              {isUserRoleCompare[0]?.excelpassword && (
                <>
                  <ExportXL fileName={fileName} csvData={exceldata} />
                </>
              )}
              {isUserRoleCompare[0]?.printpassword && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={handleprint} >&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                </>
              )}
              {isUserRoleCompare[0]?.pdfpassword && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()} ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                </>
              )}
            </Grid>
          </Grid>
          <Grid item sm={12} xs={12} md={2} sx={{ display: "flex", justifyContent: "center" }} >
            {isUserRoleCompare[0]?.apassword && (
              <>
                <Link to="/passwords/password/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
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
              <MenuItem value={(password.length)}>All</MenuItem>
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
          <Box>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700, }} aria-label="customized table" id="usertable" >
                <TableHead sx={{ fontWeight: "600" }}>
                  <StyledTableRow>
                    <StyledTableCell>Actions</StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('logo')}><Box sx={userStyle.tableheadstyle}><Box>Logo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('log')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('name')}><Box sx={userStyle.tableheadstyle}><Box>Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('name')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('username')}><Box sx={userStyle.tableheadstyle}><Box>User Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('username')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('password')}><Box sx={userStyle.tableheadstyle}><Box>Password</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('password')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('totpkey')}><Box sx={userStyle.tableheadstyle}><Box>TOTP Key</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('totpkey')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('curtotpkey')}><Box sx={userStyle.tableheadstyle}><Box>Current TOTP Key</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('curtotpkey')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('url')}><Box sx={userStyle.tableheadstyle}><Box>Url</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('url')}</Box></Box></StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody align="left">
                  {filteredData.length > 0 ?
                    (filteredData.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>
                          <Grid sx={{ display: 'flex' }}>
                            {isUserRoleCompare[0]?.epassword && (
                              <>
                                <Link to={`/passwords/password/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff' }}><Button sx={userStyle.buttonedit}><EditOutlinedIcon style={{ fontSize: "small" }} /></Button></Link>
                              </>
                            )}
                            {isUserRoleCompare[0]?.vpassword && (
                              <>
                                <Link to={`/passwords/password/view/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'small' }} /></Button></Link>
                              </>
                            )}
                            {isUserRoleCompare[0]?.dpassword && (
                              <>
                                <Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowData(row._id) }} ><DeleteOutlineOutlinedIcon style={{ fontSize: 'small' }} /></Button>
                              </>
                            )}
                          </Grid>
                        </StyledTableCell>
                        <StyledTableCell >{row.logo ? <img src={row.logo} style={{ width: '50px', height: '50px' }} /> : ""}</StyledTableCell>
                        <StyledTableCell>{row.name}</StyledTableCell>
                        <StyledTableCell>{row.username}</StyledTableCell>
                        <StyledTableCell ><TextField value={row.password}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                border: 'none',
                              },
                            },
                          }}
                          type={ispassword[index] ? "text" : "password"}>
                        </TextField>
                          <Grid sx={{ display: "flex", justifyContent: "center" }} >
                            {ispassword[index] ?
                              <VisibilityOffIcon fontSize="small" sx={{ cursor: "pointer", }} onClick={() => { togglePasswordVisibility(index) }} />
                              : <VisibilityIcon fontSize="small" sx={{ cursor: "pointer", }} onClick={() => { togglePasswordVisibility(index) }} />
                            }
                          </Grid>
                        </StyledTableCell>
                        <StyledTableCell>{row.totpkey}</StyledTableCell>
                        <StyledTableCell>{row.curtotpkey}</StyledTableCell>
                        <StyledTableCell>{row.url}</StyledTableCell>
                      </StyledTableRow>
                    )))
                    : <StyledTableRow><StyledTableCell colSpan={8} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
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
            {/* Table End */}
            <br />
            <br />
            {pageSize != 1 ? <Grid >
              {isUserRoleCompare[0]?.apassword && (
                <>
                  <Link to="/passwords/password/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
                </>
              )}<br /><br />
            </Grid> : null}
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
            </Box>
          </>
        )}

        {/* PRINT START */}
        <Box sx={userStyle.printcls}>
          <>
            <Box>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="passwordtable" ref={componentRef}>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>User Name</StyledTableCell>
                      <StyledTableCell>Password</StyledTableCell>
                      <StyledTableCell>TOTP Key</StyledTableCell>
                      <StyledTableCell>Current TOTP Key</StyledTableCell>
                      <StyledTableCell>Url</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody align="left">
                    {password.length > 0 && (
                      password.map((row, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{row.name}</StyledTableCell>
                          <StyledTableCell>{row.username}</StyledTableCell>
                          <StyledTableCell>{row.password}</StyledTableCell>
                          <StyledTableCell>{row.totpkey}</StyledTableCell>
                          <StyledTableCell>{row.curtotpkey}</StyledTableCell>
                          <StyledTableCell>{row.url}</StyledTableCell>
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
          <Button onClick={(e) => deleteData(passwordid)} autoFocus variant="contained" color='error'> OK </Button>
        </DialogActions>
      </Dialog>
      { /* Table End */}
    </Box>
  );
}

function Passwordlist() {
  return (
    <>
      <Passwordlists /><br /><br /><br />
      <Footer /><br /><br />
    </>
  );
}

export default Passwordlist;