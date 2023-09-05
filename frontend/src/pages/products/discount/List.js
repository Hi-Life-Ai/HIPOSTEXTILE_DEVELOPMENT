import React, { useState, useEffect, useContext, useRef } from 'react';
import { Box, Grid, Select, MenuItem, FormControl, OutlinedInput, Button, Table, TableBody, TableContainer, FormControlLabel, DialogContentText, TableHead, DialogTitle, Typography, Paper, Checkbox, Dialog, DialogContent, DialogActions } from '@mui/material';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Headtitle from '../../../components/header/Headtitle';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import { userStyle } from '../../PageStyle';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { toast } from 'react-toastify';
import { ExportXL, ExportCSV } from '../../Export';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { SERVICE } from '../../../services/Baseservice';
import jsPDF from "jspdf";
import { AuthContext } from '../../../context/Appcontext';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { useReactToPrint } from "react-to-print";

const Discountlisttable = () => {

    const { auth, setngs } = useContext(AuthContext);
    const [isLoader, setIsLoader] = useState(false);
    const [discounts, setDiscounts] = useState([]);
    const [isdiscount, setDiscount] = useState({})
    const [exceldata, setExceldata] = useState([]);
    const [isLocations, setIsLocations] = useState([]);

    // Datatable 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    // PDF Data
    const [isPdfData, setIsPdfData] = useState({
        isDisclocation: false, isDiscId: false, isDiscname: false, isDiscproduct: false, isDisccategory: false, isDiscsubcategory: false,
        isBrand: false, isPurchaseExtax: false, isPurchaseIntax: false, isSellinIntax: false, isSellingExtax: false, isDisctype: false,
        isDiscprice: false, isDiscAmount: false, isDiscValue: false, isStart: false, isEnd: false,
    })

    // User Access
    const { isUserRoleCompare, isUserRoleAccess, isActiveLocations } = useContext(UserRoleAccessContext);

    // Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleClose = () => { setIsDeleteOpen(false); };

    // PDF
    const [openPdf, setOpenPdf] = useState(false);
    const handleOpenPdf = () => { setOpenPdf(true); };
    const handleClosePdf = () => { setOpenPdf(false); };

    //  Fetch Discount Data
    const fetchDiscount = async () => {
        try {
            let res = await axios.post(SERVICE.DISCOUNT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });

            setIsLocations(isActiveLocations);
            setDiscounts(res?.data?.discounts);
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
            fetchDiscount();
        }, [isPdfData]);

    //set function to get particular row
    const rowData = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.DISCOUNT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDiscount(res?.data?.sdiscount);
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
    let discountid = isdiscount._id;

    const deleteDiscount = async (discountid) => {

        try {
            let res = await axios.delete(`${SERVICE.DISCOUNT_SINGLE}/${discountid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            await fetchDiscount();
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

    //  Excel
    const fileName = 'Discounts';

    // // get perticular columns for export excel
    const getexcelDatas = async () => {
        var data = discounts.map((t, index) => ({
            "Sno": index + 1,
            "Location": t.businesslocation, "Discount ID": t.discountid, "Name": t.name, "Product Name": t.products, "Category": t.category, "Sub Category": t.subcategory,
            "Brand": t.brand, "Sub Brand": t.subbrand, "Purchase Exclude Tax": t.purchaseexcludetax, "Purchase Include Tax": t.pruchaseincludetax, "Selling Exclude Tax": t.sellingvalue,
            "Discount Type": t.discounttype, "Select Discount Price": t.selectdiscountprice, "Discount Amount": t.discountamt,
            "Discount Value": t.discountvalue, "Starts At": t.startsat, "Ends At": t.endsat,
        }));
        setExceldata(data);
    }

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'HIPOS | SUPPLIERS LIST',
        pageStyle: 'print'
    });

    // Pdf
    // const downloadPdf = () => {
    //     const newData = discounts.map(row => {
    //         delete row._id;
    //         delete row.prodid;
    //         delete row.createdAt;
    //         delete row.__v;
    //         delete row.assignbusinessid;
    //         { !isPdfData.isDisclocation && delete row.businesslocation };
    //         { !isPdfData.isDiscId && delete row.discountid };
    //         { !isPdfData.isDiscname && delete row.name };
    //         { !isPdfData.isDiscproduct && delete row.products };
    //         { !isPdfData.isDisccategory && delete row.category };
    //         { !isPdfData.isDiscsubcategory && delete row.subcategory };
    //         { !isPdfData.isBrand && delete row.brand };
    //         { !isPdfData.isPurchaseExtax && delete row.purchaseexcludetax };
    //         { !isPdfData.isPurchaseIntax && delete row.pruchaseincludetax };
    //         { !isPdfData.isSellingExtax && delete row.sellingvalue };
    //         { !isPdfData.isDisctype && delete row.discounttype };
    //         { !isPdfData.isDiscprice && delete row.selectdiscountprice };
    //         { !isPdfData.isDiscAmount && delete row.discountamt };
    //         { !isPdfData.isDiscValue && delete row.discountvalue };
    //         { !isPdfData.isStart && delete row.startsat };
    //         { !isPdfData.isEnd && delete row.endsat };
    //         setIsPdfData(row);
    //         handleClosePdf();
    //     })

    //     const doc = new jsPDF()

    //     doc.autoTable({
    //         theme: "grid",
    //         body: discounts,
    //     })
    //     doc.save('Discounts.pdf')
    // }

    const columns = [

        { title: "Location", field: "businesslocation" },
        { title: "DiscountID", field: "discountid" },
        { title: "Name", field: "name" },
        { title: "ProductName", field: "products" },
        { title: "Category", field: "category" },
        { title: "SubCategory", field: "subcategory" },
        { title: "Brand", field: "brand" },
        { title: "SubBrand", field: "subbrand" },
        { title: "PurchaseExcludingTax", field: "purchaseexcludetax" },
        { title: "PurchaseIncludingTax", field: "pruchaseincludetax" },
        { title: "SellingTax", field: "sellingvalue" },
        { title: "DiscountType", field: "discounttype" },
        { title: "SelectDiscount Price", field: "selectdiscountprice" },
        { title: "DiscountAmount", field: "discountamt" },
        { title: "DiscountValue", field: "discountvalue" },
        { title: "StartAt", field: "startsat" },
        { title: "EndsAt", field: "endsat" },
    ]

    const downloadPdf = () => {
        const doc = new jsPDF();
        const columnsWithSerial = [
            // Serial number column
            { title: "SNo", dataKey: "serialNumber" },
            ...columns.map((col) => ({ ...col, dataKey: col.field, })),
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
        doc.save("Discount.pdf");
    };
    useEffect(
        () => {
            fetchDiscount();
        }, [isPdfData]
    );

    useEffect(
        () => {
            getexcelDatas();
        }, [discounts]
    );
    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = discounts?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [discounts])

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

    const totalPages = Math.ceil(discounts.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    return (
        <Box>
            <Headtitle title={'Discount List'} />
            <Typography sx={userStyle.HeaderText}>Discount</Typography>
            <Box sx={userStyle.container}>
                <Grid container spacing={2}>
                    <Grid item md={2} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                        <Typography sx={userStyle.importheadtext}>All your discounts</Typography>
                    </Grid>
                    <Grid item sm={12} md={8} xs={12} sx={{ display: "flex", justifyContent: "center" }} >
                        <Grid >
                            {isUserRoleCompare[0]?.csvdiscount && (
                                <>
                                    <ExportCSV csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0]?.exceldiscount && (
                                <>
                                    <ExportXL csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0]?.printdiscount && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                </>
                            )}
                            {isUserRoleCompare[0]?.pdfproduct && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                </>
                            )}
                        </Grid>
                    </Grid>
                    <Grid item md={2} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                        {isUserRoleCompare[0]?.adiscount && (
                            <>
                                <Link to={'/product/discount/create'} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
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
                    <>
                        <Box>
                            <TableContainer component={Paper} >
                                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="discounttable">
                                    <TableHead>
                                        <StyledTableRow>
                                            <StyledTableCell>Actions</StyledTableCell>
                                            <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('businesslocation')}><Box sx={userStyle.tableheadstyle}><Box>Location</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('businesslocation')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('discountid')}><Box sx={userStyle.tableheadstyle}><Box>Discount ID</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('discountid')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('name')}><Box sx={userStyle.tableheadstyle}><Box>Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('name')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('products')}><Box sx={userStyle.tableheadstyle}><Box>Product Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('products')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('category')}><Box sx={userStyle.tableheadstyle}><Box>Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('category')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('subcategory')}><Box sx={userStyle.tableheadstyle}><Box>Sub Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subcategory')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('brand')}><Box sx={userStyle.tableheadstyle}><Box>Brand</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('brand')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('subbrand')}><Box sx={userStyle.tableheadstyle}><Box>Sub Brand</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subbrand')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('purchaseexcludetax')}><Box sx={userStyle.tableheadstyle}><Box>Purchase Excluding Tax</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('purchaseexcludetax')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('pruchaseincludetax')}><Box sx={userStyle.tableheadstyle}><Box>Purchase Including Tax</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('pruchaseincludetax')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('sellingvalue')}><Box sx={userStyle.tableheadstyle}><Box>Selling Tax</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sellingvalue')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('discounttype')}><Box sx={userStyle.tableheadstyle}><Box>Discount Type</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('discounttype')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('selectdiscountprice')}><Box sx={userStyle.tableheadstyle}><Box>Select Discount Price</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('selectdiscountprice')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('discountamt')}><Box sx={userStyle.tableheadstyle}><Box>Discount Amount</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('discountamt')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('discountvalue')}><Box sx={userStyle.tableheadstyle}><Box>Discount Value</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('discountvalue')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('startsat')}><Box sx={userStyle.tableheadstyle}><Box>Start At	</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('startsat')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('endsat')}><Box sx={userStyle.tableheadstyle}><Box>Ends At</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('endsat')}</Box></Box></StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData.length > 0 ?
                                            (filteredData.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell >
                                                        <Grid sx={{ display: 'flex' }}>
                                                            {isUserRoleCompare[0]?.ediscount && (<Link to={`/product/discount/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonedit} style={{ minWidth: '0px' }}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>)}
                                                            {isUserRoleCompare[0]?.ddiscount && (<Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowData(row._id) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>)}
                                                            {isUserRoleCompare[0]?.vunit && (
                                                                <>
                                                                    <Link to={`/product/discount/view/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                                                </>
                                                            )}
                                                        </Grid>
                                                    </StyledTableCell>
                                                    <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                    <StyledTableCell component="th" scope="row">{isLocations?.map((data, i) => data.locationid.includes(row.businesslocation) ? data.name + " " : "")}</StyledTableCell>
                                                    <StyledTableCell>{row.discountid}</StyledTableCell>
                                                    <StyledTableCell>{row.name}</StyledTableCell>
                                                    <StyledTableCell>{row.products}</StyledTableCell>
                                                    <StyledTableCell>{row.category}</StyledTableCell>
                                                    <StyledTableCell>{row.subcategory}</StyledTableCell>
                                                    <StyledTableCell>{row.brand}</StyledTableCell>
                                                    <StyledTableCell>{row.subbrand}</StyledTableCell>
                                                    <StyledTableCell>{row.purchaseexcludetax}</StyledTableCell>
                                                    <StyledTableCell>{row.pruchaseincludetax}</StyledTableCell>
                                                    <StyledTableCell>{row.sellingvalue}</StyledTableCell>
                                                    <StyledTableCell>{row.discounttype}</StyledTableCell>
                                                    <StyledTableCell>{row.selectdiscountprice}</StyledTableCell>
                                                    <StyledTableCell>{row.discountamt}</StyledTableCell>
                                                    <StyledTableCell>{row.discountvalue}</StyledTableCell>
                                                    <StyledTableCell>{row.startsat}</StyledTableCell>
                                                    <StyledTableCell>{row.endsat}</StyledTableCell>
                                                </StyledTableRow>
                                            )))
                                            : <StyledTableRow><StyledTableCell colSpan={18} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer><br /><br />
                            <Box style={userStyle.dataTablestyle}>
                                <Box>
                                    Showing {filteredData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
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
                            <br /><br />
                            {pageSize != 1 ? <Grid >
                                {isUserRoleCompare[0]?.adiscount && (
                                    <>
                                        <Link to={'/product/discount/create'} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
                                    </>
                                )}
                            </Grid> : null}
                            <br />
                        </Box>
                    </>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                        </Box>
                    </>
                )}


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
                        <Button onClick={(e) => deleteDiscount(discountid)} autoFocus variant="contained" color='error'> OK </Button>
                    </DialogActions>
                </Dialog>

                { /* ****** Print ****** */}
                <Box sx={userStyle.printcls} >
                    <Box>
                        <Typography variant='h5' >Pos</Typography>
                    </Box>
                    <>
                        <Box  >
                            <TableContainer component={Paper} sx={userStyle.printcls}>
                                <Table aria-label="simple table" id="discounttablepdf" ref={componentRef}>
                                    <TableHead sx={{ fontWeight: "600" }} >
                                        <StyledTableRow >
                                            <StyledTableCell>Sno</StyledTableCell>
                                            <StyledTableCell>Location </StyledTableCell>
                                            <StyledTableCell>Discount ID</StyledTableCell>
                                            <StyledTableCell>Name</StyledTableCell>
                                            <StyledTableCell>Product name</StyledTableCell>
                                            <StyledTableCell>Category</StyledTableCell>
                                            <StyledTableCell>Sub category</StyledTableCell>
                                            <StyledTableCell>Brand</StyledTableCell>
                                            <StyledTableCell>Sub Brand</StyledTableCell>
                                            <StyledTableCell>Purchase Excluding Tax</StyledTableCell>
                                            <StyledTableCell>Purchase Including Tax</StyledTableCell>
                                            <StyledTableCell>Selling Tax</StyledTableCell>
                                            <StyledTableCell>Discount Type </StyledTableCell>
                                            <StyledTableCell>Select Discount Price</StyledTableCell>
                                            <StyledTableCell>Discount Amount </StyledTableCell>
                                            <StyledTableCell>Discount value </StyledTableCell>
                                            <StyledTableCell>Start At </StyledTableCell>
                                            <StyledTableCell>Ends At </StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {discounts.length > 0 &&
                                            (discounts.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                                    <StyledTableCell component="th" scope="row">{isLocations?.map((data, i) => data.locationid.includes(row.businesslocation) ? data.name + " " : "")}</StyledTableCell>
                                                    <StyledTableCell>{row.discountid}</StyledTableCell>
                                                    <StyledTableCell>{row.name}</StyledTableCell>
                                                    <StyledTableCell>{row.products}</StyledTableCell>
                                                    <StyledTableCell>{row.category}</StyledTableCell>
                                                    <StyledTableCell>{row.subcategory}</StyledTableCell>
                                                    <StyledTableCell>{row.brand}</StyledTableCell>
                                                    <StyledTableCell>{row.subbrand}</StyledTableCell>
                                                    <StyledTableCell>{row.purchaseexcludetax}</StyledTableCell>
                                                    <StyledTableCell>{row.pruchaseincludetax}</StyledTableCell>
                                                    <StyledTableCell>{row.sellingvalue}</StyledTableCell>
                                                    <StyledTableCell>{row.discounttype}</StyledTableCell>
                                                    <StyledTableCell>{row.selectdiscountprice}</StyledTableCell>
                                                    <StyledTableCell>{row.discountamt}</StyledTableCell>
                                                    <StyledTableCell>{row.discountvalue}</StyledTableCell>
                                                    <StyledTableCell>{row.startsat}</StyledTableCell>
                                                    <StyledTableCell>{row.endsat}</StyledTableCell>
                                                </StyledTableRow>
                                            )))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </>
                </Box>
            </Box>
        </Box>
    );
}
const Discountlist = () => {
    return (
        <>
            <Discountlisttable /><br /><br /><br /><br />
            <Footer />
        </>
    );
}
export default Discountlist;