import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Select, MenuItem, FormControl, OutlinedInput, InputLabel, Table, TableBody, TableContainer, TableHead, Paper, Button, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { FaPrint, FaFilePdf, } from 'react-icons/fa';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
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
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Selects, { components } from "react-select";
import { MultiSelect } from "react-multi-select-component";


function Grouptable() {

  const { auth, setngs } = useContext(AuthContext);
  const [isLoader, setIsLoader] = useState(false);
  const [getGroups, setGroups] = useState([]);
  const [cats, setCats] = useState({ brandname: "", categoryname: "" });
  const [brandview, setBrandview] = useState([]);
  const [cateview, setCateview] = useState([]);

  // Datatable 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [exceldata, setExceldata] = useState([]);
  const InputOption = ({
    getStyles,
    Icon,
    isDisabled,
    isFocused,
    isSelected,
    children,
    innerProps,
    ...rest
  }) => {
    const [isActive, setIsActive] = useState(false);
    const onMouseDown = () => setIsActive(true);
    const onMouseUp = () => setIsActive(false);
    const onMouseLeave = () => setIsActive(false);
    // styles
    let bg = "transparent";
    if (isFocused) bg = "#eee";
    if (isActive) bg = "#B2D4FF";
    const style = {
      alignItems: "center",
      backgroundColor: bg,
      color: "inherit",
      display: "flex "
    };
    // prop assignment
    const props = {
      ...innerProps,
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      style
    };
    return (
      <components.Option
        {...rest}
        isDisabled={isDisabled}
        isFocused={isFocused}
        isSelected={isSelected}
        getStyles={getStyles}
        innerProps={props}
      >
        <input type="checkbox" checked={isSelected} />
        {children}
      </components.Option>
    );
  };

  // Access
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  //delete modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => { setIsDeleteOpen(true); };
  const handleClose = () => { setIsDeleteOpen(false); };

  // Edit Modal Popup
  const [groupmodal, setGroupmodal] = useState(false);
  const groupModOpen = () => { setGroupmodal(true); };
  const groupModClose = () => { setGroupmodal(false); setAddGroup([]); setShowAlert("") };

  // View Modal Popup
  const [groupmodalview, setGroupmodalview] = useState(false);
  const groupModOpenView = () => { setGroupmodalview(true); };
  const groupModCloseView = () => { setGroupmodalview(false); };

  // Edit
  const [brand, setBrand] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addGroup, setAddGroup] = useState({ brandname: "", categoryname: "" });
  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  const [selectedOptionsBrand, setSelectedOptionsBrand] = useState("");

  // Disable field
  const [isBrandOptionSelected, setIsBrandOptionSelected] = useState(false);
  const [isCategoryOptionSelected, setIsCategoryOptionSelected] = useState(false);

  // Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpenError = () => { setIsErrorOpen(true); };
  const handleCloseError = () => { setIsErrorOpen(false); };

  // Brand
  const fetchBrands = async () => {
    try {
      let res = await axios.post(SERVICE.BRAND, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      const brandid = [...res?.data?.brands.map((d) => (
        {
          ...d,
          label: d.brandname,
          value: d.brandname,
        }
      ))];
      setBrand(brandid)
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  // Category
  const fetchCategory = async () => {
    try {
      let res = await axios.post(SERVICE.CATEGORIES, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });

      const catid = [...res?.data?.categories.map((d) => (
        {
          ...d,
          label: d.categoryname,
          value: d.categoryname,
        }
      ))];
      setCategories(catid)
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  useEffect(() => { fetchCategory(); fetchBrands() }, [])

  //  Fetch Category Data
  const fetchGroup = async () => {
    try {
      let res = await axios.post(SERVICE.GROUPS, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      setGroups(res?.data?.groups);
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

  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.GROUP_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      })
      setCats(res?.data?.sgroup);
      setAddGroup(res?.data?.sgroup);
      setBrandview(res?.data?.sgroup.brandname);
      setCateview(res?.data?.sgroup.categoryname);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  }

  const getunitvaluesCate = (e) => {
    setSelectedOptionsCate(
      Array.isArray(e?.categoryname)
        ? e?.categoryname?.map((x) => ({
          ...x,
          label: x,
          value: x,
          key: `category-${x._id}`
        }))
        : []
    );
  };

  const getunitvaluesBrand = (e) => {
    setSelectedOptionsBrand(
      Array.isArray(e?.brandname)
        ? e?.brandname?.map((x) => ({
          ...x,
          label: x,
          value: x,
          key: `brand-${x._id}`
        }))
        : []
    );
  };

  const handleCategoryChange = (e) => {
    setSelectedOptionsCate(
      Array.isArray(e)
        ? e.map((x, index) => ({ ...x, key: `category-selected-${index}` }))
        : []
    );
    setAddGroup({
      ...addGroup,
      categoryname: e.length === 1 ? [e[0].value] : e.map((x) => x.value),
    });
  };

  const customValueRenderer = (selectedOptionsCate, _categories) => {
    return selectedOptionsCate.length
      ? selectedOptionsCate.map(({ label }) => label).join(", ")
      : " No Items Selected";
  };

  const customValueRendererbrand = (selectedOptionsBrand, _brand) => {
    return selectedOptionsBrand.length
      ? selectedOptionsBrand.map(({ label }) => label).join(", ")
      : " No Items Selected";
  };

  const handleBrandChange = (e) => {
    setSelectedOptionsBrand(
      Array.isArray(e)
        ? e.map((x, index) => ({ ...x, key: `brand-selected-${index}` }))
        : []
    );
    setAddGroup({
      ...addGroup,
      brandname: e.length === 1 ? [e[0].value] : e.map((x) => x.value),
    });
  };

  // Disable field function
  const handleCategoryFocus = () => {
    setIsBrandOptionSelected(true)
  };

  const handleCategoryBlur = () => {
    if (!selectedOptionsCate) {
      setIsCategoryOptionSelected(false);
    }
  };

  const handleBrandFocus = () => {
    setIsCategoryOptionSelected(true)
  };

  const handleBrandBlur = () => {
    if (!selectedOptionsBrand) {
      setIsBrandOptionSelected(false);
    }
  };

  //alert delete popup
  let catid = cats._id;

  const deleteCats = async (catid) => {
    try {
      let res = await axios.delete(`${SERVICE.GROUP_SINGLE}/${catid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      await fetchGroup();
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
      fetchGroup();
    }, []
  );

  const edit_id = cats._id;

  const sendRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.GROUP_SINGLE}/${edit_id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        assignbusinessid: String(setngs.businessid),
        brandname: addGroup.brandname ? addGroup.brandname : selectedOptionsBrand,
        categoryname: addGroup.categoryname ? addGroup.categoryname : selectedOptionsCate,
        isBrandOptionSelected: Boolean(isBrandOptionSelected),
        isCategoryOptionSelected: Boolean(isCategoryOptionSelected),
      });
      toast.success(res.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      groupModClose();
      await fetchGroup();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cats.isBrandOptionSelected == false) {
      if (addGroup.brandname == "") {
        setShowAlert("Please Select Brand!");
        handleClickOpenError();
      }
      else if (selectedOptionsCate.length === 0) {
        setShowAlert("Please Select Category!");
        handleClickOpenError();
      }
      else {
        sendRequest();
      }
    }
    else {
      if (addGroup.categoryname == "") {
        setShowAlert("Please Select Category!, lll");
        handleClickOpenError();
      }
      else if (selectedOptionsBrand.length === 0) {
        setShowAlert("Please Select Brand!");
        handleClickOpenError();
      }
      else {
        sendRequest();
      }
    }
  }

  // Export Excel
  const fileName = 'Groups'
  //  get particular columns for export excel
  const getexcelDatas = async () => {
    var data = getGroups.map((t, i) => (
      {
        "S.No": i + 1,
        "Category Name": t.categoryname?.map(d => d).join(","),
        "Brand Name": t.brandname?.map(d => d).join(","),
      }));
    setExceldata(data);
  }

  useEffect(
    () => {
      getexcelDatas()
    }, [getGroups]
  );

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Groups',
    pageStyle: 'print'
  });

  // PDF
  const downloadPdf = () => {
    const doc = new jsPDF();
    autoTable(doc, { html: '#groupid' });
    doc.save('Groups.pdf')
  }

  // Sort
  const addSerialNumber = () => {
    const itemsWithSerialNumber = getGroups?.map((item, index) => ({ ...item, sno: index + 1 }));
    setItems(itemsWithSerialNumber);
  }

  useEffect(() => {
    addSerialNumber();
  }, [getGroups])

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
      <Headtitle title={'Groups'} />
      {/* header text */}
      <Typography sx={userStyle.HeaderText}>Groups List</Typography>
      {/* content start */}
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item md={2} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={userStyle.importheadtext}>Groups</Typography>
          </Grid>
          <Grid item md={8} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Grid>
              {isUserRoleCompare[0]?.csvgrouping && (
                <>
                  <ExportCSV csvData={exceldata} fileName={fileName} />
                </>
              )}
              {isUserRoleCompare[0]?.excelgrouping && (
                <>
                  <ExportXL csvData={exceldata} fileName={fileName} />
                </>
              )}
              {isUserRoleCompare[0]?.printgrouping && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                </>
              )}
              {isUserRoleCompare[0]?.pdfgrouping && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                </>
              )}

            </Grid>
          </Grid>
          <Grid item sm={12} xs={12} md={2} sx={{ display: "flex", justifyContent: "center" }} >
            {isUserRoleCompare[0]?.addgrouping && (
              <>
                <Link to="/product/group/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd} >ADD</Button></Link>
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
              <MenuItem value={(getGroups.length)}>All</MenuItem>
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
                    <StyledTableCell onClick={() => handleSorting('category')}><Box sx={userStyle.tableheadstyle}><Box>Category Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('category')}</Box></Box></StyledTableCell>
                    <StyledTableCell >Action</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody align="left">
                  {filteredData.length > 0 ?
                    (filteredData.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">{item.sno}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{item.brandname?.map(item => item)?.join(",")}</StyledTableCell>
                        <StyledTableCell>{item.categoryname?.map(item => item)?.join(",")}</StyledTableCell>
                        <StyledTableCell>
                          <Grid sx={{ display: 'flex' }}>
                            {isUserRoleCompare[0]?.editgrouping && (
                              <>
                                <Button sx={userStyle.buttonedit} onClick={(e) => {
                                  groupModOpen(); rowData(item._id);
                                  getunitvaluesCate(item); getunitvaluesBrand(item);
                                }} ><EditOutlinedIcon style={{ fontSize: "large" }} /></Button>
                              </>
                            )}
                            {isUserRoleCompare[0]?.deletegrouping && (
                              <>
                                <Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowData(item._id) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                              </>
                            )}
                            {isUserRoleCompare[0]?.viewgrouping && (
                              <>
                                <Button sx={userStyle.buttonview} style={{ minWidth: '0px' }} onClick={(e) => { groupModOpenView(); rowData(item._id); }} ><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button>
                              </>
                            )}
                          </Grid>
                        </StyledTableCell>
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
              {isUserRoleCompare[0]?.addgrouping && (
                <>
                  <Link to="/product/group/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd} >ADD</Button></Link>
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
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="groupid" ref={componentRef}>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>SI.No</StyledTableCell>
              <StyledTableCell>Brand Name</StyledTableCell>
              <StyledTableCell>Category Name</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody align="left">
            {getGroups &&
              (getGroups.map((item, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">{index + 1}</StyledTableCell>
                  <StyledTableCell component="th" scope="row">{item?.brandname?.map(item => item)?.join(",")}</StyledTableCell>
                  <StyledTableCell component="th" scope="row">{item?.categoryname?.map(item => item)?.join(",")}</StyledTableCell>
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

      {/* Edit */}
      <Box>
        <Dialog
          onClose={groupModClose}
          aria-labelledby="customized-dialog-title1"
          open={groupmodal}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              border: '1px solid #b97df0',
            },
          }}
          maxWidth="md"
        >
          <form >
            <DialogTitle id="customized-dialog-title1" onClose={groupModClose} sx={{ backgroundColor: '#e0e0e0', color: "#000", display: "flex" }}>
              Edit Category Grouping
            </DialogTitle>
            <DialogContent dividers style={{
              minWidth: '900px', height: '430px', '& .MuiOutlinedInput-notchedOutline': {
                border: '1px solid #4a7bf7 !important',
              },
            }}
              sx={userStyle.filtercontentpopup}
            >
              {cats.isBrandOptionSelected == false ? (
                <Grid container spacing={3} >
                  <Grid item md={6} sm={12} xs={12}>
                    <InputLabel htmlFor="component-outlined">Brand Name <b style={{ color: 'red', }}>*</b></InputLabel>
                    <FormControl size="small" fullWidth>
                      <Selects
                        id="component-outlined"
                        options={brand}
                        value={{ label: addGroup.brandname, value: addGroup.brandname }}
                        onChange={(e) => { setAddGroup({ ...addGroup, brandname: e.value }) }}
                        name="brandname"
                        placeholder='Brand Name'

                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputLabel htmlFor="component-outlined">Category Name <b style={{ color: 'red', }}>*</b></InputLabel>
                    <FormControl size="small" fullWidth>
                      <MultiSelect
                        id="component-outlined"
                        options={categories}
                        isMulti
                        value={selectedOptionsCate}
                        onChange={(e) => { handleCategoryChange(e) }}
                        valueRenderer={customValueRenderer}
                        name="Category Name"
                        placeholder="Category Name"
                        isDisabled={isBrandOptionSelected}
                        onFocus={handleCategoryFocus}
                        onBlur={handleBrandBlur}
                        isClearable={false}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{
                          Option: InputOption
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={3} sx={userStyle.textInput}>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputLabel htmlFor="component-outlined">Category Name <b style={{ color: 'red', }}>*</b></InputLabel>
                    <FormControl size="small" fullWidth>
                      <Selects
                        id="component-outlined"
                        options={categories}
                        value={{ label: addGroup.categoryname, value: addGroup.categoryname }}
                        onChange={(e) => { setAddGroup({ ...addGroup, categoryname: e.value }); }}
                        name="categoryname"
                        placeholder='Category Name'
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputLabel htmlFor="component-outlined">Brand Name <b style={{ color: 'red', }}>*</b></InputLabel>
                    <FormControl size="small" fullWidth>
                      <MultiSelect
                        id="component-outlined"
                        isMulti
                        options={brand}
                        value={selectedOptionsBrand}
                        onChange={handleBrandChange}
                        valueRenderer={customValueRendererbrand}
                        name="Category Name"
                        placeholder="Category Name"
                        isDisabled={isBrandOptionSelected}
                        onFocus={handleBrandFocus}
                        onBlur={handleCategoryBlur}
                        isClearable={false}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{
                          Option: InputOption
                        }}
                      />

                    </FormControl>
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button autoFocus variant='contained' sx={userStyle.buttonadd} onClick={handleSubmit}>Update</Button>
              <Button onClick={groupModClose} variant='contained' sx={userStyle.buttoncancel}>Close</Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* ALERT DIALOG */}
        <Box>
          <Dialog
            open={isErrorOpen}
            onClose={handleCloseError}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
              <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
              <Typography variant="h6" >{showAlert}</Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="error" onClick={handleCloseError}>ok</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box >

      {/* View */}
      <Box>
        <Dialog
          onClose={groupModCloseView}
          aria-labelledby="customized-dialog-title1"
          open={groupmodalview}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              border: '1px solid #b97df0',
            },
          }}
          maxWidth="md"
        >
          <DialogTitle id="customized-dialog-title1" onClose={groupModCloseView} sx={{ backgroundColor: '#e0e0e0', color: "#000", display: "flex" }}>
            View Category Grouping
          </DialogTitle>
          <DialogContent dividers style={{
            minWidth: '750px', height: 'auto', '& .MuiOutlinedInput-notchedOutline': {
              border: '1px solid #4a7bf7 !important',
            },
          }}
            sx={userStyle.filtercontentpopup}
          >
            <Grid container spacing={3} >
              <Grid item md={6} sm={12} xs={12}>
                <InputLabel htmlFor="component-outlined">Brand Name <b style={{ color: 'red', }}>*</b></InputLabel>
                <FormControl size="small" fullWidth>
                  <OutlinedInput
                    id="component-outlined"
                    readOnly
                    value={brandview?.map(d => d).join(", ")}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <InputLabel htmlFor="component-outlined">Category Name <b style={{ color: 'red', }}>*</b></InputLabel>
                <FormControl size="small" fullWidth>
                  <OutlinedInput
                    id="component-outlined"
                    readOnly
                    value={cateview?.map(d => d).join(", ")}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={groupModCloseView} variant='contained' sx={userStyle.buttoncancel}>Back</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

function GroupList() {
  return (
    <>
      <Grouptable /><br /><br /><br /><br />
          <Footer />
    </>
  );
}
export default GroupList;