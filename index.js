// index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Se requiere un prompt' });
    }

    try {
        const response = await axios.post(GEMINI_URL, {
            contents: [{
                role: "user",
                parts: [{ text: `Dame 20 palabras relacionadas con '${prompt}'. Vuelve solo la lista separada por comas, sin texto adicional.` }]
            }]
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        const data = response.data;
        const words = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        res.json({ words });
    } catch (error) {
        console.error("Error al solicitar palabras:", error.response?.data || error.message);
        res.status(500).json({ error: 'Error al generar palabras' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

