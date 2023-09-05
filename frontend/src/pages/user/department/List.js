import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Select, MenuItem, FormControl, OutlinedInput, Table, TableBody, TableContainer, TableHead, Paper, Button, Grid, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { FaPrint, FaFilePdf, } from 'react-icons/fa';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Link } from 'react-router-dom';
import axios from 'axios';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { ExportXL, ExportCSV } from '../../Export';
import { toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Headtitle from '../../../components/header/Headtitle';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { useReactToPrint } from 'react-to-print';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Departmentlisttable() {

  const [department, setdepartments] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [isDepartment, setIsDepartments] = useState([]);
  const [exceldata, setExceldata] = useState([]);
  const [checkUser, setCheckUser] = useState([])

  // Datatable 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");

  //role access
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);
  const { auth, setngs } = useContext(AuthContext);

  //delete modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [departmentdel, setDepartmentDel] = useState({});
  const handleClickOpen = () => { setIsDeleteOpen(true); };
  const handleClose = () => { setIsDeleteOpen(false); };

  // check delete
  const [isCheckOpen, setIsCheckOpen] = useState(false);
  const handleClickOpenCheck = () => { setIsCheckOpen(true); };
  const handleCloseCheck = () => { setIsCheckOpen(false); };

  //  Fetch department Data
  const fetchDepartments = async () => {
    try {
      let res = await axios.post(SERVICE.DEPARTMENT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      setdepartments(res?.data?.departments);
      setIsDepartments(res?.data?.departments);
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
  };

  //  get particular columns for export excel
  const getexcelDatas = async () => {

    var data = isDepartment.map((t,index) => ({
      sno: index+1 ,id: t.departmentid, name: t.departmentname
    }));
    setExceldata(data);
  }

  //alert delete popup
  const rowData = async (id, departmentname) => {
    try {
      const [
        res, req
      ] = await Promise.all([
        axios.get(`${SERVICE.DEPARTMENT_SINGLE}/${id}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          }
        }),
        axios.post(SERVICE.USER_DELETE_DEPARTMENT_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checkdepartment: String(departmentname)
        })
      ])

      setDepartmentDel(res?.data?.sdepartment);
      setCheckUser(req?.data?.users)
      if ((req?.data?.users).length > 0) {
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
  let deparatmentid = departmentdel._id;

  const deleteDepartment = async (deparatmentid) => {
    try {
      let res = await axios.delete(`${SERVICE.DEPARTMENT_SINGLE}/${deparatmentid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      await fetchDepartments();
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

  useEffect(
    () => {
      fetchDepartments();
    }, []
  );

  useEffect(
    () => {
      getexcelDatas();
    }, [department]
  )

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = department?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  }

  useEffect(() => {
    addSerialNumber();
  }, [department])


  // Export Excel
  const fileName = 'Department'

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Department',
    pageStyle: 'print'
  });

  //pdf
  const columns = [{ title: "DEPARTMENT ID", field: "departmentid", }, { title: "DEPARTMENT NAME", field: "departmentname", }]  // PDF

  // const downloadPdf = () => {
  //   const newData = isDepartment.map(row => {
  //     delete row._id;
  //     delete row.__v;
  //     delete row.createdAt;
  //     delete row.assignbusinessid;
  //     return row
  //   })
  //   const doc = new jsPDF();
  //   doc.autoTable({ theme: "grid", columns: columns.map(col => ({ ...col, dataKey: col.field })), body: isDepartment })
  //   doc.save('departments.pdf')
  // }
  const downloadPdf = () => {
    const newData = isDepartment.map((row, index) => {
      delete row._id;
      delete row.__v;
      delete row.createdAt;
      delete row.assignbusinessid;
      row.serialNumber = index + 1; // Add serial number to each row
      return row;
    });
    const doc = new jsPDF();
    const updatedColumns = [
      { title: "Serial Number", dataKey: "serialNumber" }, // Serial number column
      ...columns.map(col => ({ ...col, dataKey: col.field }))
    ];
    doc.autoTable({
      theme: "grid",
      columns: updatedColumns,
      body: newData
    });
    doc.save('departments.pdf');
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

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box>
      <Headtitle title={'Departments'} />
      {/* header text */}
      <Typography sx={userStyle.HeaderText}>Departments<Typography component="span" sx={userStyle.SubHeaderText}>Manage your departments</Typography></Typography>
      {/* content start */}
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item md={2} sm={12} xs={12}  ></Grid>
          <Grid item md={8} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }} >
            <Grid>
              {isUserRoleCompare[0]?.exceldepartment && (
                <>
                  <ExportCSV csvData={exceldata} fileName={fileName} />
                </>
              )}
              {isUserRoleCompare[0]?.csvdepartment && (
                <>
                  <ExportXL csvData={exceldata} fileName={fileName} />
                </>
              )}
              {isUserRoleCompare[0]?.printdepartment && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                </>
              )}
              {isUserRoleCompare[0]?.pdfdepartment && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                </>
              )}
            </Grid>

          </Grid>
          <Grid item md={2} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }} >
            {isUserRoleCompare[0]?.adepartment && (
              <>
                <Link to="/user/department/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd} >ADD</Button></Link>
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
              <MenuItem value={(department.length)}>All</MenuItem>
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
        {isLoader ? (
          <>
            <TableContainer component={Paper} sx={userStyle.tablecontainer}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table" >
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell >Actions</StyledTableCell>
                    <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                    <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('departmentid')}><Box sx={userStyle.tableheadstyle}><Box>Department ID</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('departmentid')}</Box></Box></StyledTableCell>
                    <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('departmentname')}><Box sx={userStyle.tableheadstyle}><Box>Department Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('departmentname')}</Box></Box></StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody align="left">
                  {filteredData.length > 0 ?
                    (filteredData.map((row, index) => (
                      <StyledTableRow >
                        <StyledTableCell component="th" scope="row">
                          <Grid sx={{ display: 'flex' }}>
                            {isUserRoleCompare[0]?.edepartment && (
                              <>
                                <Link to={`/user/department/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff' }}><Button sx={userStyle.buttonedit}><EditOutlinedIcon style={{ fontSize: "large" }} /></Button></Link>

                              </>
                            )}
                            {isUserRoleCompare[0]?.ddepartment && (
                              <>
                                <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(row._id, row.departmentname) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                              </>
                            )}
                            {isUserRoleCompare[0]?.vdepartment && (
                              <>
                                <Link to={`/user/department/view/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                              </>
                            )}
                          </Grid>
                        </StyledTableCell>
                        <StyledTableCell>{row.serialNumber}</StyledTableCell>
                        <StyledTableCell >{row.departmentid}</StyledTableCell>
                        <StyledTableCell>{row.departmentname}</StyledTableCell>
                      </StyledTableRow>
                    )))
                    : <StyledTableRow><StyledTableCell colSpan={5} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
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
              {isUserRoleCompare[0]?.adepartment && (
                <>
                  <Link to="/user/department/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd} >ADD</Button></Link>
                </>
              )}<br /> <br />
            </Grid> : null}
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
            </Box>
          </>
        )}
      </Box>
      { /* content end */}

      { /* ****** Print ****** */}
      <Box sx={userStyle.printcls} >
        <Box>
          <Typography variant='h5' >Department</Typography>
        </Box>
        <>
          <Box>
            <TableContainer component={Paper} sx={userStyle.printcls}>
              <Table aria-label="simple table" id="departmenttable" ref={componentRef}>
                <TableHead sx={{ fontWeight: "600" }} >
                  <StyledTableRow >
                  <StyledTableCell>Sno</StyledTableCell>
                    <StyledTableCell ><b>Department ID</b></StyledTableCell>
                    <StyledTableCell ><b>Department Name</b></StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {isDepartment && (
                    isDepartment.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{row.departmentid}</StyledTableCell>
                        <StyledTableCell >{row.departmentname}</StyledTableCell>
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
          <Button onClick={(e) => deleteDepartment(deparatmentid)} autoFocus variant="contained" color='error'> OK </Button>
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
            {checkUser?.length > 0 ? (
              <>
                <span style={{ fontWeight: '700', color: '#777' }}>
                  {`${departmentdel.departmentname} `}
                </span>
                was linked in <span style={{ fontWeight: '700' }}>User</span>
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

function Departmentlist() {
  return (
    <>
      <Departmentlisttable /><br /><br /><br />
          <Footer />
    </>
  );
}
export default Departmentlist;