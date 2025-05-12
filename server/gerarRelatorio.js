function gerarRelatorio(texto, residencial, dataStr, escalaStr) {
  const linhas = texto.split("\n").map(linha => linha.trimStart());
  const eventosEncontrados = [];

  const regexes = [
    { tipo: "inicio", regex: /(?:in[ií]cio|inicio)\s*de\s*ronda.*?(\d{1,2}\s*:\s*\d{2})/i },
    { tipo: "termino", regex: /(?:t[ée]rmino|termino)\s*de\s*ronda.*?(\d{1,2}\s*:\s*\d{2})/i },
    { tipo: "inicio", regex: /vtr\s*\d+:\s*(\d{1,2}\s*:\s*\d{2}).*?in[ií]cio/i },
    { tipo: "termino", regex: /vtr\s*\d+:\s*(\d{1,2}\s*:\s*\d{2}).*?t[ée]rmino/i },
    { tipo: "inicio", regex: /^(\d{1,2}\s*:\s*\d{2}).*?in[ií]cio/i },
    { tipo: "termino", regex: /^(\d{1,2}\s*:\s*\d{2}).*?t[ée]rmino/i },
  ];

  // Primeira passagem: Encontrar todos os eventos nas linhas
  for (const linha of linhas) {
    for (const r of regexes) {
      const match = linha.match(r.regex);
      if (match) {
        eventosEncontrados.push({ tipo: r.tipo, hora: match[1].replace(/\s/g, "").padStart(5, "0") });
        break; // Importante: parar após a primeira correspondência na linha
      }
    }
  }

  let rondas = [];
  let inicioPendente = null;
  const alertas = [];

  // Segunda passagem: Parear os eventos de início e término
  for (const evento of eventosEncontrados) {
    if (evento.tipo === "inicio") {
      if (inicioPendente) {
        alertas.push(`⚠️ Início de ronda às ${inicioPendente} sem término correspondente.`);
      }
      inicioPendente = evento.hora;
    } else if (evento.tipo === "termino" && inicioPendente) {
      rondas.push({ inicio: inicioPendente, termino: evento.hora });
      inicioPendente = null;
    }
  }

  // Caso ainda haja um início pendente no final
  if (inicioPendente) {
    alertas.push(`⚠️ Início de ronda às ${inicioPendente} sem término correspondente.`);
  }

  // Preparar o relatório com alinhamento
  const relatorioLinhas = rondas
    .map((r) => {
      const inicioFormatado = r.inicio.padEnd(7, " ");
      const terminoFormatado = r.termino.padEnd(7, " ");
      return ` Início: ${inicioFormatado}– Término: ${terminoFormatado}`;
    })
    .join("\n");

  const totalRondas = rondas.length;
  const dataPlantao = dataStr.split("/").slice(0, 3).join("/");
  const escala = escalaStr === "06-18" ? "06h às 18h" : "18h às 06h";

  return `Plantão ${dataPlantao} (${escala})\n📍 Condomínio: ${residencial}\n\n${relatorioLinhas}\n\n✅ Total: ${totalRondas} rondas no plantão}\n\n${alertas.join("\n")}`;
}

module.exports = { gerarRelatorio };