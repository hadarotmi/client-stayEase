import react, { useState } from 'react';
import axios from 'axios';
import HotTubIcon from '@mui/icons-material/HotTub'//ז'קוזי
import AccessibleIcon from '@mui/icons-material/Accessible';//נכה
import PoolIcon from '@mui/icons-material/Pool';//בריכה
import LocalParkingIcon from '@mui/icons-material/LocalParking';//חניה
import GridOnIcon from '@mui/icons-material/GridOn';//סורגים
import ElevatorIcon from '@mui/icons-material/Elevator';//מעלית
import AcUnitIcon from '@mui/icons-material/AcUnit';//מזגן
import { Box, Button, Checkbox, CircularProgress, Container, Typography } from '@mui/material';
import { apiKey, apiSecret, cloudName } from '../../config/secret';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const UploadComponent = (props) => {
  const { register, getValues, handleSubmit, formState: { errors } } = useForm();
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false)
  const adData = useSelector(state => state.adSlice.adData)

  useEffect(() => {
    if (adData.arr_img) {
      setImageUrls(adData.arr_img)

    }

    console.log(imageUrls);
  }, [adData.arr_img])



  const onSub = (data) => {
    data.arr_img = imageUrls
    props.handleNext(data)
    // doApiUpload();
  }

  const handleUpload = async (file) => {
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'StayEase');
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      console.log(response);
      setImageUrls((prevUrls) => [...prevUrls, response.data.url]);
      setLoading(false)
    } catch (error) {
      console.log('Error uploading image:', error);
    }
  };

  const handleFileInputChange = (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      handleUpload(file);
    }
  };
  const handleDelete = async (imageUrl) => {
    setImageUrls((prevUrls) => prevUrls.filter((url) => url !== imageUrl));
    if (imageUrls.length == 1) {
      setLoading(false)
    }
    // const publicId = imageUrl.split('/').pop().split('.')[0];

    // axios
    // .post(`https://api.cloudinary.com/v1_1/${cloudName}/resources/delete`, {
    //   public_ids: [publicId],
    //   api_key: apiKey,
    //   api_secret: apiSecret,
    // })
    // const result = await cloudinary.uploader.destroy(imageUrl.public_id);
  };

  return (
    <Container component={'form'} onSubmit={handleSubmit(onSub)}>
      <div className='m-auto p-2 bg-light center flex-column' style={{ border: "1.5px dotted #0D9488 " }}>
        <Typography gutterBottom variant="h5" component="div">תמונות של המקום שלך...</Typography>
       
        <div className='d-flex flex-wrap justify-content-center'>
          {imageUrls?.map((imageUrl, index) => (
            <div key={index} className='shadow rounded-3 m-2 center py-3'>
              <div className='btn-close d-flex justify-content-start align-self-start bg-success-subtle' onClick={() => handleDelete(imageUrl)}></div>
              <img className='shadow rounded-3 m-2' src={imageUrl} alt={`Image ${index}`} width={200} height={120} />
            </div>))
          }
        </div>
        {!loading ?
          <div>
            <input
              multiple onChange={handleFileInputChange}
              accept="image/*"
              className="d-none"
              id="contained-button-file"

              type="file"
            />
            <label htmlFor="contained-button-file">
              <Button className='btn bg-success-subtle text-black' variant="contained" component="span">
                בחר תמונה
              </Button>
            </label>
          </div>
          : <CircularProgress color='turquoise'/>
          }


      </div>
      <h3 className='mt-3'>מה יש בנכס שלך?</h3>
      <div className='row row-cols-3' >
        <Typography sx={{ margin: 0, color: "#0D9488" }}>
          <Checkbox color='turquoise' {...register("elevator")} defaultChecked={adData != {} ? adData.elevator : false} />
          <ElevatorIcon />מעלית
        </Typography>
        <Typography sx={{ margin: 0, color: "#0D9488" }}>
          <Checkbox color='turquoise' {...register("merger")} defaultChecked={adData != {} ? adData.merger : false} />
          <AcUnitIcon />מזגן
        </Typography>
        <Typography sx={{ margin: 0, color: "#0D9488" }}>
          <Checkbox color='turquoise' {...register("bars")} defaultChecked={adData != {} ? adData.bars : false} />
          <GridOnIcon />סורגים
        </Typography>
        <Typography sx={{ margin: 0, color: "#0D9488" }}>
          <Checkbox color='turquoise' {...register("disabled")} defaultChecked={adData != {} ? adData.disabled : false} />
          <AccessibleIcon />גישה לנכים
        </Typography>
        <Typography sx={{ margin: 0, color: "#0D9488" }}>
          <Checkbox color='turquoise' {...register("pool")} defaultChecked={adData != {} ? adData.pool : false} />
          <PoolIcon />בריכה
        </Typography>
        <Typography sx={{ margin: 0, color: "#0D9488" }}>
          <Checkbox color='turquoise' {...register("jacuzzi")} defaultChecked={adData != {} ? adData.jacuzzi : false} />
          <HotTubIcon />ז'קוזי
        </Typography>
        <Typography sx={{ margin: 0, color: "#0D9488" }}>
          <Checkbox color='turquoise' {...register("parking")} defaultChecked={adData != {} ? adData.parking : false} />
          <LocalParkingIcon />חניה
        </Typography>

      </div>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button color='turquoise' onClick={props.handleBack} sx={{ mt: 3, ml: 1 }}>
          עמוד קודם
        </Button>
        <Button
          disabled={loading}
          type='submit'
          color='turquoise'
          variant="contained"
          sx={{ mt: 3, ml: 1, color: "white" }}
        >
          עמוד הבא
        </Button>
      </Box>
    </Container >
  );
};

export default UploadComponent;
