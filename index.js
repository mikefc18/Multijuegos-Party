// index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();  // Esto carga las variables de entorno desde un archivo .env

// Crea la aplicación Express
const app = express();

// Configura el puerto dinámicamente usando la variable de entorno PORT (proporcionada por Render)
const PORT = process.env.PORT || 5000;  // Usa el puerto de la variable de entorno si está disponible, si no usa 5000

// Recupera la API Key de Gemini desde las variables de entorno
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Habilita CORS para que el servidor pueda manejar solicitudes de otros dominios
app.use(cors());

// Configura Express para que pueda leer el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Ruta POST para generar contenido basado en el prompt recibido
app.post('/generate', async (req, res) => {
    const { prompt } = req.body;  // Desestructura el prompt de la solicitud

    // Si no se proporciona un prompt, devuelve un error 400
    if (!prompt) {
        return res.status(400).json({ error: 'Se requiere un prompt' });
    }

    try {
        // Realiza la solicitud a la API de Gemini para obtener las palabras relacionadas
        const response = await axios.post(GEMINI_URL, {
            contents: [{
                role: "user",
                parts: [{ text: `Dame 20 palabras relacionadas con '${prompt}'. Vuelve solo la lista separada por comas, sin texto adicional.` }]
            }]
        }, {
            headers: { 'Content-Type': 'application/json' }  // Configura los headers para que la solicitud sea correcta
        });

        // Extrae las palabras de la respuesta de la API
        const data = response.data;
        const words = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";  // Si no hay palabras, devuelve un string vacío

        // Devuelve las palabras como respuesta al cliente
        res.json({ words });
    } catch (error) {
        console.error("Error al solicitar palabras:", error.response?.data || error.message);
        // Si ocurre un error, responde con un error 500
        res.status(500).json({ error: 'Error al generar palabras' });
    }
});

// El servidor se pone a escuchar en el puerto configurado
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
