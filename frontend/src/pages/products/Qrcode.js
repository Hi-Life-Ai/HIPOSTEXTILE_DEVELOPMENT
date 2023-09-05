import React, {useState,useEffect, useContext} from 'react';
import {Grid, Box,Typography} from '@mui/material';
import { AuthContext } from '../../context/Appcontext';
import QRCode from 'qrcode';


function Qrcodegenerate({getProductData, productLabel}) { 

  const [imageUrl, setImageUrl] = useState('');
  const { setngs } = useContext(AuthContext);

  useEffect(()=> {
    generateQrCode();
  },[])

  const generateQrCode = async () => {
    try {
          const response = await QRCode.toDataURL(`${getProductData.sku}`);
          setImageUrl(response);
    }catch (error) {
      console.log(error);
    }
  }
  let bnname = getProductData.businessname.slice(0, 15);
  return (
    <>
      <Box sx={{ margin:0,position : "relative", padding:0, overflow:'hidden'}}>
      <Grid xs={12} md={12} lg={12} sx={12}>
        {productLabel.isProductLocation && <p className="BusinessLocation" style={{fontSize:'13px',color:"black" ,fontWeight:'bolder',textAlign:'center'}}><b>{bnname}</b></p>}

          </Grid>
   
      <Grid container>
            <Grid xs={1} md={1} lg={1} sm={1} sx={{textAlign:'center'}}>
            <Typography>{productLabel.isProductCode && <p style = {{fontSize:'10px',marginTop:'49px', transform:'rotate(-90deg)',fontWeight:"bold",textAlign:'center',color:'black',textTransform:'uppercase'}}>{getProductData.rack + '/' + getProductData.sku}</p>}</Typography>

            </Grid>
              <Grid xs={8} md={8} lg={8} sm={8} sx={{textAlign:'center'}}>
                <Typography>{productLabel.isProductCategorySubcategory && <p style={{fontSize:'11px',fontWeight:'bolder',color:'black'}}><b style={{textTransform:'uppercase'}}>{getProductData.category + '/' + getProductData.subcategory}</b></p> }</Typography>
              <Typography> {productLabel.isProductSizeBrand &&<p className="Alpharate" style={{fontSize:'11px', textAlign:'center',fontWeight:'bolder', color:'black'}}><b>{getProductData.size + '/' + getProductData.brand}</b></p>}</Typography>
              <Grid container>
              <Grid xs={8} md={8} lg={8} sm={8} sx={{textAlign:'center'}}>
               <Typography> {productLabel.isProductSellingPrice && <p className="productSellingPrice" style={{fontSize:'17px', color:'black', fontWeight:'bolder',textAlign:'center'}}><b>{ '₹ ' + getProductData.sellingexcludetax}</b></p>} </Typography>
               {/* <Typography>  {productLabel.isProductDiscPrice && <p className="ProductDiscoutPrice" style={{fontSize:'17px', color:'black',fontWeight:'bolder', textAlign:'center'}}><b>{'₹ ' +getProductData.pruchaseincludetax}</b></p>}  </Typography> */}
              </Grid>
              <Grid xs={3} md={3} lg={3} sm={3} >
                <Box>
                  {imageUrl ? (
                    <a href={imageUrl} download >
                        <img src={imageUrl} alt="img" width={50} height={50} style={{marginTop:'-5px'}}/>
                    </a>) : null
                  }
                  </Box>
                </Grid>
              </Grid>
            </Grid>
      </Grid>
    </Box>
      
    </>
    
  );
}


export default Qrcodegenerate;