import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Table, TableBody, TableContainer, DialogTitle, DialogContentText, TableHead, OutlinedInput, Paper, FormControl, InputLabel, Select, MenuItem, Button, Grid, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import Footer from '../../../components/footer/Footer';
import Headtitle from '../../../components/header/Headtitle';
import { FaPrint, FaFilePdf, } from 'react-icons/fa';
import { ExportXL, ExportCSV } from '../../Export';
import { userStyle } from '../../PageStyle';
import { useReactToPrint } from "react-to-print";
import { ThreeDots } from 'react-loader-spinner';
import autoTable from 'jspdf-autotable';
import jsPDF from "jspdf";
import Createfolder from "./Create";
import { SERVICE } from "../../../services/Baseservice"
import axios from "axios";
import { toast } from "react-toastify";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Selects from "react-select";
import AddIcon from '@mui/icons-material/Add';
import { AuthContext } from '../../../context/Appcontext';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { Link } from 'react-router-dom';

function Passwordfolderlist() {

  const [exceldata, setExceldata] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [folder, setFolder] = useState([]);
  const [isFolder, setIsFolder] = useState({ foldername: "" })
  const [list, setList] = useState({ status: "" })
  const [fetchFolderName, setFetchFolderName] = useState("")
  const [pwdName, setPwdName] = useState([])
  const [selectedValueedit, setSelectedValueedit] = useState([]);
  const [selectedValuePass, setSelectedValuePass] = useState([]);
  const [selectedunits, setselectedunits] = useState([]);

  // Datatable 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");

  // Access
  const { auth, setngs } = useContext(AuthContext);
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  // Popup
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleOpen = () => { setIsErrorOpen(true); };
  const handleCloseError = () => { setIsErrorOpen(false); };

  //  Error popup
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => { setIsDeleteOpen(true) };
  const handleClose = () => { setIsDeleteOpen(false) };

  //  add passwords into folder popup
  const [isOpen, setIsOpen] = useState(false)
  const handlePopupOpen = () => { setIsOpen(true) };
  const handlePopupClose = () => { setIsOpen(false) };

  //  edit passwords into folder popup
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const handlePopupOpenEdit = () => { setIsOpenEdit(true) };
  const handlePopupCloseEdit = () => { setIsOpenEdit(false) };

  //  Fetch Folder Data
  const fetchFolder = async () => {
    try {
      let res = await axios.post(SERVICE.FOLDER, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      })
      setFolder(res.data.folders);
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

  //  Fetch Passwords Data
  const fetchPasswordsName = async () => {
    try {
      let res = await axios.post(SERVICE.PASSWORD, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });

      setPwdName(res.data.passwords.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      })))
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  }

  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.FOLDER_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      })
      setIsFolder(res?.data?.sfolder);//set function to get particular row
    
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
  let folderid = isFolder._id;

  const deleteFolder = async (folderid) => {
    try {
      await axios.delete(`${SERVICE.FOLDER_SINGLE}/${folderid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      })
      await fetchFolder();
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

  const handleChangeedit = (e) => {
    setSelectedValueedit(Array.isArray(e) ? e.map((x) => x.value) : []);
  };

  const addFolderData = async (folderid) => {
    try {
      await axios.put(`${SERVICE.FOLDER_SINGLE}/${folderid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        passwordnames: [...selectedValueedit]
      })
      toast.success("Updated Successfully!", {
        position: toast.POSITION.TOP_CENTER
      });
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };


  const getunitvalues = (e) => {
    setselectedunits(
      Array.isArray(e?.passwordnames)
        ? e?.passwordnames?.map((x) => ({
          ...x,
          label: x,
          value: x,
        }))
        : []
    );
  };

  const handlePassChange = (e) => {
    setSelectedValuePass(Array.isArray(e) ? e?.map((x) => x.value) : []);
  };
  const EditFolderData = async (folderid) => {
    try {
      let res = await axios.put(`${SERVICE.FOLDER_SINGLE}/${folderid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        foldername: String(isFolder.foldername),
        passwordnames: [...selectedValuePass == "" ? selectedunits : selectedValuePass]
      })
      setIsFolder(res.data)
      toast.success(res.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };


  const handleActivatetrue = async (id) => {
    if (list.status == "Activate") {
      setShowAlert("Already activated")
      handleOpen()
    }
    try {
      let res = await axios.put(`${SERVICE.FOLDER_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        status: "activate"
      })
      setIsFolder(res.data)
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  const handleActivatefalse = async (id) => {
    if (list.status == "Deactivate") {
      setShowAlert("Already Deactivated")
      handleOpen()
    }

    try {
      let res = await axios.put(`${SERVICE.FOLDER_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        status: "Deactivate"
      })
      toast.success(res.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
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
  const fileName = 'Folders List'
  // get particular columns for export excel
  const getexcelDatas = async () => {

    let dataxl = folder.map((data) => {
      delete data._id;
      delete data.createdAt;
      delete data.assignbusinessid;
      delete data.__v;
      delete data.passwordnames
      return data
    })
    setExceldata(dataxl);
  }

  useEffect(() => {
    getexcelDatas()
  }, [exceldata])

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'FOLDERS LIST',
    pageStyle: 'print'
  });

  //  PDF
  const downloadPdf = () => {
    const doc = new jsPDF()
    autoTable(doc, { html: '#folderslist' })
    doc.save('Folders List.pdf')
  }

  useEffect(() => {
    fetchFolder();
    fetchPasswordsName();
  }, [fetchFolderName])

  // Sorting
  const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
    setSorting({ column, direction });
  };

  const sortedData = folder.sort((a, b) => {
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
  const filteredDatas = folder?.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
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
      <Headtitle title={'Folder List'} />
      {/* header text */}
      <Typography sx={userStyle.HeaderText}>Folders<Typography sx={userStyle.SubHeaderText} component="span" >Manage your folders</Typography></Typography>
      {/* content start */}
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item xs={8}></Grid>
          <Grid item xs={4}>
            {isUserRoleCompare[0]?.afolder && (
              <>
                <Createfolder setFetchFolderName={setFetchFolderName} />
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
              <MenuItem value={(folder.length)}>All</MenuItem>
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
        <Grid container sx={userStyle.gridcontainer}>
          <Grid>
            {isUserRoleCompare[0]?.csvfolder && (
              <>
                <ExportCSV csvData={exceldata} fileName={fileName} />
              </>
            )}
            {isUserRoleCompare[0]?.excelfolder && (
              <>
                <ExportXL csvData={exceldata} fileName={fileName} />
              </>
            )}
            {isUserRoleCompare[0]?.printfolder && (
              <>
                <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
              </>
            )}
            {isUserRoleCompare[0]?.pdffolder && (
              <>
                <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
              </>
            )}
          </Grid>
        </Grid><br /><br />
        {isLoader ? (
          <>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700, }} aria-label="customized table" id="usertable" >
                <TableHead sx={{ fontWeight: "600" }}>
                  <StyledTableRow>
                    <StyledTableCell>Actions</StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('foldername')}><Box sx={userStyle.tableheadstyle}><Box>Folder Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('foldername')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('status')}><Box sx={userStyle.tableheadstyle}><Box>Status</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('status')}</Box></Box></StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody align="left">
                  {filteredData.length > 0 ?
                    (filteredData.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>
                          <Grid sx={{ display: 'flex' }}>
                            {isUserRoleCompare[0]?.efolder && (
                              <>
                                {row.status == "Deactivate" ? null : <Button onClick={() => { rowData(row._id); getunitvalues(row); }} sx={userStyle.buttonedit}><EditOutlinedIcon style={{ fontSize: "small" }} /></Button>}
                              </>
                            )}
                            {isUserRoleCompare[0]?.vfolder && (
                              <>
                                <Link to={`/passwords/folder/view/${row._id}`}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'small' }} /></Button></Link>
                              </>
                            )}
                            {isUserRoleCompare[0]?.dfolder && (
                              <>
                                <Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowData(row._id) }} ><DeleteOutlineOutlinedIcon style={{ fontSize: 'small' }} /></Button>
                              </>
                            )}
                            {isUserRoleCompare[0]?.addnewfolder && (
                              <>
                                {row.status == "Deactivate" ? null : <Button onClick={() => { handlePopupOpen(); rowData(row._id) }} sx={userStyle.buttonactivate}><AddIcon style={{ fontSize: 'small' }} /></Button>}
                              </>
                            )}
                          </Grid>
                        </StyledTableCell>
                        <StyledTableCell>{row.foldername}</StyledTableCell>
                        <StyledTableCell>
                          <FormControl variant="outlined" fullWidth>
                            <Select labelId="demo-simple-select-outlined-label" id="demo-simple-select-outlined"
                              defaultValue={row.status == "Deactivate" ? "Deactivate" : "Activate"}
                              onChange={(e) => { setList({ ...list, status: e.target.value }); }}
                            >
                              <MenuItem value="Activate" onClick={(e) => { handleActivatetrue(row._id) }}  >Activate</MenuItem>
                              <MenuItem value="Deactivate" onClick={(e) => { handleActivatefalse(row._id) }}>Deactivate</MenuItem>
                            </Select>
                          </FormControl>
                        </StyledTableCell>
                      </StyledTableRow>
                    )))
                    : <StyledTableRow><StyledTableCell colSpan={3} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
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
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
            </Box>
          </>
        )}

      </Box>
      {/* print layout */}
      <Box sx={userStyle.printcls} >
        <TableContainer component={Paper} >
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="folderslist" ref={componentRef}>
            <TableHead sx={{ fontWeight: "600", fontSize: "14px" }} >
              <StyledTableRow>
                <StyledTableCell>Folder Name</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody align="left">
              {folder.length > 0 &&
                (folder?.map((row, index) => (
                  <StyledTableRow key={index} >
                    <StyledTableCell>{row.foldername}</StyledTableCell>
                    <StyledTableCell>{row.status} </StyledTableCell>
                  </StyledTableRow>
                ))
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* Add passwords into folder popup */}
      <Box>
        <Dialog open={isOpen} minWidth="lg" PaperProps={{ style: { overflowY: 'visible' } }}>
          <DialogTitle sx={{ backgroundColor: '#e0e0e0', color: "#000", display: "flex" }}>
            <AddIcon />&nbsp;
            <Typography sx={{ marginTop: "1px", fontWeight: 700 }}>Add Password(s) to Folder</Typography>
          </DialogTitle>
          <DialogContent sx={{ padding: '20px', overflowY: 'visible' }}>
            {/* <Box> */}
            <DialogContentText id="alert-dialog-description">
              <Grid container spacing={3} sx={{ marginTop: '2px' }}>
                <Grid item md={12} lg={12}>
                  <Typography>Folder Name <b style={{ color: "red" }}>*</b></Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      sx={userStyle.input}
                      id="component-outlined"
                      type="text"
                      value={isFolder.foldername}
                    />
                  </FormControl>
                </Grid><br /><br />
                <Grid item md={12} lg={12}>
                  <FormControl fullWidth>
                    <Typography>Password</Typography>
                    <Selects
                      isMulti
                      name="units"
                      options={pwdName}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={handleChangeedit}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              {/* </Box> */}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePopupClose} variant="outlined" sx={userStyle.buttoncancel}>Cancel</Button>
            <Button onClick={() => { addFolderData(isFolder._id); handlePopupClose() }} autoFocus variant="contained" color='error' sx={userStyle.buttonadd}> OK </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Edit Passwords into folder popup */}
      <Dialog open={isOpenEdit} minWidth="lg" PaperProps={{ style: { overflowY: 'visible' } }}>
        <DialogTitle sx={{ backgroundColor: '#e0e0e0', color: "#000", display: "flex" }}>
          <EditOutlinedIcon />&nbsp;
          <Typography sx={{ marginTop: "1px", fontWeight: 700 }}>Edit Password(s) to Folder</Typography>
        </DialogTitle>
        <DialogContent sx={{ padding: '20px', overflowY: 'visible' }}>
          <Box>
            <Grid container spacing={3} sx={{ marginTop: '2px' }}>
              <Grid item md={12} lg={12}>
                <Typography>Folder Name <b style={{ color: "red" }}>*</b></Typography>
                <FormControl size="small" fullWidth>
                  <OutlinedInput
                    sx={userStyle.input}
                    id="component-outlined"
                    type="text"
                    value={isFolder.foldername}
                    onChange={(e) => { setIsFolder({ ...isFolder, foldername: e.target.value }); }}
                  />
                </FormControl>
              </Grid><br /><br />
              <Grid item md={12} lg={12}>
                <FormControl fullWidth>
                  <Typography>Password</Typography>
                  <Selects
                    isMulti
                    name="password"
                    options={pwdName}
                    defaultValue={selectedunits}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handlePassChange}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePopupCloseEdit} variant="outlined" sx={userStyle.buttoncancel}>Cancel</Button>
          <Button onClick={() => { EditFolderData(isFolder._id); handlePopupCloseEdit() }} autoFocus variant="contained" color='error' sx={userStyle.buttonadd}> OK </Button>
        </DialogActions>
      </Dialog>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
            <Typography variant="h6" >{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseError} >ok</Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* DELETE DIALOG */}
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
          <Button onClick={(e) => deleteFolder(folderid)} autoFocus variant="contained" color='error'> OK </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function Passwordfolder() {
  return (
    <>
      <Passwordfolderlist /><br /><br /><br />
        <Footer /><br /><br />
    </>
  )
}

export default Passwordfolder;