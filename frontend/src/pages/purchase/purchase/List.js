import React, { useState, useEffect, useRef, useContext, createRef } from "react";
import { Box, Button, Select, MenuItem, FormControl, OutlinedInput, Typography, DialogContent, Paper, TableHead, Table, TableContainer, TableBody, Dialog, TableFooter, DialogActions, Grid } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import pdfIcon from "../../../assets/images/pdf-icon.png";
import wordIcon from "../../../assets/images/word-icon.png";
import excelIcon from "../../../assets/images/excel-icon.png";
import csvIcon from "../../../assets/images/CSV.png";
import fileIcon from "../../../assets/images/file-icons.png";
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import { userStyle } from '../../PageStyle';
import { makeStyles } from "@material-ui/core";
import "rsuite/dist/rsuite.css";
import Footer from '../../../components/footer/Footer';
import Headtitle from '../../../components/header/Headtitle';
import moment from 'moment';
import axios from 'axios';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { toast } from 'react-toastify';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext } from '../../../context/Appcontext';
import { useReactToPrint } from "react-to-print"
import { ExportXL, ExportCSV } from '../../Export';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import autoTable from 'jspdf-autotable';
import jsPDF from "jspdf";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { FaExpand } from "react-icons/fa";

const useStyles = makeStyles((theme) => ({
    inputs: {
        display: "none",
    },
    preview: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: theme.spacing(2),
        "& > *": {
            margin: theme.spacing(1),
        },
    },
}));

const Purchasetablelist = () => {

    const { auth, setngs } = useContext(AuthContext);
    const [isLoader, setIsLoader] = useState(false);
    const [purchases, setPurchases] = useState([]);
    const [deletepur, setDeletepur] = useState({});
    const [exceldata, setExceldata] = useState([]);
    const [isLocations, setIsLocations] = useState([]);
    const { isUserRoleCompare, allLocations, isUserRoleAccess, setAllPurchases } = useContext(UserRoleAccessContext);
    const classes = useStyles();
    // Datatable 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    //  File Upload
    const [files, setFiles] = useState([]);
    const [fileId, setFileId] = useState("");

    // Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleClose = () => { setIsDeleteOpen(false); };
    const [viewImage, setViewImage] = useState("");
    const [showFullscreen, setShowFullscreen] = useState(false);
    // download  model
    const [download, setDownload] = useState([])
    const [isOpendownload, setIsOpenDownload] = useState(false);
    const handleOpenDownload = () => { setIsOpenDownload(true); };
    const handleCloseDownload = () => { setIsOpenDownload(false); };

    // view model
    const [indexData, setIndex] = useState("");
    const [todoCheck, setTodoCheck] = useState(false);

    const [openview, setOpenview] = useState(false);

    let total = 0;
    let sum = 0;
    let btnval;

    const getFileIcon = (fileName) => {
        const extension = fileName.split(".").pop();
        switch (extension) {
            case "pdf":
                return pdfIcon;
            case "doc":
            case "docx":
                return wordIcon;
            case "xls":
            case "xlsx":
                return excelIcon;
            case "csv":
                return csvIcon;
            default:
                return fileIcon;
        }
    };

    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
    };
    const handleFullscreenClick = () => {
        setShowFullscreen(true);
    };
    const handleFullscreenClose = () => {
        setShowFullscreen(false);
    };


    //set function to get particular row
    const rowgetimages = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.PURCHASE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setFiles(res?.data?.spurchse.files);
            handleOpenDownload()
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    // Purchase 
    const fetchPurchase = async () => {
        try {
            let res = await axios.post(SERVICE.PURCHASELIST, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });
            setIsLocations(allLocations);
            setPurchases(res?.data?.purchases);
            setIsLoader(true)
            fetchAllPurchase();
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

    const fetchAllPurchase = async () => {
        try {
            let res = await axios.post(SERVICE.PURCHASE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });
            setAllPurchases(res?.data?.purchases);
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
            fetchPurchase();
        }, []);


    const handleFileUpload = (event, id, previousfiles) => {
        const filesname = event.target.files;
        let newSelectedFiles = [...previousfiles];
        for (let i = 0; i < filesname.length; i++) {
            const file = filesname[i];
            // Check if the file is an image
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png', 'pdf'].includes(fileExtension)) {
                const reader = new FileReader();
                reader.onload = () => {
                    newSelectedFiles.push({
                        name: file.name,
                        preview: reader.result,
                        data: reader.result.split(',')[1]
                        // index: indexData
                    });
                    // setFiles(newSelectedFiles);
                    updateDocument(id, newSelectedFiles);
                };
                reader.readAsDataURL(file);
            }
            else {
                // Display an error message or take appropriate action for unsupported file types
                toast.error('Unsupported file type. Only images and PDFs are allowed.');
            }
        }
    };

    const updateDocument = async (id, allfile) => {

        try {
            // Use the 'files' state instead of the local variable 'files'
            let req = await axios.put(
                `${SERVICE.PURCHASE_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                userbyadd: String(isUserRoleAccess.staffname),
                files: allfile,
            },

            );
            setIsLoader(true)
            toast.success('File uploaded successfully!', {
                position: toast.POSITION.TOP_CENTER,
            });
            await fetchPurchase();
        } catch (err) {
            setIsLoader(true)
            const messages = err?.response?.data?.message;
            if (messages) {
                if (messages == "request entity too large") {
                    toast.warning("Document Size Can't more than 5MB!");
                } else {
                    toast.warning(messages);
                }
            } else {
                toast.warning("Something went wrong!");
            }
        }
    };

    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    //set function to get particular row
    const rowDataDel = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.PURCHASE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setDeletepur(res?.data?.spurchse);
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
    let supid = deletepur._id;

    const deletePurchase = async () => {
        try {
            let res = await axios.delete(`${SERVICE.PURCHASE_SINGLE}/${supid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            await fetchPurchase();
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

    //Excel
    let fileName = "purchases"
    //  get particular columns for export excel
    const getexcelDatas = async () => {

        let data = purchases.map((t, index) => ({
            "Sno": index + 1, date: moment(t.purchasedate).format('DD-MM-YYYY'), referencenumber: t.referenceno, location: t.businesslocation, supplier: t.supplier, billamount: t.billamount, invoiceno: t.invoiceno, purchasestatus: t.purchasestatus, paymentmethod: t.paymentmethod, nettotal: t.nettotal, paydue: t.paydue, userbyadd: t.userbyadd,
        }));
        setExceldata(data);
    }

    useEffect(
        () => {
            getexcelDatas()
        }, [purchases]);

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Purchase',
        pageStyle: 'print'
    });
    const ref = createRef();
    const options = {
        orientation: 'portrait',
        unit: 'in'
    };

    const columns = [
        { title: "Date", field: "purchasedate" },
        { title: "ReferenceNo", field: "referenceno" },
        { title: "Location", field: "businesslocation" },
        { title: "Supplier", field: "supplier" },
        { title: "BillAmount", field: "billamount" },
        { title: "InvoiceNo", field: "invoiceno" },
        { title: "PurchaseStatus", field: "purchasestatus" },
        { title: "PaymentStatus", field: "paymentmethod" },
        { title: "GrandTotal", field: "nettotal" },
        { title: "PaymentDue", field: "paydue" },
        { title: "Added By", field: "userbyadd" },
    ]

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = purchases?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [purchases])

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
            columns: columnsWithSerial,
            body: itemsWithSerial,
        });
        doc.save("Purchase.pdf");
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

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    return (
        <>
            <Box>
                <Headtitle title={'Purchases'} />
                <Typography sx={userStyle.HeaderText}>Purchases</Typography>
            </Box>
            {/* //table----------------------------------------------- */}
            <Box sx={userStyle.container}>
                { /* Table header  */}

                <Grid container spacing={2}>
                    <Grid item md={2} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                        <Typography sx={userStyle.importheadtext}>All your Purchases</Typography>
                    </Grid>
                    <Grid item md={8} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                        <Grid>
                            {isUserRoleCompare[0]?.csvpurchase && (
                                <>
                                    <ExportCSV csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0]?.excelpurchase && (
                                <>
                                    <ExportXL csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0]?.printpurchase && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                </>
                            )}
                            {isUserRoleCompare[0]?.pdfpurchase && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                </>
                            )}
                        </Grid>
                    </Grid>
                    <Grid item sm={12} xs={12} md={2} sx={{ display: "flex", justifyContent: "center" }} >
                        {isUserRoleCompare[0]?.apurchase && (
                            <>
                                <Link to="/purchase/purchase/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
                            </>
                        )}
                    </Grid>
                </Grid><br /><br />

                <Grid container >
                    <Grid lg={12} md={12} sm={12} xs={12} style={userStyle.dataTablestyle}>
                        <Box>
                            <label htmlFor="pageSizeSelect">Show&ensp;</label>
                            <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                                <MenuItem value={(purchases.length)}>All</MenuItem>
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
                    </Grid><br /><br /><br></br>

                </Grid> <br /><br />
                { /* Table start */}
                {isLoader ? (
                    <>
                        <Box>
                            <TableContainer component={Paper} >
                                <Table aria-label="customized table" id="purchasetable">
                                    <TableHead>
                                        <StyledTableRow>
                                            <StyledTableCell> Action </StyledTableCell>
                                            <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('purchasedate')}><Box sx={userStyle.tableheadstyle}><Box>Date</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('purchasedate')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('referenceno')}><Box sx={userStyle.tableheadstyle}><Box>Reference No</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('referenceno')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('businesslocation')}><Box sx={userStyle.tableheadstyle}><Box>Location</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('businesslocation')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('supplier')}><Box sx={userStyle.tableheadstyle}><Box>Supplier</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('supplier')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('billamount')}><Box sx={userStyle.tableheadstyle}><Box>Bill Amount</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('billampount')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('invoiceno')}><Box sx={userStyle.tableheadstyle}><Box>Invoice No</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('invoiceno')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('purchasestatus')}><Box sx={userStyle.tableheadstyle}><Box>Purchase Status</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('purchasestatus')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('paymentmethod')}><Box sx={userStyle.tableheadstyle}><Box>Payment status</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('paymentmethod')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('nettotal')}><Box sx={userStyle.tableheadstyle}><Box> Grand Total</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('nettotal')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('paydue')}><Box sx={userStyle.tableheadstyle}><Box>Payment Due</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('paydue')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('files')}><Box sx={userStyle.tableheadstyle}><Box>Document</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('files')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('userbyadd')}><Box sx={userStyle.tableheadstyle}><Box>Added By</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('userbyadd')}</Box></Box></StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData.length > 0 ?
                                            (filteredData.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell>
                                                        {row.purchasestatus == "Received" ?
                                                            <Grid sx={{ display: 'flex' }}>
                                                                {isUserRoleCompare[0].vpurchase && (
                                                                    <>
                                                                        <Link to={`/purchase/purchase/view/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                                                    </>
                                                                )}
                                                                <Button variant="outlined" component="label" >
                                                                    <CloudUploadIcon />
                                                                    <input hidden type="file" multiple onChange={(e) => { handleFileUpload(e, row._id, row.files) }} accept=" application/pdf, image/*" />
                                                                </Button>
                                                            </Grid>
                                                            :
                                                            <Grid sx={{ display: 'flex' }}>
                                                                {isUserRoleCompare[0]?.vpurchase && (
                                                                    <>
                                                                        <Link to={`/purchase/purchase/view/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                                                    </>
                                                                )}
                                                                {isUserRoleCompare[0]?.epurchase && (
                                                                    <>
                                                                        <Link to={`/purchase/purchase/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonedit} style={{ minWidth: '0px' }}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                                                    </>
                                                                )}
                                                                {isUserRoleCompare[0]?.dpurchase && (
                                                                    <>
                                                                        <Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowDataDel(row._id) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                                                                    </>
                                                                )}
                                                                <Button variant="outlined" component="label">
                                                                    <CloudUploadIcon />
                                                                    <input hidden type="file" multiple onChange={(e) => { handleFileUpload(e, row._id, row.files) }} accept=" application/pdf, image/*" />
                                                                </Button>
                                                            </Grid>}
                                                    </StyledTableCell>
                                                    <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                    <StyledTableCell>{moment(row.purchasedate).format('DD-MM-YYYY')}</StyledTableCell>
                                                    <StyledTableCell>{row.referenceno}</StyledTableCell>
                                                    <StyledTableCell>{isLocations?.map((data, i) => data.locationid.includes(row.businesslocation) ? data.name + " " : "")}</StyledTableCell>
                                                    <StyledTableCell>{row.supplier}</StyledTableCell>
                                                    <StyledTableCell>{row.billamount}</StyledTableCell>
                                                    <StyledTableCell>{row.invoiceno}</StyledTableCell>
                                                    <StyledTableCell>{row.purchasestatus}</StyledTableCell>
                                                    <StyledTableCell>{row.paymentmethod}</StyledTableCell>
                                                    <StyledTableCell>₹ {row.nettotal}</StyledTableCell>
                                                    <StyledTableCell>₹ {row.paydue}</StyledTableCell>
                                                    <StyledTableCell>{row.files[0] ? (
                                                        <>
                                                            <span style={{ color: "#357AE8", cursor: "pointer" }} >
                                                                <FileDownloadIcon onClick={(e) => { rowgetimages(row._id); }} />
                                                            </span>
                                                        </>
                                                    ) : (<></>)}</StyledTableCell>
                                                    <StyledTableCell>{row.userbyadd}</StyledTableCell>
                                                </StyledTableRow>
                                            )))
                                            : <StyledTableRow><StyledTableCell colSpan={13} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                        }
                                    </TableBody>
                                    <TableFooter sx={{ backgroundColor: '#9591914f', height: '75px' }}>
                                        <StyledTableRow className="table2_total" >
                                            {purchases && (
                                                purchases.forEach(
                                                    (item => {
                                                        total += +item.paydue;
                                                        sum += +item.nettotal;
                                                    })
                                                ))}
                                            <StyledTableCell colSpan={7} sx={userStyle.footerStyle}>Total</StyledTableCell>
                                            <StyledTableCell align="left">{btnval}</StyledTableCell>
                                            <StyledTableCell align="left"></StyledTableCell>
                                            <StyledTableCell align="left" sx={userStyle.footerStyle}>₹ {+sum}</StyledTableCell>
                                            <StyledTableCell align="left" sx={userStyle.footerStyle}>Purchase Due - ₹ {+total} </StyledTableCell>
                                            <StyledTableCell align="left"></StyledTableCell>
                                            <StyledTableCell align="left"></StyledTableCell>
                                            <StyledTableCell align="left"></StyledTableCell>
                                        </StyledTableRow>
                                    </TableFooter>
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
                            <br /><br />
                            {pageSize != 1 ? <Grid >
                                {isUserRoleCompare[0]?.apurchase && (
                                    <>
                                        <Link to="/purchase/purchase/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
                                    </>
                                )}
                                <br /><br />
                            </Grid> : null}
                        </Box>
                    </>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                        </Box>
                    </>
                )}
                { /* Table end */}
            </Box>
            :
            <Box sx={userStyle.printcls}>
                <TableContainer component={Paper} >
                    <Table aria-label="customized table" id="purchasetablepdf" ref={componentRef}>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Sno</StyledTableCell>
                                <StyledTableCell> Date</StyledTableCell>
                                <StyledTableCell> Reference No</StyledTableCell>
                                <StyledTableCell> Location </StyledTableCell>
                                <StyledTableCell> Supplier </StyledTableCell>
                                <StyledTableCell> Bill Amount</StyledTableCell>
                                <StyledTableCell> Invoice No</StyledTableCell>
                                <StyledTableCell> Purchase Status</StyledTableCell>
                                <StyledTableCell> Payment status</StyledTableCell>
                                <StyledTableCell> Grand Total</StyledTableCell>
                                <StyledTableCell> Payment Due</StyledTableCell>
                                <StyledTableCell> Added By</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {purchases && (
                                purchases.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{index + 1}</StyledTableCell>
                                        <StyledTableCell>{moment(row.purchasedate).format('DD-MM-YYYY')}</StyledTableCell>
                                        <StyledTableCell>{row.referenceno}</StyledTableCell>
                                        <StyledTableCell>{isLocations?.map((data, i) => data.locationid.includes(row.businesslocation) ? data.name + " " : "")}</StyledTableCell>
                                        <StyledTableCell>{row.supplier}</StyledTableCell>
                                        <StyledTableCell>{row.billamount}</StyledTableCell>
                                        <StyledTableCell>{row.invoiceno}</StyledTableCell>
                                        <StyledTableCell>{row.purchasestatus}</StyledTableCell>
                                        <StyledTableCell>{row.paymentmethod}</StyledTableCell>
                                        <StyledTableCell>₹ {row.nettotal}</StyledTableCell>
                                        <StyledTableCell>₹ {row.paydue}</StyledTableCell>
                                        <StyledTableCell>{row.userbyadd}</StyledTableCell>
                                    </StyledTableRow>
                                ))
                            )}
                        </TableBody>
                        <TableFooter sx={{ backgroundColor: '#9591914f', height: '75px' }}>
                            <StyledTableRow className="table2_total" >
                                {purchases && (
                                    purchases.forEach(
                                        (item => {
                                            total += +item.paydue;
                                            sum += +item.nettotal;
                                        })
                                    ))}
                                <StyledTableCell colSpan={6} sx={userStyle.footerStyle}>Total</StyledTableCell>
                                <StyledTableCell align="left">{btnval}</StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
                                <StyledTableCell align="left" sx={userStyle.footerStyle}>₹ {+sum}</StyledTableCell>
                                <StyledTableCell align="left" sx={userStyle.footerStyle}>Purchase Due - ₹ {+total} </StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
                            </StyledTableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
            { /* Table end */}
            <Box>
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
                        <Button autoFocus variant="contained" color='error' onClick={(e) => deletePurchase(supid)}> OK </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    maxWidth='md'
                    fullWidth
                    open={isOpendownload}
                    onClose={handleCloseDownload}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"

                >
                    <DialogContent ><br />
                        <Grid container sx={{ display: "flex", justifyContent: "space-evenly" }}>
                            <Grid item lg={2} md={2} sm={4} xs={6}>
                                <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>File Name</Typography><br /><br /></Grid>
                            <Grid item lg={2} md={2} sm={4} xs={6}>
                                <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Download</Typography><br /><br />
                                <Grid sx={{ display: "flex", justifyContent: "center" }}>

                                </Grid>
                            </Grid>
                            <Grid item lg={2} md={2} sm={4} xs={6}>
                                <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Preview</Typography><br /><br />
                                <Grid sx={{ display: "flex", justifyContent: "center" }}>

                                </Grid>
                            </Grid>
                        </Grid>
                        {files.length > 0 &&
                            (files.map((row, index) => (
                                <Grid container sx={{ display: "flex", justifyContent: "space-evenly" }}>
                                    <Grid item lg={2} md={2} sm={4} xs={6}>
                                        <Grid sx={{ display: "flex", justifyContent: "center" }}>
                                            {download ? (
                                                <>
                                                    <Typography>{row.name}</Typography>
                                                </>
                                            ) : (<></>)}
                                        </Grid>
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={4} xs={6}>
                                        <Grid sx={{ display: "flex", justifyContent: "center" }}>
                                            {download ? (
                                                <>
                                                    <a
                                                        style={{ color: "#357AE8", }}
                                                        href={`data:application/octet-stream;base64,${row.data}`}
                                                        download={row.name}
                                                    >
                                                        <FileDownloadIcon />
                                                    </a>
                                                </>
                                            ) : (<></>)}
                                        </Grid>
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={4} xs={6}>
                                        {download ? (
                                            <>
                                                {download?.type?.includes("application/pdf, image/") ?
                                                    <>
                                                        <img src={row.preview} alt={row.name} style={{ maxHeight: '100px', marginTop: '10px' }} />
                                                        <Button style={userStyle.buttonedit}
                                                            onClick={() => {
                                                                handleClickOpenview();
                                                                setViewImage(row.preview);
                                                            }} ><VisibilityOutlinedIcon style={{ fontsize: "large" }} /></Button>
                                                    </>
                                                    :
                                                    <>
                                                        <Box sx={{ display: "flex", justifyContent: 'center' }}>
                                                            <Grid>
                                                                <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(row)} />
                                                            </Grid>&emsp;&emsp;&emsp;
                                                            <Grid sx={{ position: "relative", bottom: "40px" }}>
                                                                <img className={classes.preview} src={getFileIcon(row.name)} height="80" alt="file icon" />
                                                            </Grid>
                                                        </Box>
                                                    </>
                                                }
                                            </>
                                        ) : (<></>)}
                                    </Grid>
                                </Grid>
                            )))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDownload} variant="outlined" color="error">close</Button>&emsp;&emsp;&emsp;<br /><br /><br />
                    </DialogActions>
                </Dialog>
                {/* view model */}
                <Dialog open={openview} onClose={handleClickOpenview} >
                    <DialogContent sx={{ maxWidth: "100%", alignItems: "center" }}>
                        <img
                            src={viewImage}
                            alt={viewImage}
                            style={{ maxWidth: "90%", }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                cursor: "pointer",
                                padding: "5px",
                                backgroundColor: "rgba(255,255,255,0?.8)",
                            }}
                            onClick={() => { handleFullscreenClick(); }}
                        >
                            <FaExpand size={20} />
                        </div>

                        <Button variant="contained" onClick={() => { handleCloseview(); handleCloseDownload() }}>
                            {" "}
                            Back{" "}
                        </Button>
                    </DialogContent>
                </Dialog>
            </Box>
        </>
    )
}

function Purchaselists() {
    return (
        <>
            <Purchasetablelist /><br /><br /><br /><br />
            <Footer />
        </>
    );
}

export default Purchaselists;