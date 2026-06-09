// modules/compuesto.js
(function() {
    const title = "Interés Compuesto";
    const description = "Módulo interactivo para comprender la capitalización compuesta, el crecimiento exponencial del dinero y comparar sus efectos frente al interés simple.";

    function render() {
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
                        Parámetros de la Capitalización
                    </h2>
                    
                    <form id="comp-calc-form">
                        <div class="form-group">
                            <label for="comp-P">Capital Inicial (VP - COP)</label>
                            <div class="input-wrapper">
                                <i data-lucide="dollar-sign" class="input-icon"></i>
                                <input type="number" id="comp-P" placeholder="Ej. 10000000" min="0.01" step="any" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="comp-i">Tasa de Interés (%)</label>
                            <div class="input-wrapper">
                                <i data-lucide="percent" class="input-icon"></i>
                                <input type="number" id="comp-i" placeholder="Ej. 12" min="0.0001" step="any" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="comp-tipo-tasa">Tipo de Tasa Ingresada</label>
                            <div class="input-wrapper">
                                <i data-lucide="award" class="input-icon"></i>
                                <select id="comp-tipo-tasa">
                                    <option value="EA" selected>Efectiva Anual (EA)</option>
                                    <option value="nominal">Nominal Anual</option>
                                    <option value="mensual">Efectiva Mensual</option>
                                    <option value="trimestral">Efectiva Trimestral</option>
                                    <option value="semestral">Efectiva Semestral</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="comp-n">Plazo (Años)</label>
                            <div class="input-wrapper">
                                <i data-lucide="clock" class="input-icon"></i>
                                <input type="number" id="comp-n" placeholder="Ej. 5" min="1" step="1" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="comp-cap">Frecuencia de Capitalización</label>
                            <div class="input-wrapper">
                                <i data-lucide="refresh-cw" class="input-icon"></i>
                                <select id="comp-cap">
                                    <option value="1" selected>Anual</option>
                                    <option value="2">Semestral</option>
                                    <option value="4">Trimestral</option>
                                    <option value="12">Mensual</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Alerta de Validación -->
                        <div id="comp-validation-error" style="display: none; color: #ef4444; margin-bottom: 20px; font-size: 0.85rem; font-weight: 600;">
                            <i data-lucide="alert-circle" style="width: 16px; height: 16px; display: inline; vertical-align: middle;"></i>
                            <span id="comp-validation-msg">Error de validación</span>
                        </div>

                        <!-- Botonera -->
                        <div class="actions-grid">
                            <button type="submit" class="btn btn-primary" id="comp-btn-calcular">
                                <i data-lucide="play"></i> Calcular
                            </button>
                            <button type="button" class="btn btn-secondary" id="comp-btn-limpiar">
                                Limpiar
                            </button>
                            <button type="button" class="btn btn-accent" id="comp-btn-ejemplo">
                                Ejemplo
                            </button>
                        </div>
                    </form>
                </div>
                
                <!-- Tarjetas de Resultados -->
                <div class="card" id="comp-results-card" style="display: none;">
                    <h2 class="card-title">
                        <i data-lucide="trending-up"></i>
                        Resultados Obtenidos
                    </h2>
                    
                    <div class="results-display" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="result-card">
                            <span class="result-lbl">Capital Inicial</span>
                            <div class="result-val" id="comp-res-vp" style="font-size: 1.5rem;">$0.00</div>
                        </div>
                        <div class="result-card">
                            <span class="result-lbl">Tasa Periódica Equiv.</span>
                            <div class="result-val" id="comp-res-tasa-eq" style="font-size: 1.5rem;">0.00%</div>
                        </div>
                        <div class="result-card">
                            <span class="result-lbl">Número de Períodos (n)</span>
                            <div class="result-val" id="comp-res-n" style="font-size: 1.5rem;">0</div>
                        </div>
                        <div class="result-card">
                            <span class="result-lbl">Interés Generado</span>
                            <div class="result-val" id="comp-res-interes" style="color: var(--accent); font-size: 1.5rem;">$0.00</div>
                        </div>
                        <div class="result-card" style="grid-column: span 2;">
                            <span class="result-lbl">Valor Futuro (VF)</span>
                            <div class="result-val" id="comp-res-vf" style="color: var(--primary); font-size: 2rem;">$0.00</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Gráfico Comparativo de Crecimiento -->
            <div class="card" id="comp-chart-card" style="margin-top: 32px; display: none;">
                <h2 class="card-title">
                    <i data-lucide="line-chart"></i>
                    Crecimiento en el Tiempo: Interés Compuesto vs Simple
                </h2>
                <div style="position: relative; height: 350px; width: 100%;">
                    <canvas id="comp-chart"></canvas>
                </div>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 15px; line-height: 1.5; text-align: center;">
                    La curva superior representa el <strong>Interés Compuesto</strong> (donde los intereses se reinvierten y generan nuevos intereses), evidenciando un crecimiento exponencial. La línea inferior muestra el <strong>Interés Simple</strong> con crecimiento puramente lineal.
                </p>
            </div>

            <!-- Tabla de crecimiento período a período -->
            <div class="card" id="comp-table-card" style="margin-top: 32px; display: none;">
                <h2 class="card-title">
                    <i data-lucide="table-properties"></i>
                    Tabla de Capitalización Período a Período
                </h2>
                <div class="table-container" style="max-height: 300px; overflow-y: auto;">
                    <table>
                        <thead>
                            <tr>
                                <th>Período (t)</th>
                                <th>Capital Inicial</th>
                                <th>Interés del Período</th>
                                <th>Valor Acumulado (VF)</th>
                            </tr>
                        </thead>
                        <tbody id="comp-table-body">
                            <!-- Inyectado dinámicamente -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Explicación Académica -->
            <div class="card" id="comp-academic-card" style="margin-top: 32px; display: none;">
                <h2 class="card-title">
                    <i data-lucide="book-open"></i>
                    Metodología de Cálculo y Fórmulas
                </h2>
                
                <div class="formula-card">
                    <h3 style="font-size: 1rem; margin-bottom: 12px;">Fórmulas del Módulo</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="formula-box">
                            <span class="math-text">VF = VP &times; (1 + i)<sup>n</sup></span>
                            <span class="math-legend"><strong>VF</strong> = Valor Futuro<br><strong>VP</strong> = Valor Presente (Capital Inicial)<br><strong>i</strong> = Tasa de interés periódica efectiva<br><strong>n</strong> = Número total de períodos</span>
                        </div>
                        <div class="formula-box">
                            <span class="math-text">Interés = VF - VP</span>
                            <span class="math-legend"><strong>Interés</strong> = Interés Acumulado total<br><strong>VF</strong> = Valor Futuro calculado<br><strong>VP</strong> = Capital Inicial</span>
                        </div>
                    </div>
                </div>

                <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 16px;">Cálculo Explicado Paso a Paso</h3>
                <div class="step-list" id="comp-step-by-step">
                    <!-- Inyectado dinámicamente -->
                </div>
            </div>
        `;
    }

    /**
     * Función principal requerida.
     * Realiza el cálculo del interés compuesto y devuelve los resultados clave.
     */
    function calcularInteresCompuesto(capital, tasaInteres, tipoTasa, periodosAnio, capFrecuencia) {
        // capFrecuencia es m (1: Anual, 2: Semestral, 4: Trimestral, 12: Mensual)
        const m = parseInt(capFrecuencia);
        const P = parseFloat(capital);
        const rInput = parseFloat(tasaInteres) / 100;
        
        let tea = 0;
        
        // 1. Convertir la tasa ingresada a TEA (Tasa Efectiva Anual)
        if (tipoTasa === 'EA') {
            tea = rInput;
        } else if (tipoTasa === 'nominal') {
            // Tasa nominal j con capitalización m: TEA = (1 + j/m)^m - 1
            // Si no se especifica, asumimos que capitaliza con la frecuencia de la operación (m)
            tea = Math.pow(1 + (rInput / m), m) - 1;
        } else {
            // Tasa periódica efectiva ingresada (mensual, trimestral, semestral)
            let mInput = 1;
            if (tipoTasa === 'mensual') mInput = 12;
            if (tipoTasa === 'trimestral') mInput = 4;
            if (tipoTasa === 'semestral') mInput = 2;
            
            // TEA = (1 + i_p)^m_input - 1
            tea = Math.pow(1 + rInput, mInput) - 1;
        }
        
        // 2. Obtener la tasa periódica de capitalización (i) equivalente
        // i = (1 + TEA)^(1/m) - 1
        const i = Math.pow(1 + tea, 1 / m) - 1;
        
        // 3. Determinar el número de períodos totales
        const n = periodosAnio * m;
        
        // 4. Aplicar fórmula de interés compuesto
        const valorFuturo = P * Math.pow(1 + i, n);
        const interesGenerado = valorFuturo - P;
        
        return {
            capitalInicial: P,
            tasa: i,
            periodos: n,
            interesGenerado: interesGenerado,
            valorFuturo: valorFuturo,
            tea: tea,
            frecuenciaM: m
        };
    }

    let chartInstance = null;

    function init() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        const form = document.getElementById('comp-calc-form');
        const inputP = document.getElementById('comp-P');
        const inputI = document.getElementById('comp-i');
        const selectTipoTasa = document.getElementById('comp-tipo-tasa');
        const inputN = document.getElementById('comp-n');
        const selectCap = document.getElementById('comp-cap');
        
        const errorContainer = document.getElementById('comp-validation-error');
        const validationMsg = document.getElementById('comp-validation-msg');
        
        const resultsCard = document.getElementById('comp-results-card');
        const chartCard = document.getElementById('comp-chart-card');
        const tableCard = document.getElementById('comp-table-card');
        const academicCard = document.getElementById('comp-academic-card');
        
        const resVp = document.getElementById('comp-res-vp');
        const resTasaEq = document.getElementById('comp-res-tasa-eq');
        const resN = document.getElementById('comp-res-n');
        const resInteres = document.getElementById('comp-res-interes');
        const resVf = document.getElementById('comp-res-vf');
        
        const tableBody = document.getElementById('comp-table-body');
        const stepContainer = document.getElementById('comp-step-by-step');
        
        const btnLimpiar = document.getElementById('comp-btn-limpiar');
        const btnEjemplo = document.getElementById('comp-btn-ejemplo');

        btnEjemplo.addEventListener('click', () => {
            inputP.value = "10000000";
            inputI.value = "12";
            selectTipoTasa.value = "EA";
            inputN.value = "5";
            selectCap.value = "1"; // Anual
            
            errorContainer.style.display = 'none';
            form.dispatchEvent(new Event('submit'));
        });

        btnLimpiar.addEventListener('click', () => {
            form.reset();
            errorContainer.style.display = 'none';
            resultsCard.style.display = 'none';
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
            
            const P = parseFloat(inputP.value);
            const rate = parseFloat(inputI.value);
            const tipoTasa = selectTipoTasa.value;
            const years = parseInt(inputN.value);
            const m = parseInt(selectCap.value);
            
            // --- VALIDACIONES ---
            if (isNaN(P) || P <= 0) {
                showError("El capital inicial debe ser un número mayor a cero.");
                return;
            }
            if (isNaN(rate) || rate <= 0) {
                showError("La tasa de interés debe ser un porcentaje mayor a cero.");
                return;
            }
            if (isNaN(years) || years <= 0) {
                showError("El plazo en años debe ser mayor a cero.");
                return;
            }

            // --- EJECUTAR CÁLCULOS ---
            const res = calcularInteresCompuesto(P, rate, tipoTasa, years, m);
            
            // --- MOSTRAR RESULTADOS ---
            resVp.textContent = `$${res.capitalInicial.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP`;
            resTasaEq.textContent = `${(res.tasa * 100).toLocaleString('es-CO', { minimumFractionDigits: 4, maximumFractionDigits: 6 })}% por período`;
            resN.textContent = `${res.periodos} períodos`;
            resInteres.textContent = `$${res.interesGenerated || res.interesGenerado.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP`;
            resVf.textContent = `$${res.valorFuturo.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP`;
            
            resultsCard.style.display = 'block';
            academicCard.style.display = 'block';
            
            // --- GENERAR TABLA Y CURVAS ---
            const dataTable = [];
            const dataSimple = [];
            const labels = [];
            
            let saldoComp = P;
            let saldoSimp = P;
            let tableHTML = '';
            
            // Período 0
            labels.push("Inicio");
            dataTable.push(P);
            dataSimple.push(P);
            
            for (let t = 1; t <= res.periodos; t++) {
                const interesCompPeriodo = saldoComp * res.tasa;
                const nuevoSaldoComp = saldoComp + interesCompPeriodo;
                
                tableHTML += `
                    <tr>
                        <td><strong>${t}</strong></td>
                        <td>$${saldoComp.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>$${interesCompPeriodo.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td><strong>$${nuevoSaldoComp.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                    </tr>
                `;
                
                saldoComp = nuevoSaldoComp;
                
                // Interés simple equivalente por período: VF = P * (1 + i * t)
                const nuevoSaldoSimp = P * (1 + res.tasa * t);
                
                labels.push(`P. ${t}`);
                dataTable.push(saldoComp);
                dataSimple.push(nuevoSaldoSimp);
            }
            
            tableBody.innerHTML = tableHTML;
            tableCard.style.display = 'block';
            
            // --- DIBUJAR GRÁFICO (Chart.js) ---
            chartCard.style.display = 'block';
            drawChart(labels, dataTable, dataSimple);
            
            // --- INYECTAR EXPLICACIÓN PASO A PASO ---
            renderStepByStep(P, rate, tipoTasa, res, m, years);
            
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });

        function showError(msg) {
            validationMsg.textContent = msg;
            errorContainer.style.display = 'block';
            resultsCard.style.display = 'none';
            chartCard.style.display = 'none';
            tableCard.style.display = 'none';
            academicCard.style.display = 'none';
        }

        function drawChart(labels, dataComp, dataSimp) {
            const ctx = document.getElementById('comp-chart').getContext('2d');
            
            if (chartInstance) {
                chartInstance.destroy();
            }
            
            chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Interés Compuesto (Exponencial)',
                            data: dataComp,
                            borderColor: '#0f766e',
                            backgroundColor: 'rgba(15, 118, 110, 0.05)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.15
                        },
                        {
                            label: 'Interés Simple Comparativo (Lineal)',
                            data: dataSimp,
                            borderColor: '#2563eb',
                            backgroundColor: 'transparent',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            fill: false,
                            tension: 0
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
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': $' + context.raw.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                }
                            }
                        }
                    }
                }
            });
        }

        function renderStepByStep(P, rate, tipoTasa, res, m, years) {
            const mNombres = { '1': 'Anual', '2': 'Semestral', '4': 'Trimestral', '12': 'Mensual' };
            const mNombre = mNombres[m.toString()];
            
            stepContainer.innerHTML = `
                <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h4 class="step-title">Identificar la tasa efectiva aplicable por período (i)</h4>
                        <p class="step-desc">Se convierte la tasa ingresada del <strong>${rate}% (${tipoTasa})</strong> a la tasa efectiva periódica correspondiente a la capitalización <strong>${mNombre}</strong>:</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 6px;">
                            TEA calculada = ${(res.tea * 100).toFixed(4)}% Anual.<br>
                            i = (1 + TEA)<sup>(1/${m})</sup> - 1 = ${(res.tasa * 100).toFixed(6)}% por período.
                        </p>
                    </div>
                </div>
                
                <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h4 class="step-title">Determinar el número total de períodos (n)</h4>
                        <p class="step-desc">Multiplicamos el plazo en años (<strong>${years}</strong>) por la frecuencia de capitalización al año (<strong>m = ${m}</strong>):</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 6px;">
                            n = ${years} años &times; ${m} períodos/año = ${res.periodos} períodos en total.
                        </p>
                    </div>
                </div>
                
                <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h4 class="step-title">Aplicar la fórmula del interés compuesto</h4>
                        <p class="step-desc">Calculamos el valor futuro (<strong>VF</strong>) elevando el factor de capitalización al número de períodos totales:</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 6px;">
                            VF = VP &times; (1 + i)<sup>n</sup><br>
                            VF = ${P.toLocaleString('es-CO')} &times; (1 + ${res.tasa.toFixed(8)})<sup>${res.periodos}</sup><br>
                            VF = $${res.valorFuturo.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP
                        </p>
                    </div>
                </div>
                
                <div class="step-item">
                    <div class="step-number">4</div>
                    <div class="step-content">
                        <h4 class="step-title">Calcular el interés acumulado total</h4>
                        <p class="step-desc">Restamos el capital inicial del valor futuro acumulado al final de la operación:</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 6px;">
                            Interés = VF - VP<br>
                            Interés = $${res.valorFuturo.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - $${P.toLocaleString('es-CO')}<br>
                            Interés = $${res.interesGenerado.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP
                        </p>
                    </div>
                </div>
            `;
        }
    }

    // Registrar globalmente
    window.FinanceModules.compuesto = {
        title,
        description,
        render,
        calcularInteresCompuesto,
        init
    };
})();
