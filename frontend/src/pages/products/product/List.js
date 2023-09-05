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

function Productlisttable() {

  const { auth, setngs } = useContext(AuthContext);
  const [isLoader, setIsLoader] = useState(false);
  const [products, setProducts] = useState([]);
  const [exceldata, setExceldata] = useState([]);
  const [prid, setPrid] = useState({});
  const [isLocations, setIsLocations] = useState([]);
  const [checkPurProd, setCheckPurProd] = useState([])
  const [checkPurRtnProd, setCheckPurRtnProd] = useState([])
  const [checkPosProd, setCheckPosProd] = useState([])
  const [checkDraftProd, setCheckDraftProd] = useState([])
  const [checkQuotProd, setCheckQuotProd] = useState([])

  // Datatable 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");

  // Access
  const { isUserRoleAccess, isUserRoleCompare, allLocations, setAllProducts } = useContext(UserRoleAccessContext);

  // Delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => { setIsDeleteOpen(true); };
  const handleClose = () => { setIsDeleteOpen(false); };

  // check delete
  const [isCheckOpen, setIsCheckOpen] = useState(false);
  const handleClickOpenCheck = () => { setIsCheckOpen(true); };
  const handleCloseCheck = () => { setIsCheckOpen(false); };

  const fetchSize = async () => {
    try {
      // Fetch sizes
      let res = await axios.post(SERVICE.SIZE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });

      fetchProduct();

    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  useEffect(() => {
    fetchSize();
  }, []);
  // get all products
  const fetchProduct = async () => {
    try {
      let res = await axios.post(SERVICE.PRODUCT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid),
        role: String(isUserRoleAccess.role),
        userassignedlocation: [isUserRoleAccess.businesslocation]
      });
      setProducts(res?.data?.products);
      setAllProducts(res?.data?.products)
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

  // delete function api
  const rowData = async (id, sku) => {
    try {
      const [
        res, reqpur, reqpurrtn, reqpos, reqdraft, reqquot
      ] = await Promise.all([
        axios.get(`${SERVICE.PRODUCT_SINGLE}/${id}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
        }),
        axios.post(SERVICE.PURCHASE_DELETE_PRODUCT_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checksku: String(sku)
        }),
        axios.post(SERVICE.PURCHASERTN_DELETE_PRODUCT_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checksku: String(sku)
        }),
        axios.post(SERVICE.POS_DELETE_PRODUCT_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checksku: String(sku)
        }),
        axios.post(SERVICE.DRAFT_DELETE_PRODUCT_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checksku: String(sku)
        }),
        axios.post(SERVICE.QUOTATION_DELETE_PRODUCT_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checksku: String(sku)
        })
      ])
      setPrid(res?.data?.sproduct); //set function to get particular row
      setCheckPurProd(reqpur?.data?.purchases)
      setCheckPurRtnProd(reqpurrtn?.data?.purchasesrtn)
      setCheckPosProd(reqpos?.data?.pos)
      setCheckDraftProd(reqdraft?.data?.drafts)
      setCheckQuotProd(reqquot?.data?.quotations)

      if ((reqpur?.data?.purchases)?.length > 0 || (reqpurrtn?.data?.purchasesrtn)?.length > 0 || (reqpos?.data?.pos)?.length > 0 || (reqdraft?.data?.drafts)?.length > 0 || (reqquot?.data?.quotations)?.length > 0
      ) {
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
  let prodid = prid._id;
  const deleteProd = async (prodid) => {
    try {
      let res = await axios.delete(`${SERVICE.PRODUCT_SINGLE}/${prodid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      await fetchProduct();
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
  const fileName = "Products";

  // get perticular columns for export excel
  const productexcel = async () => {
    var data = products.map((t, index) => ({
      "Sno": index + 1,
      'Product Name': t.productname,
      SKU: t.sku,
      'Business Location': t.businesslocation,
      Category: t.category,
      'Sub Category': t.subcategory,
      Brand: t.brand,
      'Sub Brand': t.subbrand,
      Unit: t.unit,
      Size: t.size,
      Style: t.style,
      Tax: (t.hsn != "" ? t.hsn : t.applicabletax),
      'barcodetype': t.barcodetype,
      managestock: t.managestock,
      productdescription: t.productdescription,
      applicabletax: t.applicabletax,
      sellingpricetax: t.sellingpricetax,
      producttype: t.producttype,
      minquantity: t.minquantity,
      maxquantity: t.maxquantity,
      hsn: t.hsn,
      color: t.color,
    }));
    setExceldata(data);
  }

  useEffect(
    () => {
      productexcel();
    }, [products]
  )

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Products',
    pageStyle: 'print'
  });


  const columns = [
    { title: "Productname", field: "productname" },
    { title: "Sku", field: "sku" },
    { title: "Businesslocation", field: "businesslocation" },
    { title: "Category", field: "category" },
    { title: "Subcategory", field: "subcategory" },
    { title: "Brand", field: "brand" },
    { title: "Sub Brand", field: "subbrand" },
    { title: "Unit", field: "unit" },
    { title: "Size", field: "size" },
    { title: "Style", field: "style" },
    { title: "Barcodetype", field: "barcodetype" },
    { title: "Managestock", field: "managestock" },
    { title: "Productdescription", field: "productdescription" },
    { title: "Applicabletax", field: "applicabletax" },
    { title: "Sellingpricetax", field: "sellingpricetax" },
    { title: "Producttype", field: "producttype" },
    { title: "Minquantity", field: "minquantity" },
    { title: "Maxquantity", field: "maxquantity" },
    { title: "Hsn", field: "hsn" },
    { title: "Color", field: "color" },



  ]

  // const downloadPdf = () => {
  //   const doc = new jsPDF();
  //   doc.autoTable({
  //     theme: "grid",
  //     styles: {
  //       fontSize: 4,
  //     },
  //     columns: columns.map((col) => ({ ...col, dataKey: col.field })),
  //     body: products,
  //   });
  //   doc.save("products.pdf");
  // };

  const downloadPdf = () => {
    const doc = new jsPDF();
    const columnsWithSerial = [
      // Serial number column
      { title: "SNo", dataKey: "serialNumber" },
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];
    // Add a serial number to each row
    const itemsWithSerial = items.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
      },
      // columns: columns?.map((col) => ({ ...col, dataKey: col.field })),
      // body: items,
      columns: columnsWithSerial,
      body: itemsWithSerial,
    });
    doc.save("Product.pdf");
  };


  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = products?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  }

  useEffect(() => {
    addSerialNumber();
  }, [products])

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
      <Headtitle title={'Products'} />
      { /* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Products <Typography component="span" sx={userStyle.SubHeaderText}>Manage your Products</Typography></Typography>
      { /* ****** Table Start ****** */}
      <>
        <Box sx={userStyle.container} >
          { /* Header Content */}
          <Grid container spacing={2}>
            <Grid item md={2} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              <Typography sx={userStyle.importheadtext}>All your Products</Typography>
            </Grid>
            <Grid item md={8} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              <Grid>
                {isUserRoleCompare[0]?.excelproduct && (
                  <>
                    <ExportCSV csvData={exceldata} fileName={fileName} />
                  </>
                )}
                {isUserRoleCompare[0]?.csvproduct && (
                  <>
                    <ExportXL csvData={exceldata} fileName={fileName} />
                  </>
                )}
                {isUserRoleCompare[0]?.printproduct && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                  </>
                )}
                {isUserRoleCompare[0]?.pdfproduct && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={downloadPdf}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                  </>
                )}
              </Grid>
            </Grid>
            <Grid item md={2} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              {isUserRoleCompare[0]?.aproduct && (
                <>
                  <Link to="/product/product/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
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
          <Box>
            {isLoader ? (
              <>
                <TableContainer component={Paper} >
                  <Table aria-label="simple table">
                    <TableHead sx={{ fontWeight: "600", fontSize: "14px" }} >
                      <StyledTableRow >
                        <StyledTableCell >Actions</StyledTableCell>
                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('productimage')}><Box sx={userStyle.tableheadstyle}><Box>Product Image</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('productimage')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('productname')}><Box sx={userStyle.tableheadstyle}><Box>Product Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('productname')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('sku')}><Box sx={userStyle.tableheadstyle}><Box>SKU</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sku')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('businesslocation')}><Box sx={userStyle.tableheadstyle}><Box>Business location</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('businesslocation')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('category')}><Box sx={userStyle.tableheadstyle}><Box>Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('category')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('subcategory')}><Box sx={userStyle.tableheadstyle}><Box>Sub category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subcategory')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('brand')}><Box sx={userStyle.tableheadstyle}><Box>Brand</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('brand')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('subbrand')}><Box sx={userStyle.tableheadstyle}><Box>Sub Brand</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subbrand')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('unit')}><Box sx={userStyle.tableheadstyle}><Box>Unit</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('unit')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('style')}><Box sx={userStyle.tableheadstyle}><Box>Style</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('style')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('size')}><Box sx={userStyle.tableheadstyle}><Box>Size</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('size')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('color')}><Box sx={userStyle.tableheadstyle}><Box>Color</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('color')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('hsn')}><Box sx={userStyle.tableheadstyle}><Box>Tax</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('hsn')}</Box></Box></StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData.length > 0 ?
                        (filteredData.map((row, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row" colSpan={1}>
                              <Grid sx={{ display: 'flex' }}>
                                {isUserRoleCompare[0]?.eproduct && (
                                  <>
                                    <Link to={`/product/product/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonedit} style={{ minWidth: '0px' }}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                  </>
                                )}
                                {isUserRoleCompare[0]?.dproduct && (
                                  <>
                                    <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(row._id, row.sku); }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                                  </>
                                )}
                                {isUserRoleCompare[0]?.vproduct && (
                                  <>
                                    <Link to={`/product/product/view/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                  </>
                                )}
                              </Grid>
                            </StyledTableCell>
                            <StyledTableCell>{row.serialNumber}</StyledTableCell>
                            <StyledTableCell >{row?.productimage ? <img src={row?.productimage} alt="image" width="70px" height="70px" /> : ""}</StyledTableCell>
                            <StyledTableCell >{row.productname}</StyledTableCell>
                            <StyledTableCell >{row.sku}</StyledTableCell>
                            <StyledTableCell >{isLocations?.map((data, i) => data.locationid.includes(row.businesslocation) ? data.name + " " : "")}</StyledTableCell>
                            <StyledTableCell >{row.category}</StyledTableCell>
                            <StyledTableCell >{row.subcategory}</StyledTableCell>
                            <StyledTableCell >{row.brand}</StyledTableCell>
                            <StyledTableCell >{row.subbrand}</StyledTableCell>
                            <StyledTableCell >{row.unit}</StyledTableCell>
                            <StyledTableCell >{row.style}</StyledTableCell>
                            <StyledTableCell >{row.size}</StyledTableCell>
                            <StyledTableCell >{row.color}</StyledTableCell>
                            <StyledTableCell >{row.hsn == "" || row.hsn == "None" ? row.applicabletax : row.hsn}</StyledTableCell>
                          </StyledTableRow>
                        )))
                        : <StyledTableRow><StyledTableCell colSpan={16} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
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
                </Box><br /><br />
                {pageSize != 1 ? <Grid >
                  {isUserRoleCompare[0]?.aproduct && (
                    <>
                      <Link to="/product/product/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
                    </>
                  )}<br /><br />
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

          { /* Table End */}
        </Box>
      </>
      { /* ****** Table End ****** */}
      {/* Print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="producttablepdf" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600", fontSize: "14px" }} >
            <StyledTableRow >
              <StyledTableCell>Sno</StyledTableCell>
              <StyledTableCell >Product Name</StyledTableCell>
              <StyledTableCell >SKU</StyledTableCell>
              <StyledTableCell >Business Location</StyledTableCell>
              <StyledTableCell >Category</StyledTableCell>
              <StyledTableCell >Sub category</StyledTableCell>
              <StyledTableCell >Brand</StyledTableCell>
              <StyledTableCell >Sub Brand</StyledTableCell>
              <StyledTableCell >Unit</StyledTableCell>
              <StyledTableCell >Style</StyledTableCell>
              <StyledTableCell >Size</StyledTableCell>
              <StyledTableCell >Color</StyledTableCell>
              <StyledTableCell >Tax</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell >{row.productname}</StyledTableCell>
                  <StyledTableCell >{row.sku}</StyledTableCell>
                  <StyledTableCell >{isLocations.map((data, i) => data.locationid.includes(row.businesslocation) ? data.name + " " : "")}</StyledTableCell>
                  <StyledTableCell >{row.category}</StyledTableCell>
                  <StyledTableCell >{row.subcategory}</StyledTableCell>
                  <StyledTableCell >{row.brand}</StyledTableCell>
                  <StyledTableCell >{row.subbrand}</StyledTableCell>
                  <StyledTableCell >{row.unit}</StyledTableCell>
                  <StyledTableCell >{row.style}</StyledTableCell>
                  <StyledTableCell >{row.size}</StyledTableCell>
                  <StyledTableCell >{row.color}</StyledTableCell>
                  <StyledTableCell >{row.applicabletax != "" ? row.applicabletax : row.hsn}</StyledTableCell>
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
          <Button onClick={(e) => deleteProd(prodid)} autoFocus variant="contained" color='error'> OK </Button>
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
            {checkPurProd?.length > 0 && checkPurRtnProd?.length > 0 && checkPosProd?.length > 0 && checkDraftProd.length > 0 && checkQuotProd.length > 0
              // && checkStockRack?.length > 0  
              ? (
                <>
                  <span style={{ fontWeight: '700', color: '#777' }}>
                    {`${prid.productname} `}
                  </span>
                  was linked in <span style={{ fontWeight: '700' }}>Discount, Purchase, Purchase Return, Pos, Draft & Quotation</span>
                </>
              ) : checkPurProd?.length > 0 || checkPurRtnProd?.length > 0 || checkPosProd?.length > 0 || checkDraftProd.length > 0 || checkQuotProd.length > 0
                //  || checkStockRack?.length > 0 
                ? (
                  <>
                    <span style={{ fontWeight: '700', color: '#777' }}>
                      {`${prid.productname} `}
                    </span>
                    was linked in{' '}
                    <span style={{ fontWeight: '700' }}>
                      {checkPurProd?.length ? ' Purchase' : ''}
                      {checkPurRtnProd?.length ? ' Purchase Return' : ''}
                      {checkPosProd?.length ? ' Pos' : ''}
                      {checkDraftProd?.length ? ' Draft' : ''}
                      {checkQuotProd?.length ? ' Quotation' : ''}

                      {/* {checkStockRack?.length ? ' Stock' : ''} */}
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

function Productlist() {
  return (
    <>
      <Productlisttable /><br /><br /><br /><br />
      <Footer />
    </>
  );
}
export default Productlist;