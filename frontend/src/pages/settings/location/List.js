import React, { useState, useEffect, useContext, useRef } from 'react';
import { Button, Select, MenuItem, FormControl, OutlinedInput, Grid, Box, Typography, Table, TableHead, TableContainer, FormControlLabel, TableBody, DialogContentText, DialogTitle, Checkbox, Paper, DialogContent, DialogActions, Dialog } from '@mui/material';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ExportXL, ExportCSV } from '../../Export';
import jsPDF from "jspdf";
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';

const Locationtable = () => {

    const { auth, setngs } = useContext(AuthContext);
    const [isLoader, setIsLoader] = useState(false);
    const [busilocations, setBusilocations] = useState([]);
    const [exceldata, setExceldata] = useState([]);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [checkUserLocation, setCheckUserLocation] = useState([])
    const [checkProdLocation, setCheckProdLocation] = useState([])
    const [checkProdDisLocation, setCheckProdDisLocation] = useState([])
    const [checkPurLocation, setCheckPurLocation] = useState([])
    const [checkPurRtnLocation, setCheckPurRtnLocation] = useState([])
    const [checkExpLocation, setCheckExpLocation] = useState([])
    const [checkPosLocation, setCheckPosLocation] = useState([])
    const [checkDraftLocation, setCheckDraftLocation] = useState([])
    const [checkQotLocation, setCheckQotLocation] = useState([])


    // Datatable 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");
    const [isActive, setIsActive] = useState("");

    // User Access
    const { isUserRoleCompare, isUserRoleAccess, setIsActiveLocations, setAllLocations } = useContext(UserRoleAccessContext);

    const [isPdfData, setIsPdfData] = useState({
        isBusiId: false, isBusiName: false, isBusiLandmark: false, isCountry: false,
        isState: false, isCity: false, isZipcode: false, ismobile: false, ismobileone: false, ismobiletwo: false,
        ismobilethree: false, isWhatsapp: false, isEmail: false, isWebsite: false
    })
    const [busilocationses, setBusilocationses] = useState({});

    const [isOpen, setIsOpen] = useState(false);
    const handlePdfClose = () => { setIsOpen(false); };

    //delete model
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleClose = () => { setIsDeleteOpen(false); };

    // check delete
    const [isCheckOpen, setIsCheckOpen] = useState(false);
    const handleClickOpenCheck = () => { setIsCheckOpen(true); };
    const handleCloseCheck = () => { setIsCheckOpen(false); };

    // Alert popup
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpener = () => { setIsErrorOpen(true); };
    const handleCloser = () => { setIsErrorOpen(false); };

    // Business Locations
    const fetchLocation = async () => {
        try {
            let res = await axios.post(SERVICE.BUSINESS_LOCATION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });
            setBusilocations(res?.data?.businesslocations);
            setIsActiveLocations(res?.data?.businesslocationsactive);
            setAllLocations(res?.data?.businesslocations);
            setIsLoader(true);
        } catch (err) {
            setIsLoader(true);
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const getrow = async (id) => {
        try {
            let response = await axios.get(`${SERVICE.BUSINESS_LOCATION_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let getdata = response?.data?.sbusilocation?.activate;
            await axios.put(`${SERVICE.BUSINESS_LOCATION_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                activate: !getdata,
            }).then(res => res.data);
            setIsActive("None");
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const rowData = async (id, locationid) => {
        try {
            const [
                res, requser, reqprod, reqproddis, reqpur, reqpurrtn, reqexp, reqpos, reqdraft, reqqot
              ] = await Promise.all([
                axios.get(`${SERVICE.BUSINESS_LOCATION_SINGLE}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                }),
                axios.post(SERVICE.USER_DELETE_LOCATION_CHECK, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid),
                    checklocationid: String(locationid)
                }),
                axios.post(SERVICE.PRODUCT_DELETE_LOCATION_CHECK, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid),
                    checklocationid: String(locationid)
                }),
                axios.post(SERVICE.DISCOUNT_DELETE_LOCATION_CHECK, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid),
                    checklocationid: String(locationid)
                }),
                axios.post(SERVICE.PURCHASE_DELETE_LOCATION_CHECK, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid),
                    checklocationid: String(locationid)
                }),
                axios.post(SERVICE.PURCHASERTN_DELETE_LOCATION_CHECK, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid),
                    checklocationid: String(locationid)
                }),
                axios.post(SERVICE.EXPENSE_DELETE_LOCATION_CHECK, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid),
                    checklocationid: String(locationid)
                }),
                axios.post(SERVICE.POS_DELETE_LOCATION_CHECK, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid),
                    checklocationid: String(locationid)
                }),
                axios.post(SERVICE.DRAFT_DELETE_LOCATION_CHECK, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid),
                    checklocationid: String(locationid)
                }),
                axios.post(SERVICE.QUOTATION_DELETE_LOCATION_CHECK, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid),
                    checklocationid: String(locationid)
                })
            ])

            setBusilocationses(res?.data?.sbusilocation);//set function to get particular row
            setCheckUserLocation(requser?.data?.users)
            setCheckProdLocation(reqprod?.data?.products)
            setCheckProdDisLocation(reqproddis?.data?.discounts)
            setCheckPurLocation(reqpur?.data?.purchases)
            setCheckPurRtnLocation(reqpurrtn?.data?.purchasesrtn)
            setCheckExpLocation(reqexp?.data?.expenses)
            setCheckPosLocation(reqpos?.data?.pos)
            setCheckDraftLocation(reqdraft?.data?.drafts)
            setCheckQotLocation(reqqot?.data?.quotations)

            if ((requser?.data?.users).length > 0 || (reqprod?.data?.products)?.length > 0 || (reqproddis?.data?.discounts)?.length > 0 || (reqpur?.data?.purchases)?.length > 0 || (reqpurrtn?.data?.purchasesrtn)?.length > 0 ||
                (reqexp?.data?.expenses).length > 0 || (reqpos?.data?.pos)?.length > 0 || (reqdraft?.data?.drafts)?.length > 0 || (reqqot?.data?.quotations)?.length > 0
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
    let busiid = busilocationses._id;
    const deleteLocation = async (busiid) => {
        try {
            await fetchLocation();
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
    const fileName = 'Business Locations';
    // get particular columns for export excel
    const getexcelDatas = async () => {
        var data = busilocations.map((t, index) => ({
            "Sno": index + 1,
            Name: t.name, 'Location ID': t.locationid, Address: t.address, Landmark: t.landmark, Country: t.country, State: t.state, City: t.city, Zipcode: t.zipcde,
            Mobile: t.phonenumber, 'Mobile 1': t.onephonenumber, 'Mobile 2': t.twophonenumber, 'Mobile 3': t.threephonenumber,
            'Landline Number': t.landlinenumber, 'WhatsApp No': t.whatsappno, Email: t.email, Website: t.website, Activate: t.activate
        }));
        setExceldata(data);
    }

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'HIPOS | BUSINESS LOCATIONS',
        pageStyle: 'print'
    });

    const columns = [
        { title: "Locationid", field: "locationid" },
        { title: "Name", field: "name" },
        { title: "Address", field: "address" },
        { title: "landmark", field: "landmark" },
        { title: "Country", field: "country" },
        { title: "State", field: "state" },
        { title: "City", field: "city" },
        { title: "Zipcde", field: "zipcde" },
        { title: "Phonenumber", field: "phonenumber" },
        { title: "Onephonenumber", field: "onephonenumber" },
        { title: "Twophonenumber", field: "twophonenumber" },
        { title: "Threephonenumber", field: "threephonenumber" },
        { title: "Whatsappno", field: "whatsappno" },
        { title: "Email", field: "email" },
        { title: "Website", field: "website" },


    ]

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
            doc.save("BusinessLocation.pdf");
        };
        

    useEffect(
        () => {
            fetchLocation();
        }, [isActive, isOpen]
    );

    useEffect(
        () => {
            getexcelDatas();
        }, [busilocations]
    );
    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
      const itemsWithSerialNumber = busilocations?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
      setItems(itemsWithSerialNumber);
    }
  
    useEffect(() => {
      addSerialNumber();
    }, [busilocations])
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

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    return (
        <Box>
            <Headtitle title={'Business Locations'} />
            <Typography sx={userStyle.HeaderText}>Business Locations <Typography sx={userStyle.SubHeaderText}>Manage your business locations</Typography></Typography>
            <Box sx={userStyle.container}>
                <Grid container spacing={2}>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <Typography sx={userStyle.importheadtext}>All your business locations</Typography>
                    </Grid>

                    {/* EXPORT BUTTONS START */}
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ display: "flex", justifyContent: 'center' }}>
                        <Grid>
                            {isUserRoleCompare[0]?.csvbusinesslocation && (
                                <>
                                    <ExportCSV csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0]?.excelbusinesslocation && (
                                <>
                                    <ExportXL csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0]?.printbusinesslocation && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                </>
                            )}
                            {isUserRoleCompare[0]?.pdfbusinesslocation && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                </>
                            )}
                        </Grid>
                    </Grid>
                    {/* EXPORT BUTTONS END */}

                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        {isUserRoleCompare[0]?.abusinesslocation && (
                            <>
                                <Link to={'/settings/location/create'} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
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
                            <MenuItem value={(busilocations.length)}>All</MenuItem>
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
                {/* EXPORT BUTTONS START */}
                {/* EXPORT BUTTONS END */}
                {isLoader ? (
                    <>
                        {/* TABLE START */}
                        <Box>
                            <TableContainer component={Paper} >
                                <Table aria-label="customized table" id="businessLocation" sx={{ minWidth: 700 }}>
                                    <TableHead>
                                        <StyledTableRow>
                                            <StyledTableCell align="left">Action</StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('name')}><Box sx={userStyle.tableheadstyle}><Box>Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('name')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('locationid')}><Box sx={userStyle.tableheadstyle}><Box>Location ID</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('locationid')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('address')}><Box sx={userStyle.tableheadstyle}><Box>Address</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('address')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('landmark')}><Box sx={userStyle.tableheadstyle}><Box>Landmark</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('landmark')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('country')}><Box sx={userStyle.tableheadstyle}><Box>Country</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('country')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('state')}><Box sx={userStyle.tableheadstyle}><Box>State</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('state')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('city')}><Box sx={userStyle.tableheadstyle}><Box>City</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('city')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('zipcde')}><Box sx={userStyle.tableheadstyle}><Box>Zip Code</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('zipcde')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('phonenumber')}><Box sx={userStyle.tableheadstyle}><Box>Mobile</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('phonenumber')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('onephonenumber')}><Box sx={userStyle.tableheadstyle}><Box>Mobile 1</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('onephonenumber')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('twophonenumber')}><Box sx={userStyle.tableheadstyle}><Box>Mobile 2</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('twophonenumber')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('threephonenumber')}><Box sx={userStyle.tableheadstyle}><Box>Mobile 3</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('threephonenumber')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('whatsappno')}><Box sx={userStyle.tableheadstyle}><Box>WhatsApp</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('whatsappno')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('website')}><Box sx={userStyle.tableheadstyle}><Box>Website</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('website')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('email')}><Box sx={userStyle.tableheadstyle}><Box>Email</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('email')}</Box></Box></StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData.length > 0 ?
                                            (filteredData.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell align="left">
                                                        <Grid sx={{ display: 'flex' }}>
                                                            {isUserRoleCompare[0]?.ebusinesslocation && (
                                                                <>
                                                                    <Link to={`/settings/location/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonedit}><EditOutlinedIcon style={{ fontSize: "large" }} /></Button></Link>
                                                                </>
                                                            )}
                                                            {isUserRoleCompare[0]?.dbusinesslocation && (
                                                                <>
                                                                    <Button sx={userStyle.buttondelete} onClick={() => { rowData(row._id, row.locationid) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                                                                </>
                                                            )}
                                                            {isUserRoleCompare[0]?.activatebusinesslocation && (
                                                                <>
                                                                    <Button variant="contained" color={row.activate == true ? 'success' : 'warning'} sx={{ minWidth: '0px', padding: '0 7px' }} onClick={() => { handleClickOpener((setShowAlert(row.activate == true ? 'Do you want to Deactivate?' : 'Do you want to Activate?'))); rowData(row._id) }}><PowerSettingsNewOutlinedIcon style={{ fontSize: 'large' }} /></Button>
                                                                </>
                                                            )}
                                                            {isUserRoleCompare[0]?.activatebusinesslocation && (
                                                                <>
                                                                    {isUserRoleCompare[0]?.vsupplier && (<Link to={`/settings/location/view/${row._id}`} style={{ textDecoration: 'none', color: 'white', }}><Button sx={userStyle.buttonview}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>)}
                                                                </>
                                                            )}
                                                        </Grid>
                                                    </StyledTableCell>
                                                    <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                    <StyledTableCell component="th" scope="row"> {row.name} </StyledTableCell>
                                                    <StyledTableCell align="left">{row.locationid}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.address}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.landmark}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.country}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.state}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.city}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.zipcde}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.phonenumber}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.onephonenumber}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.twophonenumber}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.threephonenumber}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.whatsappno}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.website}</StyledTableCell>
                                                    <StyledTableCell align='left'>{row.email}</StyledTableCell>
                                                </StyledTableRow>
                                            )))
                                            : <StyledTableRow><StyledTableCell colSpan={18} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
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
                    </>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                        </Box>
                    </>
                )}
                <br /><br />
                {pageSize != 1 ? <Grid >
                    {isUserRoleCompare[0]?.abusinesslocation && (
                        <>
                            <Link to={'/settings/location/create'} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
                        </>
                    )}<br /><br />
                </Grid> : null}
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
                        <Button onClick={() => deleteLocation(busiid)} autoFocus variant="contained" color='error'> OK </Button>
                    </DialogActions>
                </Dialog>
                {/* PDF Model */}
                <Box>
                    <Dialog
                        open={isOpen}
                        onClose={handlePdfClose}
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
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isBusiName} onClick={() => { setIsPdfData({ ...isPdfData, isBusiName: !isPdfData.isBusiName }) }} />} label="Name" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isBusiId} onClick={() => setIsPdfData({ ...isPdfData, isBusiId: !isPdfData.isBusiId })} />} label="Location id" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isBusiLandmark} onClick={() => setIsPdfData({ ...isPdfData, isBusiLandmark: !isPdfData.isBusiLandmark })} />} label="Landmark" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isCountry} onClick={() => setIsPdfData({ ...isPdfData, isCountry: !isPdfData.isCountry })} />} label="Country" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isState} onClick={() => setIsPdfData({ ...isPdfData, isState: !isPdfData.isState })} />} label="State" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isCity} onClick={() => setIsPdfData({ ...isPdfData, isCity: !isPdfData.isCity })} />} label="City" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isZipcode} onClick={() => setIsPdfData({ ...isPdfData, isZipcode: !isPdfData.isZipcode })} />} label="Zipcode" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.ismobile} onClick={() => setIsPdfData({ ...isPdfData, ismobile: !isPdfData.ismobile })} />} label="Mobile" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.ismobileone} onClick={() => setIsPdfData({ ...isPdfData, ismobileone: !isPdfData.ismobileone })} />} label="Mobile 1" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.ismobiletwo} onClick={() => setIsPdfData({ ...isPdfData, ismobiletwo: !isPdfData.ismobiletwo })} />} label="Mobile 2" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.ismobilethree} onClick={() => setIsPdfData({ ...isPdfData, ismobilethree: !isPdfData.ismobilethree })} />} label="Mobile 3" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isWhatsapp} onClick={() => setIsPdfData({ ...isPdfData, isWhatsapp: !isPdfData.isWhatsapp })} />} label="WhatsApp" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isEmail} onClick={() => setIsPdfData({ ...isPdfData, isEmail: !isPdfData.isEmail })} />} label="Email" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isWebsite} onClick={() => setIsPdfData({ ...isPdfData, isWebsite: !isPdfData.isWebsite })} />} label="Website" />
                                    </Grid>
                                </Grid>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button variant='contained' color='primary' onClick={() => downloadPdf()} autoFocus>PDF</Button>
                            <Button variant='contained' color='error' onClick={handlePdfClose}>Close</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={isErrorOpen}
                        onClose={handleCloser}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                            <Typography variant="h6">{showAlert}</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloser} variant="outlined">Cancel</Button>
                            <Button variant="contained" color="error" onClick={() => { getrow(busiid); handleCloser() }}>ok</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
            {/* Print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="customized table" id="businessLocation" sx={{ minWidth: 700 }} ref={componentRef}>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Sno</StyledTableCell>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell align="left">Location ID</StyledTableCell>
                            <StyledTableCell align="left">Address</StyledTableCell>
                            <StyledTableCell align="left">Landmark</StyledTableCell>
                            <StyledTableCell align="left">Country</StyledTableCell>
                            <StyledTableCell align="left">State</StyledTableCell>
                            <StyledTableCell align="left">City</StyledTableCell>
                            <StyledTableCell align="left">Zip Code</StyledTableCell>
                            <StyledTableCell align="left">Mobile</StyledTableCell>
                            <StyledTableCell align="left">Mobile 1</StyledTableCell>
                            <StyledTableCell align="left">Mobile 2</StyledTableCell>
                            <StyledTableCell align="left">Mobile 3</StyledTableCell>
                            <StyledTableCell align="left">WhatsApp</StyledTableCell>
                            <StyledTableCell align="left">Website</StyledTableCell>
                            <StyledTableCell align="left">Email</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {busilocations &&
                            (busilocations.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell component="th" scope="row"> {row.name} </StyledTableCell>
                                    <StyledTableCell align="left">{row.locationid}</StyledTableCell>
                                    <StyledTableCell align="left">{row.address}</StyledTableCell>
                                    <StyledTableCell align="left">{row.landmark}</StyledTableCell>
                                    <StyledTableCell align="left">{row.country}</StyledTableCell>
                                    <StyledTableCell align="left">{row.state}</StyledTableCell>
                                    <StyledTableCell align="left">{row.city}</StyledTableCell>
                                    <StyledTableCell align="left">{row.zipcde}</StyledTableCell>
                                    <StyledTableCell align="left">{row.phonenumber}</StyledTableCell>
                                    <StyledTableCell align="left">{row.onephonenumber}</StyledTableCell>
                                    <StyledTableCell align="left">{row.twophonenumber}</StyledTableCell>
                                    <StyledTableCell align="left">{row.threephonenumber}</StyledTableCell>
                                    <StyledTableCell align="left">{row.whatsappno}</StyledTableCell>
                                    <StyledTableCell align="left">{row.website}</StyledTableCell>
                                    <StyledTableCell align='left'>{row.email}</StyledTableCell>
                                </StyledTableRow>
                            ))
                            )}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* printlayout ends */}

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
                        {checkUserLocation?.length > 0 && checkProdLocation?.length > 0 && checkProdDisLocation?.length > 0 && checkPurLocation?.length > 0 && checkPurRtnLocation?.length > 0 && checkExpLocation?.length > 0 &&
                            checkPosLocation?.length > 0 && checkDraftLocation?.length > 0 && checkQotLocation?.length > 0
                            ? (
                                <>
                                    <span style={{ fontWeight: '700', color: '#777' }}>
                                        {`${busilocationses.businessname} `}
                                    </span>
                                    was linked in <span style={{ fontWeight: '700' }}>User, Product, Discount, Purchase, Purchase Return, Expense</span>
                                </>
                            ) : checkUserLocation?.length > 0 || checkProdLocation?.length > 0 || checkProdDisLocation?.length > 0 || checkPurLocation?.length > 0 || checkPurRtnLocation?.length > 0 || checkExpLocation?.length > 0 ||
                                checkPosLocation?.length > 0 || checkDraftLocation?.length > 0 || checkQotLocation?.length > 0
                                ? (
                                    <>
                                        <span style={{ fontWeight: '700', color: '#777' }}>
                                            {`${busilocationses.businessname} `}
                                        </span>
                                        was linked in{' '}
                                        <span style={{ fontWeight: '700' }}>
                                            {checkUserLocation?.length ? ' User' : ''}
                                            {checkProdLocation?.length ? ' Product' : ''}
                                            {checkProdDisLocation?.length ? ' Discount' : ''}
                                            {checkPurLocation?.length ? ' Purchase' : ''}
                                            {checkPurRtnLocation?.length ? ' Purchase Return' : ''}
                                            {checkExpLocation?.length ? ' Expense' : ''}
                                            {checkPosLocation?.length ? ' Pos' : ''}
                                            {checkDraftLocation?.length ? ' Draft' : ''}
                                            {checkQotLocation?.length ? ' Quotation' : ''}
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
function Locationlist() {
    return (
       <>
        <Locationtable /><br /><br /><br /><br />
                    <Footer />
       </>
    );
}
export default Locationlist;