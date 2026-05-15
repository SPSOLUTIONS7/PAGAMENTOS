const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Configurações principais
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rota para a página inicial (ajuda o Railway a confirmar que o app está vivo)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// 1. ROTA PARA CRIAR A COBRANÇA
app.post("/criar-pix", async (req, res) => {
    try {
        const { amount } = req.body;

        const response = await axios.post('https://sxblkhbtycjwzjgmpuij.supabase.co/functions/v1/api-v1-charge', {
            amount: parseFloat(amount),
            external_id: `pedido-${Date.now()}`,
            metadata: { info: "venda_site" }
        }, {
            auth: {
                // Aqui o código busca as chaves que você salvou no painel do Railway
                username: process.env.RESUMOPAY_USERNAME, 
                password: process.env.RESUMOPAY_PASSWORD  
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Erro na API:", error.response?.data || error.message);
        res.status(500).json({ error: "Falha ao gerar PIX" });
    }
});

// 2. ROTA DE WEBHOOK
app.post("/webhook/pix", express.raw({ type: "application/json" }), (req, res) => {
    console.log("Notificação de pagamento recebida!");
    res.json({ ok: true });
});

// Configuração da Porta para o Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando com segurança na porta ${PORT}`);
});
