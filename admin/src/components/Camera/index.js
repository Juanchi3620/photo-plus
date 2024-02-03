import React, { useRef, useState, useEffect } from 'react';
import { Grid, BaseHeaderLayout, Layout, Box, Button, ContentLayout, Flex, GridItem } from '@strapi/design-system';
import { Download, PicturePlus } from '@strapi/icons';

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
   
  const downloadPicture = () => {
    const link = document.createElement('a');
    link.download = 'download.png';
    link.href = capturedImage;
    link.click();
  }

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Capturar el fotograma actual del video en el canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Obtener la URL de la imagen
    const imageUrl = canvas.toDataURL('image/png');

    // Actualizar el estado con la URL de la imagen capturada
    setCapturedImage(imageUrl);
  };

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = videoRef.current;

      if (video) {
        video.srcObject = stream;
      }
    } catch (error) {
      console.error('Error al obtener acceso a la cámara:', error);
    }
  };

  // Inicializar la cámara cuando el componente se monta
    useEffect(() => {
    initCamera();
    return () => {
      // Detener la cámara cuando el componente se desmonta
      const video = videoRef.current;
      if (video) {
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Layout>
      <BaseHeaderLayout 
      title="Camera Capture"
      subtitle="Capture a picture from your camera"
      as="h2"
      />
      <ContentLayout>
        <Grid gap={2}>
          <GridItem col={1} background="primary100">
            <Box>
              <video  ref={videoRef} width="400" height="300" autoPlay muted></video>
              <Flex centered justifyContent="center" alignItems="center" height="100%">
                <Button onClick={handleCapture} startIcon={<PicturePlus />}>Take picture</Button>
              </Flex>
              
              <canvas ref={canvasRef} width="400" height="300" style={{ display: 'none' }}></canvas>
            </Box>
          </GridItem>

          
          {/* Mostrar la imagen capturada */}
          {capturedImage && (
          <GridItem col={1} background="primary100">
            <Box>
              <img src={capturedImage} alt="Captured" />
              <Flex centered justifyContent="center" alignItems="center" height="100%">
                <Button onClick={downloadPicture} startIcon={<Download />}>Download</Button>
              </Flex>
            </Box>
          </GridItem>
          )}

          
        </Grid>
          
      </ContentLayout>
    </Layout>
  );
};

export default CameraCapture;