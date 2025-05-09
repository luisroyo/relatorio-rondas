const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const gerarRelatorio = require('./gerarRelatorio');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '../public')));

// Rota principal do relatório
app.post('/gerar_relatorio', (req, res) => {
    const { texto, residencial, data, escala } = req.body;

    if (!texto || !residencial || !data || !escala) {
        return res.status(400).json({ erro: 'Texto, residencial, data e escala são obrigatórios.' });
    }

    try {
        const relatorio = gerarRelatorio(texto, residencial, data, escala);
        res.json({ relatorio });
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao gerar relatório.' });
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
