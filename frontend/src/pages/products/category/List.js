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
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';
import Headtitle from '../../../components/header/Headtitle';
import { ExportXL, ExportCSV } from '../../Export';

function Categorieslisttable() {

  const { auth, setngs } = useContext(AuthContext);
  const [isLoader, setIsLoader] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cats, setCats] = useState({});
  const [checkProdCategory, setCheckProdCategory] = useState([])
  const [checkGrpCategory, setCheckGrpCategory] = useState([])
  const [checkStockCate, setCheckStockCate] = useState([])

  // Datatable 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");

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
  const fetchCategory = async () => {
    try {
      let res = await axios.post(SERVICE.CATEGORIES, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      setCategories(res?.data?.categories);
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

  const rowData = async (id, categoryname, categoryshotname) => {
    try {
      const [
        res, reqprod, reqgrp, reqstock
      ] = await Promise.all([
        axios.get(`${SERVICE.CATEGORIES_SINGLE}/${id}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
        }),
        axios.post(SERVICE.PRODUCT_DELETE_CATEGORY_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checkcategory: String(categoryname)
        }),
        axios.post(SERVICE.GROUP_DELETE_CATEGORY_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checkcategory: String(categoryname)
        }),
        axios.post(SERVICE.STOCK_DELETE_CATEGORY_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checkcategoryshortname: String(categoryshotname)
        }),
      ])
      setCats(res?.data?.scategory); //set function to get particular row
      setCheckProdCategory(reqprod?.data?.products)
      setCheckGrpCategory(reqgrp?.data?.groups)
      setCheckStockCate(reqstock?.data?.stock)
      if ((reqprod?.data?.products)?.length > 0 || (reqgrp?.data?.groups)?.length > 0 || (reqstock?.data?.stock)?.length > 0) {
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
      let res = await axios.delete(`${SERVICE.CATEGORIES_SINGLE}/${catid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      await fetchCategory();
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
      fetchCategory();
    }, []
  );

  // Export Excel
  const fileName = 'Category'

  //  get particular columns for export excel
  const getexcelDatas = async () => {
    var data = categories.map((t, index) => (
      {
        "Sno":index+1,
        "Category": t.categoryname,
        "Category Short Name": t.categoryshotname,
        "Category Code": t.categorycode,
        "Description": t.categorydescription,
        "Sub Category Name": t.subcategories.map(e => (e.subcategryname)).join(","),
        "Sub Category Short Name": t.subcategories.map(e => (e.subcategryshotname)).join(","),
        "Sub Category Code": t.subcategories.map(e => (e.subcategrycode)).join(",")
      }));
    setExceldata(data);
  }

  useEffect(
    () => {
      getexcelDatas()
    }, [categories]
  );

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Category',
    pageStyle: 'print'
  });

  //   // PDF
  //   const downloadPdf = () => {
  //     const newData = categories.map(row => {
  //       delete row._id;
  //       delete row.createdAt;
  //       delete row.__v;
  //       delete row.assignbusinessid;
  //       return row
  //     })
  //     const doc = new jsPDF();
  //     autoTable(doc, { html: '#categorytablepdf' });
  //     doc.save('Categories.pdf')
  //   }


  const columns = [
    { title: "Category Name", field: "Category" },
    { title: "Category Short Name", field: "Category Short Name" },
    { title: "Category Code", field: "Category Code" },
    { title: "Category Description", field: "Description" },
    { title: "Subcategry Name", field: "Sub Category Name" },
    { title: "Subcategry Short Name", field: "Sub Category Short Name" },
    { title: "Subcategry Code", field: "Sub Category Code" }

  ]
  const downloadPdf = () => {
    const newData = categories.map((row, index) => {
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
    doc.save('Categories.pdf');
  }
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = categories?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  }

  useEffect(() => {
    addSerialNumber();
  }, [categories])




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
      <Headtitle title={'Categorys'} />
      {/* header text */}
      <Typography sx={userStyle.HeaderText}>Categories<Typography component="span" sx={userStyle.SubHeaderText}>Manage your categories</Typography></Typography>
      {/* content start */}
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item md={2} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={userStyle.importheadtext}>All your categories</Typography></Grid>
          <Grid item md={8} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Grid>
              {isUserRoleCompare[0]?.excelsize && (
                <>
                  <ExportCSV csvData={exceldata} fileName={fileName} />
                </>
              )}
              {isUserRoleCompare[0]?.csvsize && (
                <>
                  <ExportXL csvData={exceldata} fileName={fileName} />
                </>
              )}
              {isUserRoleCompare[0]?.printcategory && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                </>
              )}
              {isUserRoleCompare[0]?.pdfcategory && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                </>
              )}

            </Grid>
          </Grid>
          <Grid item md={2} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            {isUserRoleCompare[0]?.acategory && (
              <>
                <Link to="/product/category/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd} >ADD</Button></Link>
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
        {isLoader ? (
          <Box>
            {/* Table Start */}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell >Action</StyledTableCell>
                    <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('categoryname')}><Box sx={userStyle.tableheadstyle}><Box>Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('categoryname')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('categoryshotname')}><Box sx={userStyle.tableheadstyle}><Box>Category Short Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('categoryshotname')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('categorycode')}><Box sx={userStyle.tableheadstyle}><Box>Category Code</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('categorycode')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('categorydescription')}><Box sx={userStyle.tableheadstyle}><Box>Description</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('categorydescription')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('subcategories')}><Box sx={userStyle.tableheadstyle}><Box>Sub Category Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subcategories')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('subcategories')}><Box sx={userStyle.tableheadstyle}><Box>Sub Category Short Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subcategories')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('subcategories')}><Box sx={userStyle.tableheadstyle}><Box>Sub Category Code</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subcategories')}</Box></Box></StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody align="left">
                  {filteredData.length > 0 ?
                    (filteredData.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>
                          <Grid sx={{ display: 'flex' }}>
                            {isUserRoleCompare[0]?.ecategory && (
                              <>
                                <Link to={`/product/category/edit/${item._id}`} style={{ textDecoration: 'none', color: '#fff' }}><Button sx={userStyle.buttonedit}><EditOutlinedIcon style={{ fontSize: "large" }} /></Button></Link>
                              </>
                            )}
                            {isUserRoleCompare[0]?.dcategory && (
                              <>
                                <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(item._id, item.categoryname, item.categoryshotname) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                              </>
                            )}
                            {isUserRoleCompare[0]?.vcategory && (
                              <>
                                <Link to={`/product/category/view/${item._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                              </>
                            )}
                          </Grid>
                        </StyledTableCell>
                        <StyledTableCell>{item.serialNumber}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{item.categoryname}</StyledTableCell>
                        <StyledTableCell>{item.categoryshotname}</StyledTableCell>
                        <StyledTableCell>{item.categorycode}</StyledTableCell>
                        <StyledTableCell>{item.categorydescription}</StyledTableCell>
                        <StyledTableCell>{item.subcategories.map((value) => value.subcategryname).join(",")}</StyledTableCell>
                        <StyledTableCell>{item.subcategories.map((value) => value.subcategryshotname).join(",")}</StyledTableCell>
                        <StyledTableCell>{item.subcategories.map((value) => value.subcategrycode).join(",")}</StyledTableCell>
                      </StyledTableRow>
                    )))
                    : <StyledTableRow><StyledTableCell colSpan={10} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
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
            <br /> <br />
            {pageSize != 1 ? <Grid >
              {isUserRoleCompare[0]?.acategory && (
                <>
                  <Link to="/product/category/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd} >ADD</Button></Link>
                </>
              )}<br /><br />
            </Grid> : null}
            {/* Table End */}
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
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="categorytablepdf" ref={componentRef}>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Sno</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Category Short Name</StyledTableCell>
              <StyledTableCell >Category Code</StyledTableCell>
              <StyledTableCell >Description</StyledTableCell>
              <StyledTableCell >Sub Category Name</StyledTableCell>
              <StyledTableCell >Sub Category Short Name</StyledTableCell>
              <StyledTableCell >Sub Category Code</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody align="left">
            {categories &&
              (categories.map((item, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell component="th" scope="row">{item.categoryname}</StyledTableCell>
                  <StyledTableCell>{item.categoryshotname}</StyledTableCell>
                  <StyledTableCell>{item.categorycode}</StyledTableCell>
                  <StyledTableCell>{item.categorydescription}</StyledTableCell>
                  <StyledTableCell>{item.subcategories.map((value) => value.subcategryname).join(",")}</StyledTableCell>
                  <StyledTableCell>{item.subcategories.map((value) => value.subcategryshotname).join(",")}</StyledTableCell>
                  <StyledTableCell>{item.subcategories.map((value) => value.subcategrycode).join(",")}</StyledTableCell>
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
            {checkProdCategory?.length > 0 && checkGrpCategory?.length > 0 && checkStockCate?.length > 0
              ? (
                <>
                  <span style={{ fontWeight: '700', color: '#777' }}>
                    {`${cats.categoryname} `}
                  </span>
                  was linked in <span style={{ fontWeight: '700' }}>Product & Group</span>
                </>
              ) : checkProdCategory?.length > 0 || checkGrpCategory?.length > 0 || checkStockCate?.length > 0
                ? (
                  <>
                    <span style={{ fontWeight: '700', color: '#777' }}>
                      {`${cats.categoryname} `}
                    </span>
                    was linked in{' '}
                    <span style={{ fontWeight: '700' }}>
                      {checkProdCategory?.length ? ' Product' : ''}
                      {checkGrpCategory?.length ? ' Group' : ''}
                      {checkStockCate?.length ? ' Stock' : ''}
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

function Categorieslist() {
  return (
    <>
       <Categorieslisttable /><br /><br /><br /><br />
          <Footer />
    </>
  );
}
export default Categorieslist;