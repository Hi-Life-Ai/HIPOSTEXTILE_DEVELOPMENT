import React, { useState, useEffect } from 'react';
import { Button, Grid, FormControl, Typography, Box, OutlinedInput } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
// import Captchabg from '../assets/images/captcha-bg.jpg';
import Newimage from '../assets/images/newimg.png';

function Captcha() {
  const [user, setUser] = useState({
      username:""
  });
  const [captcha,setCaptcha] = useState("");
  const characters ='abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  useEffect(()=> {
    generateString();
  },[]);
  function generateString() 
  {
    let length = 6;
      let result = '';
      const charactersLength = characters.length;
      for ( let i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
     return setCaptcha(result);
   }
//    const captcha = generateString(8) // Function called here and save in captcha variable
   
   let handleChange = (e) => {
     let name = e.target.name;
     let value = e.target.value;
     user[name] = value;
     setUser(user);
  }

  const onSubmit = e => {
    var element =  document.getElementById("succesBTN");
    var inputData = document.getElementById("inputType");
     element.style.cursor = "wait";
     element.innerHTML  = "Checking...";
     inputData.disabled = true;
     element.disabled = true;
      var myFunctions = function(){
          if(captcha == user.username)
          {
            element.style.backgroundColor   = "green";
            element.innerHTML  = "Verified";
            element.disabled = true;
            element.style.cursor = "not-allowed";
            inputData.style.display = "none";
            
          }
          else
          {
            element.style.backgroundColor   = "red";
            element.style.cursor = "not-allowed";
            element.innerHTML  = "Not Matched";
            element.disabled = true;
            //  element.disabled = true;
            var myFunction = function(){
              element.style.backgroundColor   = "#09aceb";
              element.style.cursor = "pointer";
              element.innerHTML  = "Verify";
              element.disabled = false;
              inputData.disabled = false;
            //   inputData.value ='Enter Captcha';
            };
            setTimeout(myFunction,3000);
          }
        }   
        setTimeout(myFunctions,3000); 
  };
  
   return (
   <>
        <Box>
            <Grid sx={{border: '1px solid #e3dede', backgroundColor: 'white',}}><br />
                <Grid sx={{display:'flex', justifyContent:'center'}}>
                    <Typography variant="contained" id="captcha" sx={{color:'#625f5f', fontSize:'30px',fontWeight:500, backgroundImage: `url(${Newimage})`}}><i>{captcha}</i></Typography>
                    &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;<Button onClick = {()=> generateString()} sx={{backgroundColor:'#f1eded', color:'#9b9ea1', borderRadius:'20px', minWidth:'0px'}}><ReplayIcon /></Button>
                </Grid><br />
                <Grid sx={{display: 'flex', justifyContent: 'center'}}>
                    <FormControl size="small">
                        <OutlinedInput
                            id="inputType"
                            placeholder="Enter Captcha"
                            name="username"  
                            onChange={handleChange} 
                            autocomplete="off"
                            sx={{backgroundColor:'#f7f3f3'}}
                            type="text" />
                    </FormControl>
                    <Button type="button" id="succesBTN" onClick={onSubmit} sx={{backgroundColor:"#09aceb", color:'white',textTransform:'lowercase',minWidth:'0px', '&:hover':{backgroundColor: '#b3b3b9'}}}>Verify</Button>
                </Grid> <br />
            </Grid>
        </Box>
   </>
    );
}
export default Captcha;