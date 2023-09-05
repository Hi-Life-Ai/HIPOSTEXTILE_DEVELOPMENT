import React, { useState, useContext, useEffect } from 'react';
import { userStyle } from '../../PageStyle';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Typography, FormGroup, FormControlLabel, Checkbox, Divider, Button, Dialog, DialogContent, DialogActions } from '@mui/material';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Rolecreatelist() {

    const { auth, setngs } = useContext(AuthContext);
    const [isRole, setIsRole] = useState([]);

    // Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    const [role, setRole] = useState({
        // User
        rolename: "", usermanagement: false, alluser: false,
        checkalluser: false, vuser: false, auser: false, euser: false, duser: false, exceluser: false,
        csvuser: false, printuser: false, pdfuser: false,
        // Role
        allrole: false, checkallrole: false, vrole: false, arole: false, erole: false, drole: false, excelrole: false, csvrole: false, printrole: false,
        pdfrole: false,
        //  Department
        alldepartment: false,
        checkalldepartment: false,
        adepartment: false,
        exceldepartment: false,
        csvdepartment: false,
        printdepartment: false,
        pdfdepartment: false,
        edepartment: false,
        vdepartment: false,
        ddepartment: false,
        // Sales commision agent
        allsalescommissionagent: false, checkallsalescommissionagent: false, asalescommissionagent: false, esalescommissionagent: false, dsalescommissionagent: false, excelsalescommissionagent: false,
        csvsalescommissionagent: false, printsalescommissionagent: false, pdfsalescommissionagent: false,
        // Supplier
        suppliermanagement: false, allsupplier: false, checkallsupplier: false, vsupplier: false, isupplier: false, asupplier: false,
        esupplier: false,
        dsupplier: false,
        excelsupplier: false,
        csvsupplier: false,
        pdfsupplier: false,
        printsupplier: false,
        // Customer
        customermanagement: false, allcustomer: false, checkallcustomer: false, vcustomer: false, icustomer: false, acustomer: false, ecustomer: false, dcustomer: false, excelcustomer: false, csvcustomer: false, printcustomer: false, pdfcustomer: false,
        // Customer group
        allcustomergrp: false, checkallcustomergrp: false,
        acustomergrp: false,
        ecustomergrp: false,
        dcustomergrp: false,
        vcustomergrp: false,
        excelcustomergrp: false,
        csvcustomergrp: false,
        printcustomergrp: false,
        pdfcustomergrp: false,
        // Product Module
        productmanagement: false,
        // Unit
        allunit: false,
        checkallunit: false,
        aunit: false,
        eunit: false,
        vunit: false,
        dunit: false,
        excelunit: false,
        csvunit: false,
        printunit: false,
        pdfunit: false,
        // Size
        allsize: false,
        checkallsize: false,
        asize: false,
        esize: false,
        vsize: false,
        dsize: false,
        excelsize: false,
        csvsize: false, printsize: false, pdfsize: false,

        //style
        allstyle: false,
        checkallstyle: false,
        astyle: false,
        estyle: false,
        vstyle: false,
        dstyle: false,
        excelstyle: false,
        csvstyle: false, printstyle: false, pdfstyle: false,

        //UnitGrouping
        allUnitGroup: false,
        checkallUnitGroup: false,
        aUnitGroup: false,
        eUnitGroup: false,
        vUnitGroup: false,
        dUnitGroup: false,
        excelUnitGroup: false,
        csvUnitGroup: false, printUnitGroup: false, pdfUnitGroup: false,

        // Color
        allcolor: false,
        checkallcolor: false,
        acolor: false,
        ecolor: false,
        vcolor: false,
        dcolor: false,
        excelcolor: false,
        csvcolor: false,
        printcolor: false,
        pdfcolor: false,
        // Category
        allcategory: false,
        checkallcategory: false,
        acategory: false,
        ecategory: false,
        dcategory: false,
        vcategory: false,
        printcategory: false,
        pdfcategory: false,
        //section Grouping
        allsectiongrp: false,
        checkallsectiongrp: false,
        asectiongrp: false,
        esectiongrp: false,
        vsectiongrp: false,
        dsectiongrp: false,
        excelsectiongrp: false,
        csvsectiongrp: false, printsectiongrp: false, pdfsectiongrp: false,
        // Product
        allproduct: false,
        checkallproduct: false,
        vproduct: false,
        iproduct: false,
        aproduct: false,
        eproduct: false,
        dproduct: false,
        excelproduct: false,
        csvproduct: false,
        printproduct: false,
        pdfproduct: false,

        // Racks Start
        allracks: false,
        checkallracks: false,
        aracks: false,
        eracks: false,
        dracks: false,
        vracks: false,
        excelracks: false,
        csvracks: false,
        printracks: false,
        pdfracks: false,
        // Racks End

        // Discount
        alldiscount: false,
        checkalldiscount: false,
        adiscount: false,
        ediscount: false,
        vdiscount: false,
        ddiscount: false,
        exceldiscount: false,
        csvdiscount: false,
        printdiscount: false,
        pdfdiscount: false,
        // Stock
        allstock: false,
        checkallstock: false,
        astock: false,
        printlabelstock: false,
        excelstock: false,
        csvstock: false,
        printstock: false,
        pdfstock: false,
        // Print lable
        allproductlabel: false,
        // Purchase
        purchasemanagement: false,
        allpurchase: false,
        checkallpurchase: false,
        vpurchase: false,
        apurchase: false,
        epurchase: false,
        dpurchase: false,
        excelpurchase: false,
        csvpurchase: false,
        printpurchase: false,
        pdfpurchase: false,
        // Purchase Return Start
        allpurchasereturn: false,
        checkallpurchasereturn: false,
        vpurchasereturn: false,
        apurchasereturn: false,
        epurchasereturn: false,
        dpurchasereturn: false,
        excelpurchasereturn: false,
        csvpurchasereturn: false,
        printpurchasereturn: false,
        pdfpurchasereturn: false,
        // Purchase order
        allpurchaseorder: false,
        checkallpurchaseorder: false,
        vpurchaseorder: false,
        apurchaseorder: false,
        epurchaseorder: false,
        dpurchaseorder: false,
        sellmanagement: false,
        // Pos
        allpos: false,
        checkallpos: false,
        apos: false,
        epos: false,
        vpos: false,
        dpos: false,
        excelpos: false,
        csvpos: false,
        printpos: false,
        pdfpos: false,
        // Draft
        alldraft: false,
        checkalldraft: false,
        adraft: false,
        edraft: false,
        vdraft: false,
        ddraft: false,
        exceldraft: false,
        csvdraft: false,
        printdraft: false,
        pdfdraft: false,
        // Quotation
        allquotation: false,
        checkallquotation: false, aquotation: false, equotation: false, vquotation: false, dquotation: false, excelquotation: false, csvquotation: false,
        printquotation: false,
        pdfquotation: false,
        // Expense
        expensemanagement: false,
        allexpense: false,
        checkallexpense: false,
        aexpense: false,
        eexpense: false,
        vexpense: false,
        dexpense: false,
        excelexpense: false,
        csvexpense: false,
        printexpense: false,
        pdfexpense: false,
        // Expense category
        dallexpensecategoryuser: false,
        allexpensecategory: false,
        checkallexpensecategory: false,
        aexpensecategory: false,
        eexpensecategory: false,
        dexpensecategory: false,
        excelexpensecategory: false,
        csvexpensecategory: false,
        printexpensecategory: false,
        pdfexpensecategory: false,
        // Settings
        settingsmanagement: false, allbusinesslocation: false, checkallbusinesslocation: false, activatebusinesslocation: false, abusinesslocation: false,
        ebusinesslocation: false,
        vbusinesslocation: false,
        dbusinesslocation: false, excelbusinesslocation: false, csvbusinesslocation: false, printbusinesslocation: false, pdfbusinesslocation: false, allalpharate: false, checkallalpharate: false, valpharate: false, aalpharate: false, alltaxrate: false, checkalltaxrate: false, ataxrate: false, etaxrate: false, vtaxrate: false, dtaxrate: false, exceltaxrate: false, csvtaxrate: false, printtaxrate: false, pdftaxrate: false, alltaxrategroup: false, checkalltaxrategroup: false, ataxrategroup: false, vtaxrategroup: false, dtaxrategroup: false, exceltaxrategroup: false, csvtaxrategroup: false, printtaxrategroup: false, pdftaxrategroup: false, alltaxratehsn: false, checkalltaxratehsn: false,
        ataxratehsn: false, vtaxratehsn: false, dtaxratehsn: false, exceltaxratehsn: false,
        csvtaxratehsn: false,
        printtaxratehsn: false,
        pdftaxratehsn: false,
        allpaymentintegration: false,
        checkallpaymentintegration: false,
        vpaymentintegration: false,
        apaymentintegration: false,
        dpaymentintegration: false,
        excelpaymentintegration: false,
        csvpaymentintegration: false,
        pdfpaymentintegration: false,
        businesssettings: false,
        // Dashboard
        home: true,
        selectlocation: false,
        from: false,
        to: false,
        totalpurchase: false,
        totalsales: false,
        purchasedue: false,
        salesdue: false,
        totalsalesreturn: false,
        totalpurchasereturn: false,
        expenses: false,
        barchart: false,
        topproductspiechart: false,
        topcustomerspiechart: false,
        stockalerttable: false,
        recentsalestable: false,
        topsellproductstable: false,
        //stock transfer
        stocktransferlistmanagement: false,
        allstocktransferlist: false,
        checkallstocktransferlist: false,
        vstocktransferlist: false,
        astocktransferlist: false,
        excelstocktransferlist: false,
        csvstocktransferlist: false,
        pdfstocktransferlist: false,
        printstocktransferlist: false,
        // Stock Adjust 
        stockadjustmanagement: false,
        allstockadjust: false,
        checkallstockadjust: false,
        astockadjust: false,
        excelstockadjust: false,
        csvstockadjust: false,
        printstockadjust: false,
        pdfstockadjust: false,
        vstockadjust: false,
        //stock adjustment type
        allstockadjustmenttype: false,
        checkallstockadjustmenttype: false,
        astockadjustmenttype: false,
        estockadjustmenttype: false,
        vstockadjustmenttype: false,
        dstockadjustmenttype: false,
        excelstockadjustmenttype: false,
        csvstockadjustmenttype: false,
        printstockadjustmenttype: false,
        pdfstockadjustmenttype: false,

        //manual stock entry

        allmanualstockentry: false,
        checkallmanualstockentry: false,
        astockmanualstockentry: false,
        estockmanualstockentry: false,
        vstockmanualstockentry: false,
        dstockmanualstockentry: false,
        excelmanualstockentry: false,
        csvmanualstockentry: false,
        printmanualstockentry: false,
        pdfmanualstockentry: false,

        //current stock entry
        checkallcurrentstock:false,
        allcurrentstockreport: false,
        excelcurrentstockreport: false,
        csvcurrentstockreport: false,
        printcurrentstockreport: false,
        pdfcurrentstockreport: false,



        // Password Management 
        // Password
        passwordmanagement: false,
        allpassword: false,
        checkallpassword: false,
        excelpassword: false,
        csvpassword: false,
        printpassword: false,
        pdfpassword: false,
        vpassword: false,
        apassword: false,
        epassword: false,
        dpassword: false,

        // Folder
        allfolder: false,
        checkallfolder: false,
        excelfolder: false,
        csvfolder: false,
        printfolder: false,
        pdffolder: false,
        afolder: false,
        vfolder: false,
        efolder: false,
        dfolder: false,
        addnewfolder: false,
        allassignpassword: false,
        assignpasswordlist: false,
        checkallassignpassword: false,
        excelassignpassword: false,
        csvassignpassword: false,
        printassignpassword: false,
        pdfassignpassword: false,

        //brand
        checkallbrands: false,
        allbrands: false,
        addbrand: false,
        listbrand: false,
        editbrand: false,
        excelbrand: false,
        csvbrand: false,
        printbrand: false,
        pdfbrand: false,
        viewbrand: false,
        deletebrand: false,


        //grouping 
        checkallgrouping: false,
        allgrouping: false,
        addgrouping: false,
        listgrouping: false,
        editgrouping: false,
        excelgrouping: false,
        csvgrouping: false,
        printgrouping: false,
        pdfgrouping: false,
        viewgrouping: false,
        deletegrouping: false,






    });

    //  Fetch department Data
    const fetchRoles = async () => {
        try {
            let res = await axios.post(SERVICE.ROLE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setIsRole(res?.data?.roles);
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
            fetchRoles();
        }, []
    )


    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);


    const userAllSelect = () => {
        setRole((prevUser) => {
            return { ...prevUser, checkalluser: !role.checkalluser, vuser: !role.vuser, auser: !role.auser, euser: !role.euser, duser: !role.duser, exceluser: !role.exceluser, csvuser: !role.csvuser, printuser: !role.printuser, pdfuser: !role.pdfuser }
        }
        )
    }

    const roleAllSelect = () => {
        setRole((prevRole) => {
            return { ...prevRole, checkallrole: !role.checkallrole, vrole: !role.vrole, arole: !role.arole, erole: !role.erole, drole: !role.drole, excelrole: !role.excelrole, csvrole: !role.csvrole, printrole: !role.printrole, pdfrole: !role.pdfrole, }
        })
    }

    const departmentAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkalldepartment: !role.checkalldepartment,
                adepartment: !role.adepartment,
                exceldepartment: !role.exceldepartment,
                csvdepartment: !role.csvdepartment,
                printdepartment: !role.printdepartment,
                pdfdepartment: !role.pdfdepartment,
                edepartment: !role.edepartment,
                vdepartment: !role.vdepartment,
                ddepartment: !role.ddepartment,
            }
        })
    }

    const salesCommissionAgentAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallsalescommissionagent: !role.checkallsalescommissionagent, asalescommissionagent: !role.asalescommissionagent, esalescommissionagent: !role.esalescommissionagent, dsalescommissionagent: !role.dsalescommissionagent, excelsalescommissionagent: !role.excelsalescommissionagent, csvsalescommissionagent: !role.csvsalescommissionagent, printsalescommissionagent: !role.printsalescommissionagent, pdfsalescommissionagent: !role.pdfsalescommissionagent }
        })
    }

    const supplierAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallsupplier: !role.checkallsupplier, vsupplier: !role.vsupplier, isupplier: !role.isupplier, asupplier: !role.asupplier, esupplier: !role.esupplier, dsupplier: !role.dsupplier, excelsupplier: !role.excelsupplier, csvsupplier: !role.csvsupplier, pdfsupplier: !role.pdfsupplier, printsupplier: !role.printsupplier }
        })
    }

    const customerAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallcustomer: !role.checkallcustomer, icustomer: !role.icustomer, vcustomer: !role.vcustomer, acustomer: !role.acustomer, ecustomer: !role.ecustomer, dcustomer: !role.dcustomer, excelcustomer: !role.excelcustomer, csvcustomer: !role.csvcustomer, printcustomer: !role.printcustomer, pdfcustomer: !role.pdfcustomer }
        })
    }

    const customerGroupAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallcustomergrp: !role.checkallcustomergrp, acustomergrp: !role.acustomergrp, ecustomergrp: !role.ecustomergrp, dcustomergrp: !role.dcustomergrp, vcustomergrp: !role.vcustomergrp, excelcustomergrp: !role.excelcustomergrp, csvcustomergrp: !role.csvcustomergrp, printcustomergrp: !role.printcustomergrp, pdfcustomergrp: !role.pdfcustomergrp }
        })
    }

    const unitAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallunit: !role.checkallunit, aunit: !role.aunit, eunit: !role.eunit, vunit: !role.vunit, dunit: !role.dunit, excelunit: !role.excelunit, csvunit: !role.csvunit, printunit: !role.printunit, pdfunit: !role.pdfunit }
        })
    }

    const sizeAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallsize: !role.checkallsize, asize: !role.asize, vsize: !role.vsize, esize: !role.esize, dsize: !role.dsize, excelsize: !role.excelsize, csvsize: !role.csvsize, printsize: !role.printsize, pdfsize: !role.pdfsize }
        })
    }

    const styleAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallstyle: !role.checkallstyle, astyle: !role.astyle, vstyle: !role.vstyle, estyle: !role.estyle, dstyle: !role.dstyle, excelstyle: !role.excelstyle, csvstyle: !role.csvstyle, printstyle: !role.printstyle, pdfstyle: !role.pdfstyle }
        })
    }

    const SectionGroupingAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallsectiongrp: !role.checkallsectiongrp, asectiongrp: !role.asectiongrp, vsectiongrp: !role.vsectiongrp, esectiongrp: !role.esectiongrp, dsectiongrp: !role.dsectiongrp, excelsectiongrp: !role.excelsectiongrp, csvsectiongrp: !role.csvsectiongrp, printsectiongrp: !role.printsectiongrp, pdfsectiongrp: !role.pdfsectiongrp }
        })
    }

    const UnitGroupAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallUnitGroup: !role.checkallUnitGroup, aUnitGroup: !role.aUnitGroup, vUnitGroup: !role.vUnitGroup, eUnitGroup: !role.eUnitGroup, dUnitGroup: !role.dUnitGroup, excelUnitGroup: !role.excelUnitGroup, csvUnitGroup: !role.csvUnitGroup, printUnitGroup: !role.printUnitGroup, pdfUnitGroup: !role.pdfUnitGroup }
        })
    }

    const colorAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallcolor: !role.checkallcolor, acolor: !role.acolor, vcolor: !role.vcolor, ecolor: !role.ecolor, dcolor: !role.dcolor, excelcolor: !role.excelcolor, csvcolor: !role.csvcolor, printcolor: !role.printcolor, pdfcolor: !role.pdfcolor }
        })
    }

    const categoryAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallcategory: !role.checkallcategory, acategory: !role.acategory, ecategory: !role.ecategory, dcategory: !role.dcategory, vcategory: !role.vcategory, printcategory: !role.printcategory, pdfcategory: !role.pdfcategory }
        })
    }

    const productAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallproduct: !role.checkallproduct, vproduct: !role.vproduct, iproduct: !role.iproduct, aproduct: !role.aproduct, eproduct: !role.eproduct, dproduct: !role.dproduct, excelproduct: !role.excelproduct, csvproduct: !role.csvproduct, printproduct: !role.printproduct, pdfproduct: !role.pdfproduct }
        })
    }

    const racksAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallracks: !role.checkallracks,
                aracks: !role.aracks,
                eracks: !role.eracks,
                dracks: !role.dracks,
                vracks: !role.vracks,
                excelracks: !role.excelracks,
                csvracks: !role.csvracks,
                printracks: !role.printracks,
                pdfracks: !role.pdfracks
            }
        })
    }

    const discountAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkalldiscount: !role.checkalldiscount, adiscount: !role.adiscount, ediscount: !role.ediscount, vdiscount: !role.vdiscount, ddiscount: !role.ddiscount, exceldiscount: !role.exceldiscount, csvdiscount: !role.csvdiscount, printdiscount: !role.printdiscount, pdfdiscount: !role.pdfdiscount, }
        })
    }

    const stockAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallstock: !role.checkallstock, astock: !role.astock, printlabelstock: !role.printlabelstock, excelstock: !role.excelstock, csvstock: !role.csvstock, printstock: !role.printstock, pdfstock: !role.pdfstock }
        })
    }

    const purchaseAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallpurchase: !role.checkallpurchase, vpurchase: !role.vpurchase, apurchase: !role.apurchase, epurchase: !role.epurchase, dpurchase: !role.dpurchase, excelpurchase: !role.excelpurchase, csvpurchase: !role.csvpurchase, printpurchase: !role.printpurchase, pdfpurchase: !role.pdfpurchase, }
        })
    }

    const purchaseOrderAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallpurchaseorder: !role.checkallpurchaseorder, vpurchaseorder: !role.vpurchaseorder, apurchaseorder: !role.apurchaseorder, epurchaseorder: !role.epurchaseorder, dpurchaseorder: !role.dpurchaseorder, }
        })
    }

    const posAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallpos: !role.checkallpos, apos: !role.apos, epos: !role.epos, vpos: !role.vpos, dpos: !role.dpos, excelpos: !role.excelpos, csvpos: !role.csvpos, printpos: !role.printpos, pdfpos: !role.pdfpos }
        })
    }

    const draftAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkalldraft: !role.checkalldraft, adraft: !role.adraft, edraft: !role.edraft, vdraft: !role.vdraft, ddraft: !role.ddraft, exceldraft: !role.exceldraft, csvdraft: !role.csvdraft, printdraft: !role.printdraft, pdfdraft: !role.pdfdraft }
        })
    }

    const quotationAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallquotation: !role.checkallquotation, aquotation: !role.aquotation, equotation: !role.equotation, dquotation: !role.dquotation, vquotation: !role.vquotation, excelquotation: !role.excelquotation, csvquotation: !role.csvquotation, printquotation: !role.printquotation, pdfquotation: !role.pdfquotation }
        })
    }

    const expenseAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallexpense: !role.checkallexpense, aexpense: !role.aexpense, vexpense: !role.vexpense, eexpense: !role.eexpense, dexpense: !role.dexpense, excelexpense: !role.excelexpense, csvexpense: !role.csvexpense, printexpense: !role.printexpense, pdfexpense: !role.pdfexpense }
        })
    }

    const expenseCategoryAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallexpensecategory: !role.checkallexpensecategory, vexpensecategory: !role.vexpensecategory, aexpensecategory: !role.aexpensecategory, eexpensecategory: !role.eexpensecategory, dexpensecategory: !role.dexpensecategory, excelexpensecategory: !role.excelexpensecategory, csvexpensecategory: !role.csvexpensecategory, printexpensecategory: !role.printexpensecategory, pdfexpensecategory: !role.pdfexpensecategory }
        })
    }

    const businessLocationAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData, checkallbusinesslocation: !role.checkallbusinesslocation, activatebusinesslocation: !role.activatebusinesslocation, abusinesslocation: !role.abusinesslocation,
                ebusinesslocation: !role.ebusinesslocation,
                vbusinesslocation: !role.vbusinesslocation,
                dbusinesslocation: !role.dbusinesslocation, excelbusinesslocation: !role.excelbusinesslocation, csvbusinesslocation: !role.csvbusinesslocation, printbusinesslocation: !role.printbusinesslocation, pdfbusinesslocation: !role.pdfbusinesslocation,
            }
        })
    }

    const alpharateAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallalpharate: !role.checkallalpharate, valpharate: !role.valpharate, aalpharate: !role.aalpharate }
        })
    }

    const taxrateAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkalltaxrate: !role.checkalltaxrate, ataxrate: !role.ataxrate, vtaxrate: !role.vtaxrate, etaxrate: !role.etaxrate, dtaxrate: !role.dtaxrate, exceltaxrate: !role.exceltaxrate, csvtaxrate: !role.csvtaxrate, printtaxrate: !role.printtaxrate, pdftaxrate: !role.pdftaxrate }
        })
    }

    const taxrateGroupAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkalltaxrategroup: !role.checkalltaxrategroup, ataxrategroup: !role.ataxrategroup, vtaxrategroup: !role.vtaxrategroup, dtaxrategroup: !role.dtaxrategroup, exceltaxrategroup: !role.exceltaxrategroup, csvtaxrategroup: !role.csvtaxrategroup, printtaxrategroup: !role.printtaxrategroup, pdftaxrategroup: !role.pdftaxrategroup }
        })
    }

    const hsnAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkalltaxratehsn: !role.checkalltaxratehsn, ataxratehsn: !role.ataxratehsn, vtaxratehsn: !role.vtaxratehsn, dtaxratehsn: !role.dtaxratehsn, exceltaxratehsn: !role.exceltaxratehsn, csvtaxratehsn: !role.csvtaxratehsn, printtaxratehsn: !role.printtaxratehsn, pdftaxratehsn: !role.pdftaxratehsn }
        })
    }

    const paymentIntegrationAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallpaymentintegration: !role.checkallpaymentintegration, vpaymentintegration: !role.vpaymentintegration, apaymentintegration: !role.apaymentintegration, dpaymentintegration: !role.dpaymentintegration, excelpaymentintegration: !role.excelpaymentintegration, csvpaymentintegration: !role.csvpaymentintegration, pdfpaymentintegration: !role.pdfpaymentintegration }
        })
    }

    const stockTransferListAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallstocktransferlist: !role.checkallstocktransferlist,
                vstocktransferlist: !role.vstocktransferlist,
                astocktransferlist: !role.astocktransferlist,
                excelstocktransferlist: !role.excelstocktransferlist,
                csvstocktransferlist: !role.csvstocktransferlist,
                pdfstocktransferlist: !role.pdfstocktransferlist,
                printstocktransferlist: !role.printstocktransferlist
            }
        })
    }

    const stockAdjustListAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallstockadjust: !role.checkallstockadjust,
                astockadjust: !role.astockadjust,
                excelstockadjust: !role.excelstockadjust,
                csvstockadjust: !role.csvstockadjust,
                printstockadjust: !role.printstockadjust,
                pdfstockadjust: !role.pdfstockadjust,
                vstockadjust: !role.vstockadjust
            }
        })
    }

    const adjustmenttypeAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallstockadjustmenttype: !role.checkallstockadjustmenttype,
                astockadjustmenttype: !role.astockadjustmenttype,
                vstockadjustmenttype: !role.vstockadjustmenttype,
                estockadjustmenttype: !role.estockadjustmenttype,
                dstockadjustmenttype: !role.dstockadjustmenttype,
                excelstockadjustmenttype: !role.excelstockadjustmenttype,
                csvstockadjustmenttype: !role.csvstockadjustmenttype,
                printstockadjustmenttype: !role.printstockadjustmenttype,
                pdfstockadjustmenttype: !role.pdfstockadjustmenttype
            }
        })
    }

    const manualstockAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                allmanualstockentry: !role.allmanualstockentry,
                checkallmanualstockentry: !role.checkallmanualstockentry,
                astockmanualstockentry: !role.astockmanualstockentry,
                estockmanualstockentry: !role.estockmanualstockentry,
                vstockmanualstockentry: !role.vstockmanualstockentry,
                dstockmanualstockentry: !role.dstockmanualstockentry,
                excelmanualstockentry: !role.excelmanualstockentry,
                csvmanualstockentry: !role.csvmanualstockentry,
                printmanualstockentry: !role.printmanualstockentry,
                pdfmanualstockentry: !role.pdfmanualstockentry,
            }
        })
    }

    const currentstockAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                 checkallcurrentstock :!role.checkallcurrentstock,
                allcurrentstockreport: !role.allcurrentstockreport,
                excelcurrentstockreport: !role.excelcurrentstockreport,
                csvcurrentstockreport: !role.csvcurrentstockreport,
                printcurrentstockreport: !role.printcurrentstockreport,
                pdfcurrentstockreport: !role.pdfcurrentstockreport,

            }
        })
    }





    const passwordListAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallpassword: !role.checkallpassword,
                excelpassword: !role.excelpassword,
                csvpassword: !role.csvpassword,
                printpassword: !role.printpassword,
                pdfpassword: !role.pdfpassword,
                vpassword: !role.vpassword,
                apassword: !role.apassword,
                epassword: !role.epassword,
                dpassword: !role.dpassword,
            }
        })
    }

    const folderListAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallfolder: !role.checkallfolder,
                excelfolder: !role.excelfolder,
                csvfolder: !role.csvfolder,
                printfolder: !role.printfolder,
                pdffolder: !role.pdffolder,
                vfolder: !role.vfolder,
                afolder: !role.afolder,
                efolder: !role.efolder,
                dfolder: !role.dfolder,
                addnewfolder: !role.addnewfolder,
            }
        })
    }

    const assignListAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallassignpassword: !role.checkallassignpassword,
                assignpasswordlist: !role.assignpasswordlist,
                excelassignpassword: !role.excelassignpassword,
                csvassignpassword: !role.csvassignpassword,
                printassignpassword: !role.printassignpassword,
                pdfassignpassword: !role.pdfassignpassword,
            }
        })
    }

    const purchaseReturnAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallpurchasereturn: !role.checkallpurchasereturn,
                vpurchasereturn: !role.vpurchasereturn,
                apurchasereturn: !role.apurchasereturn,
                epurchasereturn: !role.epurchasereturn,
                dpurchasereturn: !role.dpurchasereturn,
                excelpurchasereturn: !role.excelpurchasereturn,
                csvpurchasereturn: !role.csvpurchasereturn,
                printpurchasereturn: !role.printpurchasereturn,
                pdfpurchasereturn: !role.pdfpurchasereturn,
            }
        })
    }



    const brandAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallbrands: !role.checkallbrands,
                allbrands: !role.allbrands,
                addbrand: !role.addbrand,
                listbrand: !role.listbrand,
                editbrand: !role.editbrand,
                excelbrand: !role.excelbrand,
                csvbrand: !role.csvbrand,
                printbrand: !role.printbrand,
                pdfbrand: !role.pdfbrand,
                viewbrand: !role.viewbrand,
                deletebrand: !role.deletebrand,
            }
        })
    }



    const groupingAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallgrouping: !role.checkallgrouping,
                allgrouping: !role.allgrouping,
                addgrouping: !role.addgrouping,
                listgrouping: !role.listgrouping,
                editgrouping: !role.editgrouping,
                excelgrouping: !role.excelgrouping,
                csvgrouping: !role.csvgrouping,
                printgrouping: !role.pdfgrouping,
                pdfgrouping: !role.pdfgrouping,
                viewgrouping: !role.viewgrouping,
                deletegrouping: !role.deletegrouping,
            }
        })
    }





    const backPage = useNavigate();

    const fetchRole = async () => {
        try {
            let roles = await axios.post(`${SERVICE.ROLE_CREATE}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                rolename: String(role.rolename),
                assignbusinessid: String(setngs.businessid),
                usermanagement: Boolean(role.usermanagement),
                alluser: Boolean(role.alluser),
                checkalluser: Boolean(role.checkalluser),
                vuser: Boolean(role.vuser),
                auser: Boolean(role.auser),
                euser: Boolean(role.euser),
                duser: Boolean(role.duser),
                exceluser: Boolean(role.exceluser),
                csvuser: Boolean(role.csvuser),
                printuser: Boolean(role.printuser),
                pdfuser: Boolean(role.pdfuser),
                allrole: Boolean(role.allrole),
                checkallrole: Boolean(role.checkallrole),
                arole: Boolean(role.arole),
                erole: Boolean(role.erole),
                vrole: Boolean(role.vrole),
                drole: Boolean(role.drole),
                excelrole: Boolean(role.excelrole),
                csvrole: Boolean(role.csvrole),
                printrole: Boolean(role.printrole),
                pdfrole: Boolean(role.pdfrole),
                // Department
                alldepartment: Boolean(role.alldepartment),
                checkalldepartment: Boolean(role.checkalldepartment),
                adepartment: Boolean(role.adepartment),
                exceldepartment: Boolean(role.exceldepartment),
                csvdepartment: Boolean(role.csvdepartment),
                printdepartment: Boolean(role.printdepartment),
                pdfdepartment: Boolean(role.pdfdepartment),
                edepartment: Boolean(role.edepartment),
                vdepartment: Boolean(role.vdepartment),
                ddepartment: Boolean(role.ddepartment),
                allsalescommissionagent: Boolean(role.allsalescommissionagent),
                checkallsalescommissionagent: Boolean(role.checkallsalescommissionagent),
                asalescommissionagent: Boolean(role.asalescommissionagent),
                esalescommissionagent: Boolean(role.esalescommissionagent),
                dsalescommissionagent: Boolean(role.dsalescommissionagent),
                excelsalescommissionagent: Boolean(role.excelsalescommissionagent),
                csvsalescommissionagent: Boolean(role.csvsalescommissionagent),
                printsalescommissionagent: Boolean(role.printsalescommissionagent),
                pdfsalescommissionagent: Boolean(role.pdfsalescommissionagent),
                suppliermanagement: Boolean(role.suppliermanagement),
                allsupplier: Boolean(role.allsupplier),
                checkallsupplier: Boolean(role.checkallsupplier),
                vsupplier: Boolean(role.vsupplier),
                isupplier: Boolean(role.isupplier),
                asupplier: Boolean(role.asupplier),
                esupplier: Boolean(role.esupplier),
                dsupplier: Boolean(role.dsupplier),
                excelsupplier: Boolean(role.excelsupplier),
                csvsupplier: Boolean(role.csvsupplier),
                pdfsupplier: Boolean(role.pdfsupplier),
                printsupplier: Boolean(role.printsupplier),
                customermanagement: Boolean(role.customermanagement),
                allcustomer: Boolean(role.allcustomer),
                checkallcustomer: Boolean(role.checkallcustomer),
                icustomer: Boolean(role.icustomer),
                acustomer: Boolean(role.acustomer),
                ecustomer: Boolean(role.ecustomer),
                vcustomer: Boolean(role.vcustomer),
                dcustomer: Boolean(role.dcustomer),
                excelcustomer: Boolean(role.excelcustomer),
                csvcustomer: Boolean(role.csvcustomer),
                printcustomer: Boolean(role.printcustomer),
                pdfcustomer: Boolean(role.pdfcustomer),
                allcustomergrp: Boolean(role.allcustomergrp),
                checkallcustomergrp: Boolean(role.checkallcustomergrp),
                acustomergrp: Boolean(role.acustomergrp),
                ecustomergrp: Boolean(role.ecustomergrp),
                vcustomergrp: Boolean(role.vcustomergrp),
                dcustomergrp: Boolean(role.dcustomergrp),
                excelcustomergrp: Boolean(role.excelcustomergrp),
                csvcustomergrp: Boolean(role.csvcustomergrp),
                printcustomergrp: Boolean(role.printcustomergrp),
                pdfcustomergrp: Boolean(role.pdfcustomergrp),
                productmanagement: Boolean(role.productmanagement),
                allunit: Boolean(role.allunit),
                checkallunit: Boolean(role.checkallunit),
                aunit: Boolean(role.aunit),
                eunit: Boolean(role.eunit),
                vunit: Boolean(role.vunit),
                dunit: Boolean(role.dunit),
                excelunit: Boolean(role.excelunit),
                csvunit: Boolean(role.csvunit),
                printunit: Boolean(role.printunit),
                pdfunit: Boolean(role.pdfunit),
                allsize: Boolean(role.allsize),
                checkallsize: Boolean(role.checkallsize),
                asize: Boolean(role.asize),
                esize: Boolean(role.esize),
                vsize: Boolean(role.vsize),
                dsize: Boolean(role.dsize),
                excelsize: Boolean(role.excelsize),
                csvsize: Boolean(role.csvsize),
                printsize: Boolean(role.printsize),
                pdfsize: Boolean(role.pdfsize),
                allstyle: Boolean(role.allstyle),
                checkallstyle: Boolean(role.checkallstyle),
                astyle: Boolean(role.astyle),
                estyle: Boolean(role.estyle),
                vstyle: Boolean(role.vstyle),
                dstyle: Boolean(role.dstyle),
                excelstyle: Boolean(role.excelstyle),
                csvstyle: Boolean(role.csvstyle),
                printstyle: Boolean(role.printstyle),
                pdfstyle: Boolean(role.pdfstyle),
                allUnitGroup: Boolean(role.allUnitGroup),
                checkallUnitGroup: Boolean(role.checkallUnitGroup),
                aUnitGroup: Boolean(role.aUnitGroup),
                eUnitGroup: Boolean(role.eUnitGroup),
                vUnitGroup: Boolean(role.vUnitGroup),
                dUnitGroup: Boolean(role.dUnitGroup),
                excelUnitGroup: Boolean(role.excelUnitGroup),
                csvUnitGroup: Boolean(role.csvUnitGroup),
                printUnitGroup: Boolean(role.printUnitGroup),
                pdfUnitGroup: Boolean(role.pdfUnitGroup),
                allcolor: Boolean(role.allcolor),
                checkallcolor: Boolean(role.checkallcolor),
                acolor: Boolean(role.acolor),
                ecolor: Boolean(role.ecolor),
                vcolor: Boolean(role.vcolor),
                dcolor: Boolean(role.dcolor),
                excelcolor: Boolean(role.excelcolor),
                csvcolor: Boolean(role.csvcolor),
                printcolor: Boolean(role.printcolor),
                pdfcolor: Boolean(role.pdfcolor),
                allcategory: Boolean(role.allcategory),
                checkallcategory: Boolean(role.checkallcategory),
                acategory: Boolean(role.acategory),
                ecategory: Boolean(role.ecategory),
                dcategory: Boolean(role.dcategory),
                vcategory: Boolean(role.vcategory),
                printcategory: Boolean(role.printcategory),
                pdfcategory: Boolean(role.pdfcategory),
                allproduct: Boolean(role.allproduct),
                checkallproduct: Boolean(role.checkallproduct),
                vproduct: Boolean(role.vproduct),
                iproduct: Boolean(role.iproduct),
                aproduct: Boolean(role.aproduct),
                eproduct: Boolean(role.eproduct),
                dproduct: Boolean(role.dproduct),
                excelproduct: Boolean(role.excelproduct),
                csvproduct: Boolean(role.csvproduct),
                printproduct: Boolean(role.printproduct),
                pdfproduct: Boolean(role.pdfproduct),

                // Racks start
                allracks: Boolean(role.allracks),
                checkallracks: Boolean(role.checkallracks),
                aracks: Boolean(role.aracks),
                eracks: Boolean(role.eracks),
                dracks: Boolean(role.dracks),
                vracks: Boolean(role.vracks),
                excelracks: Boolean(role.excelracks),
                csvracks: Boolean(role.csvracks),
                printracks: Boolean(role.printracks),
                pdfracks: Boolean(role.pdfracks),
                // Racks end

                alldiscount: Boolean(role.alldiscount),
                checkalldiscount: Boolean(role.checkalldiscount),
                adiscount: Boolean(role.adiscount),
                ediscount: Boolean(role.ediscount),
                ddiscount: Boolean(role.ddiscount),
                vdiscount: Boolean(role.vdiscount),
                exceldiscount: Boolean(role.exceldiscount),
                csvdiscount: Boolean(role.csvdiscount),
                printdiscount: Boolean(role.printdiscount),
                pdfdiscount: Boolean(role.pdfdiscount),
                allstock: Boolean(role.allstock),
                checkallstock: Boolean(role.checkallstock),
                astock: Boolean(role.astock),
                printlabelstock: Boolean(role.printlabelstock),
                excelstock: Boolean(role.excelstock),
                csvstock: Boolean(role.csvstock),
                printstock: Boolean(role.printstock),
                pdfstock: Boolean(role.pdfstock),
                allproductlabel: Boolean(role.allproductlabel),
                purchasemanagement: Boolean(role.purchasemanagement),
                allpurchase: Boolean(role.allpurchase),
                checkallpurchase: Boolean(role.checkallpurchase),
                vpurchase: Boolean(role.vpurchase),
                apurchase: Boolean(role.apurchase),
                epurchase: Boolean(role.epurchase),
                dpurchase: Boolean(role.dpurchase),
                excelpurchase: Boolean(role.excelpurchase),
                csvpurchase: Boolean(role.csvpurchase),
                printpurchase: Boolean(role.printpurchase),
                pdfpurchase: Boolean(role.pdfpurchase),
                // Purchase Return Start
                allpurchasereturn: Boolean(role.allpurchasereturn),
                checkallpurchasereturn: Boolean(role.checkallpurchasereturn),
                vpurchasereturn: Boolean(role.vpurchasereturn),
                apurchasereturn: Boolean(role.apurchasereturn),
                epurchasereturn: Boolean(role.epurchasereturn),
                dpurchasereturn: Boolean(role.dpurchasereturn),
                excelpurchasereturn: Boolean(role.excelpurchasereturn),
                csvpurchasereturn: Boolean(role.csvpurchasereturn),
                printpurchasereturn: Boolean(role.printpurchasereturn),
                pdfpurchasereturn: Boolean(role.pdfpurchasereturn),
                // Purchase Return End
                allpurchaseorder: Boolean(role.allpurchaseorder),
                checkallpurchaseorder: Boolean(role.checkallpurchaseorder),
                vpurchaseorder: Boolean(role.vpurchaseorder),
                apurchaseorder: Boolean(role.apurchaseorder),
                epurchaseorder: Boolean(role.epurchaseorder),
                dpurchaseorder: Boolean(role.dpurchaseorder),
                sellmanagement: Boolean(role.sellmanagement),
                allpos: Boolean(role.allpos),
                checkallpos: Boolean(role.checkallpos),
                apos: Boolean(role.apos),
                epos: Boolean(role.epos),
                vpos: Boolean(role.vpos),
                dpos: Boolean(role.dpos),
                excelpos: Boolean(role.excelpos),
                csvpos: Boolean(role.csvpos),
                printpos: Boolean(role.printpos),
                pdfpos: Boolean(role.pdfpos),
                alldraft: Boolean(role.alldraft),
                checkalldraft: Boolean(role.checkalldraft),
                adraft: Boolean(role.adraft),
                edraft: Boolean(role.edraft),
                vdraft: Boolean(role.vdraft),
                ddraft: Boolean(role.ddraft),
                exceldraft: Boolean(role.exceldraft),
                csvdraft: Boolean(role.csvdraft),
                printdraft: Boolean(role.printdraft),
                pdfdraft: Boolean(role.pdfdraft),
                allquotation: Boolean(role.allquotation),
                checkallquotation: Boolean(role.checkallquotation),
                aquotation: Boolean(role.aquotation),
                equotation: Boolean(role.equotation),
                vquotation: Boolean(role.vquotation),
                dquotation: Boolean(role.dquotation),
                excelquotation: Boolean(role.excelquotation),
                csvquotation: Boolean(role.csvquotation),
                printquotation: Boolean(role.printquotation),
                pdfquotation: Boolean(role.pdfquotation),
                expensemanagement: Boolean(role.expensemanagement),
                allexpense: Boolean(role.allexpense),
                checkallexpense: Boolean(role.checkallexpense),
                aexpense: Boolean(role.aexpense),
                eexpense: Boolean(role.eexpense),
                vexpense: Boolean(role.vexpense),
                dexpense: Boolean(role.dexpense),
                excelexpense: Boolean(role.excelexpense),
                csvexpense: Boolean(role.csvexpense),
                printexpense: Boolean(role.printexpense),
                pdfexpense: Boolean(role.pdfexpense),
                dallexpensecategoryuser: Boolean(role.dallexpensecategoryuser),
                allexpensecategory: Boolean(role.allexpensecategory),
                checkallexpensecategory: Boolean(role.checkallexpensecategory),
                aexpensecategory: Boolean(role.aexpensecategory),
                eexpensecategory: Boolean(role.eexpensecategory),
                vexpensecategory: Boolean(role.vexpensecategory),
                dexpensecategory: Boolean(role.dexpensecategory),
                excelexpensecategory: Boolean(role.excelexpensecategory),
                csvexpensecategory: Boolean(role.csvexpensecategory),
                printexpensecategory: Boolean(role.printexpensecategory),
                pdfexpensecategory: Boolean(role.pdfexpensecategory),
                settingsmanagement: Boolean(role.settingsmanagement),
                allbusinesslocation: Boolean(role.allbusinesslocation),
                checkallbusinesslocation: Boolean(role.checkallbusinesslocation),
                activatebusinesslocation: Boolean(role.activatebusinesslocation),
                abusinesslocation: Boolean(role.abusinesslocation),
                ebusinesslocation: Boolean(role.ebusinesslocation),
                vbusinesslocation: Boolean(role.vbusinesslocation),
                dbusinesslocation: Boolean(role.dbusinesslocation),
                excelbusinesslocation: Boolean(role.excelbusinesslocation),
                csvbusinesslocation: Boolean(role.csvbusinesslocation),
                printbusinesslocation: Boolean(role.printbusinesslocation),
                pdfbusinesslocation: Boolean(role.pdfbusinesslocation),
                allalpharate: Boolean(role.allalpharate),
                checkallalpharate: Boolean(role.checkallalpharate),
                valpharate: Boolean(role.valpharate),
                aalpharate: Boolean(role.aalpharate),
                alltaxrate: Boolean(role.alltaxrate),
                checkalltaxrate: Boolean(role.checkalltaxrate),
                ataxrate: Boolean(role.ataxrate),
                etaxrate: Boolean(role.etaxrate),
                vtaxrate: Boolean(role.vtaxrate),
                dtaxrate: Boolean(role.dtaxrate),
                exceltaxrate: Boolean(role.exceltaxrate),
                csvtaxrate: Boolean(role.csvtaxrate),
                printtaxrate: Boolean(role.printtaxrate),
                pdftaxrate: Boolean(role.pdftaxrate),
                alltaxrategroup: Boolean(role.alltaxrategroup),
                checkalltaxrategroup: Boolean(role.checkalltaxrategroup),
                ataxrategroup: Boolean(role.ataxrategroup),
                vtaxrategroup: Boolean(role.vtaxrategroup),
                dtaxrategroup: Boolean(role.dtaxrategroup),
                exceltaxrategroup: Boolean(role.exceltaxrategroup),
                csvtaxrategroup: Boolean(role.csvtaxrategroup),
                printtaxrategroup: Boolean(role.printtaxrategroup),
                pdftaxrategroup: Boolean(role.pdftaxrategroup),
                alltaxratehsn: Boolean(role.alltaxratehsn),
                checkalltaxratehsn: Boolean(role.checkalltaxratehsn),
                ataxratehsn: Boolean(role.ataxratehsn),
                vtaxratehsn: Boolean(role.vtaxratehsn),
                dtaxratehsn: Boolean(role.dtaxratehsn),
                exceltaxratehsn: Boolean(role.exceltaxratehsn),
                csvtaxratehsn: Boolean(role.csvtaxratehsn),
                printtaxratehsn: Boolean(role.printtaxratehsn),
                pdftaxratehsn: Boolean(role.pdftaxratehsn),
                allpaymentintegration: Boolean(role.allpaymentintegration),
                checkallpaymentintegration: Boolean(role.checkallpaymentintegration),
                vpaymentintegration: Boolean(role.vpaymentintegration),
                apaymentintegration: Boolean(role.apaymentintegration),
                dpaymentintegration: Boolean(role.dpaymentintegration),
                excelpaymentintegration: Boolean(role.excelpaymentintegration),
                csvpaymentintegration: Boolean(role.csvpaymentintegration),
                pdfpaymentintegration: Boolean(role.pdfpaymentintegration),
                businesssettings: Boolean(role.businesssettings),
                home: Boolean(role.home),
                selectlocation: Boolean(role.selectlocation),
                from: Boolean(role.from),
                to: Boolean(role.to),
                totalpurchase: Boolean(role.totalpurchase),
                totalsales: Boolean(role.totalsales),
                purchasedue: Boolean(role.purchasedue),
                salesdue: Boolean(role.salesdue),
                totalsalesreturn: Boolean(role.totalsalesreturn),
                totalpurchasereturn: Boolean(role.totalpurchasereturn),
                expenses: Boolean(role.expenses),
                barchart: Boolean(role.barchart),
                topproductspiechart: Boolean(role.topproductspiechart),
                topcustomerspiechart: Boolean(role.topcustomerspiechart),
                stockalerttable: Boolean(role.stockalerttable),
                recentsalestable: Boolean(role.recentsalestable),
                topsellproductstable: Boolean(role.topsellproductstable),
                //stock transfer
                stocktransferlistmanagement: Boolean(role.stocktransferlistmanagement),
                allstocktransferlist: Boolean(role.allstocktransferlist),
                checkallstocktransferlist: Boolean(role.checkallstocktransferlist),
                vstocktransferlist: Boolean(role.vstocktransferlist),
                astocktransferlist: Boolean(role.astocktransferlist),
                excelstocktransferlist: Boolean(role.excelstocktransferlist),
                csvstocktransferlist: Boolean(role.csvstocktransferlist),
                pdfstocktransferlist: Boolean(role.pdfstocktransferlist),
                printstocktransferlist: Boolean(role.printstocktransferlist),
                // Stock adjust
                stockadjustmanagement: Boolean(role.stockadjustmanagement),
                astockadjust: Boolean(role.astockadjust),
                allstockadjust: Boolean(role.allstockadjust),
                checkallstockadjust: Boolean(role.checkallstockadjust),
                excelstockadjust: Boolean(role.excelstockadjust),
                csvstockadjust: Boolean(role.csvstockadjust),
                printstockadjust: Boolean(role.printstockadjust),
                pdfstockadjust: Boolean(role.pdfstockadjust),
                vstockadjust: Boolean(role.vstockadjust),
                //adjustment type
                allstockadjustmenttype: Boolean(role.allstockadjustmenttype),
                checkallstockadjustmenttype: Boolean(role.checkallstockadjustmenttype),
                astockadjustmenttype: Boolean(role.astockadjustmenttype),
                estockadjustmenttype: Boolean(role.estockadjustmenttype),
                vstockadjustmenttype: Boolean(role.vstockadjustmenttype),
                dstockadjustmenttype: Boolean(role.dstockadjustmenttype),
                excelstockadjustmenttype: Boolean(role.excelstockadjustmenttype),
                csvstockadjustmenttype: Boolean(role.csvstockadjustmenttype),
                printstockadjustmenttype: Boolean(role.printstockadjustmenttype),
                pdfstockadjustmenttype: Boolean(role.pdfstockadjustmenttype),
                
                // manual stock entry
                allmanualstockentry: Boolean(role.allmanualstockentry),
                checkallmanualstockentry: Boolean(role.checkallmanualstockentry),
                astockmanualstockentry: Boolean(role.astockmanualstockentry),
                estockmanualstockentry: Boolean(role.estockmanualstockentry),
                vstockmanualstockentry: Boolean(role.vstockmanualstockentry),
                dstockmanualstockentry: Boolean(role.dstockmanualstockentry),
                excelmanualstockentry: Boolean(role.excelmanualstockentry),
                csvmanualstockentry: Boolean(role.csvmanualstockentry),
                printmanualstockentry: Boolean(role.printmanualstockentry),
                pdfmanualstockentry: Boolean(role.pdfmanualstockentry),

                // current stock
                checkallcurrentstock :!role.checkallcurrentstock,
                allcurrentstockreport: !role.allcurrentstockreport,
                excelcurrentstockreport: !role.excelcurrentstockreport,
                csvcurrentstockreport: !role.csvcurrentstockreport,
                printcurrentstockreport: !role.printcurrentstockreport,
                pdfcurrentstockreport: !role.pdfcurrentstockreport,




                // Password
                passwordmanagement: Boolean(role.passwordmanagement),
                allpassword: Boolean(role.allpassword),
                checkallpassword: Boolean(role.checkallpassword),
                excelpassword: Boolean(role.excelpassword),
                csvpassword: Boolean(role.csvpassword),
                printpassword: Boolean(role.printpassword),
                pdfpassword: Boolean(role.pdfpassword),
                vpassword: Boolean(role.vpassword),
                apassword: Boolean(role.apassword),
                epassword: Boolean(role.epassword),
                dpassword: Boolean(role.dpassword),

                // Folder
                allfolder: Boolean(role.allfolder),
                checkallfolder: Boolean(role.checkallfolder),
                excelfolder: Boolean(role.excelfolder),
                csvfolder: Boolean(role.csvfolder),
                printfolder: Boolean(role.printfolder),
                pdffolder: Boolean(role.pdffolder),
                vfolder: Boolean(role.vfolder),
                afolder: Boolean(role.afolder),
                efolder: Boolean(role.efolder),
                dfolder: Boolean(role.dfolder),
                addnewfolder: Boolean(role.addnewfolder),

                // Assign password
                allassignpassword: Boolean(role.allassignpassword),
                assignpasswordlist: Boolean(role.assignpasswordlist),
                checkallassignpassword: Boolean(role.checkallassignpassword),
                excelassignpassword: Boolean(role.excelassignpassword),
                csvassignpassword: Boolean(role.csvassignpassword),
                printassignpassword: Boolean(role.printassignpassword),
                pdfassignpassword: Boolean(role.pdfassignpassword),

                //brand
                checkallbrands: Boolean(role.checkallbrands),
                allbrands: Boolean(role.allbrands),
                addbrand: Boolean(role.addbrand),
                listbrand: Boolean(role.listbrand),
                editbrand: Boolean(role.editbrand),
                excelbrand: Boolean(role.excelbrand),
                csvbrand: Boolean(role.csvbrand),
                printbrand: Boolean(role.printbrand),
                pdfbrand: Boolean(role.pdfbrand),
                viewbrand: Boolean(role.viewbrand),
                deletebrand: Boolean(role.deletebrand),


                //grouping
                checkallgrouping: Boolean(role.checkallgrouping),
                allgrouping: Boolean(role.allgrouping),
                addgrouping: Boolean(role.addgrouping),
                listgrouping: Boolean(role.listgrouping),
                editgrouping: Boolean(role.editgrouping),
                excelgrouping: Boolean(role.excelgrouping),
                csvgrouping: Boolean(role.csvgrouping),
                printgrouping: Boolean(role.printgrouping),
                pdfgrouping: Boolean(role.pdfgrouping),
                viewgrouping: Boolean(role.viewgrouping),
                deletegrouping: Boolean(role.deletegrouping),

                //section grouping...
                allsectiongrp: Boolean(role.allsectiongrp),
                checkallsectiongrp: Boolean(role.checkallsectiongrp),
                asectiongrp: Boolean(role.asectiongrp),
                esectiongrp: Boolean(role.esectiongrp),
                vsectiongrp: Boolean(role.vsectiongrp),
                dsectiongrp: Boolean(role.dsectiongrp),
                excelsectiongrp: Boolean(role.excelsectiongrp),
                csvsectiongrp: Boolean(role.csvsectiongrp),
                printsectiongrp: Boolean(role.printsectiongrp),
                pdfsectiongrp: Boolean(role.pdfsectiongrp),
            });
            setRole(roles.data);
            toast.success(roles.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backPage('/user/role/list');
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    const handleClear = () => {
        setRole({
            // User
            rolename: "", usermanagement: false, alluser: false,
            checkalluser: false, vuser: false, auser: false, euser: false, duser: false, exceluser: false,
            csvuser: false, printuser: false, pdfuser: false,
            // Role
            allrole: false, checkallrole: false, vrole: false, arole: false, erole: false, drole: false, excelrole: false, csvrole: false, printrole: false,
            pdfrole: false,
            //  Department
            alldepartment: false,
            checkalldepartment: false,
            adepartment: false,
            exceldepartment: false,
            csvdepartment: false,
            printdepartment: false,
            pdfdepartment: false,
            edepartment: false,
            vdepartment: false,
            ddepartment: false,
            // Sales commision agent
            allsalescommissionagent: false, checkallsalescommissionagent: false, asalescommissionagent: false, esalescommissionagent: false, dsalescommissionagent: false, excelsalescommissionagent: false,
            csvsalescommissionagent: false, printsalescommissionagent: false, pdfsalescommissionagent: false,
            // Supplier
            suppliermanagement: false, allsupplier: false, checkallsupplier: false, vsupplier: false, isupplier: false, asupplier: false,
            esupplier: false,
            dsupplier: false,
            excelsupplier: false,
            csvsupplier: false,
            pdfsupplier: false,
            printsupplier: false,
            // Customer
            customermanagement: false, allcustomer: false, checkallcustomer: false, vcustomer: false, icustomer: false, acustomer: false, ecustomer: false, dcustomer: false, excelcustomer: false, csvcustomer: false, printcustomer: false, pdfcustomer: false,
            // Customer group
            allcustomergrp: false, checkallcustomergrp: false,
            acustomergrp: false,
            ecustomergrp: false,
            dcustomergrp: false,
            vcustomergrp: false,
            excelcustomergrp: false,
            csvcustomergrp: false,
            printcustomergrp: false,
            pdfcustomergrp: false,
            // Product Module
            productmanagement: false,
            // Unit
            allunit: false,
            checkallunit: false,
            aunit: false,
            eunit: false,
            vunit: false,
            dunit: false,
            excelunit: false,
            csvunit: false,
            printunit: false,
            pdfunit: false,
            // Size
            allsize: false,
            checkallsize: false,
            asize: false,
            esize: false,
            vsize: false,
            dsize: false,
            excelsize: false,
            csvsize: false, printsize: false, pdfsize: false,

            //style
            allstyle: false,
            checkallstyle: false,
            astyle: false,
            estyle: false,
            vstyle: false,
            dstyle: false,
            excelstyle: false,
            csvstyle: false, printstyle: false, pdfstyle: false,

            //UnitGrouping
            allUnitGroup: false,
            checkallUnitGroup: false,
            aUnitGroup: false,
            eUnitGroup: false,
            vUnitGroup: false,
            dUnitGroup: false,
            excelUnitGroup: false,
            csvUnitGroup: false, printUnitGroup: false, pdfUnitGroup: false,

            // Color
            allcolor: false,
            checkallcolor: false,
            acolor: false,
            ecolor: false,
            vcolor: false,
            dcolor: false,
            excelcolor: false,
            csvcolor: false,
            printcolor: false,
            pdfcolor: false,
            // Category
            allcategory: false,
            checkallcategory: false,
            acategory: false,
            ecategory: false,
            dcategory: false,
            vcategory: false,
            printcategory: false,
            pdfcategory: false,
            //section Grouping
            allsectiongrp: false,
            checkallsectiongrp: false,
            asectiongrp: false,
            esectiongrp: false,
            vsectiongrp: false,
            dsectiongrp: false,
            excelsectiongrp: false,
            csvsectiongrp: false, printsectiongrp: false, pdfsectiongrp: false,
            // Product
            allproduct: false,
            checkallproduct: false,
            vproduct: false,
            iproduct: false,
            aproduct: false,
            eproduct: false,
            dproduct: false,
            excelproduct: false,
            csvproduct: false,
            printproduct: false,
            pdfproduct: false,

            // Racks Start
            allracks: false,
            checkallracks: false,
            aracks: false,
            eracks: false,
            dracks: false,
            vracks: false,
            excelracks: false,
            csvracks: false,
            printracks: false,
            pdfracks: false,
            // Racks End

            // Discount
            alldiscount: false,
            checkalldiscount: false,
            adiscount: false,
            ediscount: false,
            vdiscount: false,
            ddiscount: false,
            exceldiscount: false,
            csvdiscount: false,
            printdiscount: false,
            pdfdiscount: false,
            // Stock
            allstock: false,
            checkallstock: false,
            astock: false,
            printlabelstock: false,
            excelstock: false,
            csvstock: false,
            printstock: false,
            pdfstock: false,
            // Print lable
            allproductlabel: false,
            // Purchase
            purchasemanagement: false,
            allpurchase: false,
            checkallpurchase: false,
            vpurchase: false,
            apurchase: false,
            epurchase: false,
            dpurchase: false,
            excelpurchase: false,
            csvpurchase: false,
            printpurchase: false,
            pdfpurchase: false,
            // Purchase Return Start
            allpurchasereturn: false,
            checkallpurchasereturn: false,
            vpurchasereturn: false,
            apurchasereturn: false,
            epurchasereturn: false,
            dpurchasereturn: false,
            excelpurchasereturn: false,
            csvpurchasereturn: false,
            printpurchasereturn: false,
            pdfpurchasereturn: false,
            // Purchase order
            allpurchaseorder: false,
            checkallpurchaseorder: false,
            vpurchaseorder: false,
            apurchaseorder: false,
            epurchaseorder: false,
            dpurchaseorder: false,
            sellmanagement: false,
            // Pos
            allpos: false,
            checkallpos: false,
            apos: false,
            epos: false,
            vpos: false,
            dpos: false,
            excelpos: false,
            csvpos: false,
            printpos: false,
            pdfpos: false,
            // Draft
            alldraft: false,
            checkalldraft: false,
            adraft: false,
            edraft: false,
            vdraft: false,
            ddraft: false,
            exceldraft: false,
            csvdraft: false,
            printdraft: false,
            pdfdraft: false,
            // Quotation
            allquotation: false,
            checkallquotation: false, aquotation: false, equotation: false, vquotation: false, dquotation: false, excelquotation: false, csvquotation: false,
            printquotation: false,
            pdfquotation: false,
            // Expense
            expensemanagement: false,
            allexpense: false,
            checkallexpense: false,
            aexpense: false,
            eexpense: false,
            vexpense: false,
            dexpense: false,
            excelexpense: false,
            csvexpense: false,
            printexpense: false,
            pdfexpense: false,
            // Expense category
            dallexpensecategoryuser: false,
            allexpensecategory: false,
            checkallexpensecategory: false,
            aexpensecategory: false,
            eexpensecategory: false,
            dexpensecategory: false,
            excelexpensecategory: false,
            csvexpensecategory: false,
            printexpensecategory: false,
            pdfexpensecategory: false,
            // Settings
            settingsmanagement: false, allbusinesslocation: false, checkallbusinesslocation: false, activatebusinesslocation: false, abusinesslocation: false,
            ebusinesslocation: false,
            vbusinesslocation: false,
            dbusinesslocation: false, excelbusinesslocation: false, csvbusinesslocation: false, printbusinesslocation: false, pdfbusinesslocation: false, allalpharate: false, checkallalpharate: false, valpharate: false, aalpharate: false, alltaxrate: false, checkalltaxrate: false, ataxrate: false, etaxrate: false, vtaxrate: false, dtaxrate: false, exceltaxrate: false, csvtaxrate: false, printtaxrate: false, pdftaxrate: false, alltaxrategroup: false, checkalltaxrategroup: false, ataxrategroup: false, vtaxrategroup: false, dtaxrategroup: false, exceltaxrategroup: false, csvtaxrategroup: false, printtaxrategroup: false, pdftaxrategroup: false, alltaxratehsn: false, checkalltaxratehsn: false,
            ataxratehsn: false, vtaxratehsn: false, dtaxratehsn: false, exceltaxratehsn: false,
            csvtaxratehsn: false,
            printtaxratehsn: false,
            pdftaxratehsn: false,
            allpaymentintegration: false,
            checkallpaymentintegration: false,
            vpaymentintegration: false,
            apaymentintegration: false,
            dpaymentintegration: false,
            excelpaymentintegration: false,
            csvpaymentintegration: false,
            pdfpaymentintegration: false,
            businesssettings: false,
            // Dashboard
            home: true,
            selectlocation: false,
            from: false,
            to: false,
            totalpurchase: false,
            totalsales: false,
            purchasedue: false,
            salesdue: false,
            totalsalesreturn: false,
            totalpurchasereturn: false,
            expenses: false,
            barchart: false,
            topproductspiechart: false,
            topcustomerspiechart: false,
            stockalerttable: false,
            recentsalestable: false,
            topsellproductstable: false,
            //stock transfer
            stocktransferlistmanagement: false,
            allstocktransferlist: false,
            checkallstocktransferlist: false,
            vstocktransferlist: false,
            astocktransferlist: false,
            excelstocktransferlist: false,
            csvstocktransferlist: false,
            pdfstocktransferlist: false,
            printstocktransferlist: false,
            // Stock Adjust 
            stockadjustmanagement: false,
            allstockadjust: false,
            checkallstockadjust: false,
            astockadjust: false,
            excelstockadjust: false,
            csvstockadjust: false,
            printstockadjust: false,
            pdfstockadjust: false,
            vstockadjust: false,
            //stock adjustment type
            allstockadjustmenttype: false,
            checkallstockadjustmenttype: false,
            astockadjustmenttype: false,
            estockadjustmenttype: false,
            vstockadjustmenttype: false,
            dstockadjustmenttype: false,
            excelstockadjustmenttype: false,
            csvstockadjustmenttype: false,
            printstockadjustmenttype: false,
            pdfstockadjustmenttype: false,
            // Password Management 
            // Password
            passwordmanagement: false,
            allpassword: false,
            checkallpassword: false,
            excelpassword: false,
            csvpassword: false,
            printpassword: false,
            pdfpassword: false,
            vpassword: false,
            apassword: false,
            epassword: false,
            dpassword: false,

            // Folder
            allfolder: false,
            checkallfolder: false,
            excelfolder: false,
            csvfolder: false,
            printfolder: false,
            pdffolder: false,
            afolder: false,
            vfolder: false,
            efolder: false,
            dfolder: false,
            addnewfolder: false,
            allassignpassword: false,
            assignpasswordlist: false,
            checkallassignpassword: false,
            excelassignpassword: false,
            csvassignpassword: false,
            printassignpassword: false,
            pdfassignpassword: false,

            //brand
            checkallbrands: false,
            allbrands: false,
            addbrand: false,
            listbrand: false,
            editbrand: false,
            excelbrand: false,
            csvbrand: false,
            printbrand: false,
            pdfbrand: false,
            viewbrand: false,
            deletebrand: false,


            //grouping 
            checkallgrouping: false,
            allgrouping: false,
            addgrouping: false,
            listgrouping: false,
            editgrouping: false,
            excelgrouping: false,
            csvgrouping: false,
            printgrouping: false,
            pdfgrouping: false,
            viewgrouping: false,
            deletegrouping: false,
        })
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = isRole.some(item => item.rolename.toLowerCase() === (role.rolename).toLowerCase());

        if (role.rolename == "") {
            setShowAlert("Please Enter Role Name!")
            handleClickOpen();
        } else if (isNameMatch) {
            setShowAlert("Name already exits!");
            handleClickOpen();
        }
        else {
            fetchRole();
        }
    }

    return (
        <Box>
            <Headtitle title={'Add Role'} />
            <form onSubmit={handleSubmit}>
                <Box>
                    <Grid display="flex">
                        <Typography sx={userStyle.HeaderText}>Add Role</Typography>
                    </Grid>
                </Box>
                <Box sx={userStyle.container}>
                    <Grid container spacing={2} sx={{
                        padding: '40px 20px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #b97df0',
                        },
                    }}>
                        <Grid item md={5}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>Role Name <Typography style={{ color: "red" }}>*</Typography></InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={role.rolename}
                                    onChange={(e) => { setRole({ ...role, rolename: e.target.value }) }}
                                    label="Role Name *"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={7}></Grid>
                        <Grid item md={12}>
                            <InputLabel sx={{ fontWeight: '600' }}>Permissions</InputLabel>
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={4}></Grid>
                        <Grid item md={8}>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked checked={role.home} onChange={(e) => setRole({ ...role, home: !role.home })} />} label="Home" />
                                    <Typography style={{ color: "red" }}>*</Typography>
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={role.selectlocation} onChange={(e) => setRole({ ...role, selectlocation: !role.selectlocation })} />} label="Select Location Dropdown" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={role.from} onChange={(e) => setRole({ ...role, from: !role.from })} />} label="From" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={role.to} onChange={(e) => setRole({ ...role, to: !role.to })} />} label="To" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={role.totalpurchase} onChange={(e) => setRole({ ...role, totalpurchase: !role.totalpurchase })} />} label="Total Purchase" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={role.totalsales} onChange={(e) => setRole({ ...role, totalsales: !role.totalsales })} />} label="Total Sales" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={role.purchasedue} onChange={(e) => setRole({ ...role, purchasedue: !role.purchasedue })} />} label="Purchase Due" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={role.salesdue} onChange={(e) => setRole({ ...role, salesdue: !role.salesdue })} />} label="Sales Due" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={role.totalsalesreturn} onChange={(e) => setRole({ ...role, totalsalesreturn: !role.totalsalesreturn })} />} label="Total Sales Return" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={role.totalpurchasereturn} onChange={(e) => setRole({ ...role, totalpurchasereturn: !role.totalpurchasereturn })} />} label="Total Purchase Return" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={role.expenses} onChange={(e) => setRole({ ...role, expenses: !role.expenses })} />} label="Expenses" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={role.barchart} onChange={(e) => setRole({ ...role, barchart: !role.barchart })} />} label="Bar Chart" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={role.topproductspiechart} onChange={(e) => setRole({ ...role, topproductspiechart: !role.topproductspiechart })} />} label="Top Selling Products Pie Chart" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={role.topcustomerspiechart} onChange={(e) => setRole({ ...role, topcustomerspiechart: !role.topcustomerspiechart })} />} label="Top Customers Pie Chart" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={role.stockalerttable} onChange={(e) => setRole({ ...role, stockalerttable: !role.stockalerttable })} />} label="Stock Alert Table" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={role.recentsalestable} onChange={(e) => setRole({ ...role, recentsalestable: !role.recentsalestable })} />} label="Recent Sales Table" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={role.topsellproductstable} onChange={(e) => setRole({ ...role, topsellproductstable: !role.topsellproductstable })} />} label="Top Selling Products Table" />
                                </FormGroup>
                            </Grid>
                        </Grid>
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.usermanagement} onChange={(e) => setRole({ ...role, usermanagement: !role.usermanagement })} />} label="Users" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.alluser} onChange={(e) => setRole({ ...role, alluser: !role.alluser })} />} label="User" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkalluser} onChange={(e) => userAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.auser} onChange={(e) => setRole({ ...role, auser: !role.auser })} />} label="Add user" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.euser} onChange={(e) => setRole({ ...role, euser: !role.euser })} />} label="Edit user" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.duser} onChange={(e) => setRole({ ...role, duser: !role.duser })} />} label="Delete user" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vuser} onChange={(e) => setRole({ ...role, vuser: !role.vuser })} />} label="View user" />
                                        {/* <Checkbox 
                                            checked={user.view}
                                        onChange={(e) => setUser({...user, view:!user.view})}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                        /> */}
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.exceluser} onChange={(e) => setRole({ ...role, exceluser: !role.exceluser })} />} label="Excel user" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvuser} onChange={(e) => setRole({ ...role, csvuser: !role.csvuser })} />} label="CSV user" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printuser} onChange={(e) => setRole({ ...role, printuser: !role.printuser })} />} label="Print user" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfuser} onChange={(e) => setRole({ ...role, pdfuser: !role.pdfuser })} />} label="Pdf user" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allrole} onChange={(e) => setRole({ ...role, allrole: !role.allrole })} />} label="Role" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallrole} onChange={(e) => roleAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.arole} onChange={(e) => setRole({ ...role, arole: !role.arole })} />} label="Add role" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.erole} onChange={(e) => setRole({ ...role, erole: !role.erole })} />} label="Edit role" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.drole} onChange={(e) => setRole({ ...role, drole: !role.drole })} />} label="Delete role" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vrole} onChange={(e) => setRole({ ...role, vrole: !role.vrole })} />} label="View role" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelrole} onChange={(e) => setRole({ ...role, excelrole: !role.excelrole })} />} label="Excel role" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvrole} onChange={(e) => setRole({ ...role, csvrole: !role.csvrole })} />} label="CSV role" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printrole} onChange={(e) => setRole({ ...role, printrole: !role.printrole })} />} label="Print role" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfrole} onChange={(e) => setRole({ ...role, pdfrole: !role.pdfrole })} />} label="Pdf role" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.alldepartment} onChange={(e) => setRole({ ...role, alldepartment: !role.alldepartment })} />} label="Department" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkalldepartment} onChange={(e) => departmentAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.adepartment} onChange={(e) => setRole({ ...role, adepartment: !role.adepartment })} />} label="Add Department" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.edepartment} onChange={(e) => setRole({ ...role, edepartment: !role.edepartment })} />} label="Edit Department" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.ddepartment} onChange={(e) => setRole({ ...role, ddepartment: !role.ddepartment })} />} label="Delete Department" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vdepartment} onChange={(e) => setRole({ ...role, vdepartment: !role.vdepartment })} />} label="View Department" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.exceldepartment} onChange={(e) => setRole({ ...role, exceldepartment: !role.exceldepartment })} />} label="Excel Department" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvdepartment} onChange={(e) => setRole({ ...role, csvdepartment: !role.csvdepartment })} />} label="Csv Department" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printdepartment} onChange={(e) => setRole({ ...role, printdepartment: !role.printdepartment })} />} label="Print Department" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfdepartment} onChange={(e) => setRole({ ...role, pdfdepartment: !role.pdfdepartment })} />} label="Pdf Department" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        {/* <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allsalescommissionagent} onChange={(e) => setRole({ ...role, allsalescommissionagent: !role.allsalescommissionagent })} />} label="Sales commission agent" />
                            </FormGroup>
                        </Grid> */}
                        {/* <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallsalescommissionagent} onChange={(e) => salesCommissionAgentAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid> */}
                        {/* <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.asalescommissionagent} onChange={(e) => setRole({ ...role, asalescommissionagent: !role.asalescommissionagent })} />} label="Add sales commission agent" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.esalescommissionagent} onChange={(e) => setRole({ ...role, esalescommissionagent: !role.esalescommissionagent })} />} label="Edit sales commission agent" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dsalescommissionagent} onChange={(e) => setRole({ ...role, dsalescommissionagent: !role.dsalescommissionagent })} />} label="Delete sales commission agent" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelsalescommissionagent} onChange={(e) => setRole({ ...role, excelsalescommissionagent: !role.excelsalescommissionagent })} />} label="Excel sales commission agent" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvsalescommissionagent} onChange={(e) => setRole({ ...role, csvsalescommissionagent: !role.csvsalescommissionagent })} />} label="CSV sales commission agent" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printsalescommissionagent} onChange={(e) => setRole({ ...role, printsalescommissionagent: !role.printsalescommissionagent })} />} label="Print sales commission agent" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfsalescommissionagent} onChange={(e) => setRole({ ...role, pdfsalescommissionagent: !role.pdfsalescommissionagent })} />} label="Pdf sales commission agent" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid> */}
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.suppliermanagement} onChange={(e) => setRole({ ...role, suppliermanagement: !role.suppliermanagement })} />} label="Suppliers" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allsupplier} onChange={(e) => setRole({ ...role, allsupplier: !role.allsupplier })} />} label="Supplier" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallsupplier} onChange={(e) => supplierAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.isupplier} onChange={(e) => setRole({ ...role, isupplier: !role.isupplier })} />} label="Import supplier" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.asupplier} onChange={(e) => setRole({ ...role, asupplier: !role.asupplier })} />} label="Add supplier" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.esupplier} onChange={(e) => setRole({ ...role, esupplier: !role.esupplier })} />} label="Edit supplier" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dsupplier} onChange={(e) => setRole({ ...role, dsupplier: !role.dsupplier })} />} label="Delete supplier" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vsupplier} onChange={(e) => setRole({ ...role, vsupplier: !role.vsupplier })} />} label="View supplier" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelsupplier} onChange={(e) => setRole({ ...role, excelsupplier: !role.excelsupplier })} />} label="Excel supplier" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvsupplier} onChange={(e) => setRole({ ...role, csvsupplier: !role.csvsupplier })} />} label="CSV supplier" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfsupplier} onChange={(e) => setRole({ ...role, pdfsupplier: !role.pdfsupplier })} />} label="Pdf supplier" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printsupplier} onChange={(e) => setRole({ ...role, printsupplier: !role.printsupplier })} />} label="Print supplier" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.customermanagement} onChange={(e) => setRole({ ...role, customermanagement: !role.customermanagement })} />} label="Customers" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allcustomer} onChange={(e) => setRole({ ...role, allcustomer: !role.allcustomer })} />} label="Customer" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallcustomer} onChange={(e) => customerAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.icustomer} onChange={(e) => setRole({ ...role, icustomer: !role.icustomer })} />} label="Import customer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.acustomer} onChange={(e) => setRole({ ...role, acustomer: !role.acustomer })} />} label="Add customer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.ecustomer} onChange={(e) => setRole({ ...role, ecustomer: !role.ecustomer })} />} label="Edit customer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dcustomer} onChange={(e) => setRole({ ...role, dcustomer: !role.dcustomer })} />} label="Delete customer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vcustomer} onChange={(e) => setRole({ ...role, vcustomer: !role.vcustomer })} />} label="View customer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelcustomer} onChange={(e) => setRole({ ...role, excelcustomer: !role.excelcustomer })} />} label="Excel customer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvcustomer} onChange={(e) => setRole({ ...role, csvcustomer: !role.csvcustomer })} />} label="CSV customer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printcustomer} onChange={(e) => setRole({ ...role, printcustomer: !role.printcustomer })} />} label="Print customer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfcustomer} onChange={(e) => setRole({ ...role, pdfcustomer: !role.pdfcustomer })} />} label="Pdf customer" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allcustomergrp} onChange={(e) => setRole({ ...role, allcustomergrp: !role.allcustomergrp })} />} label="Customer group" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallcustomergrp} onChange={(e) => customerGroupAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.acustomergrp} onChange={(e) => setRole({ ...role, acustomergrp: !role.acustomergrp })} />} label="Add customer group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.ecustomergrp} onChange={(e) => setRole({ ...role, ecustomergrp: !role.ecustomergrp })} />} label="Edit customer group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dcustomergrp} onChange={(e) => setRole({ ...role, dcustomergrp: !role.dcustomergrp })} />} label="Delete customer group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vcustomergrp} onChange={(e) => setRole({ ...role, vcustomergrp: !role.vcustomergrp })} />} label="View customer group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelcustomergrp} onChange={(e) => setRole({ ...role, excelcustomergrp: !role.excelcustomergrp })} />} label="Excel customer group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvcustomergrp} onChange={(e) => setRole({ ...role, csvcustomergrp: !role.csvcustomergrp })} />} label="CSV customer group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printcustomergrp} onChange={(e) => setRole({ ...role, printcustomergrp: !role.printcustomergrp })} />} label="Print customer group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfcustomergrp} onChange={(e) => setRole({ ...role, pdfcustomergrp: !role.pdfcustomergrp })} />} label="Pdf customer group" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.productmanagement} onChange={(e) => setRole({ ...role, productmanagement: !role.productmanagement })} />} label="Product" />
                            </FormGroup>
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allsize} onChange={(e) => setRole({ ...role, allsize: !role.allsize })} />} label="Size" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallsize} onChange={(e) => sizeAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.asize} onChange={(e) => setRole({ ...role, asize: !role.asize })} />} label="Add size" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.esize} onChange={(e) => setRole({ ...role, esize: !role.esize })} />} label="Edit size" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dsize} onChange={(e) => setRole({ ...role, dsize: !role.dsize })} />} label="Delete size" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vsize} onChange={(e) => setRole({ ...role, vsize: !role.vsize })} />} label="View size" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelsize} onChange={(e) => setRole({ ...role, excelsize: !role.excelsize })} />} label="Excel size" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvsize} onChange={(e) => setRole({ ...role, csvsize: !role.csvsize })} />} label="CSV size" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printsize} onChange={(e) => setRole({ ...role, printsize: !role.printsize })} />} label="Print size" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfsize} onChange={(e) => setRole({ ...role, pdfsize: !role.pdfsize })} />} label="Pdf size" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allstyle} onChange={(e) => setRole({ ...role, allstyle: !role.allstyle })} />} label="Style" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallstyle} onChange={(e) => styleAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.astyle} onChange={(e) => setRole({ ...role, astyle: !role.astyle })} />} label="Add style" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.estyle} onChange={(e) => setRole({ ...role, estyle: !role.estyle })} />} label="Edit style" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dstyle} onChange={(e) => setRole({ ...role, dstyle: !role.dstyle })} />} label="Delete style" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vstyle} onChange={(e) => setRole({ ...role, vstyle: !role.vstyle })} />} label="View style" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelstyle} onChange={(e) => setRole({ ...role, excelstyle: !role.excelstyle })} />} label="Excel style" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvstyle} onChange={(e) => setRole({ ...role, csvstyle: !role.csvstyle })} />} label="CSV style" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printstyle} onChange={(e) => setRole({ ...role, printstyle: !role.printstyle })} />} label="Print style" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfstyle} onChange={(e) => setRole({ ...role, pdfstyle: !role.pdfstyle })} />} label="Pdf style" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allunit} onChange={(e) => setRole({ ...role, allunit: !role.allunit })} />} label="Units" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallunit} onChange={(e) => unitAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.aunit} onChange={(e) => setRole({ ...role, aunit: !role.aunit })} />} label="Add unit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.eunit} onChange={(e) => setRole({ ...role, eunit: !role.eunit })} />} label="Edit unit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dunit} onChange={(e) => setRole({ ...role, dunit: !role.dunit })} />} label="Delete unit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vunit} onChange={(e) => setRole({ ...role, vunit: !role.vunit })} />} label="View unit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelunit} onChange={(e) => setRole({ ...role, excelunit: !role.excelunit })} />} label="Excel unit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvunit} onChange={(e) => setRole({ ...role, csvunit: !role.csvunit })} />} label="CSV unit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printunit} onChange={(e) => setRole({ ...role, printunit: !role.printunit })} />} label="Print unit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfunit} onChange={(e) => setRole({ ...role, pdfunit: !role.pdfunit })} />} label="Pdf unit" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allUnitGroup} onChange={(e) => setRole({ ...role, allUnitGroup: !role.allUnitGroup })} />} label="Unit Group" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallUnitGroup} onChange={(e) => UnitGroupAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.aUnitGroup} onChange={(e) => setRole({ ...role, aUnitGroup: !role.aUnitGroup })} />} label="Add UnitGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.eUnitGroup} onChange={(e) => setRole({ ...role, eUnitGroup: !role.eUnitGroup })} />} label="Edit UnitGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dUnitGroup} onChange={(e) => setRole({ ...role, dUnitGroup: !role.dUnitGroup })} />} label="Delete UnitGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vUnitGroup} onChange={(e) => setRole({ ...role, vUnitGroup: !role.vUnitGroup })} />} label="View UnitGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelUnitGroup} onChange={(e) => setRole({ ...role, excelUnitGroup: !role.excelUnitGroup })} />} label="Excel UnitGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvUnitGroup} onChange={(e) => setRole({ ...role, csvUnitGroup: !role.csvUnitGroup })} />} label="CSV UnitGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printUnitGroup} onChange={(e) => setRole({ ...role, printUnitGroup: !role.printUnitGroup })} />} label="Print UnitGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfUnitGroup} onChange={(e) => setRole({ ...role, pdfUnitGroup: !role.pdfUnitGroup })} />} label="Pdf UnitGroup" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allcolor} onChange={(e) => setRole({ ...role, allcolor: !role.allcolor })} />} label="Color" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallcolor} onChange={(e) => colorAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.acolor} onChange={(e) => setRole({ ...role, acolor: !role.acolor })} />} label="Add color" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.ecolor} onChange={(e) => setRole({ ...role, ecolor: !role.ecolor })} />} label="Edit color" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dcolor} onChange={(e) => setRole({ ...role, dcolor: !role.dcolor })} />} label="Delete color" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vcolor} onChange={(e) => setRole({ ...role, vcolor: !role.vcolor })} />} label="View color" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelcolor} onChange={(e) => setRole({ ...role, excelcolor: !role.excelcolor })} />} label="Excel color" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvcolor} onChange={(e) => setRole({ ...role, csvcolor: !role.csvcolor })} />} label="CSV color" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printcolor} onChange={(e) => setRole({ ...role, printcolor: !role.printcolor })} />} label="Print color" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfcolor} onChange={(e) => setRole({ ...role, pdfcolor: !role.pdfcolor })} />} label="Pdf color" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        {/* Racks Start */}

                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allracks} onChange={(e) => setRole({ ...role, allracks: !role.allracks })} />} label="Rack" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallracks} onChange={(e) => racksAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.aracks} onChange={(e) => setRole({ ...role, aracks: !role.aracks })} />} label="Add Racks" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.eracks} onChange={(e) => setRole({ ...role, eracks: !role.eracks })} />} label="Edit Racks" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dracks} onChange={(e) => setRole({ ...role, dracks: !role.dracks })} />} label="Delete Racks" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vracks} onChange={(e) => setRole({ ...role, vracks: !role.vracks })} />} label="View Racks" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelracks} onChange={(e) => setRole({ ...role, excelracks: !role.excelracks })} />} label="Excel Racks" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvracks} onChange={(e) => setRole({ ...role, csvracks: !role.csvracks })} />} label="Csv Racks" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printracks} onChange={(e) => setRole({ ...role, printracks: !role.printracks })} />} label="Print Racks" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfracks} onChange={(e) => setRole({ ...role, pdfracks: !role.pdfracks })} />} label="Pdf Racks" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        {/* Racks End */}
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allsectiongrp} onChange={(e) => setRole({ ...role, allsectiongrp: !role.allsectiongrp })} />} label="Section Group" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallsectiongrp} onChange={(e) => SectionGroupingAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.asectiongrp} onChange={(e) => setRole({ ...role, asectiongrp: !role.asectiongrp })} />} label="Add SectionGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.esectiongrp} onChange={(e) => setRole({ ...role, esectiongrp: !role.esectiongrp })} />} label="Edit SectionGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dsectiongrp} onChange={(e) => setRole({ ...role, dsectiongrp: !role.dsectiongrp })} />} label="Delete SectionGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vsectiongrp} onChange={(e) => setRole({ ...role, vsectiongrp: !role.vsectiongrp })} />} label="View SectionGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelsectiongrp} onChange={(e) => setRole({ ...role, excelsectiongrp: !role.excelsectiongrp })} />} label="Excel SectionGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvsectiongrp} onChange={(e) => setRole({ ...role, csvsectiongrp: !role.csvsectiongrp })} />} label="CSV SectionGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printsectiongrp} onChange={(e) => setRole({ ...role, printsectiongrp: !role.printsectiongrp })} />} label="Print SectionGroup" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfsectiongrp} onChange={(e) => setRole({ ...role, pdfsectiongrp: !role.pdfsectiongrp })} />} label="Pdf SectionGroup" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allcategory} onChange={(e) => setRole({ ...role, allcategory: !role.allcategory })} />} label="Category" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallcategory} onChange={(e) => categoryAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.acategory} onChange={(e) => setRole({ ...role, acategory: !role.acategory })} />} label="Add category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.ecategory} onChange={(e) => setRole({ ...role, ecategory: !role.ecategory })} />} label="Edit category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dcategory} onChange={(e) => setRole({ ...role, dcategory: !role.dcategory })} />} label="Delete category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vcategory} onChange={(e) => setRole({ ...role, vcategory: !role.vcategory })} />} label="View category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printcategory} onChange={(e) => setRole({ ...role, printcategory: !role.printcategory })} />} label="Print category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfcategory} onChange={(e) => setRole({ ...role, pdfcategory: !role.pdfcategory })} />} label="Pdf category" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allbrands} onChange={(e) => setRole({ ...role, allbrands: !role.allbrands })} />} label="Brand" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallbrands} onChange={(e) => brandAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.addbrand} onChange={(e) => setRole({ ...role, addbrand: !role.addbrand })} />} label="Add Brand" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.editbrand} onChange={(e) => setRole({ ...role, editbrand: !role.editbrand })} />} label="Edit Brand" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.deletebrand} onChange={(e) => setRole({ ...role, deletebrand: !role.dpassword })} />} label="Delete Brand" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.viewbrand} onChange={(e) => setRole({ ...role, viewbrand: !role.viewbrand })} />} label="View Brand" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelbrand} onChange={(e) => setRole({ ...role, excelpassword: !role.excelbrand })} />} label="Excel Brand" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvbrand} onChange={(e) => setRole({ ...role, csvbrand: !role.csvbrand })} />} label="Csv Brand" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printbrand} onChange={(e) => setRole({ ...role, printbrand: !role.printbrand })} />} label="Print Brand" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfbrand} onChange={(e) => setRole({ ...role, pdfbrand: !role.pdfbrand })} />} label="Pdf Brand" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allgrouping} onChange={(e) => setRole({ ...role, allgrouping: !role.allgrouping })} />} label=" Category Grouping" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallgrouping} onChange={(e) => groupingAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.addgrouping} onChange={(e) => setRole({ ...role, addgrouping: !role.addgrouping })} />} label="Add Grouping" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.editgrouping} onChange={(e) => setRole({ ...role, editgrouping: !role.editgrouping })} />} label="Edit Grouping" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.deletegrouping} onChange={(e) => setRole({ ...role, deletegrouping: !role.deletegrouping })} />} label="Delete Grouping" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.viewgrouping} onChange={(e) => setRole({ ...role, viewgrouping: !role.viewgrouping })} />} label="View Grouping" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelgrouping} onChange={(e) => setRole({ ...role, excelgrouping: !role.excelgrouping })} />} label="Excel Grouping" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvgrouping} onChange={(e) => setRole({ ...role, csvgrouping: !role.csvgrouping })} />} label="Csv Grouping" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printgrouping} onChange={(e) => setRole({ ...role, printgrouping: !role.printgrouping })} />} label="Print Grouping" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfgrouping} onChange={(e) => setRole({ ...role, pdfgrouping: !role.pdfgrouping })} />} label="Pdf Grouping" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allproduct} onChange={(e) => setRole({ ...role, allproduct: !role.allproduct })} />} label="Product" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallproduct} onChange={(e) => productAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.iproduct} onChange={(e) => setRole({ ...role, iproduct: !role.iproduct })} />} label="Import product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.aproduct} onChange={(e) => setRole({ ...role, aproduct: !role.aproduct })} />} label="Add product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.eproduct} onChange={(e) => setRole({ ...role, eproduct: !role.eproduct })} />} label="Edit product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dproduct} onChange={(e) => setRole({ ...role, dproduct: !role.dproduct })} />} label="Delete product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vproduct} onChange={(e) => setRole({ ...role, vproduct: !role.vproduct })} />} label="View product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelproduct} onChange={(e) => setRole({ ...role, excelproduct: !role.excelproduct })} />} label="Excel product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvproduct} onChange={(e) => setRole({ ...role, csvproduct: !role.csvproduct })} />} label="CSV product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printproduct} onChange={(e) => setRole({ ...role, printproduct: !role.printproduct })} />} label="Print product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfproduct} onChange={(e) => setRole({ ...role, pdfproduct: !role.pdfproduct })} />} label="Pdf product" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.alldiscount} onChange={(e) => setRole({ ...role, alldiscount: !role.alldiscount })} />} label="Discount" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkalldiscount} onChange={(e) => discountAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.adiscount} onChange={(e) => setRole({ ...role, adiscount: !role.adiscount })} />} label="Add discount" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.ediscount} onChange={(e) => setRole({ ...role, ediscount: !role.ediscount })} />} label="Edit discount" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.ddiscount} onChange={(e) => setRole({ ...role, ddiscount: !role.ddiscount })} />} label="Delete discount" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vdiscount} onChange={(e) => setRole({ ...role, vdiscount: !role.vdiscount })} />} label="View discount" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.exceldiscount} onChange={(e) => setRole({ ...role, exceldiscount: !role.exceldiscount })} />} label="Excel discount" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvdiscount} onChange={(e) => setRole({ ...role, csvdiscount: !role.csvdiscount })} />} label="CSV discount" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printdiscount} onChange={(e) => setRole({ ...role, printdiscount: !role.printdiscount })} />} label="Print discount" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfdiscount} onChange={(e) => setRole({ ...role, pdfdiscount: !role.pdfdiscount })} />} label="Pdf discount" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allproductlabel} onChange={(e) => setRole({ ...role, allproductlabel: !role.allproductlabel })} />} label="Print Labels" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}></Grid>
                        <Grid item md={8}></Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.purchasemanagement} onChange={(e) => setRole({ ...role, purchasemanagement: !role.purchasemanagement })} />} label="Purchases" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allpurchase} onChange={(e) => setRole({ ...role, allpurchase: !role.allpurchase })} />} label="Purchase" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallpurchase} onChange={(e) => purchaseAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.apurchase} onChange={(e) => setRole({ ...role, apurchase: !role.apurchase })} />} label="Add purchase" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.epurchase} onChange={(e) => setRole({ ...role, epurchase: !role.epurchase })} />} label="Edit purchase" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dpurchase} onChange={(e) => setRole({ ...role, dpurchase: !role.dpurchase })} />} label="Delete purchase" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vpurchase} onChange={(e) => setRole({ ...role, vpurchase: !role.vpurchase })} />} label="View purchase" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvpurchase} onChange={(e) => setRole({ ...role, csvpurchase: !role.csvpurchase })} />} label="Csv purchase" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelpurchase} onChange={(e) => setRole({ ...role, excelpurchase: !role.excelpurchase })} />} label="Excel purchase" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printpurchase} onChange={(e) => setRole({ ...role, printpurchase: !role.printpurchase })} />} label="Print purchase" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfpurchase} onChange={(e) => setRole({ ...role, pdfpurchase: !role.pdfpurchase })} />} label="Pdf purchase" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        {/* Purchase Return Start */}
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allpurchasereturn} onChange={(e) => setRole({ ...role, allpurchasereturn: !role.allpurchasereturn })} />} label="Purchase Return" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallpurchasereturn} onChange={(e) => purchaseReturnAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.apurchasereturn} onChange={(e) => setRole({ ...role, apurchasereturn: !role.apurchasereturn })} />} label="Add Purchase Return" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.epurchasereturn} onChange={(e) => setRole({ ...role, epurchasereturn: !role.epurchasereturn })} />} label="Edit Purchase Return" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dpurchasereturn} onChange={(e) => setRole({ ...role, dpurchasereturn: !role.dpurchasereturn })} />} label="Delete Purchase Return" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vpurchasereturn} onChange={(e) => setRole({ ...role, vpurchasereturn: !role.vpurchasereturn })} />} label="View Purchase Return" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelpurchasereturn} onChange={(e) => setRole({ ...role, excelpurchasereturn: !role.excelpurchasereturn })} />} label="Excel Purchase Return" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvpurchasereturn} onChange={(e) => setRole({ ...role, csvpurchasereturn: !role.csvpurchasereturn })} />} label="Csv Purchase Return" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printpurchasereturn} onChange={(e) => setRole({ ...role, printpurchasereturn: !role.printpurchasereturn })} />} label="Print Purchase Return" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfpurchasereturn} onChange={(e) => setRole({ ...role, pdfpurchasereturn: !role.pdfpurchasereturn })} />} label="Pdf Purchase Return" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        {/* Purchase Return End */}
                        {/* <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allpurchaseorder} onChange={(e) => setRole({ ...role, allpurchaseorder: !role.allpurchaseorder })} />} label="Purchase order" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallpurchaseorder} onChange={(e) => purchaseOrderAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.apurchaseorder} onChange={(e) => setRole({ ...role, apurchaseorder: !role.apurchaseorder })} />} label="Add purchase order" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.epurchaseorder} onChange={(e) => setRole({ ...role, epurchaseorder: !role.epurchaseorder })} />} label="Edit purchase order" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dpurchaseorder} onChange={(e) => setRole({ ...role, dpurchaseorder: !role.dpurchaseorder })} />} label="Delete purchase order" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vpurchaseorder} onChange={(e) => setRole({ ...role, vpurchaseorder: !role.vpurchaseorder })} />} label="View purchase order" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid> */}
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.sellmanagement} onChange={(e) => setRole({ ...role, sellmanagement: !role.sellmanagement })} />} label="Sell" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allpos} onChange={(e) => setRole({ ...role, allpos: !role.allpos })} />} label="Pos" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallpos} onChange={(e) => posAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.apos} onChange={(e) => setRole({ ...role, apos: !role.apos })} />} label="Add pos" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vpos} onChange={(e) => setRole({ ...role, vpos: !role.vpos })} />} label="View pos" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dpos} onChange={(e) => setRole({ ...role, dpos: !role.dpos })} />} label="Delete pos" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelpos} onChange={(e) => setRole({ ...role, excelpos: !role.excelpos })} />} label="Excel pos" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvpos} onChange={(e) => setRole({ ...role, csvpos: !role.csvpos })} />} label="Csv pos" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printpos} onChange={(e) => setRole({ ...role, printpos: !role.printpos })} />} label="Print pos" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfpos} onChange={(e) => setRole({ ...role, pdfpos: !role.pdfpos })} />} label="Pdf pos" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.alldraft} onChange={(e) => setRole({ ...role, alldraft: !role.alldraft })} />} label="Draft" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkalldraft} onChange={(e) => draftAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.adraft} onChange={(e) => setRole({ ...role, adraft: !role.adraft })} />} label="Add draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.edraft} onChange={(e) => setRole({ ...role, edraft: !role.edraft })} />} label="Edit draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vdraft} onChange={(e) => setRole({ ...role, vdraft: !role.vdraft })} />} label="View draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.ddraft} onChange={(e) => setRole({ ...role, ddraft: !role.ddraft })} />} label="Delete draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.exceldraft} onChange={(e) => setRole({ ...role, exceldraft: !role.exceldraft })} />} label="Excel draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvdraft} onChange={(e) => setRole({ ...role, csvdraft: !role.csvdraft })} />} label="Csv draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printdraft} onChange={(e) => setRole({ ...role, printdraft: !role.printdraft })} />} label="Print draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfdraft} onChange={(e) => setRole({ ...role, pdfdraft: !role.pdfdraft })} />} label="Pdf draft" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allquotation} onChange={(e) => setRole({ ...role, allquotation: !role.allquotation })} />} label="Quotation" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallquotation} onChange={(e) => quotationAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.aquotation} onChange={(e) => setRole({ ...role, aquotation: !role.aquotation })} />} label="Add quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.equotation} onChange={(e) => setRole({ ...role, equotation: !role.equotation })} />} label="Edit quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vquotation} onChange={(e) => setRole({ ...role, vquotation: !role.vquotation })} />} label="View quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dquotation} onChange={(e) => setRole({ ...role, dquotation: !role.dquotation })} />} label="Delete quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelquotation} onChange={(e) => setRole({ ...role, excelquotation: !role.excelquotation })} />} label="Excel quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvquotation} onChange={(e) => setRole({ ...role, csvquotation: !role.csvquotation })} />} label="Csv quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printquotation} onChange={(e) => setRole({ ...role, printquotation: !role.printquotation })} />} label="Print quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfquotation} onChange={(e) => setRole({ ...role, pdfquotation: !role.pdfquotation })} />} label="Pdf quotation" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        {/* Stock Transfer Start */}

                        <Divider sx={{ my: 2 }} />
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.stocktransferlistmanagement} onChange={(e) => setRole({ ...role, stocktransferlistmanagement: !role.stocktransferlistmanagement })} />} label="Stock" />
                            </FormGroup>
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allstock} onChange={(e) => setRole({ ...role, allstock: !role.allstock })} />} label="All Stock Details" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallstock} onChange={(e) => stockAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.astock} onChange={(e) => setRole({ ...role, astock: !role.astock })} />} label="View stock" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printlabelstock} onChange={(e) => setRole({ ...role, printlabelstock: !role.printlabelstock })} />} label="Label stock" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelstock} onChange={(e) => setRole({ ...role, excelstock: !role.excelstock })} />} label="Excel stock" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvstock} onChange={(e) => setRole({ ...role, csvstock: !role.csvstock })} />} label="CSV stock" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printstock} onChange={(e) => setRole({ ...role, printstock: !role.printstock })} />} label="Print stock" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfstock} onChange={(e) => setRole({ ...role, pdfstock: !role.pdfstock })} />} label="Pdf stock" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allstocktransferlist} onChange={(e) => setRole({ ...role, allstocktransferlist: !role.allstocktransferlist })} />} label="Stock Transfer" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallstocktransferlist} onChange={(e) => stockTransferListAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.astocktransferlist} onChange={(e) => setRole({ ...role, astocktransferlist: !role.astocktransferlist })} />} label="Add Stock Transfer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vstocktransferlist} onChange={(e) => setRole({ ...role, vstocktransferlist: !role.vstocktransferlist })} />} label="View Stock Transfer" />
                                    </FormGroup>
                                </Grid>
                                {/* <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelstocktransferlist} onChange={(e) => setRole({ ...role, excelstocktransferlist: !role.excelstocktransferlist })} />} label="Excel Stock Transfer List" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvstocktransferlist} onChange={(e) => setRole({ ...role, csvstocktransferlist: !role.csvstocktransferlist })} />} label="Csv Stock Transfer List" />
                                    </FormGroup>
                                </Grid> */}
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfstocktransferlist} onChange={(e) => setRole({ ...role, pdfstocktransferlist: !role.pdfstocktransferlist })} />} label="Pdf Stock Transfer" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printstocktransferlist} onChange={(e) => setRole({ ...role, printstocktransferlist: !role.printstocktransferlist })} />} label="Print Stock Transfer" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Stock Transfer End */}

                        {/* Stock Adjust Start */}

                        <Divider sx={{ my: 2 }} />
                        {/* <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.stockadjustmanagement} onChange={(e) => setRole({ ...role, stockadjustmanagement: !role.stockadjustmanagement })} />} label="Stock Adjust Management" />
                            </FormGroup>
                        </Grid> */}
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allstockadjust} onChange={(e) => setRole({ ...role, allstockadjust: !role.allstockadjust })} />} label="Stock Adjustment" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallstockadjust} onChange={(e) => stockAdjustListAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.astockadjust} onChange={(e) => setRole({ ...role, astockadjust: !role.astockadjust })} />} label="Add Stock Adjustment" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vstockadjust} onChange={(e) => setRole({ ...role, vstockadjust: !role.vstockadjust })} />} label="View Stock Adjustment" />
                                    </FormGroup>
                                </Grid>
                                {/* <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelstockadjust} onChange={(e) => setRole({ ...role, excelstockadjust: !role.excelstockadjust })} />} label="Excel Stock Adjust" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvstockadjust} onChange={(e) => setRole({ ...role, csvstockadjust: !role.csvstockadjust })} />} label="Csv Stock Adjust" />
                                    </FormGroup>
                                </Grid> */}
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printstockadjust} onChange={(e) => setRole({ ...role, printstockadjust: !role.printstockadjust })} />} label="Print Stock Adjustment" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfstockadjust} onChange={(e) => setRole({ ...role, pdfstockadjust: !role.pdfstockadjust })} />} label="Pdf Stock Adjustment" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Stock Adjust End */}

                        {/*Stock adjustment type  */}
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allstockadjustmenttype} onChange={(e) => setRole({ ...role, allstockadjustmenttype: !role.allstockadjustmenttype })} />} label="Adjustment Type" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallstockadjustmenttype} onChange={(e) => adjustmenttypeAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.astockadjustmenttype} onChange={(e) => setRole({ ...role, astockadjustmenttype: !role.astockadjustmenttype })} />} label="Add Adjustment Type" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.estockadjustmenttype} onChange={(e) => setRole({ ...role, estockadjustmenttype: !role.estockadjustmenttype })} />} label="Edit Adjustment Type" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dstockadjustmenttype} onChange={(e) => setRole({ ...role, dstockadjustmenttype: !role.dstockadjustmenttype })} />} label="Delete Adjustment Type" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vstockadjustmenttype} onChange={(e) => setRole({ ...role, vstockadjustmenttype: !role.vstockadjustmenttype })} />} label="View Adjustment Type" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelstockadjustmenttype} onChange={(e) => setRole({ ...role, excelstockadjustmenttype: !role.excelstockadjustmenttype })} />} label="Excel Adjustment Type" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvstockadjustmenttype} onChange={(e) => setRole({ ...role, csvstockadjustmenttype: !role.csvstockadjustmenttype })} />} label="CSV Adjustment Type" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printstockadjustmenttype} onChange={(e) => setRole({ ...role, printstockadjustmenttype: !role.printstockadjustmenttype })} />} label="Print Adjustment Type" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfstockadjustmenttype} onChange={(e) => setRole({ ...role, pdfstockadjustmenttype: !role.pdfstockadjustmenttype })} />} label="Pdf Adjustment Type" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/*manual stock entry  */}
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allmanualstockentry} onChange={(e) => setRole({ ...role, allmanualstockentry: !role.allmanualstockentry })} />} label="Manual Stock Entry" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallmanualstockentry} onChange={(e) => manualstockAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.astockmanualstockentry} onChange={(e) => setRole({ ...role, astockmanualstockentry: !role.astockmanualstockentry })} />} label="Add Manual Stock Entry" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.estockmanualstockentry} onChange={(e) => setRole({ ...role, estockmanualstockentry: !role.estockmanualstockentry })} />} label="Edit Manual Stock Entry" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dstockmanualstockentry} onChange={(e) => setRole({ ...role, dstockmanualstockentry: !role.dstockmanualstockentry })} />} label="Delete Manual Stock Entry" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vstockmanualstockentry} onChange={(e) => setRole({ ...role, vstockmanualstockentry: !role.vstockmanualstockentry })} />} label="View Manual Stock Entry" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelmanualstockentry} onChange={(e) => setRole({ ...role, excelmanualstockentry: !role.excelmanualstockentry })} />} label="Excel Manual Stock Entry" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvmanualstockentry} onChange={(e) => setRole({ ...role, csvmanualstockentry: !role.csvmanualstockentry })} />} label="CSV Manual Stock Entry" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printmanualstockentry} onChange={(e) => setRole({ ...role, printmanualstockentry: !role.printmanualstockentry })} />} label="Print Manual Stock Entry" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfmanualstockentry} onChange={(e) => setRole({ ...role, pdfmanualstockentry: !role.pdfmanualstockentry })} />} label="Print Manual Stock Entry" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>


                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allcurrentstockreport} onChange={(e) => setRole({ ...role, allcurrentstockreport: !role.allcurrentstockreport })} />} label="Current Stock Report " />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallcurrentstock} onChange={(e) => currentstockAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelcurrentstockreport} onChange={(e) => setRole({ ...role, excelcurrentstockreport: !role.excelcurrentstockreport })} />} label=" Excel Current stock Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvcurrentstockreport} onChange={(e) => setRole({ ...role, csvcurrentstockreport: !role.csvcurrentstockreport })} />} label="CSV Current stock Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printcurrentstockreport} onChange={(e) => setRole({ ...role, printcurrentstockreport: !role.printcurrentstockreport })} />} label="Print Current stock Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfcurrentstockreport} onChange={(e) => setRole({ ...role, pdfcurrentstockreport: !role.pdfcurrentstockreport })} />} label="Pdf Current stock Report" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                       {/* Password Management Start */}
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.expensemanagement} onChange={(e) => setRole({ ...role, expensemanagement: !role.expensemanagement })} />} label="Expenses" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allexpense} onChange={(e) => setRole({ ...role, allexpense: !role.allexpense })} />} label="Expense" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallexpense} onChange={(e) => expenseAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.aexpense} onChange={(e) => setRole({ ...role, aexpense: !role.aexpense })} />} label="Add expense" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.eexpense} onChange={(e) => setRole({ ...role, eexpense: !role.eexpense })} />} label="Edit expense" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dexpense} onChange={(e) => setRole({ ...role, dexpense: !role.dexpense })} />} label="Delete expense" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vexpense} onChange={(e) => setRole({ ...role, vexpense: !role.vexpense })} />} label="View expense" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelexpense} onChange={(e) => setRole({ ...role, excelexpense: !role.excelexpense })} />} label="Excel expense" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvexpense} onChange={(e) => setRole({ ...role, csvexpense: !role.csvexpense })} />} label="Csv expense" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printexpense} onChange={(e) => setRole({ ...role, printexpense: !role.printexpense })} />} label="Print expense" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfexpense} onChange={(e) => setRole({ ...role, pdfexpense: !role.pdfexpense })} />} label="Pdf expense" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allexpensecategory} onChange={(e) => setRole({ ...role, allexpensecategory: !role.allexpensecategory })} />} label="Expense category" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallexpensecategory} onChange={(e) => expenseCategoryAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.aexpensecategory} onChange={(e) => setRole({ ...role, aexpensecategory: !role.aexpensecategory })} />} label="Add expense category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.eexpensecategory} onChange={(e) => setRole({ ...role, eexpensecategory: !role.eexpensecategory })} />} label="Edit expense category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dexpensecategory} onChange={(e) => setRole({ ...role, dexpensecategory: !role.dexpensecategory })} />} label="Delete expense category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vexpensecategory} onChange={(e) => setRole({ ...role, vexpensecategory: !role.vexpensecategory })} />} label="View expense category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelexpensecategory} onChange={(e) => setRole({ ...role, excelexpensecategory: !role.excelexpensecategory })} />} label="Excel expense category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvexpensecategory} onChange={(e) => setRole({ ...role, csvexpensecategory: !role.csvexpensecategory })} />} label="Csv expense category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printexpensecategory} onChange={(e) => setRole({ ...role, printexpensecategory: !role.printexpensecategory })} />} label="Print expense category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfexpensecategory} onChange={(e) => setRole({ ...role, pdfexpensecategory: !role.pdfexpensecategory })} />} label="Pdf expense category" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />

                        {/* password management */}

                        <Divider sx={{ my: 2 }} />
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.passwordmanagement} onChange={(e) => setRole({ ...role, passwordmanagement: !role.passwordmanagement })} />} label="Passwords" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allpassword} onChange={(e) => setRole({ ...role, allpassword: !role.allpassword })} />} label="Password" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallpassword} onChange={(e) => passwordListAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.apassword} onChange={(e) => setRole({ ...role, apassword: !role.apassword })} />} label="Add Password" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.epassword} onChange={(e) => setRole({ ...role, epassword: !role.epassword })} />} label="Edit Password" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dpassword} onChange={(e) => setRole({ ...role, dpassword: !role.dpassword })} />} label="Delete Password" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vpassword} onChange={(e) => setRole({ ...role, vpassword: !role.vpassword })} />} label="View Password" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelpassword} onChange={(e) => setRole({ ...role, excelpassword: !role.excelpassword })} />} label="Excel Password" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvpassword} onChange={(e) => setRole({ ...role, csvpassword: !role.csvpassword })} />} label="Csv Password" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printpassword} onChange={(e) => setRole({ ...role, printpassword: !role.printpassword })} />} label="Print Password" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfpassword} onChange={(e) => setRole({ ...role, pdfpassword: !role.pdfpassword })} />} label="Pdf Password" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        {/* Password Management End */}

                        {/* Folder Start */}

                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allfolder} onChange={(e) => setRole({ ...role, allfolder: !role.allfolder })} />} label="Folder" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallfolder} onChange={(e) => folderListAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.afolder} onChange={(e) => setRole({ ...role, afolder: !role.afolder })} />} label="Add Folder" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.efolder} onChange={(e) => setRole({ ...role, efolder: !role.efolder })} />} label="Edit Folder" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dfolder} onChange={(e) => setRole({ ...role, dfolder: !role.dfolder })} />} label="Delete Folder" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vfolder} onChange={(e) => setRole({ ...role, vfolder: !role.vfolder })} />} label="View Folder" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelfolder} onChange={(e) => setRole({ ...role, excelfolder: !role.excelfolder })} />} label="Excel Folder" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvfolder} onChange={(e) => setRole({ ...role, csvfolder: !role.csvfolder })} />} label="Csv Folder" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printfolder} onChange={(e) => setRole({ ...role, printfolder: !role.printfolder })} />} label="Print Folder" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdffolder} onChange={(e) => setRole({ ...role, pdffolder: !role.pdffolder })} />} label="Pdf Folder" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.addnewfolder} onChange={(e) => setRole({ ...role, addnewfolder: !role.addnewfolder })} />} label="Add Password To Folder" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        {/* Folder End */}
                        {/* Assign password Start */}

                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allassignpassword} onChange={(e) => setRole({ ...role, allassignpassword: !role.allassignpassword })} />} label="Assign password" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallassignpassword} onChange={(e) => assignListAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.assignpasswordlist} onChange={(e) => setRole({ ...role, assignpasswordlist: !role.assignpasswordlist })} />} label="Assign password List" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelassignpassword} onChange={(e) => setRole({ ...role, excelassignpassword: !role.excelassignpassword })} />} label="Excel Assign password" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvassignpassword} onChange={(e) => setRole({ ...role, csvassignpassword: !role.csvassignpassword })} />} label="Csv Assign password" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printassignpassword} onChange={(e) => setRole({ ...role, printassignpassword: !role.printassignpassword })} />} label="Print Assign password" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfassignpassword} onChange={(e) => setRole({ ...role, pdfassignpassword: !role.pdfassignpassword })} />} label="Pdf Assign password" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Assign passwoed End */}
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.settingsmanagement} onChange={(e) => setRole({ ...role, settingsmanagement: !role.settingsmanagement })} />} label="Settings" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={4}></Grid>
                        <Grid item md={8}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.businesssettings} onChange={(e) => setRole({ ...role, businesssettings: !role.businesssettings })} />} label="Business settings" />
                            </FormGroup><br /><hr /><br />
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allbusinesslocation} onChange={(e) => setRole({ ...role, allbusinesslocation: !role.allbusinesslocation })} />} label="Business location" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallbusinesslocation} onChange={(e) => businessLocationAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.activatebusinesslocation} onChange={(e) => setRole({ ...role, activatebusinesslocation: !role.activatebusinesslocation })} />} label="Activate business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.abusinesslocation} onChange={(e) => setRole({ ...role, abusinesslocation: !role.abusinesslocation })} />} label="Add business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.ebusinesslocation} onChange={(e) => setRole({ ...role, ebusinesslocation: !role.ebusinesslocation })} />} label="Edit business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vbusinesslocation} onChange={(e) => setRole({ ...role, vbusinesslocation: !role.vbusinesslocation })} />} label="View business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dbusinesslocation} onChange={(e) => setRole({ ...role, dbusinesslocation: !role.dbusinesslocation })} />} label="Delete business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelbusinesslocation} onChange={(e) => setRole({ ...role, excelbusinesslocation: !role.excelbusinesslocation })} />} label="Excel business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvbusinesslocation} onChange={(e) => setRole({ ...role, csvbusinesslocation: !role.csvbusinesslocation })} />} label="Csv business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printbusinesslocation} onChange={(e) => setRole({ ...role, printbusinesslocation: !role.printbusinesslocation })} />} label="Print business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfbusinesslocation} onChange={(e) => setRole({ ...role, pdfbusinesslocation: !role.pdfbusinesslocation })} />} label="Pdf expense category" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allalpharate} onChange={(e) => setRole({ ...role, allalpharate: !role.allalpharate })} />} label="Alpharate" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallalpharate} onChange={(e) => alpharateAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.aalpharate} onChange={(e) => setRole({ ...role, aalpharate: !role.aalpharate })} />} label="Add alpharate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.valpharate} onChange={(e) => setRole({ ...role, valpharate: !role.valpharate })} />} label="View alpharate" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.alltaxrate} onChange={(e) => setRole({ ...role, alltaxrate: !role.alltaxrate })} />} label="Taxrate" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkalltaxrate} onChange={(e) => taxrateAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.ataxrate} onChange={(e) => setRole({ ...role, ataxrate: !role.ataxrate })} />} label="Add taxrate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.etaxrate} onChange={(e) => setRole({ ...role, etaxrate: !role.etaxrate })} />} label="Edit taxrate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dtaxrate} onChange={(e) => setRole({ ...role, dtaxrate: !role.dtaxrate })} />} label="Delete taxrate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vtaxrate} onChange={(e) => setRole({ ...role, vtaxrate: !role.vtaxrate })} />} label="View taxrate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.exceltaxrate} onChange={(e) => setRole({ ...role, exceltaxrate: !role.exceltaxrate })} />} label="Excel taxrate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvtaxrate} onChange={(e) => setRole({ ...role, csvtaxrate: !role.csvtaxrate })} />} label="Csv taxrate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printtaxrate} onChange={(e) => setRole({ ...role, printtaxrate: !role.printtaxrate })} />} label="Print taxrate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdftaxrate} onChange={(e) => setRole({ ...role, pdftaxrate: !role.pdftaxrate })} />} label="Pdf taxrate" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.alltaxrategroup} onChange={(e) => setRole({ ...role, alltaxrategroup: !role.alltaxrategroup })} />} label="Taxrate group" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkalltaxrategroup} onChange={(e) => taxrateGroupAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.ataxrategroup} onChange={(e) => setRole({ ...role, ataxrategroup: !role.ataxrategroup })} />} label="Add taxrate group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dtaxrategroup} onChange={(e) => setRole({ ...role, dtaxrategroup: !role.dtaxrategroup })} />} label="Delete taxrate group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vtaxrategroup} onChange={(e) => setRole({ ...role, vtaxrategroup: !role.vtaxrategroup })} />} label="View taxrate group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.exceltaxrategroup} onChange={(e) => setRole({ ...role, exceltaxrategroup: !role.exceltaxrategroup })} />} label="Excel taxrate group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvtaxrategroup} onChange={(e) => setRole({ ...role, csvtaxrategroup: !role.csvtaxrategroup })} />} label="Csv taxrate group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printtaxrategroup} onChange={(e) => setRole({ ...role, printtaxrategroup: !role.printtaxrategroup })} />} label="Print taxrate group" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdftaxrategroup} onChange={(e) => setRole({ ...role, pdftaxrategroup: !role.pdftaxrategroup })} />} label="Pdf taxrate group" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.alltaxratehsn} onChange={(e) => setRole({ ...role, alltaxratehsn: !role.alltaxratehsn })} />} label="Hsn" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkalltaxratehsn} onChange={(e) => hsnAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.ataxratehsn} onChange={(e) => setRole({ ...role, ataxratehsn: !role.ataxratehsn })} />} label="Add hsn" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dtaxratehsn} onChange={(e) => setRole({ ...role, dtaxratehsn: !role.dtaxratehsn })} />} label="Delete hsn" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vtaxratehsn} onChange={(e) => setRole({ ...role, vtaxratehsn: !role.vtaxratehsn })} />} label="View hsn" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.exceltaxratehsn} onChange={(e) => setRole({ ...role, exceltaxratehsn: !role.exceltaxratehsn })} />} label="Excel hsn" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvtaxratehsn} onChange={(e) => setRole({ ...role, csvtaxratehsn: !role.csvtaxratehsn })} />} label="Csv hsn" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.printtaxratehsn} onChange={(e) => setRole({ ...role, printtaxratehsn: !role.printtaxratehsn })} />} label="Print hsn" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdftaxratehsn} onChange={(e) => setRole({ ...role, pdftaxratehsn: !role.pdftaxratehsn })} />} label="Pdf hsn" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.allpaymentintegration} onChange={(e) => setRole({ ...role, allpaymentintegration: !role.allpaymentintegration })} />} label="Payment Integration" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={2}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={role.checkallpaymentintegration} onChange={(e) => paymentIntegrationAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={8}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.apaymentintegration} onChange={(e) => setRole({ ...role, apaymentintegration: !role.apaymentintegration })} />} label="Add payment integration" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.dpaymentintegration} onChange={(e) => setRole({ ...role, dpaymentintegration: !role.dpaymentintegration })} />} label="Delete payment integration" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.vpaymentintegration} onChange={(e) => setRole({ ...role, vpaymentintegration: !role.vpaymentintegration })} />} label="View payment integration" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.excelpaymentintegration} onChange={(e) => setRole({ ...role, excelpaymentintegration: !role.excelpaymentintegration })} />} label="Excel payment integration" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.csvpaymentintegration} onChange={(e) => setRole({ ...role, csvpaymentintegration: !role.csvpaymentintegration })} />} label="Csv payment integration" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={role.pdfpaymentintegration} onChange={(e) => setRole({ ...role, pdfpaymentintegration: !role.pdfpaymentintegration })} />} label="Pdf payment integration" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />


                        {/* Dashboard start */}

                        {/* Dashboard end */}
                        <Grid item md={12} sm={6} xs={6} >
                            <Button sx={userStyle.buttoncancel} onClick={handleClear}>CLEAR</Button>
                            <Link to="/user/role/list"><Button sx={userStyle.buttoncancel} >CANCEL</Button></Link>
                            <Button sx={userStyle.buttonadd} type="submit">SAVE</Button>
                        </Grid>
                    </Grid>
                </Box>
            </form>

            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleClose}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box >
    );
}

function Rolecreate() {
    return (
        <>
            <Rolecreatelist /><br /><br /><br /><br />
            <Footer />
        </>
    );
}
export default Rolecreate;