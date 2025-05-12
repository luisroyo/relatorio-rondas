const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { gerarRelatorio } = require("./gerarRelatorio");

const app = express();
const port = process.env.PORT || 3000;

// Configuração de middlewares
app.use(cors()); // Permitir CORS
app.use(bodyParser.json()); // Parseia o corpo das requisições para JSON

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "..", "public")));

// Rota POST para gerar o relatório
app.post("/gerar_relatorio", (req, res) => {
  const { texto, residencial, data, escala } = req.body;

  // Validação dos campos obrigatórios
  if (!texto || !residencial || !data || !escala) {
    return res
      .status(400)
      .json({ erro: "Texto, residencial, data e escala são obrigatórios." });
  }

  // Verificar se a data está no formato correto (ex: 06/05/2025)
  const dataRegex = /^(0[1-9]|1[0-9]|2[0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (!dataRegex.test(data)) {
    return res
      .status(400)
      .json({ erro: "Data no formato inválido. Use DD/MM/AAAA." });
  }

  try {
    // Gerar o relatório
    const relatorio = gerarRelatorio(texto, residencial, data, escala);
    res.json({ relatorio }); // Retorna o relatório em formato JSON
  } catch (err) {
    // Caso algum erro ocorra ao gerar o relatório
    console.error("Erro ao gerar relatório:", err);
    res.status(500).json({ erro: "Erro ao gerar relatório." });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
