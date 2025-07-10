// app/api/upload/route.ts

import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configura Cloudinary usando las variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Tu cloud name
  api_key: process.env.CLOUDINARY_API_KEY,         // Tu API Key
  api_secret: process.env.CLOUDINARY_API_SECRET,   // Tu API Secret
});

// Desactivar el body parser para poder manejar formData manualmente
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    // Extraemos el formData de la petición
    const formData = await request.formData();
    // Se espera que el campo con el archivo se llame 'file'. (Puedes cambiar el nombre según tu implementación)
    const fileField = formData.get('file');
    
    if (!fileField || !(fileField instanceof File)) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo." }, { status: 400 });
    }
    
    // Convertimos el File en un Buffer para poder enviarlo al stream de Cloudinary.
    const fileBuffer = Buffer.from(await fileField.arrayBuffer());
    
    // Realizamos la subida a Cloudinary utilizando upload_stream
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'tu_carpeta', /* Puedes especificar una carpeta en Cloudinary para organizar los archivos */ },
        (error, result) => {
          if (error) {
            console.error("Error al subir la imagen:", error);
            return reject(error);
          }
          resolve(result);
        }
      );
      uploadStream.end(fileBuffer);
    });
    
    // Retornamos la URL segura de la imagen subida
    return NextResponse.json({ 
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    }, { status: 200 });
    
  } catch (error: any) {
    // Manejo de errores
    console.error("Error en el endpoint de subida:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
