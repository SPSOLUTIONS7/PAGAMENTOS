const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Adicione isso
require('dotenv').config(); // Recomendado para proteger suas chaves

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 1. ROTA PARA CRIAR A COBRANÇA (O site vai chamar aqui)
app.post("/criar-pix", async (req, res) => {
    try {
        const { amount } = req.body;
        
        // Aqui vai a lógica para chamar o banco/gateway de pagamento
        // Exemplo de resposta de sucesso:
        res.status(200).json({ 
            msg: "Pix gerado com sucesso!", 
            valor: amount 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao gerar o Pix" });
    }
});
// 2. ROTA DE WEBHOOK (Já estava no seu código)
app.post("/webhook/pix", express.raw({ type: "application/json" }), (req, res) => {
    // Lógica de validação de assinatura aqui...
    console.log("Pagamento confirmado recebido via Webhook!");
    res.json({ ok: true });
});
const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
});
