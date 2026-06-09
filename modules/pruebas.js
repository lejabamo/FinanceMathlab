// modules/pruebas.js
(function() {
    const title = "Pruebas Académicas de Precisión";
    const description = "Módulo de aseguramiento de calidad (QA). Valida automáticamente las fórmulas de interés, tasas, anualidades y ecuaciones de valor contra respuestas teóricas exactas de Matemáticas Financieras I (tolerancia máxima de desviación del 0.01%).";

    function render() {
        return `
            <div class="module-header">
                <h1>${title}</h1>
                <p class="module-description">${description}</p>
            </div>
            
            <div class="card" style="margin-bottom: 32px; padding: 24px; text-align: center;">
                <h2 style="font-family: var(--font-heading); font-size: 1.25rem; margin-bottom: 16px;">Consola de Pruebas Unitarias</h2>
                <div style="display: flex; gap: 16px; justify-content: center;">
                    <button class="btn btn-primary" id="btn-run-tests" style="width: auto; padding: 12px 30px;">
                        <i data-lucide="play-circle"></i> Ejecutar Banco de Pruebas
                    </button>
                </div>
            </div>

            <!-- Reporte de QA -->
            <div class="card" id="qa-report-card" style="display: none; margin-bottom: 32px;">
                <h2 class="card-title">
                    <i data-lucide="award"></i>
                    Reporte Final de Verificación
                </h2>
                
                <div class="results-display" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); display: grid; gap: 16px; margin-bottom: 24px;">
                    <div class="result-card" style="padding: 16px;">
                        <span class="result-lbl">Total Pruebas</span>
                        <div class="result-val" id="qa-res-total" style="font-size: 2rem;">0</div>
                    </div>
                    <div class="result-card" style="padding: 16px;">
                        <span class="result-lbl">Aprobadas</span>
                        <div class="result-val" id="qa-res-aprob" style="color: var(--accent); font-size: 2rem;">0</div>
                    </div>
                    <div class="result-card" style="padding: 16px;">
                        <span class="result-lbl">Fallidas</span>
                        <div class="result-val" id="qa-res-fail" style="color: #ef4444; font-size: 2rem;">0</div>
                    </div>
                    <div class="result-card" style="padding: 16px;">
                        <span class="result-lbl">Precisión Matemática</span>
                        <div class="result-val" id="qa-res-prec" style="color: var(--primary); font-size: 2rem;">0%</div>
                    </div>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre de la Prueba</th>
                                <th>Datos de Entrada</th>
                                <th>Resultado Obtenido / Detalle</th>
                                <th style="width: 120px; text-align: center;">Estado</th>
                            </tr>
                        </thead>
                        <tbody id="qa-table-body">
                            <!-- Filas de resultados de pruebas -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function init() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        const btnRun = document.getElementById('btn-run-tests');
        const reportCard = document.getElementById('qa-report-card');
        const resTotal = document.getElementById('qa-res-total');
        const resAprob = document.getElementById('qa-res-aprob');
        const resFail = document.getElementById('qa-res-fail');
        const resPrec = document.getElementById('qa-res-prec');
        const tableBody = document.getElementById('qa-table-body');

        btnRun.addEventListener('click', () => {
            if (!window.AcademicQA) {
                alert("Error: El motor de pruebas unitarias (tests.js) no se ha cargado.");
                return;
            }

            // Ejecutar suite de pruebas
            const report = window.AcademicQA.ejecutarSuiteDePruebas();

            // Rellenar tarjetas
            resTotal.textContent = report.total;
            resAprob.textContent = report.aprobadas;
            resFail.textContent = report.fallidas;
            resPrec.textContent = `${report.precision.toFixed(2)}%`;

            // Rellenar tabla
            let rowsHTML = '';
            report.resultados.forEach(r => {
                rowsHTML += `
                    <tr>
                        <td><strong>${r.nombre}</strong></td>
                        <td><code style="font-size: 0.8rem; background-color: var(--bg-app); padding: 4px; border-radius: 4px;">${r.inputs || '{}'}</code></td>
                        <td><span style="font-size: 0.85rem; color: var(--text-secondary);">${r.detalle}</span></td>
                        <td style="text-align: center;">
                            <span class="badge" style="background-color: ${r.exito ? 'var(--accent-light)' : 'rgba(239, 68, 68, 0.1)'}; color: ${r.exito ? 'var(--accent)' : '#ef4444'};">
                                ${r.exito ? '✅ APROBADO' : '❌ FALLÓ'}
                            </span>
                        </td>
                    </tr>
                `;
            });
            tableBody.innerHTML = rowsHTML;

            // Mostrar reporte
            reportCard.style.display = 'block';

            if (window.lucide) {
                window.lucide.createIcons();
            }
        });
    }

    // Registrar globalmente
    window.FinanceModules.pruebas = {
        title,
        description,
        render,
        init
    };
})();
