import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Select, MenuItem, FormControl, OutlinedInput, Table, TableBody, TableContainer, TableHead, Paper, Button, Grid, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { FaPrint, FaFilePdf, } from 'react-icons/fa';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { Link } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import axios from 'axios';
import jsPDF from "jspdf";
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';
import Headtitle from '../../../components/header/Headtitle';
import { ExportXL, ExportCSV } from '../../Export';
import autoTable from 'jspdf-autotable';

function Brandtable() {

  const { auth, setngs } = useContext(AuthContext);
  const [isLoader, setIsLoader] = useState(false);
  const [brands, setBrands] = useState([]);
  const [cats, setCats] = useState({});
  const [checkProdBrand, setCheckProdBrand] = useState([])
  const [checkGroupBrand, setCheckGroupBrand] = useState([])
  const [checkStockBrand, setCheckStockBrand] = useState([])

  // Datatable 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [exceldata, setExceldata] = useState([]);

  // Access
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  //delete modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => { setIsDeleteOpen(true); };
  const handleClose = () => { setIsDeleteOpen(false); };

  // check delete
  const [isCheckOpen, setIsCheckOpen] = useState(false);
  const handleClickOpenCheck = () => { setIsCheckOpen(true); };
  const handleCloseCheck = () => { setIsCheckOpen(false); };

  //  Fetch Category Data
  const fetchBrand = async () => {
    try {
      let res = await axios.post(SERVICE.BRAND, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      setBrands(res?.data?.brands);
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

  const rowData = async (id, brandname, brandshortname) => {
    try {
      const [
        res, reqprod, reqgrp, reqstock
      ] = await Promise.all([
        axios.get(`${SERVICE.BRAND_SINGLE}/${id}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
        }),
        axios.post(SERVICE.PRODUCT_DELETE_BRAND_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checkbrand: String(brandname)
        }),
        axios.post(SERVICE.GROUP_DELETE_BRAND_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checkbrand: String(brandname)
        }),
        axios.post(SERVICE.STOCK_DELETE_BRAND_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checkbrandshortname: String(brandshortname)
        })
      ])
      setCats(res?.data?.sbrand); //set function to get particular row
      setCheckProdBrand(reqprod?.data?.products)
      setCheckGroupBrand(reqgrp?.data?.groups)
      setCheckStockBrand(reqstock?.data?.stock)
      if ((reqprod?.data?.products)?.length > 0 || (reqgrp?.data?.groups)?.length > 0 || (reqgrp?.data?.stock)?.length > 0) {
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
  let catid = cats._id;

  const deleteCats = async (catid) => {
    try {
      let res = await axios.delete(`${SERVICE.BRAND_SINGLE}/${catid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      await fetchBrand();
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
      fetchBrand();
    }, []
  );

  // Export Excel
  const fileName = 'Brands'

  //  get particular columns for export excel
  const getexcelDatas = async () => {
    var data = brands.map((t, i) => (
      {
        "SI.NO": i + 1,
        "Brand Name": t.brandname,
        "Brand Short Name": t.brandshortname,
        "Brand Code": t.brandcode,
        "Sub brand Name": t.subbrands.map(d => d.subbrandname).join(","),
        "Sub brand Short Name": t.subbrands.map(d => d.subbrandshotname).join(","),
        "Sub brand Code": t.subbrands.map(d => d.subbrandcode).join(",")
      }));
    setExceldata(data);
  }

  useEffect(
    () => {
      getexcelDatas()
    }, [brands]
  );

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Brands',
    pageStyle: 'print'
  });

  // PDF
  const downloadPdf = () => {
    const doc = new jsPDF();
    autoTable(doc, { html: '#brandid' });
    doc.save('Brands.pdf')
  }

  // Sort
  const addSerialNumber = () => {
    const itemsWithSerialNumber = brands?.map((item, index) => ({ ...item, sno: index + 1 }));
    setItems(itemsWithSerialNumber);
  }

  useEffect(() => {
    addSerialNumber();
  }, [brands])

  // Sorting
  const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
    setSorting({ column, direction });
  };

  const sortedData = items?.sort((a, b) => {
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
      <Headtitle title={'Brands'} />
      {/* header text */}
      <Typography sx={userStyle.HeaderText}>Brand List</Typography>
      {/* content start */}
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item md={2} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }} >
            <Typography sx={userStyle.HeaderText}> Brands</Typography></Grid>
          <Grid item md={8} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Grid>
              {isUserRoleCompare[0]?.excelbrand && (
                <>
                  <ExportCSV csvData={exceldata} fileName={fileName} />
                </>
              )}
              {isUserRoleCompare[0]?.csvbrand && (
                <>
                  <ExportXL csvData={exceldata} fileName={fileName} />
                </>
              )}
              {isUserRoleCompare[0]?.printbrand && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                </>
              )}
              {isUserRoleCompare[0]?.pdfbrand && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                </>
              )}

            </Grid>
          </Grid>
          <Grid item md={2} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            {isUserRoleCompare[0]?.addbrand && (
              <>
                <Link to="/product/brand/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd} >ADD</Button></Link>
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
              <MenuItem value={(brands.length)}>All</MenuItem>
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
            {/* Table Start */}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell onClick={() => handleSorting('sno')}><Box sx={userStyle.tableheadstyle}><Box>SI.No</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sno')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('brandname')}><Box sx={userStyle.tableheadstyle}><Box>Brand Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('brandname')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('brandshortname')}><Box sx={userStyle.tableheadstyle}><Box>Brand Short Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('brandshortname')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('brandcode')}><Box sx={userStyle.tableheadstyle}><Box>Brand Code</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('brandcode')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('subbrands')}><Box sx={userStyle.tableheadstyle}><Box>Sub Brand Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subbrands')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('subbrands')}><Box sx={userStyle.tableheadstyle}><Box>Sub Brand Short Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subbrands')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('subbrands')}><Box sx={userStyle.tableheadstyle}><Box>Sub Brand Code</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subbrands')}</Box></Box></StyledTableCell>
                    <StyledTableCell >Action</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody align="left">
                  {filteredData.length > 0 ?
                    (filteredData.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">{item.sno}</StyledTableCell>
                        <StyledTableCell>{item.brandname}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{item.brandshortname}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{item.brandcode}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{item.subbrands.map(d => d.subbrandname).join(",")}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{item.subbrands.map(d => d.subbrandshotname).join(",")}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{item.subbrands.map(d => d.subbrandcode).join(",")}</StyledTableCell>
                        <StyledTableCell>
                          <Grid sx={{ display: 'flex' }}>
                            {isUserRoleCompare[0]?.editbrand && (
                              <>
                                <Link to={`/product/brand/edit/${item._id}`} style={{ textDecoration: 'none', color: '#fff' }}><Button sx={userStyle.buttonedit}><EditOutlinedIcon style={{ fontSize: "large" }} /></Button></Link>
                              </>
                            )}
                            {isUserRoleCompare[0]?.deletebrand && (
                              <>
                                <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(item._id, item.brandname, item.brandshortname) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                              </>
                            )}
                            {isUserRoleCompare[0]?.viewbrand && (
                              <>
                                <Link to={`/product/brand/view/${item._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                              </>
                            )}
                          </Grid>
                        </StyledTableCell>

                      </StyledTableRow>
                    )))
                    : <StyledTableRow><StyledTableCell colSpan={9} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
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
            {/* Table End */}
            <br />
            <br />
            {pageSize != 1 ? <Grid >
              {isUserRoleCompare[0]?.addbrand && (
                <>
                  <Link to="/product/brand/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd} >ADD</Button></Link>
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

      </Box>
      { /* content end */}
      {/* Print layout */}
      {/* ****** Table Start ****** */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="brandid" ref={componentRef}>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>SI.No</StyledTableCell>
              <StyledTableCell>Brand Name</StyledTableCell>
              <StyledTableCell>Brand Short Name</StyledTableCell>
              <StyledTableCell>Brand Code</StyledTableCell>
              <StyledTableCell>Sub Brand Name</StyledTableCell>
              <StyledTableCell>Sub Brand Short Name</StyledTableCell>
              <StyledTableCell>Sub Brand Code</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody align="left">
            {brands &&
              (brands.map((item, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">{index + 1}</StyledTableCell>
                  <StyledTableCell>{item.brandname}</StyledTableCell>
                  <StyledTableCell component="th" scope="row">{item.brandshortname}</StyledTableCell>
                  <StyledTableCell component="th" scope="row">{item.brandcode}</StyledTableCell>
                  <StyledTableCell component="th" scope="row">{item.subbrands.map(d => d.subbrandname).join(",")}</StyledTableCell>
                  <StyledTableCell component="th" scope="row">{item.subbrands.map(d => d.subbrandshotname).join(",")}</StyledTableCell>
                  <StyledTableCell component="th" scope="row">{item.subbrands.map(d => d.subbrandcode).join(",")}</StyledTableCell>
                </StyledTableRow>
              ))
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
          <Button onClick={(e) => deleteCats(catid)} autoFocus variant="contained" color='error'> OK </Button>
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
            {checkProdBrand?.length > 0 && checkGroupBrand?.length > 0 && checkStockBrand?.length > 0
              ? (
                <>
                  <span style={{ fontWeight: '700', color: '#777' }}>
                    {`${cats.brandname} `}
                  </span>
                  was linked in <span style={{ fontWeight: '700' }}>Product, Group & Stock</span>
                </>
              ) : checkProdBrand?.length > 0 || checkGroupBrand?.length > 0 || checkStockBrand?.length > 0
                ? (
                  <>
                    <span style={{ fontWeight: '700', color: '#777' }}>
                      {`${cats.brandname} `}
                    </span>
                    was linked in{' '}
                    <span style={{ fontWeight: '700' }}>
                      {checkProdBrand?.length ? ' Product' : ''}
                      {checkGroupBrand?.length ? ' Group' : ''}
                      {checkStockBrand?.length ? ' Stock' : ''}
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

function Brandlist() {
  return (
    <>
       <Brandtable /><br /><br /><br /><br />
        <Footer />
    </>
  );
}
export default Brandlist;