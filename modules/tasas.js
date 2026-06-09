// modules/tasas.js
(function() {
    const title = "Equivalencia de Tasas";
    const description = "Módulo interactivo para convertir tasas de interés nominales y efectivas de distintas periodicidades, visualizando el principio de equivalencia financiera.";

    // Definir los metadatos de las modalidades de tasa disponibles
    const tasasMeta = {
        'EA': { nombre: 'Efectiva Anual (EA)', m: 1, tipo: 'efectiva' },
        'nominal': { nombre: 'Nominal Anual (C. Anual)', m: 1, tipo: 'nominal' },
        'semestral': { nombre: 'Efectiva Semestral', m: 2, tipo: 'efectiva' },
        'trimestral': { nombre: 'Efectiva Trimestral', m: 4, tipo: 'efectiva' },
        'mensual': { nombre: 'Efectiva Mensual', m: 12, tipo: 'efectiva' },
        'nominal_mes': { nombre: 'Nominal Mes Vencido', m: 12, tipo: 'nominal' },
        'nominal_tri': { nombre: 'Nominal Trimestre Vencido', m: 4, tipo: 'nominal' },
        'nominal_sem': { nombre: 'Nominal Semestre Vencido', m: 2, tipo: 'nominal' }
    };

    function render() {
        // Generar las opciones del selector de tasas
        const selectOptions = Object.keys(tasasMeta).map(key => {
            return `<option value="${key}">${tasasMeta[key].nombre}</option>`;
        }).join('');

        return `
            <div class="module-header">
                <h1>${title}</h1>
                <p class="module-description">${description}</p>
            </div>
            
            <div class="module-grid">
                <!-- Formulario de Entrada -->
                <div class="card">
                    <h2 class="card-title">
                        <i data-lucide="calculator"></i>
                        Conversión de Tasa
                    </h2>
                    
                    <form id="tasas-calc-form">
                        <div class="form-group">
                            <label for="tasa-valor">Valor de la Tasa (%)</label>
                            <div class="input-wrapper">
                                <i data-lucide="percent" class="input-icon"></i>
                                <input type="number" id="tasa-valor" placeholder="Ej. 36" min="0.0001" step="any" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="tasa-origen-sel">Tipo de Tasa Origen</label>
                            <div class="input-wrapper">
                                <i data-lucide="arrow-right-left" class="input-icon"></i>
                                <select id="tasa-origen-sel">
                                    ${selectOptions}
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="tasa-destino-sel">Tipo de Tasa Destino</label>
                            <div class="input-wrapper">
                                <i data-lucide="refresh-cw" class="input-icon"></i>
                                <select id="tasa-destino-sel">
                                    ${selectOptions}
                                </select>
                            </div>
                        </div>
                        
                        <!-- Alerta de Validación -->
                        <div id="tasas-validation-error" style="display: none; color: #ef4444; margin-bottom: 20px; font-size: 0.85rem; font-weight: 600;">
                            <i data-lucide="alert-circle" style="width: 16px; height: 16px; display: inline; vertical-align: middle;"></i>
                            <span id="tasas-validation-msg">Error de validación</span>
                        </div>

                        <!-- Botonera -->
                        <div class="actions-grid">
                            <button type="submit" class="btn btn-primary" id="tasas-btn-calcular">
                                <i data-lucide="play"></i> Convertir
                            </button>
                            <button type="button" class="btn btn-secondary" id="tasas-btn-limpiar">
                                Limpiar
                            </button>
                            <div style="display: flex; gap: 8px;">
                                <button type="button" class="btn btn-accent" id="tasas-btn-ej1" style="font-size: 0.8rem; padding: 6px;">Ej. 1</button>
                                <button type="button" class="btn btn-accent" id="tasas-btn-ej2" style="font-size: 0.8rem; padding: 6px;">Ej. 2</button>
                                <button type="button" class="btn btn-accent" id="tasas-btn-ej3" style="font-size: 0.8rem; padding: 6px;">Ej. 3</button>
                            </div>
                        </div>
                    </form>
                </div>
                
                <!-- Resultados en Tarjetas -->
                <div class="card" id="tasas-results-card" style="display: none;">
                    <h2 class="card-title">
                        <i data-lucide="trending-up"></i>
                        Resultados de Equivalencia
                    </h2>
                    
                    <div class="results-display" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="result-card" style="grid-column: span 2;">
                            <span class="result-lbl">Tasa Origen</span>
                            <div class="result-val" id="res-tasa-orig" style="font-size: 1.5rem;">0.00%</div>
                        </div>
                        <div class="result-card">
                            <span class="result-lbl">Tasa Periódica Equiv.</span>
                            <div class="result-val" id="res-tasa-per" style="font-size: 1.5rem; color: var(--accent);">0.00%</div>
                        </div>
                        <div class="result-card">
                            <span class="result-lbl">Factor de Capitaliz. (1+i)</span>
                            <div class="result-val" id="res-tasa-factor" style="font-size: 1.35rem;">1.000000</div>
                        </div>
                        <div class="result-card" style="grid-column: span 2;">
                            <span class="result-lbl">Tasa Destino Equivalente</span>
                            <div class="result-val" id="res-tasa-dest" style="color: var(--primary); font-size: 2rem;">0.00%</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Diagrama de Conversión -->
            <div class="card" id="tasas-diag-card" style="margin-top: 32px; display: none;">
                <h2 class="card-title">
                    <i data-lucide="split"></i>
                    Diagrama de Flujo de la Conversión
                </h2>
                
                <div style="display: flex; align-items: center; justify-content: center; gap: 20px; padding: 20px; background-color: var(--bg-app); border-radius: var(--border-radius-md); border: 1px solid var(--border-color);">
                    <div style="text-align: center; padding: 12px; background-color: var(--bg-card); border-radius: var(--border-radius-sm); border: 1px solid var(--border-color); min-width: 140px;">
                        <span style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Origen</span>
                        <div id="diag-origen" style="font-weight: 700; margin-top: 4px; color: var(--text-primary);">--</div>
                    </div>
                    <i data-lucide="arrow-right" style="color: var(--accent);"></i>
                    <div style="text-align: center; padding: 12px; background-color: var(--bg-card); border-radius: var(--border-radius-sm); border: 1px solid var(--border-color); min-width: 140px; border-color: var(--accent);">
                        <span style="font-size: 0.75rem; color: var(--accent); text-transform: uppercase;">Paso Intermedio (TEA)</span>
                        <div id="diag-tea" style="font-weight: 700; margin-top: 4px; color: var(--accent);">--</div>
                    </div>
                    <i data-lucide="arrow-right" style="color: var(--accent);"></i>
                    <div style="text-align: center; padding: 12px; background-color: var(--bg-card); border-radius: var(--border-radius-sm); border: 1px solid var(--border-color); min-width: 140px; border-color: var(--primary);">
                        <span style="font-size: 0.75rem; color: var(--primary); text-transform: uppercase;">Destino</span>
                        <div id="diag-destino" style="font-weight: 700; margin-top: 4px; color: var(--primary);">--</div>
                    </div>
                </div>
            </div>

            <!-- Gráfico de Crecimiento Comparativo (Chart.js) -->
            <div class="card" id="tasas-chart-card" style="margin-top: 32px; display: none;">
                <h2 class="card-title">
                    <i data-lucide="line-chart"></i>
                    Simulación de Equivalencia en el Tiempo
                </h2>
                <div style="position: relative; height: 350px; width: 100%;">
                    <canvas id="tasas-chart"></canvas>
                </div>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 15px; line-height: 1.5; text-align: center;">
                    Esta simulación muestra el crecimiento de una inversión inicial de <strong>$1.000.000 COP</strong> a lo largo de un año. Ambas curvas se superponen y terminan exactamente en el mismo valor final, demostrando que <strong>ambas tasas de interés son financieramente equivalentes</strong>.
                </p>
            </div>

            <!-- Tabla de Crecimiento Mensual -->
            <div class="card" id="tasas-table-card" style="margin-top: 32px; display: none;">
                <h2 class="card-title">
                    <i data-lucide="table"></i>
                    Tabla de Factores Acumulados Mensuales
                </h2>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Mes (t)</th>
                                <th>Factor Acumulado Origen</th>
                                <th>Factor Acumulado Destino</th>
                                <th>Saldo Equivalente ($1.000.000)</th>
                            </tr>
                        </thead>
                        <tbody id="tasas-table-body">
                            <!-- Inyectado dinámicamente -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Fórmulas y Procedimiento Paso a Paso -->
            <div class="card" id="tasas-academic-card" style="margin-top: 32px; display: none;">
                <h2 class="card-title">
                    <i data-lucide="book-open"></i>
                    Fórmulas y Desarrollo Matemático
                </h2>
                
                <div class="formula-card">
                    <h3 style="font-size: 1rem; margin-bottom: 12px;">Fórmulas Empleadas</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                        <div class="formula-box">
                            <span class="math-text" style="font-size: 1.25rem;">TEA = (1 + i)<sup>n</sup> - 1</span>
                            <span class="math-legend">Conversión de periódica efectiva a Efectiva Anual (TEA)</span>
                        </div>
                        <div class="formula-box">
                            <span class="math-text" style="font-size: 1.25rem;">i = (1 + TEA)<sup>(1/n)</sup> - 1</span>
                            <span class="math-legend">Conversión de TEA a periódica efectiva</span>
                        </div>
                        <div class="formula-box">
                            <span class="math-text" style="font-size: 1.25rem;">Nominal = i &times; m</span>
                            <span class="math-legend">Cálculo de tasa nominal dada la periódica</span>
                        </div>
                    </div>
                </div>

                <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 16px;">Desarrollo Matemático Completo</h3>
                <div class="step-list" id="tasas-step-by-step">
                    <!-- Inyectado dinámicamente -->
                </div>
            </div>
        `;
    }

    /**
     * Función solicitada.
     * Convierte cualquier valor de tasa ingresada a su tasa periódica efectiva.
     */
    function convertirATasaPeriodica(valorPercent, m, tipo) {
        const val = valorPercent / 100;
        if (tipo === 'nominal') {
            return val / m;
        } else {
            return val;
        }
    }

    /**
     * Función solicitada.
     * Convierte una tasa periódica efectiva a la modalidad destino deseada.
     */
    function convertirDesdeTasaPeriodica(tasaPeriodica, m, tipo) {
        if (tipo === 'nominal') {
            return tasaPeriodica * m;
        } else {
            return tasaPeriodica;
        }
    }

    /**
     * Función principal. Orquesta la conversión completa entre dos llaves de tasa.
     */
    function convertirTasa(valorPercent, origenKey, destinoKey) {
        const orig = tasasMeta[origenKey];
        const dest = tasasMeta[destinoKey];
        
        // 1. Obtener la tasa periódica efectiva origen
        const iOrig = convertirATasaPeriodica(valorPercent, orig.m, orig.tipo);
        
        // 2. Convertir la tasa periódica origen a TEA (Efectiva Anual)
        const tea = Math.pow(1 + iOrig, orig.m) - 1;
        
        // 3. Convertir la TEA a la tasa periódica efectiva destino
        const iDest = Math.pow(1 + tea, 1 / dest.m) - 1;
        
        // 4. Convertir la tasa periódica destino al valor final
        const valorDest = convertirDesdeTasaPeriodica(iDest, dest.m, dest.tipo) * 100;
        
        return {
            tasaPeriodicaOrigen: iOrig,
            tea: tea,
            tasaPeriodicaDestino: iDest,
            valorDestino: valorDest
        };
    }

    let chartInstance = null;

    function init() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        const form = document.getElementById('tasas-calc-form');
        const inputValor = document.getElementById('tasa-valor');
        const selectOrigen = document.getElementById('tasa-origen-sel');
        const selectDestino = document.getElementById('tasa-destino-sel');
        
        const errorContainer = document.getElementById('tasas-validation-error');
        const validationMsg = document.getElementById('tasas-validation-msg');
        
        const resultsCard = document.getElementById('tasas-results-card');
        const diagCard = document.getElementById('tasas-diag-card');
        const chartCard = document.getElementById('tasas-chart-card');
        const tableCard = document.getElementById('tasas-table-card');
        const academicCard = document.getElementById('tasas-academic-card');
        
        const resTasaOrig = document.getElementById('res-tasa-orig');
        const resTasaPer = document.getElementById('res-tasa-per');
        const resTasaFactor = document.getElementById('res-tasa-factor');
        const resTasaDest = document.getElementById('res-tasa-dest');
        
        const diagOrigen = document.getElementById('diag-origen');
        const diagTea = document.getElementById('diag-tea');
        const diagDestino = document.getElementById('diag-destino');
        
        const tableBody = document.getElementById('tasas-table-body');
        const stepContainer = document.getElementById('tasas-step-by-step');
        
        const btnLimpiar = document.getElementById('tasas-btn-limpiar');
        const btnEj1 = document.getElementById('tasas-btn-ej1');
        const btnEj2 = document.getElementById('tasas-btn-ej2');
        const btnEj3 = document.getElementById('tasas-btn-ej3');

        // Ejemplos
        btnEj1.addEventListener('click', () => {
            inputValor.value = "36";
            selectOrigen.value = "nominal_mes"; // Nominal Mes Vencido
            selectDestino.value = "EA";
            form.dispatchEvent(new Event('submit'));
        });

        btnEj2.addEventListener('click', () => {
            inputValor.value = "24";
            selectOrigen.value = "EA";
            selectDestino.value = "mensual"; // Efectiva Mensual
            form.dispatchEvent(new Event('submit'));
        });

        btnEj3.addEventListener('click', () => {
            inputValor.value = "2.24";
            selectOrigen.value = "mensual";
            selectDestino.value = "EA";
            form.dispatchEvent(new Event('submit'));
        });

        btnLimpiar.addEventListener('click', () => {
            form.reset();
            errorContainer.style.display = 'none';
            resultsCard.style.display = 'none';
            diagCard.style.display = 'none';
            chartCard.style.display = 'none';
            tableCard.style.display = 'none';
            academicCard.style.display = 'none';
            if (chartInstance) {
                chartInstance.destroy();
                chartInstance = null;
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            errorContainer.style.display = 'none';
            
            const valor = parseFloat(inputValor.value);
            const origenKey = selectOrigen.value;
            const destinoKey = selectDestino.value;
            
            // --- VALIDACIONES ---
            if (isNaN(valor) || valor <= 0) {
                showError("La tasa de interés debe ser mayor a cero.");
                return;
            }
            if (origenKey === destinoKey) {
                showError("La tasa origen y la tasa destino no deben ser iguales.");
                return;
            }

            // --- EJECUTAR CONVERSIÓN ---
            const res = convertirTasa(valor, origenKey, destinoKey);
            
            const origMeta = tasasMeta[origenKey];
            const destMeta = tasasMeta[destinoKey];
            
            // --- RENDERIZAR RESULTADOS ---
            resTasaOrig.textContent = `${valor}% ${origMeta.nombre}`;
            resTasaPer.textContent = `${(res.tasaPeriodicaDestino * 100).toLocaleString('es-CO', { minimumFractionDigits: 4, maximumFractionDigits: 6 })}%`;
            resTasaFactor.textContent = (1 + res.tasaPeriodicaDestino).toLocaleString('es-CO', { minimumFractionDigits: 6, maximumFractionDigits: 8 });
            resTasaDest.textContent = `${res.valorDestino.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}% ${destMeta.nombre}`;
            
            diagOrigen.textContent = `${valor}%`;
            diagTea.textContent = `${(res.tea * 100).toFixed(4)}% TEA`;
            diagDestino.textContent = `${res.valorDestino.toFixed(4)}%`;
            
            resultsCard.style.display = 'block';
            diagCard.style.display = 'flex';
            
            // --- SIMULAR DE INVERSIÓN ($1.000.000 COP) ---
            const P = 1000000;
            const dataOrig = [];
            const dataDest = [];
            const labels = [];
            let tableHTML = '';
            
            for (let t = 0; t <= 12; t++) {
                // crecimiento acumulado mensual: factor = (1 + i)^(t * m/12)
                const factorOrig = Math.pow(1 + res.tasaPeriodicaOrigen, t * origMeta.m / 12);
                const factorDest = Math.pow(1 + res.tasaPeriodicaDestino, t * destMeta.m / 12);
                
                const saldoOrig = P * factorOrig;
                const saldoDest = P * factorDest;
                
                labels.push(`Mes ${t}`);
                dataOrig.push(saldoOrig);
                dataDest.push(saldoDest);
                
                tableHTML += `
                    <tr>
                        <td><strong>${t}</strong></td>
                        <td>${factorOrig.toFixed(6)}</td>
                        <td>${factorDest.toFixed(6)}</td>
                        <td><strong>$${saldoDest.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP</strong></td>
                    </tr>
                `;
            }
            
            tableBody.innerHTML = tableHTML;
            tableCard.style.display = 'block';
            
            // --- DIBUJAR GRÁFICO (Chart.js) ---
            chartCard.style.display = 'block';
            drawChart(labels, dataOrig, dataDest);
            
            // --- GENERAR EXPLICACIÓN PASO A PASO ---
            renderStepByStep(valor, origMeta, destMeta, res);
            academicCard.style.display = 'block';
            
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });

        function showError(msg) {
            validationMsg.textContent = msg;
            errorContainer.style.display = 'block';
            resultsCard.style.display = 'none';
            diagCard.style.display = 'none';
            chartCard.style.display = 'none';
            tableCard.style.display = 'none';
            academicCard.style.display = 'none';
        }

        function drawChart(labels, dataOrig, dataDest) {
            const ctx = document.getElementById('tasas-chart').getContext('2d');
            
            if (chartInstance) {
                chartInstance.destroy();
            }
            
            chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Crecimiento Tasa Origen',
                            data: dataOrig,
                            borderColor: '#0f766e',
                            borderWidth: 3,
                            fill: false,
                            tension: 0.1
                        },
                        {
                            label: 'Crecimiento Tasa Destino',
                            data: dataDest,
                            borderColor: '#2563eb',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            fill: false,
                            tension: 0.1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString('es-CO', { maximumFractionDigits: 0 });
                                }
                            }
                        }
                    }
                }
            });
        }

        function renderStepByStep(valor, orig, dest, res) {
            stepContainer.innerHTML = `
                <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h4 class="step-title">Convertir la tasa origen a tasa periódica efectiva</h4>
                        <p class="step-desc">La tasa de entrada <strong>${valor}%</strong> se procesa según su modalidad (<strong>${orig.nombre}</strong>):</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 6px;">
                            ${orig.tipo === 'nominal' ? `i_periodo = ${valor}% / ${orig.m} = ${(res.tasaPeriodicaOrigen*100).toFixed(6)}%` : `i_periodo = ${valor}% (Tasa efectiva periódica directa)`}.
                        </p>
                    </div>
                </div>
                
                <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h4 class="step-title">Calcular el factor de capitalización base (1+i)</h4>
                        <p class="step-desc">Se calcula el factor periódico de adición de intereses:</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 6px;">
                            (1 + i_origen) = (1 + ${res.tasaPeriodicaOrigen.toFixed(8)}) = ${(1 + res.tasaPeriodicaOrigen).toFixed(8)}.
                        </p>
                    </div>
                </div>
                
                <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h4 class="step-title">Aplicar equivalencia financiera (llevar a TEA)</h4>
                        <p class="step-desc">Convertimos la tasa periódica de origen a su equivalente Efectiva Anual (TEA) para tener una base común:</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 6px;">
                            TEA = (1 + i_origen)<sup>m_origen</sup> - 1 = (1 + ${res.tasaPeriodicaOrigen.toFixed(8)})<sup>${orig.m}</sup> - 1 = ${(res.tea * 100).toFixed(6)}% Anual.
                        </p>
                    </div>
                </div>
                
                <div class="step-item">
                    <div class="step-number">4</div>
                    <div class="step-content">
                        <h4 class="step-title">Convertir la TEA a la tasa periódica de destino</h4>
                        <p class="step-desc">Haciendo la operación inversa con la frecuencia de la tasa destino (<strong>m = ${dest.m}</strong>):</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 6px;">
                            i_destino = (1 + TEA)<sup>(1/${dest.m})</sup> - 1 = (1 + ${res.tea.toFixed(8)})<sup>(1/${dest.m})</sup> - 1 = ${(res.tasaPeriodicaDestino * 100).toFixed(6)}% por período.
                        </p>
                    </div>
                </div>

                <div class="step-item">
                    <div class="step-number">5</div>
                    <div class="step-content">
                        <h4 class="step-title">Mostrar la tasa equivalente final</h4>
                        <p class="step-desc">Multiplicamos por la frecuencia en caso de tasa nominal o la dejamos directa para efectiva:</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 6px;">
                            Tasa equivalente final = ${dest.tipo === 'nominal' ? `i_destino &times; ${dest.m} = ${(res.valorDestino).toFixed(4)}% Nominal Anual` : `${(res.valorDestino).toFixed(4)}% Efectiva Periódica`}.
                        </p>
                    </div>
                </div>
            `;
        }
    }

    // Registrar en el objeto global
    window.FinanceModules.tasas = {
        title,
        description,
        render,
        convertirTasa,
        init
    };
})();
