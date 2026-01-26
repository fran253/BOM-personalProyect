import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Configurar cliente S3
const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

// Convierte Blob a ArrayBuffer para AWS SDK
const blobToArrayBuffer = (blob: Blob): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
};

// Sube una imagen a S3
export const uploadImageToS3 = async (file: File | Blob, folder: string = 'images'): Promise<string> => {
  try {
    const timestamp = Date.now();
    const fileName = file instanceof File 
      ? `${folder}/${timestamp}-${file.name.replace(/\s/g, '-')}`
      : `${folder}/${timestamp}-image.jpg`;
    
    // Convertir Blob a ArrayBuffer
    const arrayBuffer = await blobToArrayBuffer(file);
    const uint8Array = new Uint8Array(arrayBuffer);
    
    const command = new PutObjectCommand({
      Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
      Key: fileName,
      Body: uint8Array,
      ContentType: file.type || 'image/jpeg',
    });

    await s3Client.send(command);

    const imageUrl = `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${fileName}`;
    
    return imageUrl;
  } catch (error) {
    console.error('Error subiendo imagen a S3:', error);
    throw new Error('Error al subir la imagen');
  }
};

// Comprime una imagen antes de subirla
export const compressImage = async (
  file: File, 
  maxWidth: number = 1920, 
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo obtener contexto del canvas'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Error al comprimir imagen'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Error al cargar imagen'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Error al leer archivo'));
    reader.readAsDataURL(file);
  });
};