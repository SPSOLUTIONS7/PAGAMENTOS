const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Adicione isso
require('dotenv').config(); // Recomendado para proteger suas chaves

const app = express();
app.use(cors());
app.use(express.json());

// 1. ROTA PARA CRIAR A COBRANÇA (O site vai chamar aqui)
app.post("/criar-pix", async (req, res) => {
    try {
        const { amount } = req.body;

        const response = await axios.post('https://sxblkhbtycjwzjgmpuij.supabase.co/functions/v1/api-v1-charge', {
            amount: parseFloat(amount),
            external_id: `pedido-${Date.now()}`, // ID único para o pedido
            metadata: { info: "venda_site" }
        }, {
            auth: {
                username: 'pk_live_764d0cf8703f16705e432406d670fc1c', // Substitua pela sua chave real
                password: 'sk_live_8a6fd83b8480a47e726134542c7c27a1d972d1dbb9602c6b'  // Substitua pela sua chave real
            }
        });

        // Retorna os dados do PIX (QR Code e Copia e Cola) para o site
        res.json(response.data);
    } catch (error) {
        console.error("Erro na API:", error.response?.data || error.message);
        res.status(500).json({ error: "Falha ao gerar PIX" });
    }
});

// 2. ROTA DE WEBHOOK (Já estava no seu código)
app.post("/webhook/pix", express.raw({ type: "application/json" }), (req, res) => {
    // Lógica de validação de assinatura aqui...
    console.log("Pagamento confirmado recebido via Webhook!");
    res.json({ ok: true });
});

// Define a porta dinamicamente (Railway) ou usa a 3000 localmente
const port = process.env.PORT || 3000;

// Inicia o servidor ouvindo em 0.0.0.0 para permitir acesso externo
app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Servidor rodando com sucesso!`);
    console.log(`📍 Porta configurada: ${port}`);
});
