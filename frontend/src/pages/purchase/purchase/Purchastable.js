import React, { useEffect, useState, useContext } from 'react';
import { userStyle, colourStyles } from '../../PageStyle';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, TextField, Select, MenuItem, Paper, TableCell, Dialog, DialogContent, DialogActions, Typography, Button, Table, TableContainer, TableHead, TableBody, } from '@mui/material';
import dayjs from 'dayjs';
import { FaSearch } from "react-icons/fa";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { AiOutlineClose } from "react-icons/ai";
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Purchaseproductadd from './Purchaseproductadd';
import Selects from "react-select";
import axios from 'axios';
import { toast } from 'react-toastify';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import 'react-quill/dist/quill.snow.css';

const Purchasetable = ({setPurchaseAdd, taxRate, taxrates, productsList, setProductsList, allProductsList, setAllProductsList, purchaseAdd}) => {

    const { auth, setngs } = useContext(AuthContext);
    //role access
    const { isUserRoleAccess, allTaxrates } = useContext(UserRoleAccessContext);

    const [allUnits, setAllUnits] = useState([]);
    const [groupUnit, setGroupUnit] = useState({quantity:0, unitgrouping:"",subquantity:0});
    const [alpha, setAlpha] = useState("");
    const [fetchsaveproduct, setFetchsaveproduct] = useState("");

    // produts list for add purchase data into db
    const productInputs = {
        produniqid:"",prodname:"",supplier:"",suppliershortname:"",date:"",sku:"",hsn:"",hsntax:"",applicabletax: "",
        applicabletaxrate: "",lotnumber: "",purchasetabletax:"None",purchasetax: "None",purchasetaxrate:"",sellingpricetax:"",enteramt:0,margin: "",
        purchaseexcludetax:"",pruchaseincludetax: "",excalpha: "",incalpha: "",quantity: 1,
        quantityunit: "None",quantitynitpiece:"",quantitysubunitpieces:1,quantitytotalpieces: 1,quantityunitstatus: false,freeitem: 0,freeitemunit:"None",freeitemtotalpieces:0,
        freeitemunitstatus:false,freeitemnitpiece:"",freeitemsubunitpieces:1,netcostafterdiscount:"",netcostbeforediscount:"",netcosttaxamount:0,netcostwithtax:0,unitcostbeforediscount: "",
        unitcostafterdiscount:"",unitcosttaxamount: "",unitcostwithtax:"",purchasenetcost:"",purchasenetcosttax: "",purchasenetcostaftertax: "",
        distypemod: "None",disvaluemod:"",differenceamt:"",subtaxs:[],ratebydismod:"",sellingpriceunitcost:"",sellingpriceunitwithoutcost: "",saletaxamount: ""
    }

    let totalalltaxamt = 0.00;
    let totalitem = 0.00;
    let totalvalue = 0.00;

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();

    const handleClickOpen = () => {
        setIsErrorOpen(true);
    };
    const handleClose = () => {
        setIsErrorOpen(false);
    };

    useEffect(
        () => {
        fetchProducts();
    }, [fetchsaveproduct]);

    useEffect(() => {
        fetchUnits();
        fetchAlpha();
    }, []);

    const fetchUnits = async () => {
        try {
            let res = await axios.post(SERVICE.UNIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            
            setAllUnits(
                res.data.units.map((d) => ({
                    ...d,
                    label: d.unit,
                    value: d.unit,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };
    
    const fetchProducts = async () => {
        try {
            let res = await axios.post(SERVICE.PRODUCT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });

            setProductsList(
                res.data.products.map((d) => ({
                    ...d,
                    label: d.productname,
                    value: d.productname,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // alpha
    const fetchAlpha = async () => {
        try {
            let res = await axios.post(SERVICE.ALPHARATEACTIVE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            setAlpha(res?.data?.alpharates);

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }

    }

    // add hsn to the product list data
    const gethsncode = async (e) => {

        try {
            let taxRateData = allTaxrates?.filter((data) => {
                if (data.hsn + '@' + data.taxrate == e.hsncode) {
                    return data
                } else if (data.taxname + '@' + data.taxrate == e.applicabletax) {
                    return data
                }
            });
            let isAlreadyAdded = false;
            let addedproductId = allProductsList.map((item) => {
                if (e.sku == item.sku) {
                    isAlreadyAdded = true
                    setShowAlert("This product already added!")
                    handleClickOpen();
                    return { ...item }
                } else {
                    return item
                }
            })
            if (isAlreadyAdded) {
                setAllProductsList(addedproductId)
            } else {
                setAllProductsList((productslistdata) => {
                    return [{ ...productInputs, produniqid: e._id, quantityunit:"Pieces", freeitemunit:"Pieces", distypemod:purchaseAdd.discounttypemode, disvaluemod: Number(purchaseAdd.discountvaluemode)?.toFixed(2), differenceamt:Number(purchaseAdd.discountamountmode)?.toFixed(2), suppliershortname: purchaseAdd.suppliershrtname, purchasetabletax: purchaseAdd.purchasetaxmode == "Inclusive" ? "Inclusive" : purchaseAdd.purchasetaxmode == "Exclusive" ? "Exclusive" : "None", purchasetaxrate:taxRate, purchasetax: purchaseAdd.purchasetaxlabmode, supplier: purchaseAdd.supplier, date: purchaseAdd.purchasedate, margin: setngs.dprofitpercent, applicabletax: e.applicabletax == "" || e.applicabletax == "None" ? "" : e.applicabletax, applicabletaxrate: e.applicabletax == "" || e.applicabletax == "None" ? 0 : taxRateData[0]?.taxrate, hsntax: e.hsn == "" || e.hsn == "None" ? 0 : taxRateData[0]?.taxrate, prodname: e.productname, sku: e.sku, hsn: e.hsn == "" || e.hsn == "None" ? "" : e.hsn, sellingpricetax: e.sellingpricetax }, ...productslistdata]
                });
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

    // alpharate for exclude tax
    let gotalpha = "";
    const getAlphaRate = (inputValue) => {
        let getalpha = alpha.slice(0).filter((data) => {
            var num = inputValue;
            var digits = num.toString().split('');
            var realDigits = digits.map((item) => {
                if (item == '.') {
                    gotalpha += '.'
                }
                else {
                    gotalpha += data[item]
                }
            });
        });
        return gotalpha
    }

    //alpharate include tax
    const getAlphaRateInc = (taxValue) => {
        let alphaValue = ""
        let getalpha = alpha.slice(0).filter((data) => {
            var num = taxValue;
            var digits = num.toString().split('');
            var realDigits = digits.map((item) => {
                if (item == '.') {
                    alphaValue += '.'
                }
                else {
                    alphaValue += data[item]
                }
            })
        });
        return alphaValue;
    }

    //quantity unit change compare with unit group
    const handleChangeUnit = async (unitindex,valueunitname) =>{
        let resdata = [];
        let resunidata = [];
        let unitcompare = [];
        let unitpiececompare = [];
        try {
            let res = await axios.post(SERVICE.UNIT_GROUPS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            unitcompare = res?.data?.unitgroupings.filter((data,index)=>{
                if(valueunitname == data.unit){
                    resunidata.push({...data, subquantity:1});
                    return data;
                }
            });

            // if(valueunitname == "Pieces" || valueunitname == "Piece" || valueunitname == "pieces" || valueunitname == "piece"){
            //     return {quantity:0, unitgrouping:valueunitname}
            // }else if(valueunitname == data.unit){
            //     return data
            // }

            unitpiececompare = res?.data?.unitgroupings.filter((data, index)=>{
                if(unitcompare[0]?.unitgrouping != "Pieces" || unitcompare[0]?.unitgrouping != "Piece" || unitcompare[0]?.unitgrouping != "pieces" || unitcompare[0]?.unitgrouping != "piece"){
                    if(unitcompare[0]?.unitgrouping == data.unit){
                        resdata.push({...data, subquantity:unitcompare[0]?.quantity})
                        return {...data, subquantity:unitcompare[0]?.quantity}
                    }
                }
            })

            let result = unitcompare.length == 0 ? [{quantity:1,unitgrouping:valueunitname,subquantity:1}] : unitpiececompare.length == 0 ? resunidata : resdata;
                
            setGroupUnit(result[0]);
            await  productUserInput(unitindex, "quantityunit", valueunitname, "Quantityunit", result[0]?.quantity, false,result[0]?.subquantity);

            // if(unitcompare.length == 0){
            //     // setShowAlert("Unit name didn't present unit group! Quantity calulate as single piece!");
            //     // handleQuantityOpen();
            //     let result = valueunitname == "Pieces" || valueunitname == "Piece" || valueunitname == "pieces" || valueunitname == "piece" ? [{quantity:0,unitgrouping:valueunitname}] : unitcompare[0]?.unitgrouping == "Pieces" || unitcompare[0]?.unitgrouping == "Piece" || unitcompare[0]?.unitgrouping == "pieces" || unitcompare[0]?.unitgrouping == "piece" ? resunidata : resdata;
            //     setGroupUnit(result[0]);
            //     await  productUserInput(unitindex, "quantityunit", valueunitname, "Quantityunit","",result[0]?.quantity,result[0]?.subquantity);
            // }else{
            //     let result = valueunitname == "Pieces" || valueunitname == "Piece" || valueunitname == "pieces" || valueunitname == "piece" ? [{quantity:0,unitgrouping:valueunitname}] : unitcompare[0]?.unitgrouping == "Pieces" || unitcompare[0]?.unitgrouping == "Piece" || unitcompare[0]?.unitgrouping == "pieces" || unitcompare[0]?.unitgrouping == "piece" ? resunidata : resdata;
                
            // setGroupUnit(result[0]);
            // await  productUserInput(unitindex, "quantityunit", valueunitname, "Quantityunit", result[0]?.quantity, false,result[0]?.subquantity);
            // }
            

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    //free quantity unit change compare with unit group
    const handleChangeFreeUnit = async (unitindex,valueunitname) =>{
        let resdata = [];
        let resunidata = [];
        let unitcompare = [];
        let unitpiececompare = [];
        try {
            let res = await axios.post(SERVICE.UNIT_GROUPS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            unitcompare = res?.data?.unitgroupings.filter((data,index)=>{
                if(valueunitname == data.unit){
                    resunidata.push({...data, subquantity:1});
                    return data;
                }
            });

            // if(valueunitname == "Pieces" || valueunitname == "Piece" || valueunitname == "pieces" || valueunitname == "piece"){
            //     return {quantity:0, unitgrouping:valueunitname}
            // }else if(valueunitname == data.unit){
            //     return data
            // }

            unitpiececompare = res?.data?.unitgroupings.filter((data, index)=>{
                if(unitcompare[0]?.unitgrouping != "Pieces" || unitcompare[0]?.unitgrouping != "Piece" || unitcompare[0]?.unitgrouping != "pieces" || unitcompare[0]?.unitgrouping != "piece"){
                    if(unitcompare[0]?.unitgrouping == data.unit){
                        resdata.push({...data, subquantity:unitcompare[0]?.quantity})
                        return {...data, subquantity:unitcompare[0]?.quantity}
                    }
                }
            })

            // if(unitcompare.length == 0){
            //     let result = valueunitname == "Pieces" || valueunitname == "Piece" || valueunitname == "pieces" || valueunitname == "piece" ? [{quantity:0,unitgrouping:valueunitname}] : unitcompare[0]?.unitgrouping == "Pieces" || unitcompare[0]?.unitgrouping == "Piece" || unitcompare[0]?.unitgrouping == "pieces" || unitcompare[0]?.unitgrouping == "piece" ? resunidata : resdata;
            //     setGroupUnit(result[0]);
            //     await  productUserInput(unitindex, "freeitemunit", valueunitname, "Free Unit","",true,result[0]?.subquantity);
            // }else{
                let result = unitcompare.length == 0 ? [{quantity:1,unitgrouping:valueunitname,subquantity:1}] : unitpiececompare.length == 0 ? resunidata : resdata;
                
            setGroupUnit(result[0]);
            await  productUserInput(unitindex, "freeitemunit", valueunitname, "Free Unit", result[0]?.quantity, false,result[0]?.subquantity);
            // }
            

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    //tax change
    const handleChangeTax = async (index,taxname,taxvalue,taxsubarray) => {

        await productUserInput(index, "purchasetax", taxname, "taxchange",0,"",0,taxvalue,taxsubarray);
     }

     {
        allProductsList && (
            allProductsList.forEach(
                (item => {
                    totalitem += +item.quantity 
                    totalalltaxamt += +item.netcosttaxamount
                    totalvalue += +item.netcostwithtax
                })
            ))
    }
    

    // all tabel product tax calculation
    function productUserInput(indexInput, productInputName, inputValue, reference = "", unituantityvalue, unitstatus, unitsubquantity, taxratevalue, taxsubarray) {
        let userInputs = allProductsList.map((value, indexList) => {
            if (indexInput == indexList) {
                if (reference == "purchasetablechange") {
                    if (inputValue == "None") {
                        if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
          
                            //quantity
                            let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let unitcostdisc = value.enteramt;
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                let differenceValue = Number(value.enteramt) + Number(disamt);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (inputValue == "Inclusive") {
                        if(value.purchasetax == "None"){
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                               let differenceValue = Number(value.enteramt) + Number(disamt);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }
                        else{
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                            let purchaseEx = (Number(purchaseincamtfix) / Number(taxvalue));
                            let purchaseIn = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftTax)?.toFixed(2),netcostbeforediscount:Number(netCostAftTax)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftTax)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseIn)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx =(Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =(Number(value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterdisc)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseDiscAftIn)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx =(Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =(Number(value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseDiscAftIn)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (inputValue == "Exclusive") {
                        if(value.purchasetax == "None"){
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                               let differenceValue = Number(value.enteramt) + Number(disamt);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }
                        else{
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseIn =Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrDisc = (Number(netCostBefrDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftdisc = (Number(netCostAftDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            // let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);

                            // let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftDisc)?.toFixed(2),netcostbeforediscount:Number(netCostBefrDisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx = Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                                

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                }
                else if (reference == "taxchange") {
                    
                    if (value.purchasetabletax == "None") {
                        if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
          
                            //quantity
                            let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let unitcostdisc = value.enteramt;
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, purchasetaxrate:taxratevalue, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, purchasetaxrate:taxratevalue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                let differenceValue = Math.abs(Number(value.enteramt) + Number(disamt));
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            

                                return { ...value, [productInputName]: inputValue, purchasetaxrate:taxratevalue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        if(inputValue == "None"){
                            //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue, purchasetaxrate:taxratevalue, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, purchasetaxrate:taxratevalue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                               let differenceValue = Math.abs(Number(value.enteramt) + Number(disamt));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, purchasetaxrate:taxratevalue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }
                        else{
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = taxratevalue == undefined || "" ? 0 : taxratevalue;
                            let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                            let purchaseEx =(Number(purchaseincamtfix) / Number(taxvalue));
                            let purchaseIn = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, purchasetaxrate:taxratevalue, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftTax)?.toFixed(2),netcostbeforediscount:Number(netCostAftTax)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftTax)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseIn)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = taxratevalue == undefined || "" ? 0 : taxratevalue;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx =(Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =(Number(value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, purchasetaxrate:taxratevalue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterdisc)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseDiscAftIn)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = taxratevalue == undefined || "" ? 0 : taxratevalue;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx =(Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =(Number(value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue, purchasetaxrate:taxratevalue, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseDiscAftIn)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Exclusive") {
                        if(inputValue == "None"){
                            //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                           //quantity
                           let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue, purchasetaxrate:taxratevalue, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, purchasetaxrate:taxratevalue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                               let differenceValue = Math.abs(Number(value.enteramt) + Number(disamt));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, purchasetaxrate:taxratevalue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else {
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = taxratevalue == undefined || "" ? 0 : taxratevalue;
                            let purchaseIn =Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrDisc = (Number(netCostBefrDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftdisc = (Number(netCostAftDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            // let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);

                            // let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, purchasetaxrate:taxratevalue, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftDisc)?.toFixed(2),netcostbeforediscount:Number(netCostBefrDisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = taxratevalue == undefined || "" ? 0 : taxratevalue;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, purchasetaxrate:taxratevalue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = taxratevalue == undefined || "" ? 0 : taxratevalue;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                                

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue, purchasetaxrate:taxratevalue, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }  
                }
                else if (reference == "Enteramt") {
                    if (value.purchasetabletax == "None") {
                        if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(inputValue) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(inputValue) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
          
                            //quantity
                            let netCost = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let unitcostdisc = inputValue;
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(inputValue) - Number(value.disvaluemod));
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(inputValue) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(inputValue) - Number(disamt));
                                let differenceValue = Math.abs(Number(inputValue) + Number(disamt));
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        if(value.purchasetax == "None"){
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(inputValue) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(inputValue) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Math.abs(Number(inputValue) - Number(value.disvaluemod));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Math.abs(Number(inputValue) * (Number(value.disvaluemod) / 100));
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Math.abs(Number(inputValue) - Number(disamt));
                               let differenceValue = Math.abs(Number(inputValue) + Number(disamt));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }
                        else{
                            let purchaseincamtfix = Number(inputValue);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                            let purchaseEx =Number(purchaseincamtfix) / Number(taxvalue);
                            // let purchaseEx =Number(purchaseincamtfix) - (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseIn = Number(inputValue);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftTax)?.toFixed(2),netcostbeforediscount:Number(netCostAftTax)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftTax)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseIn)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(inputValue) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx =(Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =(Number(inputValue) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(inputValue);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                                
                                let netdis =  Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitdis = Number(netdis)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterdisc)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseDiscAftIn)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(inputValue) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(inputValue) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx =(Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =(Number(inputValue) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(inputValue);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseDiscAftIn)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Exclusive") {
                        if(value.purchasetax == "None"){
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(inputValue) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(inputValue) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if(value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Math.abs(Number(inputValue) - Number(value.disvaluemod));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Math.abs(Number(inputValue) * (Number(value.disvaluemod) / 100));
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Math.abs(Number(inputValue) - Number(disamt));
                               let differenceValue = Math.abs(Number(inputValue) + Number(disamt));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }
                        else{
                            let purchaseincamtfix = Number(inputValue);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            
                            let purchaseIn =Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(inputValue);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrDisc = (Number(netCostBefrDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftdisc = (Number(netCostAftDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            // let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);

                            // let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftDisc)?.toFixed(2),netcostbeforediscount:Number(netCostBefrDisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(inputValue) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number((discountValue)) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(inputValue) - (Number(inputValue) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(inputValue);
                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(inputValue) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(inputValue) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(inputValue) - (Number(inputValue) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(inputValue);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                                

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                }
                else if (reference == "Quantity") {
                    if (value.purchasetabletax == "None") {
                        if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                            let resquantity = Number(inputValue) * Number(res1);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(value.enteramt == 0 ? 1 : value.enteramt) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
          
                            //quantity
                            let netCost = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                            let unitcost = (Number(netCost)/Number(resquantity));
                            let unitcostdisc = value.enteramt == 0 ? 1 : value.enteramt;
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(value.disvaluemod));
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(resquantity));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(resquantity)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(resquantity));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(disamt));
                                let differenceValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) + Number(disamt));
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(resquantity));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(resquantity)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(resquantity));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            

                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        if(value.purchasetax == "None"){
                            let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                            let resquantity = Number(inputValue) * Number(res1);
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt == 0 ? 1 : value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                           let unitcost = (Number(netCost)/Number(resquantity));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(value.disvaluemod));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(resquantity));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(resquantity)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(resquantity));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.disvaluemod) / 100));
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(disamt));
                               let differenceValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) + Number(disamt));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(resquantity));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(resquantity)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(resquantity));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else{
                            let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                            let resquantity = Number(inputValue) * Number(res1);
                            let purchaseincamtfix = Number(value.enteramt == 0 ? 1 : value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                            let purchaseEx =(Number(purchaseincamtfix) / Number(taxvalue));
                            let purchaseIn = Number(value.enteramt == 0 ? 1 : value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrTax = Number(purchaseEx) * Number(resquantity)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(resquantity));
                            let netCostAftTax = Number(purchaseIn) * Number(resquantity)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(resquantity));
                            
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(resquantity);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftTax)?.toFixed(2),netcostbeforediscount:Number(netCostAftTax)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftTax)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseIn)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx =(Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =(Number(value.enteramt == 0 ? 1 : value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt == 0 ? 1 : value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(resquantity));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(resquantity));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(resquantity)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(resquantity);
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterdisc)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseDiscAftIn)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx =(Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =(Number(value.enteramt == 0 ? 1 : value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt == 0 ? 1 : value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(resquantity));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(resquantity));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(resquantity)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(resquantity);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseDiscAftIn)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Exclusive") {
                        if(value.purchasetax == "None"){
                            let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                            let resquantity = Number(inputValue) * Number(res1);
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt == 0 ? 1 : value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                           let unitcost = (Number(netCost)/Number(resquantity));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(value.disvaluemod));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(resquantity));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(resquantity)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(resquantity));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.disvaluemod) / 100));
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(disamt));
                               let differenceValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) + Number(disamt));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(resquantity));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(resquantity)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(resquantity));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }
                        else{
                            let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                            let resquantity = Number(inputValue) * Number(res1);
                            let purchaseincamtfix = Number(value.enteramt == 0 ? 1 : value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseIn =Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(value.enteramt == 0 ? 1 : value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(resquantity)
                            let unitcostBefrDisc = (Number(netCostBefrDisc)/Number(resquantity));
                            let netCostAftDisc = Number(purchaseEx) * Number(resquantity)
                            let unitcostAftdisc = (Number(netCostAftDisc)/Number(resquantity));
                           
                            let netCostBefrTax = Number(purchaseEx) * Number(resquantity)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(resquantity));
                            let netCostAftTax = Number(purchaseIn) * Number(resquantity)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(resquantity));
                            // let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);

                            // let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(resquantity);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftDisc)?.toFixed(2),netcostbeforediscount:Number(netCostBefrDisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt == 0 ? 1 : value.enteramt) - (Number(value.enteramt == 0 ? 1 : value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt == 0 ? 1 : value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(resquantity));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(resquantity));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(resquantity)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(resquantity);
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt == 0 ? 1 : value.enteramt) - (Number(value.enteramt == 0 ? 1 : value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt == 0 ? 1 : value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(resquantity));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(resquantity));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(resquantity)); 
                        
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(resquantity);
                                

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces: resquantity, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                }
                else if (reference == "Quantityunit") {

                    if (value.purchasetabletax == "None") {
                        if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let res1 = Number(unitsubquantity) * Number(unituantityvalue)
                            let resquantity = Number(value.quantity) * Number(res1) 
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(value.enteramt == 0 ? 1 : value.enteramt) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
          
                            //quantity
                            let netCost = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                            let unitcost = (Number(netCost)/Number(resquantity));
                            let unitcostdisc = value.enteramt == 0 ? 1 : value.enteramt;
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,quantitysubunitpieces: unitsubquantity, quantitytotalpieces:resquantity,quantitynitpiece:unituantityvalue,quantityunitstatus: unitstatus, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(value.disvaluemod));
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(resquantity));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(resquantity)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(resquantity));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces:resquantity,quantitynitpiece:unituantityvalue,quantityunitstatus: unitstatus, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(disamt));
                                let differenceValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) + Number(disamt));
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(resquantity));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(resquantity)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(resquantity));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            

                                return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces:resquantity,quantitynitpiece:unituantityvalue,quantityunitstatus: unitstatus, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        if(value.purchasetax == "None"){
                            let res1 = Number(unitsubquantity) * Number(unituantityvalue)
                            let resquantity = Number(value.quantity) * Number(res1) 
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt == 0 ? 1: value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt == 0 ? 1 : value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                           let unitcost = (Number(netCost)/Number(resquantity));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces:resquantity,quantitynitpiece:unituantityvalue,quantityunitstatus: unitstatus, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(value.disvaluemod));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(resquantity));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(resquantity)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(resquantity));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces:resquantity,quantitynitpiece:unituantityvalue,quantityunitstatus: unitstatus, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.disvaluemod) / 100));
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(disamt));
                               let differenceValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) + Number(disamt));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(resquantity));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(resquantity)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(resquantity));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces:resquantity,quantitynitpiece:unituantityvalue,quantityunitstatus: unitstatus, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }
                        else {
                            let res1 = Number(unitsubquantity) * Number(unituantityvalue)
                            let resquantity = Number(value.quantity) * Number(res1) 
                            let purchaseincamtfix = Number(value.enteramt == 0 ? 1 : value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                            let purchaseEx =(Number(purchaseincamtfix) / Number(taxvalue));
                            let purchaseIn = Number(value.enteramt == 0 ? 1 : value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrTax = Number(purchaseEx) * Number(resquantity)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(resquantity));
                            let netCostAftTax = Number(purchaseIn) * Number(resquantity)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(resquantity));
                            
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(resquantity);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces:resquantity,quantitynitpiece:unituantityvalue,quantityunitstatus: unitstatus, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftTax)?.toFixed(2),netcostbeforediscount:Number(netCostAftTax)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftTax)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseIn)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx =(Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =(Number(value.enteramt == 0 ? 1 : value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt == 0 ? 1 : value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(resquantity));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(resquantity));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(resquantity)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(resquantity);
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces:resquantity,quantitynitpiece:unituantityvalue,quantityunitstatus: unitstatus, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterdisc)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseDiscAftIn)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx =(Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =(Number(value.enteramt == 0 ? 1 : value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt == 0 ? 1 : value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(resquantity));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(resquantity));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(resquantity)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(resquantity);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces:resquantity,quantitynitpiece:unituantityvalue,quantityunitstatus: unitstatus, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseDiscAftIn)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Exclusive") {
                        if(value.purchasetax == "None"){
                            let res1 = Number(unitsubquantity) * Number(unituantityvalue)
                            let resquantity = Number(value.quantity) * Number(res1) 
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt == 0 ? 1 : value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                           let unitcost = (Number(netCost)/Number(resquantity));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces:resquantity,quantitynitpiece:unituantityvalue,quantityunitstatus: unitstatus, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(value.disvaluemod));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(resquantity));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(resquantity)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(resquantity));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces:resquantity,quantitynitpiece:unituantityvalue,quantityunitstatus: unitstatus, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.disvaluemod) / 100));
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(disamt));
                               let differenceValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) + Number(disamt));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(resquantity));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(resquantity)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(resquantity));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces:resquantity,quantitynitpiece:unituantityvalue,quantityunitstatus: unitstatus, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }
                        else {
                            let res1 = Number(unitsubquantity) * Number(unituantityvalue)
                            let resquantity = Number(value.quantity) * Number(res1) 
                            let purchaseincamtfix = Number(value.enteramt == 0 ? 1 : value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseIn =Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(value.enteramt == 0 ? 1 : value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(resquantity)
                            let unitcostBefrDisc = (Number(netCostBefrDisc)/Number(resquantity));
                            let netCostAftDisc = Number(purchaseEx) * Number(resquantity)
                            let unitcostAftdisc = (Number(netCostAftDisc)/Number(resquantity));
                           
                            let netCostBefrTax = Number(purchaseEx) * Number(resquantity)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(resquantity));
                            let netCostAftTax = Number(purchaseIn) * Number(resquantity)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(resquantity));
                            // let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);

                            // let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(resquantity);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces:resquantity,quantitynitpiece:unituantityvalue,quantityunitstatus: unitstatus, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftDisc)?.toFixed(2),netcostbeforediscount:Number(netCostBefrDisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt == 0 ? 1 : value.enteramt) - (Number(value.enteramt == 0 ? 1 : value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt == 0 ? 1 : value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(resquantity));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(resquantity));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(resquantity)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(resquantity);
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces:resquantity,quantitynitpiece:unituantityvalue,quantityunitstatus: unitstatus, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt == 0 ? 1 : value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt == 0 ? 1 : value.enteramt) - (Number(value.enteramt == 0 ? 1 : value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt == 0 ? 1 : value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt == 0 ? 1 : value.enteramt) * Number(resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(resquantity));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(resquantity));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(resquantity)); 
                        
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(resquantity);
                                

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue, quantitysubunitpieces: unitsubquantity, quantitytotalpieces:resquantity,quantitynitpiece:unituantityvalue,quantityunitstatus: unitstatus, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                }
                else if (reference == "Discountmode") {
                    if (value.purchasetabletax == "None") {
                        if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
          
                            //quantity
                            let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let unitcostdisc = value.enteramt;
                            //discount
                            if (inputValue == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (inputValue == "Fixed" || inputValue == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (inputValue == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                let differenceValue = Math.abs(Number(value.enteramt) + Number(disamt));
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        if(value.purchasetax == "None"){
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (inputValue == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (inputValue == "Fixed" || inputValue == "Amount") {
                               let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (inputValue == "Percentage") {
                               let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                               let differenceValue = Math.abs(Number(value.enteramt) + Number(disamt));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else{
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                            let purchaseEx =(Number(purchaseincamtfix) / Number(taxvalue));
                            let purchaseIn = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                            //discount
                            if (inputValue == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftTax)?.toFixed(2),netcostbeforediscount:Number(netCostAftTax)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftTax)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseIn)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (inputValue == "Fixed" || inputValue == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx =(Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =(Number(value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterdisc)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseDiscAftIn)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (inputValue == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx =(Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =(Number(value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseDiscAftIn)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Exclusive") {
                        if(value.purchasetax == "None"){
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (inputValue == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (inputValue == "Fixed" || inputValue == "Amount") {
                               let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (inputValue == "Percentage") {
                               let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                               let differenceValue = Math.abs(Number(value.enteramt) + Number(disamt));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }
                        else {
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseIn =Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrDisc = (Number(netCostBefrDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftdisc = (Number(netCostAftDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            // let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);

                            // let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                            //discount
                            if (inputValue == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftDisc)?.toFixed(2),netcostbeforediscount:Number(netCostBefrDisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (inputValue == "Fixed" || inputValue == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(value.disvaluemod));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (inputValue == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(value.disvaluemod) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                                

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                }
                else if (reference == "Discountvalue") {
                    if (value.purchasetabletax == "None") {
                        if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
          
                            //quantity
                            let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let unitcostdisc = value.enteramt;
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(inputValue));
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                let diffval = inputValue;
            
                                return { ...value, [productInputName]: inputValue, differenceamt: Number(diffval)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(inputValue) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                let differenceValue = Math.abs(Number(value.enteramt) + Number(disamt));
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            

                                return { ...value, [productInputName]: inputValue, differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        if(value.purchasetax == "None"){
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Math.abs(Number(value.enteramt) - Number(inputValue));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                               let diffval = inputValue;
           
                               return { ...value, [productInputName]: inputValue, differenceamt: Number(diffval)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Math.abs(Number(value.enteramt) * (Number(inputValue) / 100));
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                               let differenceValue = Math.abs(Number(value.enteramt) + Number(disamt));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else{
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                            let purchaseEx =(Number(purchaseincamtfix) / Number(taxvalue));
                            let purchaseIn = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftTax)?.toFixed(2),netcostbeforediscount:Number(netCostAftTax)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftTax)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseIn)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(inputValue));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx =(Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =(Number(value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                let diffval = inputValue;
            
                                return { ...value, [productInputName]: inputValue, differenceamt: Number(diffval)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterdisc)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseDiscAftIn)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Math.abs(Number(value.enteramt) * (Number(inputValue) / 100)));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let taxvalue = (Number(1) + ((Number(tax)) / Number(100)));
                                let purchaseDiscAftEx =(Number(discountValue) / Number(taxvalue));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =(Number(value.enteramt) / Number(taxvalue));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(purchaseDiscAftIn)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Exclusive") {
                        if(value.purchasetax == "None"){
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Math.abs(Number(value.enteramt) - Number(inputValue));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                               let diffval = inputValue;
           
                               return { ...value, [productInputName]: inputValue, differenceamt: Number(diffval)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Math.abs(Number(value.enteramt) * (Number(inputValue) / 100));
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                               let differenceValue = Math.abs(Number(value.enteramt) + Number(disamt));
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }
                        else{
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseIn =Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrDisc = (Number(netCostBefrDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftdisc = (Number(netCostAftDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            // let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);

                            // let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftDisc)?.toFixed(2),netcostbeforediscount:Number(netCostBefrDisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Math.abs(Number(value.enteramt) - Number(inputValue));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                let diffval = inputValue;
            
                                return { ...value, [productInputName]: inputValue, differenceamt: Number(diffval)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Math.abs(Number(value.enteramt) * (Number(inputValue) / 100));
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Math.abs(Number(value.enteramt) - Number(disamt));
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                let netatxamt = Number(unittaxamt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces);
                                

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                }
                else if (reference == "Free") {
                    let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                    let resquantity = Number(inputValue) * Number(res1);
                    
                    return { ...value, [productInputName]: inputValue, freeitemtotalpieces:inputValue };
                }
                else if(reference == "Free Unit"){
                   
                    let res1 = Number(unitsubquantity) * Number(unituantityvalue)
                    let resquantity = Number(value.quantity) * Number(res1) 

                    return { ...value, [productInputName]: inputValue, freeitemtotalpieces:resquantity,freeitemunitstatus:false, freeitemnitpiece:unituantityvalue,freeitemsubunitpieces:unitsubquantity, };
                
                }
                else if (reference == "Margin data") {
                   //selling price exclusive purchase price exclusive unit cost
                   let sellingvaluemargin = (Number(value.purchaseexcludetax) * (Number(inputValue) / 100));
                   //sell bef tax
                   let sellingExmargin = Number(value.purchaseexcludetax) + Number(sellingvaluemargin);
                   let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                   let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                   let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                   let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                   //sell aft tax
                   let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                   //sell tax amoount
                   let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

                   return { ...value, [productInputName]: inputValue,sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                }
                return { ...value, [productInputName]: inputValue }
                }
            else {
                return value;
            }
        });
        setAllProductsList(userInputs);
    }

    // Delete Searched Product
    const deleteRow = (i, e) => {
        setAllProductsList(allProductsList.filter((v, item) => item !== i));
    }

    return (
        <Box sx={userStyle.container} style={{ minHeight: '300px', }}>
        <Grid container style={{ justifyContent: "center", padding: '10px' }} sx={userStyle.textInput} >
            <Grid md={8} sx={12} xs={12}>
                <Grid sx={{ display: 'flex' }} >
                    <Grid sx={userStyle.spanIconTax}>< FaSearch /></Grid>
                    <FormControl size="small" fullWidth >
                        <Selects
                            styles={colourStyles}
                            placeholder="Enter Product Name / SKU "
                            options={productsList}
                            onChange={(e) => {
                                gethsncode(e)
                            }}
                        />
                    </FormControl>
                    <Grid sx={userStyle.spanIcons}>
                        <Purchaseproductadd setFetchsaveproduct={setFetchsaveproduct} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        <br />
        <TableContainer component={Paper} sx={userStyle.tablecontainer}>
            <Table aria-label="customized table">
                <TableHead >
                    <StyledTableRow>
                        <TableCell sx={userStyle.tableHead1}>Purchase Tax</TableCell>
                        <TableCell sx={userStyle.tableHead1}>Rate/Quantity</TableCell>
                        <TableCell sx={userStyle.tableHead1}>Discount Unit Cost</TableCell>
                        <TableCell sx={userStyle.tableHead1}>Unit Tax</TableCell>
                        <TableCell sx={userStyle.tableHead1}>Purchase Rate</TableCell>
                        <TableCell sx={userStyle.tableHead1}>Purchase Cost</TableCell>
                        <TableCell sx={userStyle.tableHead1}>SalePrice Cost(Unit)</TableCell>
                        <TableCell sx={userStyle.tableHead1}><DeleteOutlineOutlinedIcon style={{ fontSize: 'large' }} /></TableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {allProductsList.length > 0 &&
                        allProductsList.map((data, i) => {
                            return (
                                <>
                                    <StyledTableRow key={i} >
                                        <TableCell colSpan={4} sx={{ padding: '5px' }}>
                                            <Grid container spacing={1}>
                                                <Grid item md={12} sx={{ marginTop: '-67px' }}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Product Name</Typography>
                                                    <FormControl fullWidth>
                                                        <TextField size='small' value={data?.prodname} />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={2.5}>
                                                    <Grid container spacing={1} sx={{ marginTop: '34px' }}>
                                                        <Grid item md={12}>
                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Purchase Tax</Typography>
                                                            <FormControl size="small" fullWidth>
                                                                <Select
                                                                    value={data?.purchasetabletax}
                                                                    onChange={(e) => productUserInput(i, "purchasetabletax", e.target.value, "purchasetablechange")}
                                                                    MenuProps={{
                                                                        PaperProps: {
                                                                            style: {
                                                                                maxHeight: 200
                                                                            },
                                                                        },
                                                                    }}
                                                                    fullWidth
                                                                >
                                                                    <MenuItem value="None" >None</MenuItem>
                                                                    <MenuItem value="Exclusive" >Exclusive</MenuItem>
                                                                    <MenuItem value="Inclusive" >Inclusive</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item md={12}>
                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Tax Slab</Typography>
                                                            <FormControl size="small" fullWidth>
                                                                <Select
                                                                    MenuProps={{
                                                                        PaperProps: {
                                                                            style: {
                                                                                maxHeight: 200
                                                                            },
                                                                        },
                                                                    }}
                                                                    value={data?.purchasetax}
                                                                >
                                                                    <MenuItem value="None" onClick={(e) => handleChangeTax(i, "None", 0, [])}>None</MenuItem>
                                                                    {taxrates && (
                                                                        taxrates.map((row, index) => (
                                                                            <MenuItem value={row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate} key={index} onClick={(e) => handleChangeTax(i, row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate, row.taxrate, row.subtax)}>{row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate}</MenuItem>
                                                                        ))
                                                                    )}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item md={4}>
                                                    <Grid container spacing={1}>
                                                        <Grid item md={12}>
                                                            <Grid container>
                                                                <Grid item md={12}>
                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Enter Rate</Typography>
                                                                    <FormControl size="small" fullWidth>
                                                                        <TextField size='small'
                                                                            sx={userStyle.input}
                                                                            type='number'
                                                                            value={data?.enteramt}
                                                                            onChange={(e) => {
                                                                                productUserInput(i, "enteramt", e.target.value, "Enteramt");
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid item md={4}>
                                                                    
                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Qty</Typography>
                                                                    <FormControl size="small" fullWidth>
                                                                        <TextField size='small'
                                                                            sx={userStyle.input}
                                                                            type='number'
                                                                            value={data?.quantity}
                                                                            onChange={(e) => {
                                                                                productUserInput(i, "quantity", e.target.value, "Quantity");
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid item md={8}>
                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit</Typography>
                                                                    <FormControl size="small" fullWidth>
                                                                        <Select
                                                                            // value={data?.quantityunit}
                                                                            value={data?.quantityunit}
                                                                            MenuProps={{
                                                                                PaperProps: {
                                                                                    style: {
                                                                                        maxHeight: 200
                                                                                    },
                                                                                },
                                                                            }}
                                                                            fullWidth
                                                                        >
                                                                            {allUnits && (
                                                                                allUnits.map((row, index) => (
                                                                                    <MenuItem value={row.unit} key={index} onClick={(e) => handleChangeUnit(i, row.unit)}>{row.unit}</MenuItem>
                                                                                ))
                                                                            )}
                                                                        </Select>
                                                                    </FormControl>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item md={12}>
                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Total Pcs.</Typography>
                                                            <FormControl size="small" fullWidth>
                                                                <TextField size='small'
                                                                    value={data?.quantitytotalpieces}
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item md={12}>
                                                            <Grid container>
                                                                <Grid item md={4}>
                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Free</Typography>
                                                                    <FormControl size="small" fullWidth>
                                                                        <TextField size='small'
                                                                            style={{
                                                                                '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                    width: '150px !important'
                                                                                }
                                                                            }}
                                                                            sx={userStyle.input}
                                                                            type='number'
                                                                            value={data?.freeitem}
                                                                            onChange={(e) => {
                                                                                productUserInput(i, "freeitem", e.target.value, "Free");
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid item md={8}>
                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit</Typography>
                                                                    <FormControl size="small" fullWidth>
                                                                        <Select
                                                                            value={data?.freeitemunit}
                                                                            MenuProps={{
                                                                                PaperProps: {
                                                                                    style: {
                                                                                        maxHeight: 200
                                                                                    },
                                                                                },
                                                                            }}
                                                                            fullWidth
                                                                            sx={{
                                                                                '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                    width: '150px !important'
                                                                                }
                                                                            }}
                                                                        >
                                                                            {allUnits && (
                                                                                allUnits.map((row, index) => (
                                                                                    <MenuItem value={row.unit} key={index} onClick={(e) => handleChangeFreeUnit(i, row.unit)}>{row.unit}</MenuItem>
                                                                                ))
                                                                            )}
                                                                        </Select>
                                                                    </FormControl>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item md={3.5}>
                                                    <Grid container spacing={1} sx={{ marginTop: '34px' }}>
                                                        <Grid item md={12}>
                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Discount type</Typography>
                                                            <FormControl size="small" fullWidth>
                                                                <Select
                                                                    value={data?.distypemod}
                                                                    onChange={(e) => productUserInput(i, "distypemod", e.target.value, "Discountmode")}
                                                                >
                                                                    <MenuItem value="None">None</MenuItem>
                                                                    <MenuItem value="Fixed">Fixed</MenuItem>
                                                                    <MenuItem value="Amount" >Amount</MenuItem>
                                                                    <MenuItem value="Percentage">Percentage</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item md={12}>
                                                            <Grid container>
                                                                <Grid item md={6} >
                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Disc.Val</Typography>
                                                                    <FormControl size="small" fullWidth>
                                                                        <TextField size='small'
                                                                            type="number"
                                                                            sx={userStyle.input}
                                                                            value={data?.disvaluemod}
                                                                            onChange={(e) => productUserInput(i, "disvaluemod", e.target.value, "Discountvalue")}
                                                                        />
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid item md={6}>
                                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Disc.Amt</Typography>
                                                                    <FormControl size="small" fullWidth>
                                                                        <TextField size='small'
                                                                            type="text"
                                                                            value={data?.differenceamt}
                                                                        />
                                                                    </FormControl>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item md={12}>
                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Cost (After Discount)</Typography>
                                                            <OutlinedInput
                                                                size="small"
                                                                id="component-outlined"
                                                                value={data?.netcostafterdiscount}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item md={2}>
                                                    <Grid container spacing={1}>
                                                        <Grid item md={12}>
                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Exc Tax</Typography>
                                                            <OutlinedInput size='small'
                                                                type="text"
                                                                value={data?.purchaseexcludetax}
                                                            />
                                                        </Grid>
                                                        <Grid item md={12}>
                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Alphaarate</Typography>
                                                            <OutlinedInput size='small'
                                                                type="text"
                                                                value={data?.excalpha}
                                                            />
                                                        </Grid>
                                                        <Grid item md={12}>
                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Inc Tax</Typography>
                                                            <OutlinedInput size='small'
                                                                type="text"
                                                                value={data?.pruchaseincludetax}
                                                            />
                                                        </Grid>
                                                        <Grid item md={12}>
                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Alphaarate</Typography>
                                                            <OutlinedInput size='small'
                                                                type="text"
                                                                value={data?.incalpha}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: '175px', padding: '5px' }}>
                                            <Grid container spacing={1}>
                                                <Grid item md={12}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>SKU</Typography>
                                                    <OutlinedInput size='small'
                                                        value={data?.sku}
                                                        sx={{
                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                width: '80px'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={12}>
                                                    <InputLabel sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit Cost <br />(Before Discount)</InputLabel>
                                                    <OutlinedInput
                                                        size="small"
                                                        id="component-outlined"
                                                        value={data?.unitcostbeforediscount}
                                                        sx={{
                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                width: '80px'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={12}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Cost <br /> (Before Discount)</Typography>
                                                    <OutlinedInput
                                                        size="small"
                                                        id="component-outlined"
                                                        value={data?.netcostbeforediscount}
                                                        sx={{
                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                width: '80px'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={12}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit Cost <br />(After Discount)</Typography>
                                                    <OutlinedInput
                                                        size="small"
                                                        id="component-outlined"
                                                        value={data?.unitcostafterdiscount}
                                                        sx={{
                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                width: '80px'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={12}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Cost <br />(After Discount)</Typography>
                                                    <OutlinedInput
                                                        size="small"
                                                        id="component-outlined"
                                                        value={data?.netcostafterdiscount}
                                                        sx={{
                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                width: '80px'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: '175px', padding: '5px' }}>
                                            <Grid container spacing={1}>
                                                {data?.hsn ?
                                                    (
                                                        <>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Product Tax</Typography>
                                                                <OutlinedInput size='small'
                                                                    value={data?.hsn}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Product Tax</Typography>
                                                                <OutlinedInput size='small'
                                                                    value={data?.applicabletax}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </>
                                                    )
                                                }

                                                <Grid item md={12}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit  <br /> (Tax Amount)</Typography>
                                                    <OutlinedInput
                                                        size="small"
                                                        id="component-outlined"
                                                        value={data?.unitcosttaxamount}
                                                        sx={{
                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                width: '80px'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={12}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Tax <br />(Tax Amount)</Typography>
                                                    <OutlinedInput
                                                        size="small"
                                                        id="component-outlined"
                                                        value={data?.netcosttaxamount}
                                                        sx={{
                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                width: '80px'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={12}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit Cost <br /> (With Tax)</Typography>
                                                    <OutlinedInput
                                                        size="small"
                                                        id="component-outlined"
                                                        value={data?.unitcostwithtax}
                                                        sx={{
                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                width: '80px'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={12}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Cost <br />(With Tax)</Typography>
                                                    <OutlinedInput
                                                        size="small"
                                                        id="component-outlined"
                                                        value={data?.netcostwithtax}
                                                        sx={{
                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                width: '80px'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: '175px', padding: '5px' }}>
                                            <Grid container spacing={1}>
                                                <Grid item md={12} sx={{ marginTop: '-45px' }}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Margin%</Typography>
                                                    <OutlinedInput size='small'
                                                        sx={{
                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                width: '80px !important'
                                                            },
                                                            '& input[type=number]': {
                                                                'MozAppearance': 'textfield' //#8b5cf6
                                                            },
                                                            '& input[type=number]::-webkit-outer-spin-button': {
                                                                'WebkitAppearance': 'none',
                                                                margin: 0
                                                            },
                                                            '& input[type=number]::-webkit-inner-spin-button': {
                                                                'WebkitAppearance': 'none',
                                                                margin: 0
                                                            }
                                                        }}
                                                        type='number'
                                                        value={data?.margin}
                                                        onChange={(e) => {
                                                            productUserInput(i, "margin", e.target.value, "Margin data")
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={12}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Sale Unit Cost <br />(Without Tax)</Typography>
                                                    <OutlinedInput
                                                        size="small"
                                                        id="component-outlined"
                                                        value={data?.sellingpriceunitwithoutcost}
                                                        sx={{
                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                width: '80px'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={12}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Sale Tax Type</Typography>
                                                    <OutlinedInput
                                                        size="small"
                                                        id="component-outlined"
                                                        value={data?.sellingpricetax}
                                                        sx={{
                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                width: '80px'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={12}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Sale Tax Amount</Typography>
                                                    <OutlinedInput
                                                        size="small"
                                                        id="component-outlined"
                                                        value={data?.saletaxamount}
                                                        sx={{
                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                width: '80px'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                
                                                <Grid item md={12}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Sale Unit Cost <br />(With Tax)</Typography>
                                                    <OutlinedInput
                                                        size="small"
                                                        id="component-outlined"
                                                        value={data?.sellingpriceunitcost}
                                                        sx={{
                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                width: '80px'
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </TableCell>
                                        <TableCell>
                                            <AiOutlineClose style={{ color: 'red', fontWeight: '900', cursor: 'pointer', fontSize: 'large' }} onClick={(e) => deleteRow(i, e)} />
                                        </TableCell>
                                    </StyledTableRow>
                                </>
                            );
                        })}
                </TableBody>
            </Table>
        </TableContainer><br />
        <Grid container>
            <Grid item xs={6} sm={6} md={8} lg={8}>
            </Grid>
            <Grid item xs={6} sm={6} md={4} lg={4}>
                <Typography variant="subtitle1"><b>Total items:</b>{totalitem}</Typography>
                <Typography variant="subtitle1"
                    value={purchaseAdd.nettotal}
                    onChange={(e) => { setPurchaseAdd({ ...purchaseAdd, nettotal: Number(totalvalue)?.toFixed(2) }) }}
                ><b> Net Total Amount:</b> ₹ {Number(totalvalue)?.toFixed(2)}</Typography>
            </Grid>
        </Grid>

         {/* Alert Modal */}
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
    </Box>
    );
}

export default Purchasetable;