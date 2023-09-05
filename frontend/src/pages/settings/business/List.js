import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Button, Tabs, Tab, Typography } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Businesscreate from './Businesscreate';
import Productcreate from './Productcreate';
import Contactcreate from './Contactcreate';
import Prefixescreate from './Prefixescreate';
import Countercreate from './Countercreate';
import Invoicecreate from './Invoicecreate';
import StocklabelCreate from './Label';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext} from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';
import Headtitle from '../../../components/header/Headtitle';

function TabPanel(props) {

    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other} >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

function Businesssettingstable() {
    const {auth, setngs} = useContext(AuthContext)
    const [value, setValue] = useState(0);
    const [isSettingUpdate, setIsSettingUpdate] = useState(false);
    const [isSetngs, setIsSetngs] = useState({businesslocation:"",currency:"",currencysymbol:"",timezone:"",fyearsstartmonth:"",stockaccountmethod:"",
        dateformat:"",timeformat:"",
    });
    const [counters, setCounters] = useState([]);

    const backLPage = useNavigate();

      // get settings data
    const fetchSettings = () => {
    
      setIsSetngs(setngs);
      setCounters(setngs.counter);
    }
    useEffect(
        () => {
        fetchSettings();
        }, [isSettingUpdate]
    )

    // update settings data
    const updateRequest = async (idRemovedcounter) => {
        
        try {
            let req = await axios.put(`${SERVICE.SETTING_SINGLE}/${setngs._id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessname: String(isSetngs.businessname == undefined ? setngs.businessname == undefined ? "" : setngs.businessname : isSetngs.businessname),
                buniessaddress:String(isSetngs.buniessaddress == undefined ? setngs.buniessaddress== undefined ? "" : setngs.buniessaddress : isSetngs.buniessaddress),
                businesslocation:String(isSetngs.businesslocation == undefined ? setngs.businesslocation == undefined ? "" : setngs.businesslocation : isSetngs.businesslocation),
                startdate: String(isSetngs.startdate == undefined ? setngs.startdate == undefined ? "" : setngs.startdate : isSetngs.startdate),
                dprofitpercent: Number(isSetngs.dprofitpercent == undefined ? setngs.dprofitpercent == undefined ? "" : setngs.dprofitpercent : isSetngs.dprofitpercent),
                currency: String(isSetngs.currency == undefined ? setngs.currency == undefined ? "" : setngs.currency : isSetngs.currency),
                currencysymbol: String(isSetngs.currencysymbol == undefined ? setngs.currencysymbol == undefined ? "" : setngs.currencysymbol : isSetngs.currencysymbol),
                timezone: String(isSetngs.timezone == undefined ? setngs.timezone == undefined ? "" : setngs.timezone : isSetngs.timezone),
                businesslogo: String(isSetngs.businesslogo == undefined ? setngs.businesslogo == undefined ? "" : setngs.businesslogo : isSetngs.businesslogo),
                fyearsstartmonth: String(isSetngs.fyearsstartmonth == undefined ? setngs.fyearsstartmonth == undefined ? "" : setngs.fyearsstartmonth : isSetngs.fyearsstartmonth),
                stockaccountmethod: String(isSetngs.stockaccountmethod == undefined ? setngs.stockaccountmethod == undefined ? "" : setngs.stockaccountmethod : isSetngs.stockaccountmethod),
                dateformat: String(isSetngs.dateformat == undefined ? setngs.dateformat == undefined ? "" : setngs.dateformat : isSetngs.dateformat),
                timeformat: String(isSetngs.timeformat == undefined ? setngs.timeformat == undefined ? "" : setngs.timeformat : isSetngs.timeformat),
                skuprefix: String(isSetngs.skuprefix == undefined ? setngs.skuprefix == undefined ? "" : setngs.skuprefix : isSetngs.skuprefix),
                esize:Boolean(isSetngs.esize == undefined ? setngs.esize == undefined ? "" : setngs.esize : isSetngs.esize),
                eunit:Boolean(isSetngs.eunit == undefined ? setngs.eunit == undefined ? "" : setngs.eunit : isSetngs.eunit),
                ecategory: Boolean(isSetngs.ecategory == undefined ? setngs.ecategory == undefined ? "" : setngs.ecategory : isSetngs.ecategory),
                ebrand: Boolean(isSetngs.ebrand == undefined ? setngs.ebrand == undefined ? "" : setngs.ebrand : isSetngs.ebrand),
                defaultunit: String(isSetngs.defaultunit == undefined ? setngs.defaultunit == undefined ? "" : setngs.defaultunit : isSetngs.defaultunit),
                credeitlimit: Number(isSetngs.credeitlimit == undefined ? setngs.credeitlimit == undefined ? "" : setngs.credeitlimit : isSetngs.credeitlimit),
                purchasesku: String(isSetngs.purchasesku == undefined ? setngs.purchasesku == undefined ? "" : setngs.purchasesku: isSetngs.purchasesku),
                purchasereturnsku: String(isSetngs.purchasereturnsku == undefined ? setngs.purchasereturnsku == undefined ? "" : setngs.purchasereturnsku : isSetngs.purchasereturnsku),
                expensesku: String(isSetngs.expensesku == undefined ? setngs.expensesku == undefined ? "" : setngs.expensesku : isSetngs.expensesku),
                customersku: String(isSetngs.customersku == undefined ? setngs.customersku == undefined ? "" : setngs.customersku : isSetngs.customersku),
                suppliersku: String(isSetngs.suppliersku == undefined ? setngs.suppliersku == undefined ? "" : setngs.suppliersku : isSetngs.suppliersku),
                cusgroupsku: String(isSetngs.cusgroupsku == undefined ? setngs.cusgroupsku == undefined ? "" : setngs.cusgroupsku : isSetngs.cusgroupsku),
                discountsku:String(isSetngs.discountsku == undefined ? setngs.discountsku == undefined ? "" : setngs.discountsku : isSetngs.discountsku),
                businesslocationsku: String(isSetngs.businesslocationsku == undefined ? setngs.businesslocationsku == undefined ? "" : setngs.businesslocationsku: isSetngs.businesslocationsku) ,
                usersku: String(isSetngs.usersku == undefined ? setngs.usersku == undefined ? "" : setngs.usersku: isSetngs.usersku),
                departmentsku: String(isSetngs.departmentsku == undefined ? setngs.departmentsku == undefined ? "" : setngs.departmentsku: isSetngs.departmentsku),
                passwordsku: String(isSetngs.passwordsku == undefined ? setngs.passwordsku == undefined ? "" : setngs.passwordsku: isSetngs.passwordsku),
                salesku: String(isSetngs.salesku == undefined ? setngs.salesku == undefined ? "" : setngs.salesku: isSetngs.salesku),
                draftsku: String(isSetngs.draftsku == undefined ? setngs.draftsku == undefined ? "" : setngs.draftsku : isSetngs.draftsku),
                quotationsku:String(isSetngs.quotationsku == undefined ? setngs.quotationsku == undefined ? "" : setngs.quotationsku : isSetngs.quotationsku),
                ciono :Number(isSetngs.ciono == undefined ? setngs.ciono == undefined ? "" : setngs.ciono : isSetngs.ciono),
                gstno :String(isSetngs.gstno == undefined ? setngs.gstno == undefined ? "" : setngs.gstno : isSetngs.gstno),
                counter:[...idRemovedcounter],
                applicabletax:String(isSetngs.applicabletax == undefined ? setngs.applicabletax == undefined ? "" : setngs.applicabletax : isSetngs.applicabletax),
                multivalue:String(isSetngs.multivalue == undefined ? setngs.multivalue == undefined ? "" : setngs.multivalue : isSetngs.multivalue),
                sellingpricetax:String(isSetngs.sellingpricetax == undefined ? setngs.sellingpricetax == undefined ? "" : setngs.sellingpricetax : isSetngs.sellingpricetax),
                minquantity:Number(isSetngs.minquantity == undefined ? setngs.minquantity == undefined ? 0 : setngs.minquantity : isSetngs.minquantity),
                maxquantity:Number(isSetngs.maxquantity == undefined ? setngs.maxquantity == undefined ? 0 : setngs.maxquantity : isSetngs.maxquantity),
                barcodetype:String(isSetngs.barcodetype == undefined ? setngs.barcodetype == undefined ? 0 : setngs.barcodetype : isSetngs.barcodetype),
                producttype:String(isSetngs.producttype == undefined ? setngs.producttype == undefined ? 0 : setngs.producttype : isSetngs.producttype),
                saleswithtax:String(isSetngs.saleswithtax == undefined ? setngs.saleswithtax == undefined ? 'None' : setngs.saleswithtax : isSetngs.saleswithtax),
  saleswithouttax:String(isSetngs.saleswithouttax == undefined ? setngs.saleswithouttax == undefined ? 'None' : setngs.saleswithouttax : isSetngs.saleswithouttax),
            });
            setIsSetngs(req.data);
            setIsSettingUpdate(true)
            backLPage('/settings/business/list');
            toast.success(req.data.message,{
                position: toast.POSITION.TOP_CENTER
            });
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const idRemovedNew = ()=> {
        const idRemovedcounter = counters.map((value)=> {
          if (value.newAdded) {
            return {countername : value.countername,counterid:value.counterid}
          }
          else {
            return value;
          }
        });
        updateRequest(idRemovedcounter);
      }
    const sendRequest = (e) => {
        //e.preventDefault();
        idRemovedNew();
    }
    return (
        <>
            <Headtitle title={'Business Settings'}/>
            <Typography sx={userStyle.HeaderText}>Business Settings</Typography>
            <form onSubmit={sendRequest}>
                <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}>
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        sx={{ borderRight: 1, borderColor: 'divider', minWidth: '15%', maxWidth: '15%' }}
                    >
                        <Tab label="Business" {...a11yProps(0)} />
                        <Tab label="Product" {...a11yProps(1)} />
                        <Tab label="Customer" {...a11yProps(2)} />
                        <Tab label="Prefixes" {...a11yProps(3)} />
                        <Tab label="Counter" {...a11yProps(4)} />
                        <Tab label="Invoice" {...a11yProps(5)} />
                        <Tab label="Stock Label" {...a11yProps(6)} />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        <Businesscreate isSetngs={isSetngs} setIsSetngs={setIsSetngs} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Productcreate isSetngs={isSetngs} setIsSetngs={setIsSetngs} />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Contactcreate isSetngs={isSetngs} setIsSetngs={setIsSetngs} />
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <Prefixescreate isSetngs={isSetngs} setIsSetngs={setIsSetngs} />
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                        <Countercreate isSetngs={isSetngs} setIsSetngs={setIsSetngs} counters={counters} setCounters={setCounters}  />
                    </TabPanel>
                    <TabPanel value={value} index={5}>
                        <Invoicecreate isSetngs={isSetngs} setIsSetngs={setIsSetngs} />
                    </TabPanel>
                    <TabPanel value={value} index={6}>
                        <StocklabelCreate isSetngs={isSetngs} setIsSetngs={setIsSetngs}  />
                    </TabPanel>
                </Box>
                <br />
                <Grid container sx={{ justifyContent: 'right !important', bottom: '0', }}>
                    <Box>
                        <Button type="submit" name="submit" sx={userStyle.buttonadd}>UPDATE SETTINGS</Button>
                    </Box>
                </Grid>
            </form>
        </>
    );
}

function Businesssettings() {
    return (
        <>
            <Businesssettingstable /><br /><br /><br /><br />
                    <Footer />
        </>
    );
}

export default Businesssettings;
