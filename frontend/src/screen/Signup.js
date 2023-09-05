import { Box, Grid, TextField,Typography, Button,FormGroup,FormControlLabel,Checkbox } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Signuplogo from '../assets/images/mainlogo.png';
import { loginSignup, colourStyles } from './Loginstyle';
import { CgQuote } from 'react-icons/cg';
import { FavoriteSharp, BusinessOutlined} from '@mui/icons-material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import {FaFacebookF,FaLinkedinIn,FaTwitter} from 'react-icons/fa';
import { loginSignIn } from './Loginstyle';
import { Link, useNavigate } from 'react-router-dom';
import google from '../assets/images/icons/google.png';
import microsoft from '../assets/images/icons/microsoft.png';
import { Country, State } from "country-state-city";
import Select from 'react-select';
import './Signin.css';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import { toast } from 'react-toastify';
import { AUTH } from '../services/Authservice';
import { SERVICE } from '../services/Baseservice';

const Signup = () => {

    const [signup, setSignup] = useState({companyname: "", email:"", staffname:"", password:"", phonenum:"",termscondition:false});
    const [autoid, setAutoid] = useState();
    const [businessAutoid, setBusinessAutoid] = useState();
    // Country city datas
    const [selectedCountry, setSelectedCountry] = useState({ label: "India", name: "India" });
    const [selectedState, setSelectedState] = useState({ label: "Tamil Nadu", name: 'Tamil Nadu' });
    
    const backPage = useNavigate();

    //autogenerate....
    let newval = "LG0001";
    let newvalbusiness = "BN0001";
    let entryval = 1;

    // User auto id
    const fetchUser = async () => {
        try {
            let res_users = await axios.get(`${SERVICE.USER_TERMSTRUE}`);
            setAutoid(res_users.data.usersterms);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }

    //Business auto id
    const fetchBusiness = async () => {
        try {
            let res_business = await axios.get(`${SERVICE.SETTINGS}`);
            setBusinessAutoid(res_business.data.busisetngs);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }

    //user auto id
    {autoid && (
        autoid.map(
            () => {
                let strings = "LG";
                let refNo = autoid[autoid.length - 1].userid;
                entryval = Number(autoid[autoid.length - 1].entrynumber) + Number(1);
                let digits = (autoid.length + 1).toString();
                const stringLength = refNo.length;
                let lastChar = refNo.charAt(stringLength - 1);
                let getlastBeforeChar = refNo.charAt(stringLength - 2);
                let getlastThreeChar = refNo.charAt(stringLength - 3);
                let lastBeforeChar = refNo.slice(-2);
                let lastThreeChar = refNo.slice(-3);
                let lastDigit = refNo.slice(-4);
                let refNOINC = parseInt(lastChar) + 1
                let refLstTwo = parseInt(lastBeforeChar) + 1;
                let refLstThree = parseInt(lastThreeChar) + 1;
                let refLstDigit = parseInt(lastDigit) + 1;
                if (digits.length < 4 && getlastBeforeChar == 0 && getlastThreeChar == 0) {
                    refNOINC = ("000" + refNOINC);
                    newval = strings + refNOINC;
                } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                    refNOINC = ("00" + refLstTwo);
                    newval = strings + refNOINC;
                } else if (digits.length < 4 && getlastThreeChar > 0) {
                    refNOINC = ("0" + refLstThree);
                    newval = strings + refNOINC;
                } else {
                    refNOINC = (refLstDigit);
                    newval = strings + refNOINC;
                }
            }))}

        //business auto id
        {businessAutoid && (
            businessAutoid.map(
                () => {
                    let strings = "BN";
                    let refNo = businessAutoid[businessAutoid.length - 1].businessid;
                    let digits = (businessAutoid.length + 1).toString();
                    const stringLength = refNo.length;
                    let lastChar = refNo.charAt(stringLength - 1);
                    let getlastBeforeChar = refNo.charAt(stringLength - 2);
                    let getlastThreeChar = refNo.charAt(stringLength - 3);
                    let lastBeforeChar = refNo.slice(-2);
                    let lastThreeChar = refNo.slice(-3);
                    let lastDigit = refNo.slice(-4);
                    let refNOINC = parseInt(lastChar) + 1
                    let refLstTwo = parseInt(lastBeforeChar) + 1;
                    let refLstThree = parseInt(lastThreeChar) + 1;
                    let refLstDigit = parseInt(lastDigit) + 1;
                    if (digits.length < 4 && getlastBeforeChar == 0 && getlastThreeChar == 0) {
                        refNOINC = ("000" + refNOINC);
                        newvalbusiness = strings + refNOINC;
                    } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                        refNOINC = ("00" + refLstTwo);
                        newvalbusiness = strings + refNOINC;
                    } else if (digits.length < 4 && getlastThreeChar > 0) {
                        refNOINC = ("0" + refLstThree);
                        newvalbusiness = strings + refNOINC;
                    } else {
                        refNOINC = (refLstDigit);
                        newvalbusiness = strings + refNOINC;
                    }
                }))}

    const fetchAuth = async() =>{
        try{
            let auth = await axios.post(`${AUTH.REG_AUTH}`,{
                companyname: String(signup.companyname),
                staffname: String(signup.staffname),
                entrynumber: Number(entryval),
                useractive:Boolean(true),
                userid:String(newval),
                email: String(signup.email),
                password: String(signup.password),
                country: String(selectedCountry.name),
                state: String(selectedState.name),
                phonenum: Number(signup.phonenum),
                role: String('Admin'),
                termscondition: Boolean(signup.termscondition),
                counter: String(""),
                assignbusinessid:String(newvalbusiness),
            });

            let businessres = await axios.post(`${SERVICE.SETTING_CREATE}`,{
                businessname: String(signup.companyname),
                businessid: String(newvalbusiness),
                buniessaddress:String(""),
                counter: [{ countername: "", counterid: "0001" }],
                businesslocation:String(""),
                startdate: String(""),
                dprofitpercent: Number(0),
                currency: String(""),
                currencysymbol: String(""),
                timezone: String(""),
                businesslogo: String(""),
                fyearsstartmonth: String(""),
                stockaccountmethod: String(""),
                dateformat: String(""),
                timeformat: String(""),
                skuprefix: String(""),
                defaultunit: String(""),
                credeitlimit: Number(0),
                purchasesku: String(""),
                purchasereturnsku: String(""),
                expensesku: String(""),
                customersku: String(""),
                suppliersku: String(""),
                cusgroupsku: String(""),
                discountsku:String(""),
                usersku: String(""),
                departmentsku: String(""),
                passwordsku: String(""),
                salesku: String(""),
                draftsku: String(""),
                quotationsku:String(""),
                ciono :Number(0),
                gstno :String(""),
                applicabletax:String(""),
                multivalue:String(""),
                sellingpricetax:String(""),
                minquantity:Number(0),
                maxquantity:Number(0),
                barcodetype:String(0),
                producttype:String(0),

            });
            let roles = await axios.post(`${SERVICE.ROLE_CREATE}`, {
                rolename: String('Admin'),
                assignbusinessid: String(newvalbusiness),
                usermanagement: Boolean(true),
                alluser: Boolean(true),
                checkalluser: Boolean(true),
                vuser: Boolean(true),
                auser: Boolean(true),
                euser: Boolean(true),
                duser: Boolean(true),
                exceluser: Boolean(true),
                csvuser: Boolean(true),
                printuser: Boolean(true),
                pdfuser: Boolean(true),
                //role
                allrole: Boolean(true),
                checkallrole: Boolean(true),
                arole: Boolean(true),
                erole: Boolean(true),
                vrole: Boolean(true),
                drole: Boolean(true),
                excelrole: Boolean(true),
                csvrole: Boolean(true),
                printrole: Boolean(true),
                pdfrole: Boolean(true),
                // Department
                alldepartment: Boolean(true),
                checkalldepartment: Boolean(true),
                adepartment: Boolean(true),
                vdepartment: Boolean(true),
                exceldepartment: Boolean(true),
                csvdepartment: Boolean(true),
                printdepartment: Boolean(true),
                pdfdepartment: Boolean(true),
                edepartment: Boolean(true),
                ddepartment: Boolean(true),
                //supplier
                suppliermanagement: Boolean(true),
                allsupplier: Boolean(true),
                checkallsupplier: Boolean(true),
                vsupplier: Boolean(true),
                isupplier: Boolean(true),
                asupplier: Boolean(true),
                esupplier: Boolean(true),
                dsupplier: Boolean(true),
                excelsupplier: Boolean(true),
                csvsupplier: Boolean(true),
                pdfsupplier: Boolean(true),
                printsupplier: Boolean(true),
                customermanagement: Boolean(true),
                allcustomer: Boolean(true),
                checkallcustomer: Boolean(true),
                icustomer: Boolean(true),
                acustomer: Boolean(true),
                vcustomer: Boolean(true),
                ecustomer: Boolean(true),
                dcustomer: Boolean(true),
                excelcustomer: Boolean(true),
                csvcustomer: Boolean(true),
                printcustomer: Boolean(true),
                pdfcustomer: Boolean(true),
                allcustomergrp: Boolean(true),
                checkallcustomergrp: Boolean(true),
                acustomergrp: Boolean(true),
                vcustomergrp: Boolean(true),
                ecustomergrp: Boolean(true),
                dcustomergrp: Boolean(true),
                excelcustomergrp: Boolean(true),
                csvcustomergrp: Boolean(true),
                printcustomergrp: Boolean(true),
                pdfcustomergrp: Boolean(true),
                productmanagement: Boolean(true),
                allunit: Boolean(true),
                checkallunit: Boolean(true),
                aunit: Boolean(true),
                eunit: Boolean(true),
                vunit: Boolean(true),
                dunit: Boolean(true),
                excelunit: Boolean(true),
                csvunit: Boolean(true),
                printunit: Boolean(true),
                pdfunit: Boolean(true),
                allsize: Boolean(true),
                checkallsize: Boolean(true),
                asize: Boolean(true),
                esize: Boolean(true),
                vsize: Boolean(true),
                dsize: Boolean(true),
                excelsize: Boolean(true),
                csvsize: Boolean(true),
                printsize: Boolean(true),
                pdfsize: Boolean(true),
                allcolor: Boolean(true),
                checkallcolor: Boolean(true),
                acolor: Boolean(true),
                ecolor: Boolean(true),
                vcolor: Boolean(true),
                dcolor: Boolean(true),
                excelcolor: Boolean(true),
                csvcolor: Boolean(true),
                printcolor: Boolean(true),
                pdfcolor: Boolean(true),
                allcategory: Boolean(true),
                checkallcategory: Boolean(true),
                acategory: Boolean(true),
                ecategory: Boolean(true),
                dcategory: Boolean(true),
                printcategory: Boolean(true),
                pdfcategory: Boolean(true),
                allracks: Boolean(true),
                checkallracks: Boolean(true),
                vcategory: Boolean(true),
                aracks: Boolean(true),
                eracks: Boolean(true),
                dracks: Boolean(true),
                vracks: Boolean(true),
                excelracks: Boolean(true),
                csvracks: Boolean(true),
                printracks: Boolean(true),
                pdfracks: Boolean(true),
                checkallbrands: Boolean(true),
                allbrands: Boolean(true),
                addbrand: Boolean(true),
                listbrand: Boolean(true),
                editbrand: Boolean(true),
                excelbrand: Boolean(true),
                csvbrand: Boolean(true),
                printbrand: Boolean(true),
                pdfbrand: Boolean(true),
                viewbrand: Boolean(true),
                deletebrand: Boolean(true),
                checkallgrouping: Boolean(true),
                allgrouping: Boolean(true),
                addgrouping: Boolean(true),
                listgrouping: Boolean(true),
                editgrouping: Boolean(true),
                excelgrouping: Boolean(true),
                csvgrouping: Boolean(true),
                printgrouping: Boolean(true),
                pdfgrouping: Boolean(true),
                viewgrouping: Boolean(true),
                deletegrouping: Boolean(true),
                allsectiongrp: Boolean(true),
                checkallsectiongrp: Boolean(true),
                asectiongrp: Boolean(true),
                esectiongrp: Boolean(true),
                vsectiongrp: Boolean(true),
                dsectiongrp: Boolean(true),
                excelsectiongrp: Boolean(true),
                csvsectiongrp: Boolean(true),
                printsectiongrp: Boolean(true),
                pdfsectiongrp: Boolean(true),
                allstyle: Boolean(true),
                checkallstyle: Boolean(true),
                astyle: Boolean(true),
                estyle: Boolean(true),
                vstyle: Boolean(true),
                dstyle: Boolean(true),
                excelstyle: Boolean(true),
                csvstyle: Boolean(true), 
                printstyle: Boolean(true), 
                pdfstyle: Boolean(true),
                allUnitGroup: Boolean(true),
                checkallUnitGroup: Boolean(true),
                aUnitGroup: Boolean(true),
                eUnitGroup: Boolean(true),
                vUnitGroup: Boolean(true),
                dUnitGroup: Boolean(true),
                excelUnitGroup: Boolean(true),
                csvUnitGroup: Boolean(true), 
                printUnitGroup: Boolean(true), 
                pdfUnitGroup: Boolean(true),
                allproduct: Boolean(true),
                checkallproduct: Boolean(true),
                vproduct: Boolean(true),
                iproduct: Boolean(true),
                aproduct: Boolean(true),
                eproduct: Boolean(true),
                dproduct: Boolean(true),
                excelproduct: Boolean(true),
                csvproduct: Boolean(true),
                printproduct: Boolean(true),
                pdfproduct: Boolean(true),
                alldiscount: Boolean(true),
                checkalldiscount: Boolean(true),
                adiscount: Boolean(true),
                ediscount: Boolean(true),
                vdiscount: Boolean(true),
                ddiscount: Boolean(true),
                exceldiscount: Boolean(true),
                csvdiscount: Boolean(true),
                printdiscount: Boolean(true),
                pdfdiscount: Boolean(true),
                allstock: Boolean(true),
                checkallstock: Boolean(true),
                astock: Boolean(true),
                printlabelstock: Boolean(true),
                excelstock: Boolean(true),
                csvstock: Boolean(true),
                printstock: Boolean(true),
                pdfstock: Boolean(true),
                allcurrentstockreport:Boolean(true),
                checkallcurrentstockreport:Boolean(true),
                printlabelcurrentstockreport:Boolean(true),
                excelcurrentstockreport:Boolean(true),
                csvcurrentstockreport:Boolean(true),
                printcurrentstockreport:Boolean(true),
                pdfcurrentstockreport:Boolean(true),
                allproductlabel: Boolean(true),
                purchasemanagement: Boolean(true),
                allpurchase: Boolean(true),
                checkallpurchase: Boolean(true),
                vpurchase: Boolean(true),
                apurchase: Boolean(true),
                epurchase: Boolean(true),
                dpurchase: Boolean(true),
                excelpurchase: Boolean(true),
                csvpurchase: Boolean(true),
                printpurchase: Boolean(true),
                pdfpurchase: Boolean(true),
                // Purchase Return Start
                allpurchasereturn: Boolean(true),
                checkallpurchasereturn: Boolean(true),
                vpurchasereturn: Boolean(true),
                apurchasereturn: Boolean(true),
                epurchasereturn: Boolean(true),
                dpurchasereturn: Boolean(true),
                excelpurchasereturn: Boolean(true),
                csvpurchasereturn: Boolean(true),
                printpurchasereturn: Boolean(true),
                pdfpurchasereturn: Boolean(true),
                //sel
                sellmanagement: Boolean(true),
                allpos: Boolean(true),
                checkallpos: Boolean(true),
                apos: Boolean(true),
                epos: Boolean(true),
                dpos: Boolean(true),
                vpos: Boolean(true),
                excelpos: Boolean(true),
                csvpos: Boolean(true),
                printpos: Boolean(true),
                pdfpos: Boolean(true),
                alldraft: Boolean(true),
                checkalldraft: Boolean(true),
                adraft: Boolean(true),
                edraft: Boolean(true),
                vdraft: Boolean(true),
                ddraft: Boolean(true),
                exceldraft: Boolean(true),
                csvdraft: Boolean(true),
                printdraft: Boolean(true),
                pdfdraft: Boolean(true),
                allquotation: Boolean(true),
                checkallquotation: Boolean(true),
                aquotation: Boolean(true),
                equotation: Boolean(true),
                vquotation: Boolean(true),
                dquotation: Boolean(true),
                excelquotation: Boolean(true),
                csvquotation: Boolean(true),
                printquotation: Boolean(true),
                pdfquotation: Boolean(true),
                expensemanagement: Boolean(true),
                allexpense: Boolean(true),
                checkallexpense: Boolean(true),
                aexpense: Boolean(true),
                eexpense: Boolean(true),
                vexpense: Boolean(true),
                dexpense: Boolean(true),
                excelexpense: Boolean(true),
                csvexpense: Boolean(true),
                printexpense: Boolean(true),
                pdfexpense: Boolean(true),
                dallexpensecategoryuser: Boolean(true),
                allexpensecategory: Boolean(true),
                checkallexpensecategory: Boolean(true),
                aexpensecategory: Boolean(true),
                eexpensecategory: Boolean(true),
                vexpensecategory: Boolean(true),
                dexpensecategory: Boolean(true),
                excelexpensecategory: Boolean(true),
                csvexpensecategory: Boolean(true),
                printexpensecategory: Boolean(true),
                pdfexpensecategory: Boolean(true),
                settingsmanagement: Boolean(true),
                allbusinesslocation: Boolean(true),
                checkallbusinesslocation: Boolean(true),
                activatebusinesslocation: Boolean(true),
                abusinesslocation: Boolean(true),
                ebusinesslocation: Boolean(true),
                dbusinesslocation: Boolean(true),
                vbusinesslocation: Boolean(true),
                excelbusinesslocation: Boolean(true),
                csvbusinesslocation: Boolean(true),
                printbusinesslocation: Boolean(true),
                pdfbusinesslocation: Boolean(true),
                allalpharate: Boolean(true),
                checkallalpharate: Boolean(true),
                valpharate: Boolean(true),
                aalpharate: Boolean(true),
                alltaxrate: Boolean(true),
                checkalltaxrate: Boolean(true),
                ataxrate: Boolean(true),
                vtaxrate: Boolean(true),
                etaxrate: Boolean(true),
                dtaxrate: Boolean(true),
                exceltaxrate: Boolean(true),
                csvtaxrate: Boolean(true),
                printtaxrate: Boolean(true),
                pdftaxrate: Boolean(true),
                alltaxrategroup: Boolean(true),
                checkalltaxrategroup: Boolean(true),
                ataxrategroup: Boolean(true),
                vtaxrategroup: Boolean(true),
                dtaxrategroup: Boolean(true),
                exceltaxrategroup: Boolean(true),
                csvtaxrategroup: Boolean(true),
                printtaxrategroup: Boolean(true),
                pdftaxrategroup: Boolean(true),
                alltaxratehsn: Boolean(true),
                checkalltaxratehsn: Boolean(true),
                ataxratehsn: Boolean(true),
                vtaxratehsn: Boolean(true),
                dtaxratehsn: Boolean(true),
                exceltaxratehsn: Boolean(true),
                csvtaxratehsn: Boolean(true),
                printtaxratehsn: Boolean(true),
                pdftaxratehsn: Boolean(true),
                allpaymentintegration: Boolean(true),
                checkallpaymentintegration: Boolean(true),
                vpaymentintegration: Boolean(true),
                apaymentintegration: Boolean(true),
                dpaymentintegration: Boolean(true),
                excelpaymentintegration: Boolean(true),
                csvpaymentintegration: Boolean(true),
                pdfpaymentintegration: Boolean(true),
                businesssettings: Boolean(true),
                home: Boolean(true),
                selectlocation: Boolean(true),
                from: Boolean(true),
                to: Boolean(true),
                totalpurchase: Boolean(true),
                totalsales: Boolean(true),
                purchasedue: Boolean(true),
                salesdue: Boolean(true),
                totalsalesreturn: Boolean(true),
                totalpurchasereturn: Boolean(true),
                expenses: Boolean(true),
                barchart: Boolean(true),
                topproductspiechart: Boolean(true),
                topcustomerspiechart: Boolean(true),
                stockalerttable: Boolean(true),
                recentsalestable: Boolean(true),
                topsellproductstable: Boolean(true),
                //stock transfer
                stocktransferlistmanagement: Boolean(true),
                allstocktransferlist: Boolean(true),
                checkallstocktransferlist: Boolean(true),
                vstocktransferlist: Boolean(true),
                astocktransferlist: Boolean(true),
                excelstocktransferlist: Boolean(true),
                csvstocktransferlist: Boolean(true),
                pdfstocktransferlist: Boolean(true),
                printstocktransferlist: Boolean(true),
                // Stock adjust
                stockadjustmanagement: Boolean(true),
                allstockadjust: Boolean(true),
                checkallstockadjust: Boolean(true),
                excelstockadjust: Boolean(true),
                csvstockadjust: Boolean(true),
                printstockadjust: Boolean(true),
                pdfstockadjust: Boolean(true),
                vstockadjust: Boolean(true),
                //adjustment type
                allstockadjustmenttype: Boolean(true),
                checkallstockadjustmenttype: Boolean(true),
                astockadjustmenttype: Boolean(true),
                estockadjustmenttype: Boolean(true),
                vstockadjustmenttype: Boolean(true),
                dstockadjustmenttype: Boolean(true),
                excelstockadjustmenttype: Boolean(true),
                csvstockadjustmenttype: Boolean(true), 
                printstockadjustmenttype: Boolean(true), 
                pdfstockadjustmenttype: Boolean(true),
                // Password
                passwordmanagement: Boolean(true),
                allpassword: Boolean(true),
                checkallpassword: Boolean(true),
                excelpassword: Boolean(true),
                csvpassword: Boolean(true),
                printpassword: Boolean(true),
                pdfpassword: Boolean(true),
                vpassword: Boolean(true),
                apassword: Boolean(true),
                epassword: Boolean(true),
                dpassword: Boolean(true),

                // Folder
                allfolder: Boolean(true),
                checkallfolder: Boolean(true),
                excelfolder: Boolean(true),
                csvfolder: Boolean(true),
                printfolder: Boolean(true),
                pdffolder: Boolean(true),
                vfolder: Boolean(true),
                afolder: Boolean(true),
                efolder: Boolean(true),
                dfolder: Boolean(true),
                addnewfolder: Boolean(true),

                // Assign password
                allassignpassword: Boolean(true),
                assignpasswordlist: Boolean(true),
                checkallassignpassword: Boolean(true),
                excelassignpassword: Boolean(true),
                csvassignpassword: Boolean(true),
                printassignpassword: Boolean(true),
                pdfassignpassword: Boolean(true),
            });
            setSignup(auth.data);
            backPage('/signin')
        } catch(err){
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }
    const responseGoogle = (response) => {
        return response;
      }

    const handlePhonenumber = (e) => {
        if (e.length > 10) {
            toast.error("Phone number can't more than 10 characters!")
            let num = e.slice(0, 10);
            setSignup({ ...signup, phonenum: num })
        }
    }
    
    // store signup data db
    const handleSubmit =(e) =>{
        e.preventDefault();
        if(signup.companyname == "" && signup.staffname == "" && signup.email == "" && signup.phonenum == "" && signup.password == "" && signup.termscondition == false){
            toast.error("Please fill all fields!");
        }else if(signup.companyname == ""){
            toast.error("Please enter company name!");
        }else if(signup.staffname == ""){
            toast.error("Please enter Name!");
        }else if(signup.email == ""){
            toast.error("Please enter email!");
        }else if(signup.phonenum == ""){
            toast.error("Please enter mobile number!");
        }else if(signup.password == ""){
            toast.error("Please enter password!");
        }else if(signup.termscondition == false){
            toast.error("Please select terms!");
        }else{
            fetchAuth();
        }
    }

    useEffect(
        ()=>{
            fetchUser();
            fetchBusiness();
        },[]
    )
    useEffect(
        () => {
          document.body.classList.add('signupbackground');
          return () => {
            document.body.classList.remove('signupbackground');
            document.body.style.backgroundColor = 'rgb(227, 242, 253)';
            
          }

        }, []
      );

    return (
    <>
    <Box>
        <Grid container>
            <Grid item md={5} sx={loginSignup.signupLeft}>
                <Grid sx={{marginLeft: '30px', marginRight: '30px', marginTop: '10px', marginBottom: '10px'}}>
                   <Grid sx={{display: 'flex', justifyContent: 'center',marginTop: '30px',}}>
                       <Grid sx={loginSignup.signupleftheadlogo}> <img src={ Signuplogo }  alt="HILIFE.AI LOGO" width="75px" /></Grid>
                      <Typography variant="h5" sx={loginSignup.signupleftheadcontent}>HIPOS</Typography>
                   </Grid><br /><br />
                   <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                       <hr style={{ height: '0px', width: '50%'}}/>
                       <CgQuote style={{fontSize: '65px',color: 'white',fontWeight: 900,marginTop: '-30px',}} />
                       <hr style={{ height: '0px', width: '50%'}}/>
                   </Grid><br /><br />
                   <Typography sx={loginSignup.signupleftcontent} >
                       Thanks to the HIPOS team for this wonderful system, i had been using a traditional
                       software system before, which felt very limited. But HILIFE.AI is like a
                       fresh breath of air for my business and choosing it was a very satisfying
                       decision. It has made automation so much simpler.
                    </Typography><br /><br />
                    <hr /><br />
                    <Grid sx={loginSignup.signupleftbottom}>
                        <Grid sx={{backgroundColor: 'white', borderRadius: '44px', margin: '0px 0px 0px 30px' }}>
                            <img src={ Signuplogo } alt="HILIFE.AI LOGO" style={{padding: '10px'}} />
                        </Grid>
                        <Typography sx={{ fontSize: '18px', fontWeight: '900', marginLeft: '30px'}}>
                             Shreebalaji.K<br /><br />
                             <span>HILIFE.AI Pvt Ltd., India</span>
                        </Typography>
                    </Grid><br /><br />
                    <hr /><br />
                    <Grid>
                        <Typography sx={{ textAlign: 'center', color: 'white', fontSize: '18px', fontWeight: '600', }}>Made with&ensp;<FavoriteSharp sx={{color: 'red', fontSize: '30px',   fontWeight: '600', }} /> in TRICHY</Typography>
                        <Typography sx={{ textAlign: 'center', color: 'white', fontSize: '18px', fontWeight: '600', }}>திருச்சியில் உருவாக்கப்பட்டது&ensp;<FavoriteSharp sx={{color: 'red', fontSize: '30px',   fontWeight: '600',}} /></Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item md={7} sx={{height:'100vh',overFlowY:'auto',right:'0',marginLeft:'45%',paddingLeft:'10px',paddingRight:'20px','@media(max-width:1150px)':{margin:'0 auto'}}}>
                <Grid sx={{margin: '30px'}}>
                   <Grid sx={{ display: 'flex', justifyContent: 'space-between'}}>
                       <Box sx={{visibility:'hidden','@media(max-width:1150px)':{visibility:'visible'}}}><img src={Signuplogo} alt="HILIFE.AI LOGO"  /></Box>
                       <Typography variant="h6" sx={{color: '#7C7B7A',}}>&ensp;Already have a HIPOS account?&ensp;<Link to="/" style={{textDecoration: 'none'}}><span style={{ color: 'blue', fontFamily: 'system-ui'}}>Sign In</span></Link></Typography>
                   </Grid><br />
                   <hr /><br />
                   <Grid sx={{}}>
                      <Typography variant="h5" sx={{ color : '#5D5C5C', fontFamily: 'fantasy', textAlign: 'center' }}>Start your full-featured Free Trial for 14 days</Typography><br />
                      {/* Signup form start */}
                      <Grid >
                        <form onSubmit={handleSubmit}>
                            <Box sx={loginSignup.formstart}>
                                <Box sx={loginSignup.forminputfield}>
                                    <Box sx={loginSignup.inputalign}>
                                        <BusinessOutlined sx={loginSignup.inputicon} />
                                        <TextField fullWidth value={signup.companyname}
                                        type="text"
                                        onChange={ (e) => {
                                            setSignup({...signup, companyname: e.target.value})
                                        }} placeholder="Company Name" variant="outlined" sx={loginSignup.inputfield} />
                                    </Box>
                                </Box>
                                <Box sx={loginSignup.forminputfield}>
                                    <Box sx={loginSignup.inputalign}>
                                        <AccountCircleOutlinedIcon sx={loginSignup.inputicon} />
                                        <TextField fullWidth value={signup.staffname}
                                        type="text"
                                        onChange={ (e) => {
                                            setSignup({...signup, staffname: e.target.value})
                                        }} placeholder="Enter Name" variant="outlined" sx={loginSignup.inputfield} />
                                    </Box>
                                </Box>
                                <Box sx={loginSignup.forminputfield}>
                                    <Box sx={loginSignup.inputalign}>
                                        <EmailOutlinedIcon sx={loginSignup.inputicon} />
                                        <TextField fullWidth value={signup.email}
                                        type="email"
                                        onChange={ (e) => {
                                            setSignup({...signup, email: e.target.value})
                                        }} placeholder="Email Address" variant="outlined" sx={loginSignup.inputfield} />
                                    </Box>
                                </Box>
                                <Box sx={loginSignup.forminputfield}>
                                    <Box sx={loginSignup.inputalign}>
                                        <LockOutlinedIcon sx={loginSignup.inputicon} />
                                        <TextField fullWidth value={signup.password}
                                        type="password"
                                        onChange={ (e) => {
                                            setSignup({...signup, password: e.target.value})
                                        }} placeholder="Password"  variant="outlined" sx={loginSignup.inputfield} />
                                    </Box>
                                </Box>
                                <Box sx={loginSignup.forminputfield}>
                                    <Box sx={loginSignup.inputalign}>
                                        <PublicOutlinedIcon sx={loginSignup.inputicon} />
                                         <Select
                                        options={Country.getAllCountries()}
                                        getOptionLabel={(options) => {
                                            return options["name"];
                                        }}
                                        getOptionValue={(options) => {
                                            return options["name"];
                                        }}
                                        value={selectedCountry}
                                        styles={colourStyles}
                                        sx={loginSignup.inputfield}
                                        onChange={ (item) => {
                                            setSelectedCountry(item);
                                        }}
                                    />
                                     </Box>
                                 </Box>
                                 <Box sx={loginSignup.forminputfield}>
                                     <Box sx={loginSignup.inputalign} style={{width:'100%'}}>
                                         <FmdGoodOutlinedIcon sx={loginSignup.inputicon} />
                                         <Select
                                        options={State?.getStatesOfCountry(selectedCountry?.isoCode)}
                                        getOptionLabel={(options) => {
                                            return options["name"];
                                        }}
                                        getOptionValue={(options) => {
                                            return options["name"];
                                        }}
                                        value={selectedState}
                                        styles={colourStyles}
                                        onChange={ (item) => {
                                            setSelectedState(item);
                                        }}
                                        sx={loginSignup.inputfield} id="signupSelect"
                                    />
                                     </Box>
                                 </Box>
                                 <Box sx={loginSignup.forminputfield}>
                                     <Box sx={loginSignup.inputalign}>
                                         <LocalPhoneOutlinedIcon sx={loginSignup.inputicon} />
                                         <TextField fullWidth value={signup.phonenum}
                                         type="number"
                                        onChange={ (e) => {
                                            setSignup({...signup, phonenum: e.target.value});
                                            handlePhonenumber(e.target.value);
                                        }} placeholder="PhoneNumber" variant="outlined" sx={loginSignup.inputfield} />
                                    </Box>
                                </Box>
                                <br />
                                <Typography>Your data will be in INDIA data center.</Typography>
                                <div>
                                    <FormGroup> <FormControlLabel control={<Checkbox checked={signup.termscondition} onChange={(e) => setSignup({ ...signup, termscondition: !signup.termscondition })} />} /></FormGroup>
                                    <label>I agree to the <label className='conditions'>Terms of Service</label> and<label className='conditions'> Privacy Policy. </label></label>
                                </div>
                                <br />
                                <Button variant="contained" type="submit" fullWidth sx={loginSignup.Signupbtn}>Create your free account</Button>
                                <br /><br />
                                <Grid container sx={loginSignIn.socialcontainer}>
                     
                                <Box sx={loginSignIn.socialicons}>
                                <Box component="img" sx={loginSignIn.socialgoogle} alt="Google logo" src={google} />
                        {/* <Typography sx={loginSignIn.socialiconstxt}>Google</Typography> */}
                        <GoogleLogin
                                  clientId="517438224490-cdrp1615c7jtmh2bb9orh31dvsiok6d8.apps.googleusercontent.com"
                                  
                                  render={renderProps => (
                                    <Button onClick={renderProps.onClick} disabled={renderProps.disabled}>GOOGLE</Button>
                                  )}
                                  buttonText="Login"
                                  onSuccess={responseGoogle}
                                  onFailure={responseGoogle}
                                  cookiePolicy={'single_host_origin'}
                                />
                                </Box>
                  
                                <Box sx={loginSignIn.micrsoftlogo}>
                                    <Box component="img" sx={loginSignIn.socialmicrosoft} src={ microsoft } alt="Microsoft Logo"  />
                                    </Box>
                                    <Box sx={loginSignIn.facebooklogo}>
                                    <Box sx={loginSignIn.socialfacebook}><FaFacebookF></FaFacebookF></Box>
                                    </Box>
                                    <Box sx={loginSignIn.linkedinlogo}>
                                    <Box sx={loginSignIn.sociallinkedin}><FaLinkedinIn></FaLinkedinIn></Box>
                                    </Box>
                                    <Box sx={loginSignIn.twitterlogo}>
                                    <Box sx={loginSignIn.socialtwitter}><FaTwitter></FaTwitter></Box>
                                    </Box>
                                  
                                    <br />
                        </Grid>
                            </Box>
                        </form>
                      </Grid>
                      {/* Signup form end */}
                   </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Box>
    </>
  )
}


export default Signup;