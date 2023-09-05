import React, { useEffect, useState, useContext, useRef } from 'react';
import { Button, Box, OutlinedInput, Typography, FormControl, Grid, Select, MenuItem, Table, TableHead, TableContainer, TableBody, Dialog, DialogContent, DialogActions, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import { userStyle } from '../../PageStyle';
import axios from 'axios';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import { ThreeDots } from 'react-loader-spinner';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';

function AlpharateListtable() {

  const [isAlpha, setIsAlpha] = useState([]);
  const { auth, setngs } = useContext(AuthContext);
  const [isLoader, setIsLoader] = useState(false);
  const [Alpha, setAlpha] = useState("");

  // Datatable
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");

  // User Access
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  //popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpen = () => { setIsErrorOpen(true); };
  const handleClose = () => {
    setIsErrorOpen(false);
    // window.location.reload();
  };

  // Alpha Rates
  const fetchAlpha = async () => {
    try {
      let res = await axios.post(SERVICE.ALPHARATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      setIsAlpha(res?.data?.alpharates);
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
  useEffect(
    () => {
      fetchAlpha();
    }, [isAlpha])

  const messages = "Another one is Activated";

  const [showData, setShowData] = useState(true);

  //Activate and Deactivate
  const handleActivatetrue = async (id) => {
    try {
      let getrow = await axios.get(`${SERVICE.ALPHARATE_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      let getActivate = getrow?.data?.salpharate?.activate;

      let status = isAlpha.map(data => data.activate);

      const hasActivatedItem = status.includes(true);

      if (getActivate === true) {
        setShowAlert(messages);
        handleClickOpen();
      } else if (hasActivatedItem) {
        axios.put(`${SERVICE.ALPHARATE_SINGLE}/${id}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          activate: false,
        });

        setShowAlert(messages);
        handleClickOpen();
      } else {
        axios.put(`${SERVICE.ALPHARATE_SINGLE}/${id}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          activate: true,
        }).then(res => res.data);
      }
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  // useEffect(
  //   () => {
  //     handleActivatetrue();
  //   }, [])

  const handleActivatefalse = async (id) => {
    try {
      let getrow = await axios.get(`${SERVICE.ALPHARATE_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      let getActivate = getrow?.data?.salpharate?.activate;
      await axios.put(`${SERVICE.ALPHARATE_SINGLE}/${id}`, {
        activate: false,
      }).then(res => res.data);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  const deleteAlpha = async (id) => {
    try {
      let delalpha = await axios.delete(`${SERVICE.ALPHARATE_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      toast.success(delalpha?.data?.message);
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
      fetchAlpha();
    }, [deleteAlpha]
  )

  // Sorting
  const addSerialNumber = () => {
    const itemsWithSerialNumber = isAlpha?.map((item, index) => ({ ...item, sno: index + 1 }));
    setItems(itemsWithSerialNumber);
  }

  useEffect(() => {
    addSerialNumber();
  }, [isAlpha])

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
  //Datatable
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
      <Headtitle title={'Alpharates'} />
      <Grid sx={{ display: 'flex' }}>
        <Typography sx={userStyle.HeaderText}>Alpharate </Typography> &nbsp;
        <Typography sx={userStyle.SubHeaderText} style={{ marginTop: "22px" }}>Manage your alpharate settings</Typography>
      </Grid>
      <Box sx={userStyle.container}>
        <Box>
          { /* Table header  */}
          <Grid container>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>All your Alpharate settings</Typography>
            </Grid>
            <Grid item xs={4} sx={{ textAlign: 'right !important' }}>
              {isUserRoleCompare[0]?.aalpharate && (<Link to="/settings/alpharate/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>)}
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
                <MenuItem value={(isAlpha.length)}>All</MenuItem>
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
          </Grid>
          {isLoader ? (
            <>
              {/* Table start */}
              <TableContainer component={Paper} sx={{ boxShadow: 'none', marginTop: "30px" }}>
                <Table aria-label="customized table" id="alphatable" sx={{ margin: '25px' }}>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell onClick={() => handleSorting('sno')}><Box sx={userStyle.tableheadstyle}><Box>Sno </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sno')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting('alphaid')}><Box sx={userStyle.tableheadstyle}><Box>Alpha ID </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('alphaid')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting('status')}><Box sx={userStyle.tableheadstyle}><Box>Status</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('status')}</Box></Box></StyledTableCell>
                      <StyledTableCell align="left">Action</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.length > 0 ?
                      (filteredData.map((row, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="left">{row.sno}</StyledTableCell>
                          <StyledTableCell align="left">{row.alphaid}</StyledTableCell>
                          <StyledTableCell align="left">
                            <FormControl fullWidth>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                size="small"
                                value={row.activate ? "true" : "false"}
                              >
                                <MenuItem value={'true'} onClick={(e) => {
                                  handleActivatetrue(row._id)
                                }
                                }>Activate</MenuItem>

                                <MenuItem value={'false'} onClick={(e) => handleActivatefalse(row._id)}>Deactivate</MenuItem>
                              </Select>
                            </FormControl>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {isUserRoleCompare[0]?.valpharate && (
                              <>
                                <Link to={`/settings/alpharate/view/${row._id}`} style={{ textDecoration: 'none', color: 'white' }}><Button variant="contained" size='small' sx={userStyle.buttonview}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                              </>
                            )}
                          </StyledTableCell>
                        </StyledTableRow>
                      )))
                      : <StyledTableRow><StyledTableCell colSpan={4} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                    }
                  </TableBody>
                </Table>
              </TableContainer>
              <br /><br />
              <Box style={userStyle.dataTablestyle}>
                <Box>
                  Showing {filteredData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
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
              {/* Table end */}
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
              </Box>
            </>
          )}

        </Box>
      </Box>
      {/* ALERT DIALOG */}
      <Dialog
        open={isErrorOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
          <Typography>{showAlert}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleClose}>ok</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function Alpharatelist() {
  return (
    <>
      <AlpharateListtable /><br /><br /><br />
      <Footer />
    </>
  );
}

export default Alpharatelist;