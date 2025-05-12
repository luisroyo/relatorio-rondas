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

  // Verificar se a data está no formato correto (ex: AAAA-MM-DD)
  const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dataRegex.test(data)) {
    return res
      .status(400)
      .json({ erro: "Data no formato inválido. Use AAAA-MM-DD." });
  }

  try {
    // Formatar a data para DD/MM/AAAA para a função gerarRelatorio
    const dataFormatada = data.split("-").reverse().join("/");

    // Gerar o relatório
    const relatorio = gerarRelatorio(texto, residencial, dataFormatada, escala);
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