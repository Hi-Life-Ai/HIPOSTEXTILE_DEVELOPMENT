import React, { useState, useContext, useEffect } from 'react';
import { Box, OutlinedInput, DialogTitle, FormControl, FormControlLabel, Checkbox, Button, Grid, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { userStyle } from '../../PageStyle';
import FolderIcon from '@mui/icons-material/Folder';
import { toast } from "react-toastify";
import { SERVICE } from "../../../services/Baseservice"
import axios from "axios";
import { AuthContext } from '../../../context/Appcontext';

function Passwordcreatefolder({ setFetchFolderName }) {

    const { auth, setngs } = useContext(AuthContext);

    const [folderList, setFolderList] = useState({
        foldername: "", status: ""
    });
    const [send, setSend] = useState(false);
    const [isFolder, setIsFolder] = useState([]);
    const [showAlert, setShowAlert] = useState()

    //  Add folder name popup
    const openAlert = () => {
        setSend(true)
    }
    const closeAlert = () => {
        setSend(false)
        setFolderList("")
    }

    const fetchHandler = async () => {
        try {
            let res = await axios.post(SERVICE.FOLDER,{
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid:String(setngs.businessid)
              })
          let foldername = res.data.folders.map((data,index)=>{
            return data.foldername
          })
          setIsFolder(foldername);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
      };
    
      useEffect(() => {
        fetchHandler();
      }, []);

    // Folder data add to database
    const sendFolder = async () => {
        try {
            let req = await axios.post(SERVICE.FOLDER_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                foldername: String(folderList.foldername),
                status: String(folderList?.status == true ? "Activate" : "Deactivate"),
                assignbusinessid: String(setngs.businessid),
            });
            setFetchFolderName("None")
            toast.success(req.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            await closeAlert();
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (folderList.foldername == "") {
            setShowAlert("Please enter folder name!");
        }else if(isFolder.includes(folderList.foldername)){
            setShowAlert("Folder name already exits!");
        }
        else {
            sendFolder();
        }
    }

    return (

        <Box>
            <Button sx={userStyle.buttonadd} onClick={openAlert}  >ADD</Button>
            <Dialog open={send} onClose={closeAlert}>
                <form>
                    <DialogTitle sx={{ backgroundColor: '#e0e0e0', color: "#000", display: "flex" }}>
                        <FolderIcon />&nbsp;
                        <Typography sx={{ marginTop: "1px", fontWeight: 700 }}>Create New Folder</Typography>
                    </DialogTitle>
                    <DialogContent sx={{ width: '600px', textAlign: 'center', alignItems: 'center', padding: '20px' }}>
                        <p style={{color:'red'}}>{showAlert}</p>
                        <Box>
                            <Grid container spacing={3} sx={{ marginTop: '2px' }}>
                                <Grid item md={6} lg={6}>
                                    <Typography sx={{ textAlign: 'left' }} >Folder Name <b style={{ color: "red" }}>*</b></Typography>
                                    <FormControl size="small" fullWidth>
                                        <OutlinedInput
                                            sx={[userStyle.alertOutline, userStyle.input]}
                                            id="component-outlined"
                                            type="text"
                                            value={folderList.foldername}
                                            onChange={(e) => setFolderList({ ...folderList, foldername: e.target.value })}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} lg={6} sx={{ marginTop: "23px" }}>
                                    <FormControlLabel control={<Checkbox checked={folderList.status} onChange={(e) => setFolderList({ ...folderList, status: !folderList.status })} />} label="Status" />
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', float: "right" }}>
                        <Button variant="contained" color="success" onClick={handleSubmit} sx={userStyle.buttonadd} >Save</Button>
                        <Button variant="contained" color="success" onClick={closeAlert} sx={userStyle.buttoncancel} >Close</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}


export default Passwordcreatefolder;