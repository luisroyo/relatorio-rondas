async function gerarRelatorio() {
    const texto = document.getElementById('textoRondas').value;
    const residencial = document.getElementById('nomeResidencial').value;
    const data = document.getElementById('dataRelatorio').value;
    const escala = document.getElementById('escala').value;
    const resultadoDiv = document.getElementById('resultado');

    resultadoDiv.textContent = 'Gerando relatório...';

    try {
        const response = await fetch('/gerar_relatorio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ texto, residencial, data, escala })
        });

        if (!response.ok) {
            const error = await response.json();
            resultadoDiv.textContent = `Erro ao gerar relatório: ${error.erro || response.statusText}`;
            return;
        }

        const dataResposta = await response.json();
        resultadoDiv.textContent = dataResposta.relatorio;

    } catch (error) {
        resultadoDiv.textContent = `Erro na comunicação com o servidor: ${error.message}`;
    }
}
