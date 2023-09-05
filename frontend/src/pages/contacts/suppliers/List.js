import React, { useState, useEffect, useRef, useContext, createRef } from "react";
import { Box, Select, MenuItem, FormControl, OutlinedInput, Typography, FormControlLabel, Grid, Checkbox, Paper, Table, TableBody, TableHead, TableContainer, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import Headtitle from '../../../components/header/Headtitle';
import { ThreeDots } from 'react-loader-spinner';
import { useReactToPrint } from "react-to-print";
import axios from 'axios';
import jsPDF from "jspdf";
import { FaPrint, FaFilePdf, } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ExportXL, ExportCSV } from '../../Export';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import { UserRoleAccessContext } from '../../../context/Appcontext';

function Supplierlisttable() {

    const { auth, setngs } = useContext(AuthContext);
    const [isLoader, setIsLoader] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [isSuppliers, setIsSuppliers] = useState([]);
    const [isAllSuppliers, setAllIsSuppliers] = useState([]);
    const [deletesup, setDeletesup] = useState({});
    const [exceldata, setExceldata] = useState([]);
    const [checkSupplier, setCheckSupplier] = useState([])
    const [checkRtnSupplier, setCheckRtnSupplier] = useState([])

    // Datatable 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    const [isPdfData, setIsPdfData] = useState({
        isSupplierId: false, isSupplierName: false, isAddressOne: false, isAddressTwo: false,
        isCountry: false, isState: false, isCity: false, isPincode: false, isEmail: false, isGstn: false,
        isPhone: false, isPhtwo: false, isPhthree: false, isPhfour: false, isLandline: false, isWhatsapp: false,
        isPurDue: false, isPurRtnDue: false, isContact: false, isCreditdays: false,
    })

    // User Access
    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);

    // Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleClose = () => { setIsDeleteOpen(false); };

    // check delete
    const [isCheckOpen, setIsCheckOpen] = useState(false);
    const handleClickOpenCheck = () => { setIsCheckOpen(true); };
    const handleCloseCheck = () => { setIsCheckOpen(false); };

    // Pdf
    const [openPdf, setOpenPdf] = useState(false);
    const handleOpenPdf = () => { setOpenPdf(true); };
    const handleClosePdf = () => { setOpenPdf(false); };

    // Suppliers
    const fetchSuppliers = async () => {
        try {
            let res = await axios.post(SERVICE.SUPPLIER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setSuppliers(res?.data?.suppliers);
            setIsSuppliers(res?.data?.suppliers);
            setAllIsSuppliers(res?.data?.suppliers);
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

    //set function to get particular row
    const rowData = async (id, suppliername) => {
        try {
            const [
                res, reqpur, reqpurrtn
            ] = await Promise.all([
                axios.get(`${SERVICE.SUPPLIER_SINGLE}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                }),
                axios.post(SERVICE.PURCHASE_DELETE_SUPPLIER_CHECK, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid),
                    role: String(isUserRoleAccess.role),
                    userassignedlocation: [isUserRoleAccess.businesslocation],
                    checksupplier: String(suppliername)
                }),
                axios.post(SERVICE.PURCHASERTN_DELETE_SUPPLIER_CHECK, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid),
                    role: String(isUserRoleAccess.role),
                    userassignedlocation: [isUserRoleAccess.businesslocation],
                    checksupplier: String(suppliername)
                })
            ])

            setDeletesup(res?.data?.ssupplier);
            setCheckSupplier(reqpur?.data?.purchases)
            setCheckRtnSupplier(reqpurrtn?.data?.purchasesrtn)

            if ((reqpur?.data?.purchases)?.length > 0 || (reqpurrtn?.data?.purchasesrtn)?.length > 0) {
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

    // Alert delete popup
    let supid = deletesup._id;
    const deleteSupplier = async () => {
        try {
            let res = await axios.delete(`${SERVICE.SUPPLIER_SINGLE}/${supid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            await fetchSuppliers();
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
            fetchSuppliers();
        }, [isPdfData]
    )

    // Excel
    const fileName = 'Suppliers'
    // get particular columns for export excel
    const getexcelDatas = async () => {
        var data = isAllSuppliers.map((t,index)=> ({
            sno: index+1 ,
            autogenerate: t.autogenerate,
            suppliername: t.suppliername,
            suppliershortname: t.suppshortname,
            addressone: t.addressone,
            addresstwo: t.addresstwo,
            country: t.country,
            state: t.state,
            city: t.city,
            pincode: t.pincode,
            supplieremail: t.supplieremail,
            gstn: t.gstn,
            phoneone: t.phoneone,
            phonetwo: t.phonetwo,
            phonethree: t.phonethree,
            phonefour: t.phonefour,
            whatsapp: t.whatsapp,
            landline: t.landline,
            contactperson: t.contactperson,
            creditdays: t.creditdays
        }));
        setExceldata(data);
    }

    useEffect(
        () => {
            getexcelDatas();
        }, [suppliers]
    )

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = suppliers?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [suppliers])


    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'HIPOS | SUPPLIERS LIST',
        pageStyle: 'print'
    });

    const ref = createRef();
    const options = {
        orientation: 'portrait',
        unit: 'in'
    };

    // PDF
    // var nestedArray = [];

    // {
    //     isAllSuppliers && (isAllSuppliers.map((item, index) => {
    //         var cateData = [
    //             item.autogenerate,
    //             item.suppliername,
    //             item.addressone,
    //             item.addresstwo,
    //             item.country,
    //             item.state,
    //             item.city,
    //             item.pincode,
    //             item.supplieremail,
    //             item.gstn,
    //             item.phoneone,
    //             item.phonetwo,
    //             item.phonethree,
    //             item.phonefour,
    //             item.landline,
    //             item.whatsapp,
    //             item.contactperson,
    //             item.creditdays,
    //         ]
    //         nestedArray.push(cateData);
    //     })
    //     )
    // }

    // const downloadpdf = () => {
    //     const newData = isSuppliers.map(row => {
    //         delete row._id;
    //         delete row.createdAt;
    //         delete row.__v;
    //         delete row.assignbusinessid;

    //         { !isPdfData.isSupplierId && delete row.autogenerate };
    //         { !isPdfData.isSupplierName && delete row.suppliername };
    //         { !isPdfData.isAddressOne && delete row.addressone };
    //         { !isPdfData.isAddressTwo && delete row.addresstwo };
    //         { !isPdfData.isCountry && delete row.country };
    //         { !isPdfData.isState && delete row.state };
    //         { !isPdfData.isCity && delete row.city };
    //         { !isPdfData.isPincode && delete row.pincode };
    //         { !isPdfData.isEmail && delete row.supplieremail };
    //         { !isPdfData.isGstn && delete row.gstn };
    //         { !isPdfData.isPhone && delete row.phoneone };
    //         { !isPdfData.isPhtwo && delete row.phonetwo };
    //         { !isPdfData.isPhthree && delete row.phonethree };
    //         { !isPdfData.isPhfour && delete row.phonefour };
    //         { !isPdfData.isLandline && delete row.landline };
    //         { !isPdfData.isWhatsapp && delete row.whatsapp };
    //         { !isPdfData.isContact && delete row.contactperson };
    //         { !isPdfData.isCreditdays && delete row.creditdays };

    //         setIsPdfData(row);
    //         handleClosePdf();
    //     })

    //     const doc = new jsPDF()
    //     doc.autoTable({
    //         theme: "grid",
    //         body: isSuppliers,
    //         columnStyles: {
    //             0: { cellWidth: 17 },
    //             1: { cellWidth: 17 },
    //             2: { cellWidth: 17 },
    //             3: { cellWidth: 17 },
    //             4: { cellWidth: 17 },
    //             5: { cellWidth: 17 },
    //             6: { cellWidth: 17 },
    //             7: { cellWidth: 17 },
    //             8: { cellWidth: 17 },
    //             9: { cellWidth: 17 },
    //             10: { cellWidth: 14 },
    //             11: { cellWidth: 16 },
    //             12: { cellWidth: 16 },
    //             13: { cellWidth: 16 },
    //             14: { cellWidth: 16 },
    //             15: { cellWidth: 16 },
    //             16: { cellWidth: 16 },
    //             17: { cellWidth: 14 },
    //             18: { cellWidth: 16 },
    //         }
    //     })
    //     doc.save('suppliers.pdf')
    // }

    const columns = [
        { title: "SupplierNumber", field: "autogenerate" },
        { title: "Name", field: "suppliername" },
        { title: "Short Name", field: "suppshortname" },
        { title: "Addressone", field: "addressone" },
        { title: "Addresstwo", field: "addresstwo" },
        { title: "Country", field: "country" },
        { title: "State", field: "state" },
        { title: "City", field: "city" },
        { title: "Pincode", field: "pincode" },
        { title: "Supplieremail", field: "supplieremail" },
        { title: "Gstn", field: "gstn" },
        { title: "Phoneone", field: "phoneone" },
        { title: "Phonetwo", field: "phonetwo" },
        { title: "Phonethree", field: "phonethree" },
        { title: "Phonefour", field: "phonefour" },
        { title: "Gstnlandline", field: "gstnlandline" },
        { title: "Whatsapp", field: "whatsapp" },
        { title: "Contactperson", field: "contactperson" },
        { title: "Creditdays", field: "creditdays" },
    ]

    // const downloadPdf = () => {
    //     const doc = new jsPDF();
    //     doc.autoTable({
    //         theme: "grid",
    //         styles: {
    //             fontSize: 3,
    //         },
    //         columns: columns.map((col) => ({ ...col, dataKey: col.field })),
    //         body: isSuppliers,
    //     });
    //     doc.save("Supplier.pdf");
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
            doc.save("Suppliers.pdf");
        };

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
        <Box >
            <Headtitle title={'Suppliers'} />
            { /* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Suppliers  <Typography component="span" sx={userStyle.SubHeaderText}>Manage your Suppliers</Typography></Typography>

            { /* ****** Table Start ****** */}
            <>
                <Box sx={userStyle.container} >
                    { /* ****** Header Content ****** */}
                    <Grid container spacing={2}>
                        <Grid item md={2} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                            <Typography sx={userStyle.importheadtext}>All your Suppliers</Typography>
                        </Grid>
                        <Grid item md={8} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                            <Grid>
                                {isUserRoleCompare[0]?.csvsupplier && (
                                    <>
                                        <ExportCSV csvData={exceldata} fileName={fileName} />
                                    </>
                                )}
                                {isUserRoleCompare[0]?.excelsupplier && (
                                    <>
                                        <ExportXL csvData={exceldata} fileName={fileName} />
                                    </>
                                )}
                                {isUserRoleCompare[0]?.printsupplier && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                    </>
                                )}
                                {isUserRoleCompare[0]?.pdfsupplier && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                    </>
                                )}
                            </Grid>
                        </Grid>
                        <Grid item sm={12} xs={12} md={2} sx={{ display: "flex", justifyContent: "center" }} >
                            {isUserRoleCompare[0]?.asupplier && (
                                <>
                                    <Grid item md={2} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                                        <Link to={'/contact/supplier/create'} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button variant="contained" sx={userStyle.buttonadd}>ADD</Button></Link>
                                    </Grid>
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
                            { /* ****** Table start ****** */}
                            <TableContainer component={Paper} >
                                <Table aria-label="simple table" id="suppliertable">
                                    <TableHead sx={{ fontWeight: "600" }} >
                                        <StyledTableRow >
                                            <StyledTableCell>Actions</StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('autogenerate')}><Box sx={userStyle.tableheadstyle}><Box>Supplier Code</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('autogenerate')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('suppliername')}><Box sx={userStyle.tableheadstyle}><Box>Supplier Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('suppliername')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('suppshortname')}><Box sx={userStyle.tableheadstyle}><Box>Supplier ShortName</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('suppshortname')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('addressone')}><Box sx={userStyle.tableheadstyle}><Box>Address1</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('addressone')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('addresstwo')}><Box sx={userStyle.tableheadstyle}><Box>Address2</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('addresstwo')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('country')}><Box sx={userStyle.tableheadstyle}><Box>Country</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('country')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('state')}><Box sx={userStyle.tableheadstyle}><Box>State</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('state')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('city')}><Box sx={userStyle.tableheadstyle}><Box>City</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('city')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('pincode')}><Box sx={userStyle.tableheadstyle}><Box>Pincode</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('pincode')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('supplieremail')}><Box sx={userStyle.tableheadstyle}><Box>Email</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('supplieremail')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('gstn')}><Box sx={userStyle.tableheadstyle}><Box>GSTN</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('gstn')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('phoneone')}><Box sx={userStyle.tableheadstyle}><Box>Mobile</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('phoneone')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('landline')}><Box sx={userStyle.tableheadstyle}><Box>Landline</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('landline')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('whatsapp')}><Box sx={userStyle.tableheadstyle}><Box>Whatsapp</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('whatsapp')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('contactperson')}><Box sx={userStyle.tableheadstyle}><Box>Contact Person Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('contactperson')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('creditdays')}><Box sx={userStyle.tableheadstyle}><Box>Credit Days</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('creditdays')}</Box></Box></StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData.length > 0 ?
                                            (filteredData.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell component="th" scope="row" colSpan={1}>
                                                        <Grid sx={{ display: 'flex' }}>
                                                            {isUserRoleCompare[0]?.esupplier && (<Link to={`/contact/supplier/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonedit} style={{ minWidth: '0px' }}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>)}
                                                            {isUserRoleCompare[0]?.dsupplier && (<Button sx={userStyle.buttondelete} onClick={(e) => { rowData(row._id, row.suppliername) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>)}
                                                            {isUserRoleCompare[0]?.vsupplier && (<Link to={`/contact/supplier/view/${row._id}`} style={{ textDecoration: 'none', color: 'white', }}><Button sx={userStyle.buttonview}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>)}
                                                        </Grid>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">{row.serialNumber}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.autogenerate}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.suppliername}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.suppshortname}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.addressone}</StyledTableCell >
                                                    <StyledTableCell align="left">{row.addresstwo}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.country}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.state}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.city}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.pincode}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.supplieremail}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.gstn}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.phoneone}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.landline}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.whatsapp}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.contactperson}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.creditdays}</StyledTableCell>
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
                            </Box>
                            { /* ****** Table End ****** */}
                            <br />
                            <br />
                            {pageSize != 1 ? <Grid >
                                {isUserRoleCompare[0]?.asupplier && (
                                    <>
                                        <Grid  >
                                            <Link to={'/contact/supplier/create'} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button variant="contained" sx={userStyle.buttonadd}>ADD</Button></Link>
                                        </Grid>
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
            </>

            { /* ****** Print ****** */}
            <Box sx={userStyle.printcls} >
                <Box>
                    <Typography variant='h5' >Suppliers Print</Typography>
                </Box>
                <>
                    <Box>
                        <TableContainer component={Paper} sx={userStyle.printcls}>
                            <Table aria-label="simple table" id="suppliertable2" ref={componentRef}>
                                <TableHead sx={{ fontWeight: "600" }} >
                                    <StyledTableRow >
                                    <StyledTableCell>Sno</StyledTableCell>
                                        <StyledTableCell>Supplier Code</StyledTableCell>
                                        <StyledTableCell>Supplier Name</StyledTableCell>
                                        <StyledTableCell>Supplier short Name</StyledTableCell>
                                        <StyledTableCell>Address1</StyledTableCell>
                                        <StyledTableCell>Address2</StyledTableCell>
                                        <StyledTableCell>Country</StyledTableCell>
                                        <StyledTableCell>State</StyledTableCell>
                                        <StyledTableCell>City</StyledTableCell>
                                        <StyledTableCell>Pincode</StyledTableCell>
                                        <StyledTableCell>Email</StyledTableCell>
                                        <StyledTableCell>GSTN</StyledTableCell>
                                        <StyledTableCell>Mobile</StyledTableCell>
                                        <StyledTableCell>Landline</StyledTableCell>
                                        <StyledTableCell>Whatsapp</StyledTableCell>
                                        <StyledTableCell>Contact Person Name</StyledTableCell>
                                        <StyledTableCell>Credit Days</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {isAllSuppliers.length > 0 && (
                                        isAllSuppliers.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell>{index + 1}</StyledTableCell>
                                                <StyledTableCell align="left">{row.autogenerate}</StyledTableCell>
                                                <StyledTableCell align="left">{row.suppliername}</StyledTableCell>
                                                <StyledTableCell align="left">{row.suppshortname}</StyledTableCell>
                                                <StyledTableCell align="left">{row.addressone}</StyledTableCell >
                                                <StyledTableCell align="left">{row.addresstwo}</StyledTableCell>
                                                <StyledTableCell align="left">{row.country}</StyledTableCell>
                                                <StyledTableCell align="left">{row.state}</StyledTableCell>
                                                <StyledTableCell align="left">{row.city}</StyledTableCell>
                                                <StyledTableCell align="left">{row.pincode}</StyledTableCell>
                                                <StyledTableCell align="left">{row.supplieremail}</StyledTableCell>
                                                <StyledTableCell align="left">{row.gstn}</StyledTableCell>
                                                <StyledTableCell align="left">{row.phoneone}</StyledTableCell>
                                                <StyledTableCell align="left">{row.landline}</StyledTableCell>
                                                <StyledTableCell align="left">{row.whatsapp}</StyledTableCell>
                                                <StyledTableCell align="left">{row.contactperson}</StyledTableCell>
                                                <StyledTableCell align="left">{row.creditdays}</StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </>
            </Box>

            {/* PDF Model */}
            <Box>
                <Dialog
                    open={openPdf}
                    onClose={handleClosePdf}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                >
                    <DialogTitle id="alert-dialog-title">
                        Select Option to Print PDF
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Typography variant="subtitle1">Choose any 6</Typography>
                            <Grid container spacing={2}>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControlLabel control={<Checkbox checked={isPdfData.isSupplierId} onChange={(e) => { setIsPdfData({ ...isPdfData, isSupplierId: !isPdfData.isSupplierId }) }} />} label="Supplier Code" />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControlLabel control={<Checkbox checked={isPdfData.isSupplierName} onChange={(e) => setIsPdfData({ ...isPdfData, isSupplierName: !isPdfData.isSupplierName })} />} label="Supplier Name" />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControlLabel control={<Checkbox checked={isPdfData.isAddressOne} onChange={(e) => setIsPdfData({ ...isPdfData, isAddressOne: !isPdfData.isAddressOne })} />} label="Address 1" />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControlLabel control={<Checkbox checked={isPdfData.isAddressTwo} onChange={(e) => setIsPdfData({ ...isPdfData, isAddressTwo: !isPdfData.isAddressTwo })} />} label="Address 2" />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControlLabel control={<Checkbox checked={isPdfData.isCountry} onChange={(e) => setIsPdfData({ ...isPdfData, isCountry: !isPdfData.isCountry })} />} label="Country" />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControlLabel control={<Checkbox checked={isPdfData.isState} onChange={(e) => setIsPdfData({ ...isPdfData, isState: !isPdfData.isState })} />} label="State" />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControlLabel control={<Checkbox checked={isPdfData.isCity} onChange={(e) => setIsPdfData({ ...isPdfData, isCity: !isPdfData.isCity })} />} label="City" />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControlLabel control={<Checkbox checked={isPdfData.isPincode} onChange={(e) => setIsPdfData({ ...isPdfData, isPincode: !isPdfData.isPincode })} />} label="Pincode" />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControlLabel control={<Checkbox checked={isPdfData.isEmail} onChange={(e) => setIsPdfData({ ...isPdfData, isEmail: !isPdfData.isEmail })} />} label="Email" />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControlLabel control={<Checkbox checked={isPdfData.isGstn} onChange={(e) => setIsPdfData({ ...isPdfData, isGstn: !isPdfData.isGstn })} />} label="GSTN" />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControlLabel control={<Checkbox checked={isPdfData.isPhone} onChange={(e) => setIsPdfData({ ...isPdfData, isPhone: !isPdfData.isPhone })} />} label="Phone1" />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControlLabel control={<Checkbox checked={isPdfData.isPhtwo} onChange={(e) => setIsPdfData({ ...isPdfData, isPhtwo: !isPdfData.isPhtwo })} />} label="Phone2" />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControlLabel control={<Checkbox checked={isPdfData.isPhthree} onChange={(e) => setIsPdfData({ ...isPdfData, isPhthree: !isPdfData.isPhthree })} />} label="Phone3" />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControlLabel control={<Checkbox checked={isPdfData.isPhfour} onChange={(e) => setIsPdfData({ ...isPdfData, isPhfour: !isPdfData.isPhfour })} />} label="Phone4" />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControlLabel control={<Checkbox checked={isPdfData.isLandline} onChange={(e) => setIsPdfData({ ...isPdfData, isLandline: !isPdfData.isLandline })} />} label="Landline" />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControlLabel control={<Checkbox checked={isPdfData.isWhatsapp} onChange={(e) => setIsPdfData({ ...isPdfData, isWhatsapp: !isPdfData.isWhatsapp })} />} label="Whatsapp" />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControlLabel control={<Checkbox checked={isPdfData.isContact} onChange={(e) => setIsPdfData({ ...isPdfData, isContact: !isPdfData.isContact })} />} label="Contact Person" />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControlLabel control={<Checkbox checked={isPdfData.isCreditdays} onChange={(e) => setIsPdfData({ ...isPdfData, isCreditdays: !isPdfData.isCreditdays })} />} label="Credit Days" />
                                </Grid>
                            </Grid>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='contained' color='primary' onClick={() => downloadPdf()} autoFocus>PDF</Button>
                        <Button variant='contained' color='error' onClick={handleClosePdf}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* Delete Modal */}
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
                    <Button autoFocus variant="contained" color='error' onClick={(e) => deleteSupplier(supid)}> OK </Button>
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
                        {checkSupplier?.length > 0 || checkRtnSupplier?.length > 0 ? (
                            <>
                                <span style={{ fontWeight: '700', color: '#777' }}>
                                    {`${deletesup.suppliername} `}
                                </span>
                                was linked in <span style={{ fontWeight: '700' }}>Purchase & Purchase Return</span>
                            </>
                        ) : checkSupplier?.length > 0 || checkRtnSupplier?.length > 0 ? (
                            <>
                                <span style={{ fontWeight: '700', color: '#777' }}>
                                    {`${deletesup.suppliername} `}
                                </span>
                                was linked in{' '}
                                <span style={{ fontWeight: '700' }}>
                                    {checkSupplier?.length ? ' Purchase' : ''}
                                    {checkRtnSupplier?.length ? ' Purchae Return' : ''}
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

function Supplierlist() {
    return (
       <>
        <Supplierlisttable /><br /><br /><br /><br />
                    <Footer />
       </>
    );
}
export default Supplierlist;