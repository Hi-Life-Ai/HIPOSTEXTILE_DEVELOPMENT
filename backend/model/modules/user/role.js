
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roleSchema = new Schema({

    assignbusinessid: {
        type: String,
        required: false
    },
    rolename: {
        type: String,
        required: false
    },
    //dashboard|
    home: {
        type: Boolean,
        required: false
    },
    selectlocation: {
        type: Boolean,
        required: false,
    },
    from: {
        type: Boolean,
        required: false,
    },
    to: {
        type: Boolean,
        required: false,
    },
    totalpurchase: {
        type: Boolean,
        required: false,
    },
    totalsales: {
        type: Boolean,
        required: false,
    },
    purchasedue: {
        type: Boolean,
        required: false,
    },
    salesdue: {
        type: Boolean,
        required: false,
    },
    totalsalesreturn: {
        type: Boolean,
        required: false,
    },
    totalpurchasereturn: {
        type: Boolean,
        required: false,
    },
    expenses: {
        type: Boolean,
        required: false,
    },
    barchart: {
        type: Boolean,
        required: false,
    },
    topproductspiechart: {
        type: Boolean,
        required: false,
    },
    topcustomerspiechart: {
        type: Boolean,
        required: false,
    },
    stockalerttable: {
        type: Boolean,
        required: false,
    },
    recentsalestable: {
        type: Boolean,
        required: false,
    },
    topsellproductstable: {
        type: Boolean,
        required: false,
    },
    usermanagement: {
        type: Boolean,
        required: false,
    },
    alluser: {
        type: Boolean,
        required: false,
    },
    checkalluser: {
        type: Boolean,
        required: false
    },
    vuser: {
        type: Boolean,
        required: false,
    },
    auser: {
        type: Boolean,
        required: false,
    },
    euser: {
        type: Boolean,
        required: false,
    },
    duser: {
        type: Boolean,
        required: false,
    },
    exceluser: {
        type: Boolean,
        required: false,
    },
    csvuser: {
        type: Boolean,
        required: false,
    },
    printuser: {
        type: Boolean,
        required: false,
    },
    pdfuser: {
        type: Boolean,
        required: false,
    },
    allrole: {
        type: Boolean,
        required: false,
    },
    checkallrole: {
        type: Boolean,
        required: false,
    },
    arole: {
        type: Boolean,
        required: false,
    },
    erole: {
        type: Boolean,
        required: false,
    },
    drole: {
        type: Boolean,
        required: false,
    },
    vrole: {
        type: Boolean,
        required: false,
    },
    excelrole: {
        type: Boolean,
        required: false,
    },
    csvrole: {
        type: Boolean,
        required: false,
    },
    printrole: {
        type: Boolean,
        required: false,
    },
    pdfrole: {
        type: Boolean,
        required: false,
    },
    // Department 
    alldepartment: {
        type: Boolean,
        required: false,
    },
    checkalldepartment: {
        type: Boolean,
        required: false,
    },
    adepartment: {
        type: Boolean,
        required: false,
    },
    edepartment: {
        type: Boolean,
        required: false,
    },
    vdepartment: {
        type: Boolean,
        required: false,
    },
    ddepartment: {
        type: Boolean,
        required: false,
    },
    exceldepartment: {
        type: Boolean,
        required: false,
    },
    csvdepartment: {
        type: Boolean,
        required: false,
    },
    printdepartment: {
        type: Boolean,
        required: false,
    },
    pdfdepartment: {
        type: Boolean,
        required: false,
    },

    suppliermanagement: {
        type: Boolean,
        required: false,
    },
    allsupplier: {
        type: Boolean,
        required: false,
    },
    checkallsupplier: {
        type: Boolean,
        required: false,
    },
    vsupplier: {
        type: Boolean,
        required: false,
    },
    isupplier: {
        type: Boolean,
        required: false,
    },
    asupplier: {
        type: Boolean,
        required: false,
    },
    esupplier: {
        type: Boolean,
        required: false,
    },
    dsupplier: {
        type: Boolean,
        required: false,
    },
    excelsupplier: {
        type: Boolean,
        required: false,
    },
    csvsupplier: {
        type: Boolean,
        required: false,
    },
    printsupplier: {
        type: Boolean,
        required: false,
    },
    pdfsupplier: {
        type: Boolean,
        required: false,
    },
    customermanagement: {
        type: Boolean,
        required: false,
    },
    allcustomer: {
        type: Boolean,
        required: false,
    },
    checkallcustomer: {
        type: Boolean,
        required: false,
    },
    icustomer: {
        type: Boolean,
        required: false,
    },
    acustomer: {
        type: Boolean,
        required: false,
    },
    ecustomer: {
        type: Boolean,
        required: false,
    },
    vcustomer: {
        type: Boolean,
        required: false,
    },
    dcustomer: {
        type: Boolean,
        required: false,
    },
    excelcustomer: {
        type: Boolean,
        required: false,
    },
    csvcustomer: {
        type: Boolean,
        required: false,
    },
    printcustomer: {
        type: Boolean,
        required: false,
    },
    pdfcustomer: {
        type: Boolean,
        required: false,
    },
    allcustomergrp: {
        type: Boolean,
        required: false,
    },
    checkallcustomergrp: {
        type: Boolean,
        required: false,
    },
    acustomergrp: {
        type: Boolean,
        required: false,
    },
    ecustomergrp: {
        type: Boolean,
        required: false,
    },
    vcustomergrp: {
        type: Boolean,
        required: false,
    },
    dcustomergrp: {
        type: Boolean,
        required: false,
    },
    excelcustomergrp: {
        type: Boolean,
        required: false,
    },
    csvcustomergrp: {
        type: Boolean,
        required: false,
    },
    printcustomergrp: {
        type: Boolean,
        required: false,
    },
    pdfcustomergrp: {
        type: Boolean,
        required: false,
    },
    productmanagement: {
        type: Boolean,
        required: false,
    },
    allunit: {
        type: Boolean,
        required: false,
    },
    checkallunit: {
        type: Boolean,
        required: false,
    },
    aunit: {
        type: Boolean,
        required: false,
    },
    eunit: {
        type: Boolean,
        required: false,
    },
    vunit: {
        type: Boolean,
        required: false,
    },
    dunit: {
        type: Boolean,
        required: false,
    },
    excelunit: {
        type: Boolean,
        required: false,
    },
    csvunit: {
        type: Boolean,
        required: false,
    },
    printunit: {
        type: Boolean,
        required: false,
    },
    pdfunit: {
        type: Boolean,
        required: false,
    },
    allsize: {
        type: Boolean,
        required: false,
    },
    checkallsize: {
        type: Boolean,
        required: false,
    },
    asize: {
        type: Boolean,
        required: false,
    },
    esize: {
        type: Boolean,
        required: false,
    },
    vsize: {
        type: Boolean,
        required: false,
    },
    dsize: {
        type: Boolean,
        required: false,
    },
    excelsize: {
        type: Boolean,
        required: false,
    },
    csvsize: {
        type: Boolean,
        required: false,
    },
    printsize: {
        type: Boolean,
        required: false,
    },
    pdfsize: {
        type: Boolean,
        required: false,
    },
    allstyle: {
        type: Boolean,
        required: false,
    },
    checkallstyle: {
        type: Boolean,
        required: false,
    },
    astyle: {
        type: Boolean,
        required: false,
    },
    estyle: {
        type: Boolean,
        required: false,
    },
    vstyle: {
        type: Boolean,
        required: false,
    },
    dstyle: {
        type: Boolean,
        required: false,
    },
    excelstyle: {
        type: Boolean,
        required: false,
    },
    csvstyle: {
        type: Boolean,
        required: false,
    },
    printstyle: {
        type: Boolean,
        required: false,
    },
    pdfstyle: {
        type: Boolean,
        required: false,
    },
    allUnitGroup: {
        type: Boolean,
        required: false,
    },
    checkallUnitGroup: {
        type: Boolean,
        required: false,
    },
    aUnitGroup: {
        type: Boolean,
        required: false,
    },
    eUnitGroup: {
        type: Boolean,
        required: false,
    },
    vUnitGroup: {
        type: Boolean,
        required: false,
    },
    dUnitGroup: {
        type: Boolean,
        required: false,
    },
    excelUnitGroup: {
        type: Boolean,
        required: false,
    },
    csvUnitGroup: {
        type: Boolean,
        required: false,
    },
    printUnitGroup: {
        type: Boolean,
        required: false,
    },
    pdfUnitGroup: {
        type: Boolean,
        required: false,
    },
    checkallgrouping: {
        type: Boolean,
        required: false,
    },
    allgrouping: {
        type: Boolean,
        required: false,
    },
    addgrouping: {
        type: Boolean,
        required: false,
    },
    listgrouping: {
        type: Boolean,
        required: false,
    },
    editgrouping: {
        type: Boolean,
        required: false,
    },
    excelgrouping: {
        type: Boolean,
        required: false,
    },
    csvgrouping: {
        type: Boolean,
        required: false,
    },
    printgrouping: {
        type: Boolean,
        required: false,
    },
    pdfgrouping: {
        type: Boolean,
        required: false,
    },
    viewgrouping: {
        type: Boolean,
        required: false,
    },
    deletegrouping: {
        type: Boolean,
        required: false,
    },
    allsectiongrp: {
        type: Boolean,
        required: false,
    },
    checkallsectiongrp: {
        type: Boolean,
        required: false,
    },
    asectiongrp: {
        type: Boolean,
        required: false,
    },
    esectiongrp: {
        type: Boolean,
        required: false,
    },
    vsectiongrp: {
        type: Boolean,
        required: false,
    },
    dsectiongrp: {
        type: Boolean,
        required: false,
    },
    excelsectiongrp: {
        type: Boolean,
        required: false,
    },
    csvsectiongrp: {
        type: Boolean,
        required: false,
    },
    printsectiongrp: {
        type: Boolean,
        required: false,
    },
    pdfsectiongrp: {
        type: Boolean,
        required: false,
    },
    checkallbrands: {
        type: Boolean,
        required: false,
    },
    allbrands: {
        type: Boolean,
        required: false,
    },
    addbrand: {
        type: Boolean,
        required: false,
    },
    listbrand: {
        type: Boolean,
        required: false,
    },
    editbrand: {
        type: Boolean,
        required: false,
    },
    excelbrand: {
        type: Boolean,
        required: false,
    },
    csvbrand: {
        type: Boolean,
        required: false,
    },
    printbrand: {
        type: Boolean,
        required: false,
    },
    pdfbrand: {
        type: Boolean,
        required: false,
    },
    viewbrand: {
        type: Boolean,
        required: false,
    },
    deletebrand: {
        type: Boolean,
        required: false,
    },
    allcolor: {
        type: Boolean,
        required: false,
    },
    checkallcolor: {
        type: Boolean,
        required: false,
    },
    acolor: {
        type: Boolean,
        required: false,
    },
    ecolor: {
        type: Boolean,
        required: false,
    },
    vcolor: {
        type: Boolean,
        required: false,
    },
    dcolor: {
        type: Boolean,
        required: false,
    },
    excelcolor: {
        type: Boolean,
        required: false,
    },
    csvcolor: {
        type: Boolean,
        required: false,
    },
    printcolor: {
        type: Boolean,
        required: false,
    },
    pdfcolor: {
        type: Boolean,
        required: false,
    },
    allcategory: {
        type: Boolean,
        required: false,
    },
    checkallcategory: {
        type: Boolean,
        required: false,
    },
    acategory: {
        type: Boolean,
        required: false,
    },
    ecategory: {
        type: Boolean,
        required: false,
    },
    dcategory: {
        type: Boolean,
        required: false,
    },
    printcategory: {
        type: Boolean,
        required: false,
    },
    pdfcategory: {
        type: Boolean,
        required: false,
    },
    allproduct: {
        type: Boolean,
        required: false,
    },
    checkallproduct: {
        type: Boolean,
        required: false,
    },
    vproduct: {
        type: Boolean,
        required: false,
    },
    iproduct: {
        type: Boolean,
        required: false,
    },
    aproduct: {
        type: Boolean,
        required: false,
    },
    eproduct: {
        type: Boolean,
        required: false,
    },
    dproduct: {
        type: Boolean,
        required: false,
    },
    excelproduct: {
        type: Boolean,
        required: false,
    },
    csvproduct: {
        type: Boolean,
        required: false,
    },
    printproduct: {
        type: Boolean,
        required: false,
    },

    pdfproduct: {
        type: Boolean,
        required: false,
    },
    // All Racks Start
    allracks: {
        type: Boolean,
        required: false,
    },
    checkallracks: {
        type: Boolean,
        required: false,
    },
    aracks: {
        type: Boolean,
        required: false,
    },
    eracks: {
        type: Boolean,
        required: false,
    },
    dracks: {
        type: Boolean,
        required: false,
    },
    vracks: {
        type: Boolean,
        required: false,
    },
    excelracks: {
        type: Boolean,
        required: false,
    },
    csvracks: {
        type: Boolean,
        required: false,
    },
    printracks: {
        type: Boolean,
        required: false,
    },
    pdfracks: {
        type: Boolean,
        required: false,
    },
    // Racks End

    alldiscount: {
        type: Boolean,
        required: false,
    },
    checkalldiscount: {
        type: Boolean,
        required: false,
    },
    adiscount: {
        type: Boolean,
        required: false,
    },
    ediscount: {
        type: Boolean,
        required: false,
    },
    vdiscount: {
        type: Boolean,
        required: false,
    },
    ddiscount: {
        type: Boolean,
        required: false,
    },
    exceldiscount: {
        type: Boolean,
        required: false,
    },
    csvdiscount: {
        type: Boolean,
        required: false,
    },
    printdiscount: {
        type: Boolean,
        required: false,
    },
    pdfdiscount: {
        type: Boolean,
        required: false,
    },
    allstock: {
        type: Boolean,
        required: false,
    },
    checkallstock: {
        type: Boolean,
        required: false,
    },
    astock: {
        type: Boolean,
        required: false,
    },
    printlabelstock: {
        type: Boolean,
        required: false,
    },
    excelstock: {
        type: Boolean,
        required: false,
    },
    csvstock: {
        type: Boolean,
        required: false,
    },
    printstock: {
        type: Boolean,
        required: false,
    },
    pdfstock: {
        type: Boolean,
        required: false,
    },
    allcurrentstockreport: {
        type: Boolean,
        required: false,
    },
    checkallcurrentstockreport: {
        type: Boolean,
        required: false,
    },

    printlabelcurrentstockreport: {
        type: Boolean,
        required: false,
    },
    excelcurrentstockreport: {
        type: Boolean,
        required: false,
    },
    csvcurrentstockreport: {
        type: Boolean,
        required: false,
    },
    printcurrentstockreport: {
        type: Boolean,
        required: false,
    },
    pdfcurrentstockreport: {
        type: Boolean,
        required: false,
    },
    allproductlabel: {
        type: Boolean,
        required: false,
    },
    purchasemanagement: {
        type: Boolean,
        required: false,
    },
    allpurchase: {
        type: Boolean,
        required: false,
    },
    checkallpurchase: {
        type: Boolean,
        required: false,
    },
    vpurchase: {
        type: Boolean,
        required: false,
    },
    apurchase: {
        type: Boolean,
        required: false,
    },
    epurchase: {
        type: Boolean,
        required: false,
    },
    dpurchase: {
        type: Boolean,
        required: false,
    },
    excelpurchase: {
        type: Boolean,
        required: false,
    },
    csvpurchase: {
        type: Boolean,
        required: false,
    },
    printpurchase: {
        type: Boolean,
        required: false,
    },
    pdfpurchase: {
        type: Boolean,
        required: false,
    },
    // Purchase Return start
    allpurchasereturn: {
        type: Boolean,
        required: false,
    },
    checkallpurchasereturn: {
        type: Boolean,
        required: false,
    },
    vpurchasereturn: {
        type: Boolean,
        required: false,
    },
    apurchasereturn: {
        type: Boolean,
        required: false,
    },
    epurchasereturn: {
        type: Boolean,
        required: false,
    },
    dpurchasereturn: {
        type: Boolean,
        required: false,
    },
    excelpurchasereturn: {
        type: Boolean,
        required: false,
    },
    csvpurchasereturn: {
        type: Boolean,
        required: false,
    },
    printpurchasereturn: {
        type: Boolean,
        required: false,
    },
    pdfpurchasereturn: {
        type: Boolean,
        required: false,
    },

    // Purchase return end

    allpurchaseorder: {
        type: Boolean,
        required: false,
    },
    checkallpurchaseorder: {
        type: Boolean,
        required: false,
    },
    vpurchaseorder: {
        type: Boolean,
        required: false,
    },
    apurchaseorder: {
        type: Boolean,
        required: false,
    },
    epurchaseorder: {
        type: Boolean,
        required: false,
    },
    dpurchaseorder: {
        type: Boolean,
        required: false,
    },
    sellmanagement: {
        type: Boolean,
        required: false,
    },
    allpos: {
        type: Boolean,
        required: false,
    },
    checkallpos: {
        type: Boolean,
        required: false,
    },
    apos: {
        type: Boolean,
        required: false,
    },
    epos: {
        type: Boolean,
        required: false,
    },
    vpos: {
        type: Boolean,
        required: false
    },
    dpos: {
        type: Boolean,
        required: false,
    },
    excelpos: {
        type: Boolean,
        required: false,
    },
    csvpos: {
        type: Boolean,
        required: false,
    },
    printpos: {
        type: Boolean,
        required: false,
    },
    pdfpos: {
        type: Boolean,
        required: false,
    },
    alldraft: {
        type: Boolean,
        required: false,
    },
    checkalldraft: {
        type: Boolean,
        required: false,
    },
    adraft: {
        type: Boolean,
        required: false,
    },
    edraft: {
        type: Boolean,
        required: false,
    },
    vdraft: {
        type: Boolean,
        required: false
    },
    ddraft: {
        type: Boolean,
        required: false,
    },
    exceldraft: {
        type: Boolean,
        required: false,
    },
    csvdraft: {
        type: Boolean,
        required: false,
    },
    printdraft: {
        type: Boolean,
        required: false,
    },
    pdfdraft: {
        type: Boolean,
        required: false,
    },
    allquotation: {
        type: Boolean,
        required: false,
    },
    checkallquotation: {
        type: Boolean,
        required: false,
    },
    aquotation: {
        type: Boolean,
        required: false,
    },
    equotation: {
        type: Boolean,
        required: false,
    },
    vquotation: {
        type: Boolean,
        required: false
    },
    dquotation: {
        type: Boolean,
        required: false,
    },
    excelquotation: {
        type: Boolean,
        required: false,
    },
    csvquotation: {
        type: Boolean,
        required: false,
    },
    printquotation: {
        type: Boolean,
        required: false,
    },
    pdfquotation: {
        type: Boolean,
        required: false,
    },
    expensemanagement: {
        type: Boolean,
        required: false,
    },
    allexpense: {
        type: Boolean,
        required: false,
    },
    checkallexpense: {
        type: Boolean,
        required: false,
    },
    aexpense: {
        type: Boolean,
        required: false,
    },
    eexpense: {
        type: Boolean,
        required: false,
    },
    vexpense: {
        type: Boolean,
        required: false,
    },
    dexpense: {
        type: Boolean,
        required: false,
    },
    excelexpense: {
        type: Boolean,
        required: false,
    },
    csvexpense: {
        type: Boolean,
        required: false,
    },
    printexpense: {
        type: Boolean,
        required: false,
    },
    pdfexpense: {
        type: Boolean,
        required: false,
    },
    allexpensecategory: {
        type: Boolean,
        required: false,
    },
    checkallexpensecategory: {
        type: Boolean,
        required: false,
    },
    aexpensecategory: {
        type: Boolean,
        required: false,
    },
    eexpensecategory: {
        type: Boolean,
        required: false,
    },
    vexpensecategory: {
        type: Boolean,
        required: false,
    },
    dexpensecategory: {
        type: Boolean,
        required: false,
    },
    excelexpensecategory: {
        type: Boolean,
        required: false,
    },
    csvexpensecategory: {
        type: Boolean,
        required: false,
    },
    printexpensecategory: {
        type: Boolean,
        required: false,
    },
    pdfexpensecategory: {
        type: Boolean,
        required: false,
    },
    settingsmanagement: {
        type: Boolean,
        required: false,
    },
    allbusinesslocation: {
        type: Boolean,
        required: false,
    },
    checkallbusinesslocation: {
        type: Boolean,
        required: false,
    },
    activatebusinesslocation: {
        type: Boolean,
        required: false,
    },
    abusinesslocation: {
        type: Boolean,
        required: false,
    },
    ebusinesslocation: {
        type: Boolean,
        required: false,
    },
    dbusinesslocation: {
        type: Boolean,
        required: false,
    },
    excelbusinesslocation: {
        type: Boolean,
        required: false,
    },
    csvbusinesslocation: {
        type: Boolean,
        required: false,
    },
    printbusinesslocation: {
        type: Boolean,
        required: false,
    },
    pdfbusinesslocation: {
        type: Boolean,
        required: false,
    },
    allalpharate: {
        type: Boolean,
        required: false,
    },
    checkallalpharate: {
        type: Boolean,
        required: false,
    },
    valpharate: {
        type: Boolean,
        required: false,
    },
    aalpharate: {
        type: Boolean,
        required: false,
    },
    alltaxrate: {
        type: Boolean,
        required: false,
    },
    checkalltaxrate: {
        type: Boolean,
        required: false,
    },
    ataxrate: {
        type: Boolean,
        required: false,
    },
    etaxrate: {
        type: Boolean,
        required: false,
    },
    vtaxrate: {
        type: Boolean,
        required: false,
    },
    dtaxrate: {
        type: Boolean,
        required: false,
    },
    exceltaxrate: {
        type: Boolean,
        required: false,
    },
    csvtaxrate: {
        type: Boolean,
        required: false,
    },
    printtaxrate: {
        type: Boolean,
        required: false,
    },
    pdftaxrate: {
        type: Boolean,
        required: false,
    },
    alltaxrategroup: {
        type: Boolean,
        required: false,
    },
    checkalltaxrategroup: {
        type: Boolean,
        required: false,
    },
    ataxrategroup: {
        type: Boolean,
        required: false,
    },
    vtaxrategroup: {
        type: Boolean,
        required: false,
    },
    dtaxrategroup: {
        type: Boolean,
        required: false,
    },
    exceltaxrategroup: {
        type: Boolean,
        required: false,
    },
    csvtaxrategroup: {
        type: Boolean,
        required: false,
    },
    printtaxrategroup: {
        type: Boolean,
        required: false,
    },
    pdftaxrategroup: {
        type: Boolean,
        required: false,
    },
    alltaxratehsn: {
        type: Boolean,
        required: false,
    },
    checkalltaxratehsn: {
        type: Boolean,
        required: false,
    },
    ataxratehsn: {
        type: Boolean,
        required: false,
    },
    vtaxratehsn: {
        type: Boolean,
        required: false,
    },
    dtaxratehsn: {
        type: Boolean,
        required: false,
    },
    exceltaxratehsn: {
        type: Boolean,
        required: false,
    },
    csvtaxratehsn: {
        type: Boolean,
        required: false,
    },
    printtaxratehsn: {
        type: Boolean,
        required: false,
    },
    pdftaxratehsn: {
        type: Boolean,
        required: false,
    },
    allpaymentintegration: {
        type: Boolean,
        required: false,
    },
    checkallpaymentintegration: {
        type: Boolean,
        required: false,
    },
    vpaymentintegration: {
        type: Boolean,
        required: false,
    },
    apaymentintegration: {
        type: Boolean,
        required: false,
    },
    dpaymentintegration: {
        type: Boolean,
        required: false,
    },
    excelpaymentintegration: {
        type: Boolean,
        required: false,
    },
    csvpaymentintegration: {
        type: Boolean,
        required: false,
    },
    pdfpaymentintegration: {
        type: Boolean,
        required: false,
    },
    businesssettings: {
        type: Boolean,
        required: false,
    },
    //  Stock Transfer  
    stocktransferlistmanagement: {
        type: Boolean,
        required: false,
    },
    allstocktransferlist: {
        type: Boolean,
        required: false,
    },
    checkallstocktransferlist: {
        type: Boolean,
        required: false,
    },
    vstocktransferlist: {
        type: Boolean,
        required: false,
    },
    astocktransferlist: {
        type: Boolean,
        required: false,
    },
    csvstocktransferlist: {
        type: Boolean,
        required: false,
    },
    pdfstocktransferlist: {
        type: Boolean,
        required: false,
    },
    printstocktransferlist: {
        type: Boolean,
        required: false,
    },
    excelstocktransferlist: {
        type: Boolean,
        required: false,
    },

    //stock adjustment type
    allstockadjustmenttype: {
        type: Boolean,
        required: false,
    },
    checkallstockadjustmenttype: {
        type: Boolean,
        required: false,
    },
    astockadjustmenttype: {
        type: Boolean,
        required: false,
    },
    estockadjustmenttype: {
        type: Boolean,
        required: false,
    },
    vstockadjustmenttype: {
        type: Boolean,
        required: false,
    },
    dstockadjustmenttype: {
        type: Boolean,
        required: false,
    },
    excelstockadjustmenttype: {
        type: Boolean,
        required: false,
    },
    csvstockadjustmenttype: {
        type: Boolean,
        required: false,
    },
    printstockadjustmenttype: {
        type: Boolean,
        required: false,
    },
    pdfstockadjustmenttype: {
        type: Boolean,
        required: false,
    },

    // Stock Adjust
    stockadjustmanagement: {
        type: Boolean,
        required: false,
    },
    allstockadjust: {
        type: Boolean,
        required: false,
    },
    checkallstockadjust: {
        type: Boolean,
        required: false,
    },
    astockadjust:{
        type: Boolean,
        required: false,
    },
    excelstockadjust: {
        type: Boolean,
        required: false,
    },
    csvstockadjust: {
        type: Boolean,
        required: false,
    },
    printstockadjust: {
        type: Boolean,
        required: false,
    },
    pdfstockadjust: {
        type: Boolean,
        required: false,
    },
    vstockadjust: {
        type: Boolean,
        required: false,
    },
    // Password
    passwordmanagement: {
        type: Boolean,
        required: false,
    },
    allpassword: {
        type: Boolean,
        required: false,
    },
    checkallpassword: {
        type: Boolean,
        required: false,
    },
    excelpassword: {
        type: Boolean,
        required: false,
    },
    csvpassword: {
        type: Boolean,
        required: false,
    },
    printpassword: {
        type: Boolean,
        required: false,
    },
    pdfpassword: {
        type: Boolean,
        required: false,
    },
    vpassword: {
        type: Boolean,
        required: false,
    },
    apassword: {
        type: Boolean,
        required: false,
    },
    epassword: {
        type: Boolean,
        required: false,
    },
    dpassword: {
        type: Boolean,
        required: false,
    },

    //Folder
    allfolder: {
        type: Boolean,
        required: false,
    },
    checkallfolder: {
        type: Boolean,
        required: false,
    },
    excelfolder: {
        type: Boolean,
        required: false,
    },
    csvfolder: {
        type: Boolean,
        required: false,
    },
    printfolder: {
        type: Boolean,
        required: false,
    },
    pdffolder: {
        type: Boolean,
        required: false,
    },
    afolder: {
        type: Boolean,
        required: false,
    },
    vfolder: {
        type: Boolean,
        required: false,
    },
    efolder: {
        type: Boolean,
        required: false,
    },
    dfolder: {
        type: Boolean,
        required: false,
    },
    addnewfolder: {
        type: Boolean,
        required: false,
    },
    allassignpassword: {
        type: Boolean,
        required: false,
    },
    assignpasswordlist: {
        type: Boolean,
        required: false,
    },
    checkallassignpassword: {
        type: Boolean,
        required: false,
    },
    excelassignpassword: {
        type: Boolean,
        required: false,
    },
    csvassignpassword: {
        type: Boolean,
        required: false,
    },
    printassignpassword: {
        type: Boolean,
        required: false,
    },
    pdfassignpassword: {
        type: Boolean,
        required: false,
    },
    vbusinesslocation: {
        type: Boolean,
        required: false,
    },
    vcategory: {
        type: Boolean,
        required: false,
    },
     //manual stock entry

     allmanualstockentry: {
        type: Boolean,
        required: false,
      },
      checkallmanualstockentry: {
        type: Boolean,
        required: false,
      },
      astockmanualstockentry: {
        type: Boolean,
        required: false,
      },
      estockmanualstockentry: {
        type: Boolean,
        required: false,
      },
      vstockmanualstockentry: {
        type: Boolean,
        required: false,
      },
      dstockmanualstockentry: {
        type: Boolean,
        required: false,
      },
      excelmanualstockentry: {
        type: Boolean,
        required: false,
      },
      csvmanualstockentry: {
        type: Boolean,
        required: false,
      },
      printmanualstockentry: {
        type: Boolean,
        required: false,
      },
      pdfmanualstockentry:{
        type: Boolean,
        required: false,
      },

      //current stock entry
      checkallcurrentstock:{
        type: Boolean,
        required: false,
      },
      allcurrentstockreport: {
        type: Boolean,
        required: false,
      },
      excelcurrentstockreport:{
        type: Boolean,
        required: false,
      },
      csvcurrentstockreport: {
        type: Boolean,
        required: false,
      },
      printcurrentstockreport:{
        type: Boolean,
        required: false,
      },
      pdfcurrentstockreport: {
        type: Boolean,
        required: false,
      },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Role', roleSchema);