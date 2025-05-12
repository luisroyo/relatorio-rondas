async function gerarRelatorio(event) {
  event.preventDefault(); // Impede o envio do formulário para que a página não seja recarregada

  // Pegando os dados dos campos
  const texto = document.getElementById("textoRondas").value;
  const residencial = document.getElementById("nomeResidencial").value;
  const data = document.getElementById("dataRelatorio").value;
  const escala = document.getElementById("escala").value;
  const resultadoDiv = document.getElementById("resultado");

  // Validando campos
  if (!texto || !residencial || !data || !escala) {
    resultadoDiv.textContent = "Por favor, preencha todos os campos!";
    return;
  }

  // Indicando que o relatório está sendo gerado
  resultadoDiv.textContent = "Gerando relatório...";

  try {
    // Enviando a requisição para o servidor
    const response = await fetch("/gerar_relatorio", { // <----- URL ALTERADA PARA RELATIVA
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto, residencial, data, escala }),
    });

    // Verificando a resposta
    if (!response.ok) {
      const error = await response.json();
      resultadoDiv.textContent = `Erro ao gerar relatório: ${
        error.erro || response.statusText
      }`;
      return;
    }

    // Exibindo o relatório gerado
    const dataResposta = await response.json();
    resultadoDiv.textContent = dataResposta.relatorio;
  } catch (error) {
    // Caso haja um erro na comunicação com o servidor
    resultadoDiv.textContent = `Erro na comunicação com o servidor: ${error.message}`;
  }
}