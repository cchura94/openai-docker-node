require('dotenv').config();
const express = require("express");
const axios = require("axios")

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // frontend


app.post("/api/preguntar", async function(req, res){

    try {
        const pregunta = req.body.pregunta;
    
        // preguntas y conectar a OPENAI
        const respuestaIA = await obtenerRespuestaIA(pregunta);
    
        res.json({respuesta: respuestaIA});    
        
    } catch (error) {
        console.log(error);
    }

});

app.listen(PORT, function(){
    console.log("Servidor iniciado en: http://127.0.0.1:3000");
});

// OpenAI
async function obtenerRespuestaIA(pregunta){

    const respuesta = await axios.post("https://api.openai.com/v1/chat/completions", {
        "model": "gpt-4.1",
        "messages": [
            {
                "role": "system",
                "content": "Actua como un experto en ventas y responde en no más de 30 palabras y ofrece mis productos (venta de productos electronicos)"
            },
            {
                "role": "user",
                "content": pregunta
            }
        ]
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+process.env.TOKEN_API_KEY
        }
    });

    console.log(respuesta.data.choices[0].message.content);
    return respuesta.data.choices[0].message.content;

}

