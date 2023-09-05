import React, { useContext, useState, useEffect, useRef } from 'react';
import { Button, Grid, Select, MenuItem, FormControl, OutlinedInput, Box, Dialog, DialogContent, DialogActions, Typography, Table, TableHead, TableContainer, TableBody, Paper } from '@mui/material';
import { FaFilePdf, FaPrint } from 'react-icons/fa';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';
import autoTable from 'jspdf-autotable';
import { Link } from 'react-router-dom';
import jsPDF from "jspdf";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { ExportXL, ExportCSV } from '../../Export';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import { toast } from 'react-toastify';
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

let fileNameTaxrate = "TaxRate";
let fileNameTaxrategrp = "TaxRateGroup";
let fileNameHsn = "HSN"

const Taxratelisttable = () => {

  const { auth, setngs } = useContext(AuthContext);
  const [isLoader, setIsLoader] = useState(false);
  const [isGroupLoader, setTaxgroupIsLoader] = useState(false);
  const [isHsnLoader, setHSNIsLoader] = useState(false);
  const [taxRate, setTaxRate] = useState([]);
  const [taxRateGrp, setTaxRateGrp] = useState([]);
  const [hsnGrp, sethsnGrp] = useState([]);
  const [exceldatataxrate, setExceldatataxrate] = useState([]);
  const [exceldatataxgrp, setExceldatataxgrp] = useState([]);
  const [exceldatahsn, setExceldatahsn] = useState([]);
  const [tax, setTax] = useState({});
  const [checkProdTax, setCheckProdTax] = useState([])
  const [checkPurTax, setCheckPurTax] = useState([])
  const [checkPurRtnTax, setCheckPurRtnTax] = useState([])
  const [checkPosTax, setCheckPosTax] = useState([])
  const [checkDraftTax, setCheckDraftTax] = useState([])
  const [checkQuotTax, setCheckQuotTax] = useState([])
  const [checkExpTax, setCheckExpTax] = useState([])

  const [linkedValue, setLinkedValue] = useState("");

  // Datatable Taxrate
  const [pageTax, psetPageTax] = useState(1);
  const [pageSizeTax, setPageSizeTax] = useState(1);
  const [sortingTax, setSortingTax] = useState({ column: '', direction: '' });
  const [searchQueryTax, setSearchQueryTax] = useState("");

  // Datatable Taxrategroup
  const [pageGrp, setPageGrp] = useState(1);
  const [pageSizeGrp, setPageSizeGrp] = useState(1);
  const [sortingGrp, setSortingGrp] = useState({ column: '', direction: '' });
  const [searchQueryGrp, setSearchQueryGrp] = useState("");

  // Datatable 
  const [pageHsn, setPageHsn] = useState(1);
  const [pageSizeHsn, setPageSizeHsn] = useState(1);
  const [sortingHsn, setSortingHsn] = useState({ column: '', direction: '' });
  const [searchQueryHsn, setSearchQueryHsn] = useState("");

  // Access
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  //delete model
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };

  // check delete
  const [isCheckOpen, setIsCheckOpen] = useState(false);
  const handleClickOpenCheck = () => { setIsCheckOpen(true); };
  const handleCloseCheck = () => { setIsCheckOpen(false); };

  // Get Datas
  const taxrateRequest = async () => {
    try {
      let response = await axios.post(SERVICE.TAXRATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      setTaxRate(response?.data?.taxrates)
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

  // Get Datas
  const taxrateGroupRequest = async () => {
    try {
      let res = await axios.post(SERVICE.TAXRATEGROUP, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      setTaxRateGrp(res?.data?.taxratesgroup)
      setTaxgroupIsLoader(true)
    } catch (err) {
      setTaxgroupIsLoader(true)
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  }

  // Get Datas
  const taxrateHsnRequest = async () => {
    try {
      let req = await axios.post(SERVICE.TAXRATEHSN, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      sethsnGrp(req?.data?.taxrateshsn);
      setHSNIsLoader(true)
    } catch (err) {
      setHSNIsLoader(true)
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  }

  const rowData = async (id, taxname, taxrate, hsn, value) => {

    try {
      setLinkedValue(value)
      const [
        res, reqprodtax, reqpurtax, reqpurrtntax, reqpostax, reqdrafttax, reqquottax, reqexptax
      ] = await Promise.all([
        axios.get(`${SERVICE.TAXRATE_SINGLE}/${id}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          }
        }),
        axios.post(SERVICE.PRODUCT_DELETE_TAXRATE_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checktaxrates: String(taxname + '@' + taxrate,),
          checkhsn: String(hsn)
        }),
        axios.post(SERVICE.PURCHASE_DELETE_TAXRATES_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checktaxrates: String(taxname + '@' + taxrate,),
          checkhsn: String(hsn)
        }),
        axios.post(SERVICE.PURCHASERTN_DELETE_TAXRATES_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checktaxrates: String(taxname + '@' + taxrate,),
          checkhsn: String(hsn)
        }),
        axios.post(SERVICE.POS_DELETE_TAXRATES_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checktaxrates: String(taxname + '@' + taxrate,),
          checkhsn: String(hsn)
        }),
        axios.post(SERVICE.DRAFT_DELETE_TAXRATES_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checktaxrates: String(taxname + '@' + taxrate,),
          checkhsn: String(hsn)
        }),
        axios.post(SERVICE.QUOTATION_DELETE_TAXRATES_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checktaxrates: String(taxname + '@' + taxrate,),
          checkhsn: String(hsn)
        }),
        axios.post(SERVICE.EXPENSE_DELETE_TAXRATE_CHECK, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          businessid: String(setngs.businessid),
          checktaxrates: String(taxname + '@' + taxrate,),
          checkhsn: String(hsn)
        })
      ])
      setTax(res?.data?.staxrate);
      setCheckProdTax(reqprodtax?.data?.products)
      setCheckPurTax(reqpurtax?.data?.purchases)
      setCheckPurRtnTax(reqpurrtntax?.data?.purchasesrtn)
      setCheckPosTax(reqpostax?.data?.pos)
      setCheckDraftTax(reqdrafttax?.data?.drafts)
      setCheckQuotTax(reqquottax?.data?.quotations)
      setCheckExpTax(reqexptax?.data?.expenses)

      if ((reqprodtax?.data?.products)?.length > 0 || (reqpurtax?.data?.purchases)?.length > 0 || (reqpurrtntax?.data?.purchasesrtn)?.length > 0
        || (reqpostax?.data?.pos)?.length > 0 || (reqdrafttax?.data?.drafts)?.length > 0 || (reqquottax?.data?.quotations)?.length > 0
        || (reqexptax?.data?.expenses)?.length > 0
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
  let taxid = tax._id;

  // Delete 
  const deleteTaxRate = async (taxid) => {
    try {
      let response = await axios.delete(`${SERVICE.TAXRATE_SINGLE}/${taxid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
       taxrateRequest();
       taxrateGroupRequest();
       taxrateHsnRequest();
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

  // Print Tax Rate
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'HIPOS | TAX RATE',
    pageStyle: 'print'
  });
  // Print Tax Rate Group
  const componentRefTaxRateGrp = useRef();
  const handleprintTaxRateGrp = useReactToPrint({
    content: () => componentRefTaxRateGrp.current,
    documentTitle: 'HIPOS | TAX RATE GROUP',
    pageStyle: 'print'
  });
  // Print HSN
  const componentRefHsn = useRef();
  const handleprintHsn = useReactToPrint({
    content: () => componentRefHsn.current,
    documentTitle: 'HIPOS | HSN',
    pageStyle: 'print'
  });

  // Tax Rate PDF
  const downloadPdf = () => {
    const doc = new jsPDF()
    autoTable(doc, { html: '#taxrate' })
    doc.save('Taxrate.pdf')
  }

  // Tax Rate Grp PDF
  const downloadPdfGroup = () => {
    const doc = new jsPDF()
    autoTable(doc, { html: '#taxrategroup' })
    doc.save('Taxrate Group.pdf')
  }

  // HSN PDF
  const downloadPdfHsn = () => {
    const doc = new jsPDF()
    autoTable(doc, { html: '#hsn' })
    doc.save('HSN.pdf')
  }

  // get particular columns for export excel
  const excelDatasTaxrate = async () => {
    var data = taxRate.map(t => ({ 'Tax Name': t.taxname, 'Tax Rate': t.taxrate, }));
    setExceldatataxrate(data);
  }

  // get particular columns for export excel
  const excelDatasTaxrateGrp = async () => {
    var data = taxRateGrp.map(t => ({ 'Tax Name': t.taxname, 'Total Tax Rate': t.taxrate, 'Sub Taxes': t.subtax + ", " }));
    setExceldatataxgrp(data);
  }
  // get particular columns for export excel
  const excelDatashsn = async () => {
    var data = hsnGrp.map(t => ({ HSN: t.hsn, 'Total Tax Rate': t.taxrate, 'Sub Taxes': t.subtax + ", " }));
    setExceldatahsn(data);
  }

  useEffect(
    () => {
      taxrateRequest();
      taxrateGroupRequest();
      taxrateHsnRequest();
    }, []
  )

  useEffect(
    () => {
      excelDatasTaxrate();
    }, [taxRate]
  )

  useEffect(
    () => {
      excelDatasTaxrateGrp();
    }, [taxRateGrp]
  )

  useEffect(
    () => {
      excelDatashsn();
    }, [hsnGrp]
  )

  // Sorting Taxrate
  const handleSortingTax = (column) => {
    const direction = sortingTax.column === column && sortingTax.direction === 'asc' ? 'desc' : 'asc';
    setSortingTax({ column, direction });
  };

  const sortedDataTax = taxRate.sort((a, b) => {
    if (sortingTax.direction === 'asc') {
      return a[sortingTax.column] > b[sortingTax.column] ? 1 : -1;
    } else if (sortingTax.direction === 'desc') {
      return a[sortingTax.column] < b[sortingTax.column] ? 1 : -1;
    }
    return 0;
  });

  const renderSortingIconTax = (column) => {
    if (sortingTax.column !== column) {
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
    } else if (sortingTax.direction === 'asc') {
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

  // Datatable Taxrate
  const handlePageChangeTax = (newPage) => {
    psetPageTax(newPage);
  };

  const handlePageSizeChangeTax = (event) => {
    setPageSizeTax(Number(event.target.value));
    psetPageTax(1);
  };

  const handleSearchChangeTax = (event) => {
    setSearchQueryTax(event.target.value);
  };
  const filteredDatasTax = taxRate?.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().startsWith(searchQueryTax.toLowerCase())
    )
  );

  const filteredDataTax = filteredDatasTax?.slice((pageTax - 1) * pageSizeTax, pageTax * pageSizeTax);

  const totalPagesTax = Math.ceil(filteredDatasTax.length / pageSizeTax);

  const visiblePagesTax = Math.min(totalPagesTax, 3);

  const firstVisiblePageTax = Math.max(1, pageTax - 1);
  const lastVisiblePageTax = Math.min(firstVisiblePageTax + visiblePagesTax - 1, totalPagesTax);

  const pageNumbersTax = [];

  const indexOfLastItemTax = pageTax * pageSizeTax;
  const indexOfFirstItemTax = indexOfLastItemTax - pageSizeTax;

  for (let i = firstVisiblePageTax; i <= lastVisiblePageTax; i++) {
    pageNumbersTax.push(i);
  }

  // Sorting Taxrategroup
  const handleSortingGrp = (column) => {
    const direction = sortingGrp.column === column && sortingGrp.direction === 'asc' ? 'desc' : 'asc';
    setSortingGrp({ column, direction });
  };

  const sortedDataGrp = taxRateGrp.sort((a, b) => {
    if (sortingGrp.direction === 'asc') {
      return a[sortingGrp.column] > b[sortingGrp.column] ? 1 : -1;
    } else if (sortingGrp.direction === 'desc') {
      return a[sortingGrp.column] < b[sortingGrp.column] ? 1 : -1;
    }
    return 0;
  });

  const renderSortingIconGrp = (column) => {
    if (sortingGrp.column !== column) {
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
    } else if (sortingGrp.direction === 'asc') {
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

  // Datatable Taxrategroup
  const handlePageChangeGrp = (newPage) => {
    setPageGrp(newPage);
  };

  const handlePageSizeChangeGrp = (event) => {
    setPageSizeGrp(Number(event.target.value));
    setPageGrp(1);
  };

  const handleSearchChangeGrp = (event) => {
    setSearchQueryGrp(event.target.value);
  };
  const filteredDatasGrp = taxRateGrp?.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().startsWith(searchQueryGrp.toLowerCase())
    )
  );

  const filteredDataGrp = filteredDatasGrp?.slice((pageGrp - 1) * pageSizeGrp, pageGrp * pageSizeGrp);

  const totalPagesGrp = Math.ceil(filteredDatasGrp.length / pageSizeGrp);

  const visiblePagesGrp = Math.min(totalPagesGrp, 3);

  const firstVisiblePageGrp = Math.max(1, pageGrp - 1);
  const lastVisiblePageGrp = Math.min(firstVisiblePageGrp + visiblePagesGrp - 1, totalPagesGrp);

  const pageNumbersGrp = [];

  const indexOfLastItemGrp = pageGrp * pageSizeGrp;
  const iindexOfFirstItemGrp = indexOfLastItemGrp - pageSizeGrp;

  for (let i = firstVisiblePageGrp; i <= lastVisiblePageGrp; i++) {
    pageNumbersGrp.push(i);
  }

  // Sorting Hsn
  const handleSortingHsn = (column) => {
    const direction = sortingHsn.column === column && sortingHsn.direction === 'asc' ? 'desc' : 'asc';
    setSortingHsn({ column, direction });
  };

  const sortedDataHsn = hsnGrp.sort((a, b) => {
    if (sortingHsn.direction === 'asc') {
      return a[sortingHsn.column] > b[sortingHsn.column] ? 1 : -1;
    } else if (sortingHsn.direction === 'desc') {
      return a[sortingHsn.column] < b[sortingHsn.column] ? 1 : -1;
    }
    return 0;
  });

  const renderSortingIconHsn = (column) => {
    if (sortingHsn.column !== column) {
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
    } else if (sortingHsn.direction === 'asc') {
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

  // Datatable Hsn
  const handlePageChangeHsn = (newPage) => {
    setPageHsn(newPage);
  };

  const handlePageSizeChangeHsn = (event) => {
    setPageSizeHsn(Number(event.target.value));
    setPageHsn(1);
  };

  const handleSearchChangeHsn = (event) => {
    setSearchQueryHsn(event.target.value);
  };
  const filteredDatasHsn = hsnGrp?.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().startsWith(searchQueryHsn.toLowerCase())
    )
  );

  const filteredDataHsn = filteredDatasHsn?.slice((pageHsn - 1) * pageSizeHsn, pageHsn * pageSizeHsn);

  const totalPagesHsn = Math.ceil(filteredDatasHsn.length / pageSizeHsn);

  const visiblePagesHsn = Math.min(totalPagesHsn, 3);

  const firstVisiblePageHsn = Math.max(1, pageHsn - 1);
  const lastVisiblePageHsn = Math.min(firstVisiblePageHsn + visiblePagesHsn - 1, totalPagesHsn);

  const pageNumbersHsn = [];

  const indexOfLastItemHsn = pageHsn * pageSizeHsn;
  const indexOfFirstItemHsn = indexOfLastItemHsn - pageSizeHsn;

  for (let i = firstVisiblePageHsn; i <= lastVisiblePageHsn; i++) {
    pageNumbersHsn.push(i);
  }

  return (
    <>
      <Headtitle title={'Taxrate'} />
      <Typography sx={userStyle.HeaderText}>Tax Rates  <Typography component="span" sx={userStyle.SubHeaderText}>Manage your tax rates</Typography></Typography>
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item lg={3} md={3} sm={12} xs={12}>
            <Typography sx={userStyle.importheadtext}>All your tax rates</Typography>
          </Grid>
          {/* EXPORT BUTTONS START */}
          <Grid item lg={6} md={6} sm={12} xs={12} SX={{ display: "flex", justifyContent: "center" }} >
            <Grid>
              {isUserRoleCompare[0]?.csvtaxrate && (
                <>
                  <ExportCSV csvData={exceldatataxrate} fileName={fileNameTaxrate} />
                </>
              )}
              {isUserRoleCompare[0]?.exceltaxrate && (
                <>
                  <ExportXL csvData={exceldatataxrate} fileName={fileNameTaxrate} />
                </>
              )}
              {isUserRoleCompare[0]?.printtaxrate && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                </>
              )}
              {isUserRoleCompare[0]?.pdftaxrate && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                </>
              )}
            </Grid>
          </Grid>
          {/* EXPORT BUTTONS END */}
          <Grid item lg={3} md={3} sm={12} xs={12}>
            {isUserRoleCompare[0]?.ataxrate && (
              <>
                <Link to="/settings/taxrate/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>                  </>
            )}
          </Grid>
        </Grid><br /><br />
        <Grid style={userStyle.dataTablestyle}>
          <Box>
            <label htmlFor="pageSizeSelect">Show&ensp;</label>
            <Select id="pageSizeSelect" value={pageSizeTax} onChange={handlePageSizeChangeTax} sx={{ width: "77px" }}>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={(taxRate.length)}>All</MenuItem>
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
                  value={searchQueryTax}
                  onChange={handleSearchChangeTax}
                />
              </FormControl>
            </Grid>
          </Box>
        </Grid><br /><br />
        {isLoader ? (
          <>
            {/* TAX RATE TABLE START */}
            <Box>
              <TableContainer component={Paper}>
                <Table sx={{ margin: '20px' }} aria-label="customized table" id="tableRef1">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell onClick={() => handleSortingTax('taxname')}><Box sx={userStyle.tableheadstyle}><Box>Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTax('taxname')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSortingTax('taxrate')}><Box sx={userStyle.tableheadstyle}><Box>Tax Rate %</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTax('taxrate')}</Box></Box></StyledTableCell>
                      <StyledTableCell>Actions</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDataTax.length > 0 ?
                      (filteredDataTax.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell component="th" scope="row">{item.taxname}</StyledTableCell>
                          <StyledTableCell align="left">{item.taxrate}</StyledTableCell>
                          <StyledTableCell align="center">
                            <Grid sx={{ display: 'flex' }}>
                              {isUserRoleCompare[0]?.etaxrate && (
                                <>
                                  <Link to={`/settings/taxrate/edit/${item._id}`} style={{ textDecoration: 'none', color: '#fff' }}><Button sx={userStyle.buttonedit}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                </>
                              )}
                              {isUserRoleCompare[0]?.dtaxrate && (
                                <>
                                  <Button onClick={(e) => { rowData(item._id, item.taxname, item.taxrate, "", item.taxname) }} sx={userStyle.buttondelete}><DeleteOutlineOutlinedIcon style={{ fontSize: 'large' }} /></Button>
                                </>
                              )}
                              {isUserRoleCompare[0]?.vtaxrate && (
                              <>
                                <Link to={`/settings/taxrate/view/${item._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                              </>
                            )}
                            </Grid>
                          </StyledTableCell>
                        </StyledTableRow>
                      )))
                      : <StyledTableRow><StyledTableCell colSpan={5} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                    }
                  </TableBody>
                </Table>
              </TableContainer><br /><br />
              <Box style={userStyle.dataTablestyle}>
                <Box>
                Showing {filteredDatasTax.length > 0 ? ((pageTax - 1) * pageSizeTax) + 1 : 0} to {Math.min(pageTax * pageSizeTax, filteredDatasTax.length)} of {filteredDatasTax.length} entries
                </Box>
                <Box>
                  <Button onClick={() => handlePageChangeTax(pageTax - 1)} disabled={pageTax === 1} sx={{ textTransform: 'capitalize', color: 'black' }}>
                    Prev
                  </Button>
                  {pageNumbersTax?.map((pageNumber) => (
                    <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeTax(pageNumber)} className={((pageTax)) === pageNumber ? 'active' : ''} disabled={pageTax === pageNumber}>
                      {pageNumber}
                    </Button>
                  ))}
                  {lastVisiblePageTax < totalPagesTax && <span>...</span>}
                  <Button onClick={() => handlePageChangeTax(pageTax + 1)} disabled={pageTax === totalPagesTax} sx={{ textTransform: 'capitalize', color: 'black' }}>
                    Next
                  </Button>
                </Box>
              </Box>
              <br /><br />
              {pageSizeTax != 1 ? <Grid >
                {isUserRoleCompare[0]?.ataxrate && (
                  <>
                    <Link to="/settings/taxrate/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>                  </>
                )}<br /><br />
              </Grid> : null}
            </Box>
            {/* ******* TAX RATE TABLE START ******* */}
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
            </Box>
          </>
        )}

      </Box>
      <br />
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item lg={3} md={3} sm={12} xs={12}>
            <Typography sx={userStyle.importheadtext}>Tax groups (Combination of multiple taxes)</Typography>
          </Grid>
          {/* EXPORT BUTTONS START */}
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Grid>
              {isUserRoleCompare[0]?.csvtaxrategroup && (
                <>
                  <ExportCSV csvData={exceldatataxgrp} fileName={fileNameTaxrategrp} />
                </>
              )}
              {isUserRoleCompare[0]?.exceltaxrategroup && (
                <>
                  <ExportXL csvData={exceldatataxgrp} fileName={fileNameTaxrategrp} />
                </>
              )}
              {isUserRoleCompare[0]?.printtaxrategroup && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={handleprintTaxRateGrp}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                </>
              )}
              {isUserRoleCompare[0]?.pdftaxrategroup && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={() => downloadPdfGroup()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                </>
              )}
            </Grid>
          </Grid>
          {/* EXPORT BUTTONS END */}
          <Grid item lg={3} md={3} sm={12} xs={12}>
            {isUserRoleCompare[0]?.ataxrategroup && (
              <>
                <Link to="/settings/taxrateg/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>

              </>
            )}
          </Grid>
        </Grid><br /><br />
        <Grid style={userStyle.dataTablestyle}>
          <Box>
            <label htmlFor="pageSizeSelect">Show&ensp;</label>
            <Select id="pageSizeSelect" value={pageSizeGrp} onChange={handlePageSizeChangeGrp} sx={{ width: "77px" }}>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={(taxRateGrp.length)}>All</MenuItem>
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
                  value={searchQueryGrp}
                  onChange={handleSearchChangeGrp}
                />
              </FormControl>
            </Grid>
          </Box>
        </Grid><br /><br />
        {isGroupLoader ? (
          <>
            {/* TAX GROUP TABLE START */}
            <Box>
              <TableContainer component={Paper} >
                <Table sx={{ margin: "20px" }} aria-label="customized table" id="tableRefone2">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell onClick={() => handleSortingGrp('taxname')}><Box sx={userStyle.tableheadstyle}><Box>Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconGrp('taxname')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSortingGrp('taxrate')}><Box sx={userStyle.tableheadstyle}><Box>Tax rate %</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconGrp('taxrate')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSortingGrp('subtax')}><Box sx={userStyle.tableheadstyle}><Box>Sub taxes</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconGrp('subtax')}</Box></Box></StyledTableCell>
                      <StyledTableCell>Actions</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDataGrp.length > 0 ?
                      (filteredDataGrp.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell component="th" scope="row">{item.taxname}</StyledTableCell>
                          <StyledTableCell align="left">{item.taxrate}</StyledTableCell>
                          <StyledTableCell align="left">{item.subtax + ", "}</StyledTableCell>
                          <StyledTableCell align="center">
                            {isUserRoleCompare[0]?.dtaxrategroup && (
                              <>
                                <Button onClick={(e) => { rowData(item._id, item.taxname, item.taxrate, "", item.taxname) }} sx={userStyle.buttondelete}><DeleteOutlineOutlinedIcon style={{ fontSize: 'large' }} /></Button>
                              </>
                            )}
                            {isUserRoleCompare[0]?.vtaxrategroup && (
                              <>
                                <Link to={`/settings/taxrategroup/view/${item._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                              </>
                            )}
                          </StyledTableCell>
                        </StyledTableRow>
                      )))
                      : <StyledTableRow><StyledTableCell colSpan={4} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                    }
                  </TableBody>
                </Table>
              </TableContainer><br /><br />
              <Box style={userStyle.dataTablestyle}>
                <Box>
                  Showing {filteredDatasGrp.length > 0 ? ((pageGrp - 1) * taxRateGrp) + 1 : 0} to {Math.min(pageGrp * filteredDatasGrp, taxRateGrp.length)} of {filteredDatasGrp.length} entries
                </Box>
                <Box>
                  <Button onClick={() => handlePageChangeGrp(pageGrp - 1)} disabled={pageGrp === 1} sx={{ textTransform: 'capitalize', color: 'black' }}>
                    Prev
                  </Button>
                  {pageNumbersGrp?.map((pageNumber) => (
                    <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeGrp(pageNumber)} className={((pageGrp)) === pageNumber ? 'active' : ''} disabled={pageGrp === pageNumber}>
                      {pageNumber}
                    </Button>
                  ))}
                  {lastVisiblePageTax < totalPagesGrp && <span>...</span>}
                  <Button onClick={() => handlePageChangeGrp(pageGrp + 1)} disabled={pageGrp === totalPagesGrp} sx={{ textTransform: 'capitalize', color: 'black' }}>
                    Next
                  </Button>
                </Box>
              </Box>
              <br /><br />
              {pageSizeGrp != 1 ? <Grid >
                {isUserRoleCompare[0]?.ataxrategroup && (
                  <>
                    <Link to="/settings/taxrateg/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>

                  </>
                )}<br /><br />
              </Grid> : null}
            </Box>

            {/* TAX GROUP TABLE END */}
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
            </Box>
          </>
        )}
      </Box>
      <br />
      {/* HSN GROUP TABLE START */}
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item lg={3} md={3} sm={12} xs={12}>
            <Typography sx={userStyle.importheadtext}>HSN</Typography>
          </Grid>
          {/* EXPORT BUTTONS START */}
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Grid>
              {isUserRoleCompare[0]?.csvtaxratehsn && (
                <>
                  <ExportCSV csvData={exceldatahsn} fileName={fileNameHsn} />
                </>
              )}
              {isUserRoleCompare[0]?.exceltaxratehsn && (
                <>
                  <ExportXL csvData={exceldatahsn} fileName={fileNameHsn} />
                </>
              )}
              {isUserRoleCompare[0]?.printtaxratehsn && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={handleprintHsn}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                </>
              )}
              {isUserRoleCompare[0]?.pdftaxratehsn && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={() => downloadPdfHsn()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                </>
              )}
            </Grid>
          </Grid>
          {/* EXPORT BUTTONS END */}
          <Grid item lg={3} md={3} sm={12} xs={12}>
            {isUserRoleCompare[0]?.ataxratehsn && (
              <>
                <Link to="/settings/hsn/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>

              </>
            )}
          </Grid>
        </Grid><br /><br />
        <Grid style={userStyle.dataTablestyle}>
          <Box>
            <label htmlFor="pageSizeSelect">Show&ensp;</label>
            <Select id="pageSizeSelect" value={pageSizeHsn} onChange={handlePageSizeChangeHsn} sx={{ width: "77px" }}>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={(hsnGrp.length)}>All</MenuItem>
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
                  value={searchQueryHsn}
                  onChange={handleSearchChangeHsn}
                />
              </FormControl>
            </Grid>
          </Box>
        </Grid><br /><br />
        {isHsnLoader ? (
          <>
            <TableContainer component={Paper}>
              <Table sx={{ margin: "20px" }} aria-label="customized table" id="tableRefone3">
                <TableHead >
                  <StyledTableRow>
                    <StyledTableCell onClick={() => handleSortingHsn('hsn')}><Box sx={userStyle.tableheadstyle}><Box>HSN</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconHsn('hsn')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSortingHsn('taxrate')}><Box sx={userStyle.tableheadstyle}><Box>Tax rate %</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconHsn('taxrate')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSortingHsn('subtax')}><Box sx={userStyle.tableheadstyle}><Box>Sub taxes</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconHsn('subtax')}</Box></Box></StyledTableCell>
                    <StyledTableCell>Actions</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {filteredDataHsn.length > 0 ?
                    (filteredDataHsn.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">{item.hsn}</StyledTableCell>
                        <StyledTableCell align="left">{item.taxrate}</StyledTableCell>
                        <StyledTableCell align="left">{item.subtax + ", "}</StyledTableCell>
                        <StyledTableCell align="center">
                          {isUserRoleCompare[0]?.dtaxratehsn && (
                            <>
                              <Button onClick={(e) => { rowData(item._id, "", "", item.hsn, item.hsn) }} sx={userStyle.buttondelete}><DeleteOutlineOutlinedIcon style={{ fontSize: 'large' }} /></Button>
                            </>
                          )}
                          {isUserRoleCompare[0]?.vtaxratehsn && (
                        <>
                          <Link to={`/settings/hsn/view/${item._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                        </>
                      )}
                        </StyledTableCell>
                      </StyledTableRow>
                    )))
                    : <StyledTableRow><StyledTableCell colSpan={4} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                  }
                </TableBody>
              </Table>
            </TableContainer><br /><br />
            <Box style={userStyle.dataTablestyle}>
              <Box>
                Showing {filteredDatasHsn.length > 0 ? ((pageHsn - 1) * pageSizeHsn) + 1 : 0} to {Math.min(pageHsn * pageSizeHsn, filteredDatasHsn.length)} of {filteredDatasHsn.length} entries
              </Box>
              <Box>
                <Button onClick={() => handlePageChangeHsn(pageHsn - 1)} disabled={pageHsn === 1} sx={{ textTransform: 'capitalize', color: 'black' }}>
                  Prev
                </Button>
                {pageNumbersHsn?.map((pageNumber) => (
                  <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeHsn(pageNumber)} className={((pageHsn)) === pageNumber ? 'active' : ''} disabled={pageHsn === pageNumber}>
                    {pageNumber}
                  </Button>
                ))}
                {lastVisiblePageHsn < totalPagesHsn && <span>...</span>}
                <Button onClick={() => handlePageChangeHsn(pageHsn + 1)} disabled={pageHsn === totalPagesHsn} sx={{ textTransform: 'capitalize', color: 'black' }}>
                  Next
                </Button>
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
        {pageSizeHsn != 1 ? <Grid >
          {isUserRoleCompare[0]?.ataxratehsn && (
            <>
              <Link to="/settings/hsn/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>

            </>
          )}<br /><br />
        </Grid> : null}
      </Box>
      {/* TAX GROUP TABLE END */}
      {/* Print layout 1 */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ margin: '20px' }} aria-label="customized table" id="taxrate" ref={componentRef}>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell sx={{ border: '1px solid #dddddd7d !important' }}>Name</StyledTableCell>
              <StyledTableCell align="left" sx={{ border: '1px solid #dddddd7d !important' }}>Tax Rate %</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {taxRate && (
              taxRate.map((item, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">{item.taxname}</StyledTableCell>
                  <StyledTableCell align="left">{item.taxrate}</StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* printlayout ends */}
      {/* Print layout 2 */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ margin: "20px" }} aria-label="customized table" id="taxrategroup" ref={componentRefTaxRateGrp}>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell sx={{ border: '1px solid #dddddd7d !important' }}>Name</StyledTableCell>
              <StyledTableCell align="left" sx={{ border: '1px solid #dddddd7d !important' }}>Tax rate %</StyledTableCell>
              <StyledTableCell align="left" sx={{ border: '1px solid #dddddd7d !important' }}>Sub taxes</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {taxRateGrp.length > 0 && (
              taxRateGrp.map((item, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">{item.taxname}</StyledTableCell>
                  <StyledTableCell align="left">{item.taxrate}</StyledTableCell>
                  <StyledTableCell align="left">{item.subtax + ", "}</StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* printlayout ends */}
      {/* Print layout 3 */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ margin: "20px" }} aria-label="customized table" id="hsn" ref={componentRefHsn}>
          <TableHead >
            <StyledTableRow>
              <StyledTableCell sx={{ border: '1px solid #dddddd7d !important' }}>HSN</StyledTableCell>
              <StyledTableCell align="left" sx={{ border: '1px solid #dddddd7d !important' }}>Tax rate %</StyledTableCell>
              <StyledTableCell align="left" sx={{ border: '1px solid #dddddd7d !important' }}>Sub taxes</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {hsnGrp.length > 0 && (
              hsnGrp.map((item, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">{item.hsn}</StyledTableCell>
                  <StyledTableCell align="left">{item.taxrate}</StyledTableCell>
                  <StyledTableCell align="left">{item.subtax + ", "}</StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* printlayout ends */}

      {/* ALERT DIALOG */}
      <Dialog
        open={open}
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
          <Button onClick={(e) => deleteTaxRate(taxid)} autoFocus variant="contained" color='error'> OK  </Button>
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
            {checkProdTax?.length > 0 && checkPurTax?.length > 0 && checkPurRtnTax?.length > 0
              && checkPosTax?.length > 0 && checkDraftTax?.length > 0 && checkQuotTax?.length > 0
              && checkExpTax?.length > 0
              ? (

                <>
                  <span style={{ fontWeight: '700', color: '#777' }}>
                    {linkedValue}
                  </span>
                  was linked in <span style={{ fontWeight: '700' }}>Prodcut, Purchase, Pruchase Return, Expense, Pos, Draft & Quotation</span>
                </>
              ) :
              checkProdTax?.length > 0 || checkPurTax?.length > 0 || checkPurRtnTax?.length > 0
                || checkPosTax?.length > 0 || checkDraftTax?.length > 0 || checkQuotTax?.length > 0
                || checkExpTax?.length > 0

                ? (
                  <>
                    <span style={{ fontWeight: '700', color: '#777' }}>
                      {linkedValue}
                    </span>
                    was linked in{' '}
                    <span style={{ fontWeight: '700' }}>
                      {checkProdTax?.length ? ' Product' : ''}
                      {checkPurTax?.length ? ' Pruchase' : ''}
                      {checkPurRtnTax?.length ? ' Pruchase Return' : ''}
                      {checkExpTax?.length ? ' Expense' : ''}
                      {checkPosTax?.length ? ' Pos' : ''}
                      {checkDraftTax?.length ? ' Draft' : ''}
                      {checkQuotTax?.length ? ' Quotation' : ''}
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

    </>
  );
}

function Taxratelist() {
  return (
    <>
      <Taxratelisttable /><br /><br /><br /><br />
          <Footer />
    </>
  );
}
export default Taxratelist;