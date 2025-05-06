const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// CORS – permite apenas o seu frontend no Render
app.use(cors({
    origin: 'https://relatorio-rondas.onrender.com',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

// Serve arquivos estáticos (como index.html) da raiz
app.use(express.static(__dirname));

// Rota principal – carrega o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Função que gera o relatório
function gerarRelatorio(texto, residencial, dataStr) {
    const linhas = texto.split('\n');
    const rondas = [];
    const eventos = [];

    for (const linha of linhas) {
        if (linha.toLowerCase().includes('início de ronda')) {
            const match = linha.match(/(\d{2}:\s?\d{2}).*?in[ií]cio/i);
            if (match && match[1]) {
                const horaFormatada = match[1].replace(/\s/, '');
                eventos.push({ tipo: 'inicio', hora: horaFormatada });
            }
        } else if (linha.toLowerCase().includes('término') || linha.toLowerCase().includes('termino')) {
            const match = linha.match(/(\d{2}:\s?\d{2}).*?t[ée]rmino/i);
            if (match && match[1]) {
                const horaFormatada = match[1].replace(/\s/, '');
                eventos.push({ tipo: 'termino', hora: horaFormatada });
            }
        }
    }

    let inicioPendente = null;
    for (const evento of eventos) {
        if (evento.tipo === 'inicio') {
            inicioPendente = evento.hora;
        } else if (evento.tipo === 'termino' && inicioPendente) {
            rondas.push({ inicio: inicioPendente, termino: evento.hora });
            inicioPendente = null;
        }
    }

    const relatorioLinhas = rondas.map(ronda => `\tInício: ${ronda.inicio} – Término: ${ronda.termino}`);
    const total = rondas.length;
    const dataPlantao = dataStr.split('/').slice(0, 3).join('/');
    const relatorioFinal = `Plantão ${dataPlantao} (18h às 06h)\n\n📍 Condomínio: ${residencial}\n\n${relatorioLinhas.join('\n')}\n\n✅ Total: ${total} rondas no plantão`;
    return relatorioFinal;
}

// Endpoint da API
app.post('/gerar_relatorio', (req, res) => {
    const { texto, residencial, data } = req.body;

    if (!texto || !residencial || !data) {
        return res.status(400).json({ erro: 'Por favor, forneça "texto", "residencial" e "data".' });
    }

    const relatorio = gerarRelatorio(texto, residencial, data);
    res.json({ relatorio });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
