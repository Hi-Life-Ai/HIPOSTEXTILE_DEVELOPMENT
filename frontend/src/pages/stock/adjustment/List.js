import React, { useState, useEffect, useContext, useRef, createRef } from 'react';
import { Box, Table, TableBody, Select, MenuItem, FormControl, OutlinedInput, TableContainer, TableHead, Paper, Button, Grid, Typography } from '@mui/material';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { useReactToPrint } from "react-to-print";
import { userStyle } from '../../PageStyle';
import { Link } from 'react-router-dom';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import { ThreeDots } from 'react-loader-spinner';
import { ExportXL, ExportCSV } from '../../Export';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';

function StockAdjustmentTable() {


    const [isLoader, setIsLoader] = useState(false);
    const [exceldata, setExceldata] = useState([]);
    const { auth, setngs } = useContext(AuthContext);
    const [isLocations, setIsLocations] = useState([]);

    const { isUserRoleCompare, allLocations } = useContext(UserRoleAccessContext);
    // Datatable 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");


    const [stockAdjustment, setStockAdjustment] = useState([]);
    const fetchStockAdjust = async () => {
        try {
            let req = await axios.post(SERVICE.STOCK_ADJUSTMENTS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),

            });
            setStockAdjustment(req?.data?.stockadjustments)
            setIsLocations(allLocations);
            setIsLoader(true)
        }
        catch (err) {
            setIsLoader(true)
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong")
            }
        }
    }

    useEffect(() => { fetchStockAdjust() }, [])
    //set function to get particular row

    // Export Excel
    const fileName = 'Stock'
    // get perticular columns for export excel


    const getexcelDatas = async () => {
        var data = stockAdjustment.map((t, i, index) => (
            {   
                "Sno": index + 1,
                "Business location":t.businesslocation,
                "Section": t.section,
                "Category": t.category,
                "Sub Category": t.subcategory,
                "Brand": t.brand,
                "Sub Brand": t.subbrand,
                "Size": t.size,
                "Color": t.color,
                "Style": t.style,
                "Unit": t.unit,
                "Product Name":t.transferproducts.map(e => (e.productname)).join(","),
                "Supplier Name":t.transferproducts.map(e => (e.supplier)).join(","),
                "Purchase Date":t.transferproducts.map(e => (e.date)).join(","),
                "Purchase Quantity":t.transferproducts.map(e => (e.purchasequantity)).join(","),
                "Adjustment Quantity":t.transferproducts.map(e => (e.adjustmentcount)).join(","),
                "Adjustment Mode":t.transferproducts.map(e => (e.adjustmentmode)).join(","),
                "Adjustment Type":t.transferproducts.map(e => (e.adjustmenttype)).join(","),
                "Balance Stock":t.transferproducts.map(e => (e.balancecount)).join(","),
            }));
        setExceldata(data);
    }

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'HIPOS | StockAdjustment',
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
        autoTable(doc, { html: '#stockadjustmentPDF' })
        doc.save('StockAdjustment.pdf')
    }


    useEffect(() => {
        getexcelDatas();
    }, [stockAdjustment]);
    const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = stockAdjustment?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  }

  useEffect(() => {
    addSerialNumber();
  }, [stockAdjustment])

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
            <Headtitle title={'List Stock Adjustment'} />
            {/* header text */}
            <Typography sx={userStyle.HeaderText}>StockAdjustment<Typography component="span" sx={userStyle.SubHeaderText}>Manage List Stock Adjustment</Typography></Typography>
            {/* content start */}
            <Box sx={userStyle.container}>
                <Grid container spacing={2}>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <Typography sx={userStyle.importheadtext}>List Stock Adjustment</Typography>
                    </Grid>
                    <Grid item lg={6} md={7} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                        <Grid>
                            {isUserRoleCompare[0].csvstockadjust && (
                                <>
                                    <ExportCSV csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0].excelstockadjust && (
                                <>
                                    <ExportXL csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0].printstockadjust && (
                                <>

                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                </>
                            )}
                            {isUserRoleCompare[0].pdfstockadjust && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                </>
                            )}
                        </Grid>
                    </Grid>
                    <Grid item lg={3} md={2} sm={12} xs={12}>
                        {isUserRoleCompare[0].astockadjust && (
                            <>
                                <Link to="/stock/adjustment/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
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
                            <MenuItem value={(stockAdjustment.length)}>All</MenuItem>
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
                        <TableContainer component={Paper} >
                            <Table sx={{ minWidth: 700, }} aria-label="customized table" id="usertable">
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('businesslocation')}><Box sx={userStyle.tableheadstyle}><Box>Business Location</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('businesslocation')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('section')}><Box sx={userStyle.tableheadstyle}><Box>Section</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('section')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('category')}><Box sx={userStyle.tableheadstyle}><Box>Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('category')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('subcategory')}><Box sx={userStyle.tableheadstyle}><Box>Sub Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subcategory')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('brand')}><Box sx={userStyle.tableheadstyle}><Box>Brand</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('brand')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('subbrand')}><Box sx={userStyle.tableheadstyle}><Box>Sub Brand</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subbrand')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('size')}><Box sx={userStyle.tableheadstyle}><Box>Size</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('size')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('color')}><Box sx={userStyle.tableheadstyle}><Box>Color</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('color')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('style')}><Box sx={userStyle.tableheadstyle}><Box>Style</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('style')}</Box></Box></StyledTableCell>
                                        <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('unit')}><Box sx={userStyle.tableheadstyle}><Box>Unit</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('unit')}</Box></Box></StyledTableCell>
                                        <StyledTableCell>Actions</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody align="left">
                                    {filteredData.length > 0 ?
                                        (filteredData.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                <StyledTableCell >{isLocations?.map((data, i) => data.locationid.includes(row.businesslocation) ? data.name + " " : "")}</StyledTableCell>
                                                <StyledTableCell >{row.section}</StyledTableCell>
                                                <StyledTableCell >{row.category}</StyledTableCell>
                                                <StyledTableCell >{row.subcategory}</StyledTableCell>
                                                <StyledTableCell >{row.brand}</StyledTableCell>
                                                <StyledTableCell >{row.subbrand}</StyledTableCell>
                                                <StyledTableCell >{row.size}</StyledTableCell>
                                                <StyledTableCell >{row.color}</StyledTableCell>
                                                <StyledTableCell >{row.style}</StyledTableCell>
                                                <StyledTableCell >{row.unit}</StyledTableCell>
                                                <StyledTableCell component="th" scope="row">
                                                    <Grid sx={{ display: 'flex' }}>
                                                        {isUserRoleCompare[0].vstockadjust && (
                                                            <>
                                                                <Link to={`/stock/adjustment/view/${row._id}`} style={{ textDecoration: 'none', color: 'white', }}><Button sx={userStyle.buttonview}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                                            </>
                                                        )}
                                                    </Grid>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        )))
                                        : <StyledTableRow><StyledTableCell colSpan={19} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
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
                    </Box>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                        </Box>
                    </>
                )}
                <br /><br />
                {pageSize != 1 ? <Grid >
                    {isUserRoleCompare[0].astockadjust && (
                        <>
                            <Link to="/stock/adjustment/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
                        </>
                    )}
                </Grid> : null}
            </Box>
            {/* content end */}

            { /* ****** Print ****** */}
            <Box sx={userStyle.printcls} >
                <Box>
                    <Typography variant='h5' >Stock Adjustment</Typography>
                </Box>
                <>
                    <Box>
                        <TableContainer component={Paper} sx={userStyle.printcls}>
                            <Table aria-label="simple table" id="stockadjustmentPDF" ref={componentRef}>
                                <TableHead sx={{ fontWeight: "600" }} >
                                    <StyledTableRow >
                                        <StyledTableCell>Sno</StyledTableCell>
                                        <StyledTableCell ><b>Business Location</b></StyledTableCell>
                                        <StyledTableCell><b>Section</b></StyledTableCell>
                                        <StyledTableCell ><b>Category</b></StyledTableCell>
                                        <StyledTableCell ><b>Sub Category</b></StyledTableCell>
                                        <StyledTableCell ><b>Brand</b></StyledTableCell>
                                        <StyledTableCell ><b>Sub Brand</b></StyledTableCell>
                                        <StyledTableCell ><b>Size</b></StyledTableCell>
                                        <StyledTableCell ><b>Color</b></StyledTableCell>
                                        <StyledTableCell ><b>Style</b></StyledTableCell>
                                        <StyledTableCell ><b>Unit</b></StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {stockAdjustment && (
                                        stockAdjustment.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell>{index + 1}</StyledTableCell>
                                                <StyledTableCell >{isLocations?.map((data, i) => data.locationid.includes(row.businesslocation) ? data.name + " " : "")}</StyledTableCell>
                                                <StyledTableCell >{row.section}</StyledTableCell>
                                                <StyledTableCell >{row.category}</StyledTableCell>
                                                <StyledTableCell >{row.subcategory}</StyledTableCell>
                                                <StyledTableCell >{row.brand}</StyledTableCell>
                                                <StyledTableCell >{row.subbrand}</StyledTableCell>
                                                <StyledTableCell >{row.size}</StyledTableCell>
                                                <StyledTableCell >{row.color}</StyledTableCell>
                                                <StyledTableCell >{row.style}</StyledTableCell>
                                                <StyledTableCell >{row.unit}</StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </>
            </Box>
        </Box >
    );
}

function StockAdjustmentList() {
    return (
        <>
             <StockAdjustmentTable /><br /><br /><br /><br />
                    <Footer />
        </>
    );
}
export default StockAdjustmentList;
