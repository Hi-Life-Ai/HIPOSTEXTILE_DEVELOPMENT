// import React, {useState,useEffect} from 'react';
// import {Grid, Box,Typography} from '@mui/material';
// import QRCode from 'qrcode';

// function Qrcodegenerate({getProductData, productLabel, id}) { 

//   const [imageUrl, setImageUrl] = useState('');

//   useEffect(()=> {
//     generateQrCode();
//   },[])

//   const generateQrCode = async () => {
//     try {
//           const response = await QRCode.toDataURL(`${getProductData.stockid}`);
//           setImageUrl(response);
//     }catch (error) {
//       console.log(error);
//     }
//   }

//     let bnname = getProductData.businessname.slice(0, 15);
//     let category = getProductData.category == "DEFAULT" ? "**" : getProductData.category;
//     let subcategory = getProductData.subcategory == "DEFAULT" ? "**" : getProductData.subcategory;
//     let catslice = category.slice(0, 6);
//     let subcatslice = subcategory.slice(0, 6);
//     let res = catslice + '/' + subcatslice;
//     let brand =  getProductData.brand == "DEFAULT" ? "**" : getProductData.brand;
//     let size = getProductData.size == "DEFAULT" ? "**" : getProductData.size;
//     let brandslice = brand.slice(0, 6);
//     let sizecatslice = size.slice(0, 6);
//     let ressize = brandslice + '/' + sizecatslice;
//     let skuid = getProductData.rack.length > 3 ? getProductData.sku.slice(-4) : getProductData.sku;

//   return (
//     <>
//     {/* label size 35mm*22mm */}
//       <Box sx={{ margin:0,position : "relative", padding:0, overflow:'hidden'}}>
//       <Grid xs={12} md={12} lg={12} sx={12}>
//         {productLabel.isProductLocation && <p className="BusinessLocation" style={{fontSize:'16px',color:"black" ,fontWeight:1200,textAlign:'center'}}><b>{bnname}</b></p>}
//       </Grid>
//    105mm
//       <Grid container>
//             <Grid xs={2} md={2} lg={2} sm={2} sx={{textAlign:'center'}}>
//            {productLabel.isProductNumberAlpha && <p style = {{marginTop:'10px',fontSize:'14px',fontWeight:1200,transform:'rotate(-90deg)',color:'black',position:'absolute',textAlign:'center',textTransform:'uppercase'}}>{getProductData.no + "#" + getProductData.alpharate} </p>} 

//             </Grid>
//             <Grid xs={1} md={1} lg={1} sm={1} sx={{textAlign:'center'}}>
//             <Typography>{productLabel.isProductCode && <p style = {{fontSize:'9px',marginTop:'45px',marginLeft:'0', transform:'rotate(-90deg)',fontWeight:'bolder',textAlign:'center',color:'black',textTransform:'uppercase'}}>{getProductData.rack == "DEFAULT" ? "**" : getProductData.rack + '/' + skuid }</p>}</Typography>

//             </Grid>
//               <Grid xs={8} md={8} lg={8} sm={8} sx={{textAlign:'center'}}>
//                 <Typography>{productLabel.isProductCategorySubcategory && <p style={{fontSize:'11px',fontWeight:1200,color:'black', marginLeft:'-30px', marginTop:'-3px'}}><b style={{textTransform:'uppercase'}}>{res}</b></p> }</Typography>
//               <Typography> {productLabel.isProductSizeBrand &&<p className="Alpharate" style={{fontSize:'14px',left:'2px', marginLeft: '-30px', marginTop:'-6px',position:'relative', textAlign:'center',fontWeight:1200, color:'black'}}><b>{ressize}</b></p>}</Typography>
//               <Grid container>
//               <Grid xs={7} md={7} lg={7} sm={7} sx={{textAlign:'center'}}>
//                <Typography> {productLabel.isProductSellingPrice && <p className="productSellingPrice" style={{fontSize:'26px',color:'black', fontWeight:1200,textAlign:'center'}}><b>{'₹' + getProductData.sellingprice}</b></p>} </Typography>
//                {/* <Typography>  {productLabel.isProductDiscPrice && <p className="ProductDiscoutPrice" style={{fontSize:'17px', color:'black',fontWeight:'bolder', textAlign:'center'}}><b>{'₹ ' + getProductData.}  </Typography> */}
//               </Grid>
//               <Grid xs={4} md={4} lg={4} sm={4} >
//                 <Box sx={{marginLeft:'10px'}}>
//                   {imageUrl ? (
//                     <a href={imageUrl} download >
//                         <img src={imageUrl} alt="img" width={49} height={49} style={{marginTop:'-5px'}} />
//                     </a>) : null  
//                   }
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Grid>
//       </Grid>
//     </Box>
      
//     </>
    
//   );
// }


// export default Qrcodegenerate;


import React, {useState,useEffect} from 'react';
import {Grid, Box,Typography} from '@mui/material';
import QRCode from 'qrcode';

function Qrcodegenerate({getProductData, productLabel, id}) { 

  const [imageUrl, setImageUrl] = useState('');
  const [isPrice, setIsPrice] = useState(false)

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
    let category = 'YUTVYU TRU RTCUTYRVY';
    let subcategory = 'YUTY CTYRTYRVU VYTTYUTYI';
    let catspace = category.replace(/ /g, '');
    let catslice = catspace.slice(0, 6);
    let subcatspace = subcategory.replace(/ /g, '');
    let subcatslice = subcatspace.slice(0, 6);
    let res = catslice + '/' + subcatslice;
    let brand =  'YTU YTVRTYRVTTY';
    let size = 'VH YTRTRTV';
    let brandspace = brand.replace(/ /g, '')
    let brandslice = brandspace.slice(0, 9);
    let sizespace = size.replace(/ /g, '')
    let sizecatslice = sizespace.slice(0, 3);
    let ressize = sizecatslice + '/' + brandslice;
    let skuid = getProductData.rack.length == 2 ? getProductData.sku.slice(-4) : getProductData.rack.length == 3 ? getProductData.sku.slice(-3) : getProductData.rack.length == 4 ? getProductData.sku.slice(-2) : getProductData.sku;
    let respricedata = getProductData.sellingprice.length;
    let resnodata = getProductData.no.length;
    let rackdata = 'D TRVY RFTYVRUTYFRY';
    let rackspace = rackdata.replace(/ /g, '');
    let rackslice = rackspace.slice(0, 4);

  return (
    <>
    {/* label size 35mm*22mm */}
      <Box sx={{ margin:0,position : "relative", padding:0, overflow:'hidden'}}>
      <Grid xs={12} md={12} lg={12} sx={12}></Grid>
      <Grid xs={12} md={12} lg={12} sx={12}>
        {productLabel.isProductLocation && <p className="BusinessLocation" style={{lineHeight:1.2,fontSize:'17px',color:"black" ,fontWeight:1250,textAlign:'center'}}><b>{bnname}</b></p>}
      </Grid>
   
      <Grid container>
      <Grid xs={0.5} md={0.5} lg={0.5} sm={0.5} ></Grid>
            <Grid xs={1} md={1} lg={1} sm={1} sx={{textAlign:'center', verticalAlign:'middle',lineHeight:1.2,display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
           {productLabel.isProductNumberAlpha && <p style = {{lineHeight:1.2,fontSize:resnodata == 2 ? '17px': resnodata == 3 ? '16px' : resnodata == 4 ? '15px' : resnodata == 5 ? '14px' : '18px',fontWeight:1200,transform:'rotate(-90deg)',color:'black',position:'absolute',textAlign:'center',verticalAlign:'middle',textTransform:'uppercase'}}><b>{getProductData.no + "#" + getProductData.alpharate}</b></p>} 

            </Grid> 
            <Grid xs={1} md={1} lg={1} sm={1} sx={{textAlign:'center',verticalAlign:'middle',lineHeight:1.2,display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
            <Typography>{productLabel.isProductCode && <p style = {{fontSize:'16px',lineHeight:1.2,transform:'rotate(-90deg)',fontWeight:'bolder',textAlign:'center',verticalAlign:'middle',color:'black',textTransform:'uppercase'}}><b>{ rackslice + '/' + skuid }</b></p>}</Typography>

            </Grid>
              <Grid xs={8.5} md={8.5} lg={8.5} sm={8.5} sx={{textAlign:'center',verticalAlign:'middle'}}>
                <Typography>{productLabel.isProductCategorySubcategory && <p style={{lineHeight:1.2,fontSize:'16px',fontWeight:1200,color:'black', verticalAlign:'middle',textAlign:'center'}}><b style={{textTransform:'uppercase',lineHeight:1.2}}>{res}</b></p> }</Typography>
              <Typography> {productLabel.isProductSizeBrand &&<p className="Alpharate" style={{lineHeight:1.2,fontSize:'16px',position:'relative', textAlign:'center',verticalAlign:'middle',fontWeight:1200, color:'black'}}><b>{ressize}</b></p>}</Typography>
              <Grid container>
              <Grid xs={7} md={7} lg={7} sm={7} sx={{textAlign:'center',verticalAlign:'middle'}}>
               <Typography> {productLabel.isProductSellingPrice && <p className="productSellingPrice" style={{lineHeight:1.2,fontSize:respricedata == 4 ? '29px': respricedata == 5 ? '24px': respricedata == 6 ? '23px': respricedata == 7 ? '22px' : respricedata == 8 ? '21px' : '36px',color:'black', fontWeight:1200,textAlign:'center', verticalAlign:'middle'}}><b>{'₹' + getProductData.sellingprice}</b></p>} </Typography>
               {/* <Typography>  {productLabel.isProductDiscPrice && <p className="ProductDiscoutPrice" style={{fontSize:'17px', color:'black',fontWeight:'bolder', textAlign:'center'}}><b>{'₹ ' + getProductData.}  </Typography> */}
              </Grid>
              <Grid xs={5} md={5} lg={5} sm={5} >
                <Box sx={{marginLeft:'10px'}}>
                  {imageUrl ? (
                    <a href={imageUrl} download>
                        <img src={imageUrl} alt="img" width={49} height={49} style={{marginTop:'-8px'}} />
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