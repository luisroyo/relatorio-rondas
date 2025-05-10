function gerarRelatorio(texto, residencial, dataStr, escalaStr) {
    const linhas = texto.split('\n');
    const eventos = [];

    const regexes = [
        { tipo: 'inicio', regex: /(?:in[ií]cio|inicio).*?(\d{1,2}:\d{2})/i },
        { tipo: 'termino', regex: /(?:t[ée]rmino|termino|final).*?(\d{1,2}:\d{2})/i },
        { tipo: 'inicio', regex: /vtr.*?(\d{1,2}:\d{2}).*?in[ií]cio/i },
        { tipo: 'termino', regex: /vtr.*?(\d{1,2}:\d{2}).*?t[ée]rmino/i },
        { tipo: 'inicio', regex: /^(\d{1,2}:\d{2}).*?in[ií]cio/i },
        { tipo: 'termino', regex: /^(\d{1,2}:\d{2}).*?t[ée]rmino/i }
    ];

    // Identificar os eventos de início e término nas linhas
    for (const linha of linhas) {
        for (const r of regexes) {
            const match = linha.match(r.regex);
            if (match) {
                eventos.push({ tipo: r.tipo, hora: match[1].padStart(5, '0') });
                break;
            }
        }
    }

    let rondas = [];
    let inicioPendente = null;
    const alertas = [];

    // Organizar os eventos de início e término
    for (const evento of eventos) {
        if (evento.tipo === 'inicio') {
            if (inicioPendente) {
                alertas.push(`⚠️ Início de ronda às ${inicioPendente} sem término correspondente.`);
            }
            inicioPendente = evento.hora;
        } else if (evento.tipo === 'termino' && inicioPendente) {
            rondas.push({ inicio: inicioPendente, termino: evento.hora });
            inicioPendente = null;
        }
    }

    // Caso ainda haja um início pendente no final
    if (inicioPendente) {
        alertas.push(`⚠️ Início de ronda às ${inicioPendente} sem término correspondente.`);
    }

    // Preparar o relatório
    const relatorioLinhas = rondas.map(r => `\tInício: ${r.inicio} – Término: ${r.termino}`).join('\n');
    const totalRondas = rondas.length;
    const dataPlantao = dataStr.split('/').slice(0, 3).join('/');

    // Ajustar a escala
    const escala = escalaStr === '06-18' ? '06h às 18h' : '18h às 06h';

    // Retornar o relatório final
    return `Plantão ${dataPlantao} (${escala})\n\nCondomínio: ${residencial}\n\n${relatorioLinhas}\n\n✅ Total: ${totalRondas} rondas no plantão\n\n${alertas.join('\n')}`;
}

module.exports = { gerarRelatorio };
