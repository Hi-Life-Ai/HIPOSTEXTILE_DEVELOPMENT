import { Box, Grid, Typography,TableCell, TableRow,Button,Paper, TableContainer, Table, TableHead, TableBody } from '@mui/material';
import React, { useState, useEffect, useRef, useContext } from 'react';
import Footer from '../../../components/footer/Footer';
import { userStyle } from '../../PageStyle';
import axios from 'axios';
import { ExportXL, ExportCSV } from '../../Export';
import { useReactToPrint } from "react-to-print";
import autoTable from 'jspdf-autotable';
import jsPDF from "jspdf";
import { FaPrint, FaFilePdf, } from 'react-icons/fa';
import { SERVICE } from '../../../services/Baseservice';
import { toast } from 'react-toastify';
import { useParams,Link } from 'react-router-dom';
import { AuthContext } from '../../../context/Appcontext';

function Folderviewlist() {

    //  Access
    const { auth, setngs } = useContext(AuthContext);

    const [password, setPassword] = useState([]);
    const [folders, setFolders] = useState();
    const [exceldata, setExceldata] = useState([]);

    const id = useParams().id;

    let emtarray = [];

    // Fetch single folder
    const fetchAllFolder = async () => {
        try {
            let req = await axios.get(`${SERVICE.FOLDER_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            let result = req?.data?.sfolder?.passwordnames?.map((a => emtarray.push(a)))

            setFolders(req?.data?.sfolder?.foldername);

        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }
    useEffect(
        () => {
            fetchAllFolder();
        }, [folders]
    )

    // fetch Password
    const fetchAllPassword = async () => {
        try {
            let res = await axios.post(SERVICE.PASSWORD, {
                headers: {
                  'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid:String(setngs.businessid)
              });

            let ans = res.data.passwords.filter((a, i) => {

                if (emtarray.includes(a.name)) {
                    return a
                }
                else {
                    return false
                }
            })
            setPassword(ans);

        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }

    // Excel
    const fileName = 'View Passwords'
    // get particular columns for export excel

    const getexcelDatas = async () => {
        var data = password?.map(t => ({
        'Name': t.name,
        'UserName': t.username,
        'Password': t.password,
        'TOTP Key': t.totpkey,
        'Current TOTP Key': t.curtotpkey,
        'Url': t.url,
        }));
        setExceldata(data);
    }

    useEffect(() => {
        getexcelDatas();
    }, [password])

    //  Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'VIEW PASSWORDS',
        pageStyle: 'print'
    });

    //  PDF
    const downloadPdf = () => {
        const doc = new jsPDF()
        autoTable(doc, { html: '#passwordtable' })
        doc.save('View Passwords.pdf')
    }

    useEffect(
        () => {
            fetchAllPassword();
        }, []
    )

    return (
        <Box sx={{ justifyContent: "center" }}>
            {/* header text */}
            <Typography sx={userStyle.HeaderText} style={{ textAlign: "center", margin: "20px" }}>{folders}</Typography>
            {/* content start */}
            <Box sx={userStyle.container}>
            <Grid container sx={userStyle.gridcontainer}>
                <Grid >
                    <ExportCSV fileName={fileName} csvData={exceldata} />
                    <ExportXL fileName={fileName} csvData={exceldata} />
                    <Button sx={userStyle.buttongrp} onClick={handleprint} >&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                    <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()} ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                </Grid>
            </Grid><br />
                <Box>
                    {/* Password Grid Start */}
                    <Grid containersx={{ direction: "flex", flexDirection: "column", justifyContent: "center" }} ref={componentRef}>
                        {password.length > 0 && (
                            password.map((row, index) => (
                                <><Grid item key={index} sx={{ boxShadow: 'inset -2px 0 10px #1976d2', borderRadius: "20px", padding: "20px 0 0 50px" }}>
                                    <Typography sx={{ color: "#002e5c", fontSize: "20px", letterSpacing: "1px", marginBottom: "10px", fontWeight: "bold" }}>{index + 1 + ". "}{" " + row.name}</Typography>
                                    <Typography sx={userStyle.folderviewstyle} ><b style={{ color: "gray", }}>Username : </b>{row.username}</Typography>
                                    <Typography sx={userStyle.folderviewstyle} ><b style={{ color: "gray", }}>Password : </b>{row.password}</Typography>
                                    {row.totpkey ? <Typography sx={userStyle.folderviewstyle} ><b style={{ color: "gray", }}>Totp Key : </b>{row.totpkey}</Typography> : null}
                                    {row.curtotpkey ? <Typography sx={userStyle.folderviewstyle} ><b style={{ color: "gray", }}>Current Totp Key : </b>{row.curtotpkey}</Typography> : null}
                                    {row.url ? <Typography sx={userStyle.folderviewstyle} ><b style={{ color: "gray", }}>URL : </b>{row.url}</Typography> : null}
                                    <br /></Grid><br />
                                </>
                            ))
                        )}
                    </Grid>
                    {/* Password Grid End */}
                </Box>
                <Grid container sx={userStyle.gridcontainer}>
                    <Grid >
                        <Link to="/passwords/folder/list"><Button sx={userStyle.buttoncancel} >CANCEL</Button></Link>
                    </Grid>
                </Grid>
            </Box>

            {/* print layout */}
            <Box sx={userStyle.printcls}>
                <TableContainer component={Paper} >
                    <Table aria-label="customized table" id="passwordtable">
                        <TableHead>
                            <TableRow>
                                <TableCell> Name</TableCell>
                                <TableCell> User Name</TableCell>
                                <TableCell> Password </TableCell>
                                <TableCell> Totp Key </TableCell>
                                <TableCell> Current Totp Key</TableCell>
                                <TableCell> URL</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {password && (
                                password.map((row, index) => (
                                    <TableRow key={index}>
                                         <TableCell>{ row.name}</TableCell>
                                        <TableCell>{row.username}</TableCell>
                                        <TableCell>{row.password}</TableCell>
                                        <TableCell>{row.totpkey}</TableCell>
                                        <TableCell>{row.curtotpkey}</TableCell>
                                        <TableCell>{row.url}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
       </Box>
    );
}

const Folderview = () => {
    return (
        <>
            <Folderviewlist /><br /><br /><br />
                <Footer /><br /><br />
        </>
    )
}

export default Folderview;