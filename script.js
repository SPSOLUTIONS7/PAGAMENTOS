async function gerarPixAnimado() {
    const valor = document.getElementById('valorInput').value;
    const btn = document.getElementById('btnGerar');
    const pixImg = document.querySelector('#step-2 img'); // Onde está o QR Code
    const pixCopiaCola = document.getElementById('pixCode'); // Onde está o texto

    if (!valor || valor <= 0) {
        alert("Insira um valor válido.");
        return;
    }

    btn.innerText = "PROCESSANDO...";
    btn.disabled = true;

    try {
        // Chama o SEU servidor Node.js
        const response = await fetch('http://localhost:3000/criar-pix', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: valor })
        });

        const data = await response.json();

        if (data.pix) {
            // 1. Atualiza a imagem do QR Code com a API de QR Code usando o código retornado
            pixImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data.pix.copy_paste)}`;
            pixImg.classList.remove('opacity-20', 'grayscale'); // Remove o efeito de "desativado"
            
            // 2. Insere o código "Copia e Cola" no input
            pixCopiaCola.value = data.pix.copy_paste;

            // 3. Muda para a tela do QR Code
            document.getElementById('step-1').classList.add('hidden');
            document.getElementById('step-2').classList.remove('hidden');
        }
    } catch (error) {
        alert("Erro ao conectar com o servidor.");
        console.error(error);
    } finally {
        btn.innerText = "GERAR CÓDIGO PIX";
        btn.disabled = false;
    }
}

function voltar() {
    document.getElementById('step-1').classList.remove('hidden');
    document.getElementById('step-2').classList.add('hidden');
}

function copiarCodigo() {
    const input = document.getElementById('pixCode');
    input.select();
    document.execCommand('copy');
    alert("Código copiado!");
}