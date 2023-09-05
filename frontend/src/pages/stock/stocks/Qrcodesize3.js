import React, {useState,useEffect} from 'react';
import {Grid,Box,Typography} from '@mui/material';
import QRCode from 'qrcode';

function Qrcodegenerate({getProductData, productLabel, id}) { 

  const [imageUrl, setImageUrl] = useState('');

  useEffect(()=> {
    generateQrCode();
  },[])

  const generateQrCode = async () => {
    try {
          const response = await QRCode.toDataURL(`${getProductData.stockid}`);
          setImageUrl(response);
    }catch (error) {
      console.log(error);
    }
  }
    
  let bnname = getProductData.businessname.slice(0, 15);
  let catspace = getProductData.category.replace(/[^a-zA-Z0-9]/g, '');
  let subcatspace = getProductData.subcategory.replace(/[^a-zA-Z0-9]/g, '');
  let catslice = catspace.slice(0, 6);
  let subcatslice = subcatspace.slice(0, 6);
  let category = catslice == "ALL" ? "**" : catslice;
  let subcategory = subcatslice == "ALL" ? "**" : subcatslice;
  let rescat = category + '/' + subcategory;
  let suppspace = getProductData.suppliershortname.replace(/[^a-zA-Z0-9]/g, '');
  let suppslice = suppspace.slice(0, 4);
  let catslicesup = catspace.slice(0, 4);
  let subcatslicesup = subcatspace.slice(0, 4);
  let categorys = catslicesup == "ALL" ? "**" : catslicesup;
  let subcategorys = subcatslicesup == "ALL" ? "**" : subcatslicesup;
  let rescatsubsup = suppslice + '/' + categorys + '/' + subcategorys;
  let brand =  getProductData.brand == "ALL" ? "**" : getProductData.brand;
  let size = getProductData.size == "ALL" ? "***" : getProductData.size;
  let subbrand = getProductData.subbrand == "ALL" ? "***" : getProductData.subbrand;
  let sizespace = size.replace(/[^a-zA-Z0-9]/g, '');
  let subbrandspace = subbrand.replace(/[^a-zA-Z0-9]/g, '');
  let brandspace = brand.replace(/[^a-zA-Z0-9]/g, '');
  let sizecatslice = sizespace.slice(0, 3);
  let brandslice = brandspace.slice(0, 4);
  let subbrandslice = subbrandspace.slice(0, 4);
  let ressizebrandsub = sizecatslice + '/' + brandslice + '/'+subbrandslice;
  let sizecatslicesup = sizespace.slice(0, 3);
  let brandslicesup = brandspace.slice(0, 6);
  let ressize = sizecatslicesup + '/' + brandslicesup;
  let skuid = getProductData?.rack?.length == 2 ? getProductData.sku.slice(-4) : getProductData?.rack?.length == 3 ? getProductData.sku.slice(-3) : getProductData?.rack?.length == 4 ? getProductData.sku.slice(-2) : getProductData?.rack?.length == 5 ? getProductData.sku.slice(-2) : getProductData?.rack?.length == 6 ? getProductData.sku.slice(-2) : getProductData?.rack?.length == 7 ? getProductData.sku.slice(-2) : getProductData?.rack?.length == 8 ? getProductData.sku.slice(-2) : getProductData?.rack?.length == 9 ? getProductData.sku.slice(-2) : getProductData?.rack?.length == 10 ? getProductData.sku.slice(-2):getProductData.sku;
  let respricedatastring = Number(getProductData?.sellingprice)?.toFixed(0);
  let respricedatasplit = getProductData?.sellingprice?.split('.');
  let respricesuffix = respricedatasplit[1] == undefined ? ".00" : '.'+respricedatasplit[1];
  let respricedata = String(respricedatastring)?.length;
  let resnodata = String(getProductData?.snno)?.length;
  let rackspace = getProductData.rack.replace(/[^a-zA-Z0-9]/g, '');
  let rackdata = rackspace.slice(0, 4);
  let rackslice = rackdata == "ALL" ? "**" : rackdata;

  return (
    <>
      {/* label size 25mm*20mm */}
      <Box sx={{ margin:0,position : "relative", padding:0, overflow:'hidden'}}>
        <Grid xs={12} md={12} lg={12} sx={12}>
          {productLabel.isProductLocation ? <p className="BusinessLocation" style={{fontSize:'16px',color:"black" ,fontWeight:1200,textAlign:'center'}}><b>{bnname}</b></p> : <p className="BusinessLocation" style={{fontSize:'13px',color:"black" ,fontWeight:1200,textAlign:'center', visibility:'hidden'}}><b>{bnname}</b></p>}
        </Grid>
      <Grid container>
            <Grid xs={2} md={2} lg={2} sm={2} sx={{textAlign:'center'}}>
           {productLabel.isProductNumberAlpha ? <p style = {{marginTop:'15px',fontSize:resnodata == 2 ? '14px': resnodata == 3 ? '12px' : resnodata == 4 ? '11px' : resnodata == 5 ? '10px' : '15px',marginLeft:'-14px',fontWeight:1200,transform:'rotate(-90deg)',color:'black',position:'absolute',textAlign:'center',textTransform:'uppercase'}}><b>{getProductData.snno + "#" + getProductData.alpharate}</b></p> : <p style = {{marginTop:'15px',fontSize:resnodata == 2 ? '14px': resnodata == 3 ? '13px' : resnodata == 4 ? '12px' : resnodata == 5 ? '11px' : '15px',marginLeft:'-14px',fontWeight:1200,transform:'rotate(-90deg)',color:'black',position:'absolute',textAlign:'center',textTransform:'uppercase', visibility:'hidden'}}><b>{getProductData.snno + "#" + getProductData.alpharate}</b></p>} 

            </Grid>
            <Grid xs={1} md={1} lg={1} sm={1} sx={{textAlign:'center'}}>
            <Typography>{productLabel.isProductCode ? <p style = {{fontSize:'13px',marginTop:'45px',marginLeft:'-2px', transform:'rotate(-90deg)',fontWeight:'bolder',textAlign:'center',color:'black',textTransform:'uppercase'}}><b>{rackslice + '/' + skuid }</b></p> : <p style = {{fontSize:'13px',marginTop:'45px',marginLeft:'-2px', transform:'rotate(-90deg)',fontWeight:'bolder',textAlign:'center',color:'black',textTransform:'uppercase', visibility:'hidden'}}><b>{rackslice + '/' + skuid }</b></p>}</Typography>

            </Grid>
              <Grid xs={8} md={8} lg={8} sm={8} sx={{textAlign:'center'}}>
              <Typography> {productLabel.isProductSizeBrand ? <p className="Alpharate" style={{fontSize:'14px',left:'2px', marginTop:'-4px',position:'relative', textAlign:'center',fontWeight:'bold', color:'black'}}><b>{ressize}</b></p> : <p className="Alpharate" style={{fontSize:'14px',left:'2px', marginTop:'-4px',position:'relative', textAlign:'center',fontWeight:'bold', color:'black'}}><b>{ressizebrandsub}</b></p>}</Typography>
              <Grid container>
              <Grid xs={7} md={7} lg={7} sm={7} sx={{textAlign:'center'}}>
               <Typography> {productLabel.isProductSellingPrice ? <p className="productSellingPrice" style={{fontSize:respricedata == 2 ? '31px' : respricedata == 3 ? '20px' : respricedata == 4 ? '19px': respricedata == 5 ? '15px': respricedata == 6 ? '13px': respricedata == 7 ? '12px' : respricedata == 8 ? '18px' : '23px',color:'black', fontWeight:1200,textAlign:'center', transformOrigin:'top', transform: respricedata == 3 ? 'scaleY(2)' : respricedata == 4 ? 'scaleY(2.5)' : respricedata == 5 ? 'scaleY(2.5)' : respricedata == 6 ? 'scaleY(3)' : respricedata == 7 ? 'scaleY(3.5)' : 'none', marginTop: respricedata == 3 ? '-9px' : respricedata == 4 ? '-10px' : respricedata == 5 ? '-12px' : respricedata == 6 ? '-13px' : respricedata == 7 ? '-13px' : '0'}}><b>{'₹' + respricedatastring}<sub style={{fontSize:'8px', transform:'none', transformOrigin:'none'}}>{respricesuffix}</sub></b></p> : <p className="productSellingPrice" style={{fontSize:respricedata == 4 ? '22px': respricedata == 5 ? '18px': respricedata == 6 ? '20px': respricedata == 7 ? '19px' : respricedata == 8 ? '18px' : '23px',color:'black', fontWeight:1200,textAlign:'center', visibility:'hidden'}}><b>{'₹' + respricedatastring}<sub style={{fontSize:'8px', transform:'none', transformOrigin:'none'}}>{respricesuffix}</sub></b></p>} </Typography>
               {/* <Typography>  {productLabel.isProductDiscPrice && <p className="ProductDiscoutPrice" style={{fontSize:'17px', color:'black',fontWeight:'bolder', textAlign:'center'}}><b>{'₹ ' + getProductData.}  </Typography> */}
              </Grid>
              <Grid xs={4} md={4} lg={4} sm={4} >
                <Box sx={{marginLeft:'4px'}}>
                  {imageUrl ? (
                    <a href={imageUrl} download >
                        <img src={imageUrl} alt="img" width={50} height={50} style={{marginTop:'-8px'}} />
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