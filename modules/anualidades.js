// modules/anualidades.js
(function() {
    const title = "Anualidades";
    const description = "Módulo interactivo para comprender las anualidades (ordinarias y anticipadas), calcular valor futuro, valor presente, cuotas periódicas y fondos de ahorro.";

    function render() {
        return `
            <div class="module-header">
                <h1>${title}</h1>
                <p class="module-description">${description}</p>
            </div>
            
            <!-- Tab Navigation -->
            <div class="tabs-container">
                <button class="tab-btn active" data-tab="tab-vf">Valor Futuro (VF)</button>
                <button class="tab-btn" data-tab="tab-vp">Valor Presente (VP)</button>
                <button class="tab-btn" data-tab="tab-renta">Cuota Periódica (R)</button>
                <button class="tab-btn" data-tab="tab-fondo">Fondo de Ahorro</button>
            </div>
            
            <div class="module-grid">
                <!-- Formulario de Entrada Dinámico -->
                <div class="card">
                    <h2 class="card-title">
                        <i data-lucide="calculator"></i>
                        Parámetros de la Anualidad
                    </h2>
                    
                    <form id="annuity-calc-form">
                        <!-- Pestaña Activa de Entrada -->
                        <div class="tab-pane active" id="pane-vf">
                            <div class="form-group">
                                <label for="vf-R">Cuota Periódica (R - COP)</label>
                                <div class="input-wrapper">
                                    <i data-lucide="dollar-sign" class="input-icon"></i>
                                    <input type="number" id="vf-R" placeholder="Ej. 500000" min="0.01" step="any">
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane" id="pane-vp">
                            <div class="form-group">
                                <label for="vp-R">Cuota Periódica (R - COP)</label>
                                <div class="input-wrapper">
                                    <i data-lucide="dollar-sign" class="input-icon"></i>
                                    <input type="number" id="vp-R" placeholder="Ej. 500000" min="0.01" step="any">
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane" id="pane-renta">
                            <div class="form-group">
                                <label for="renta-know">Conociendo:</label>
                                <div class="input-wrapper">
                                    <i data-lucide="settings" class="input-icon"></i>
                                    <select id="renta-know">
                                        <option value="VP" selected>Valor Presente (VP)</option>
                                        <option value="VF">Valor Futuro (VF)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="renta-val" id="renta-val-lbl">Valor de Referencia ($ COP)</label>
                                <div class="input-wrapper">
                                    <i data-lucide="dollar-sign" class="input-icon"></i>
                                    <input type="number" id="renta-val" placeholder="Ej. 10000000" min="0.01" step="any">
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane" id="pane-fondo">
                            <div class="form-group">
                                <label for="fondo-meta">Meta de Ahorro (VF - COP)</label>
                                <div class="input-wrapper">
                                    <i data-lucide="target" class="input-icon"></i>
                                    <input type="number" id="fondo-meta" placeholder="Ej. 600000" min="0.01" step="any">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="fondo-dep">Depósito Periódico (R - COP)</label>
                                <div class="input-wrapper">
                                    <i data-lucide="dollar-sign" class="input-icon"></i>
                                    <input type="number" id="fondo-dep" placeholder="Ej. 10000" min="0.01" step="any">
                                </div>
                            </div>
                        </div>

                        <!-- Parámetros Comunes -->
                        <div class="form-group">
                            <label for="annuity-rate">Tasa de Interés (%)</label>
                            <div class="input-wrapper">
                                <i data-lucide="percent" class="input-icon"></i>
                                <input type="number" id="annuity-rate" placeholder="Ej. 2" min="0.0001" step="any" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="annuity-rate-type">Tipo de Tasa</label>
                            <div class="input-wrapper">
                                <i data-lucide="shield-alert" class="input-icon"></i>
                                <select id="annuity-rate-type">
                                    <option value="mensual" selected>Efectiva Mensual</option>
                                    <option value="trimestral">Efectiva Trimestral</option>
                                    <option value="semestral">Efectiva Semestral</option>
                                    <option value="EA">Efectiva Anual (EA)</option>
                                    <option value="nominal_mes">Nominal Anual Conv. Mensual</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group" id="annuity-periods-group">
                            <label for="annuity-n">Número de Períodos (n)</label>
                            <div class="input-wrapper">
                                <i data-lucide="hash" class="input-icon"></i>
                                <input type="number" id="annuity-n" placeholder="Ej. 24" min="1" step="1">
                            </div>
                        </div>

                        <div class="form-group" id="annuity-type-group">
                            <label for="annuity-type">Tipo de Anualidad</label>
                            <div class="input-wrapper">
                                <i data-lucide="layers" class="input-icon"></i>
                                <select id="annuity-type">
                                    <option value="ordinaria" selected>Ordinaria / Vencida</option>
                                    <option value="anticipada">Anticipada</option>
                                </select>
                            </div>
                        </div>

                        <!-- Alerta de Validación -->
                        <div id="annuity-validation-error" style="display: none; color: #ef4444; margin-bottom: 20px; font-size: 0.85rem; font-weight: 600;">
                            <i data-lucide="alert-circle" style="width: 16px; height: 16px; display: inline; vertical-align: middle;"></i>
                            <span id="annuity-validation-msg">Error de validación</span>
                        </div>

                        <!-- Botonera -->
                        <div class="actions-grid">
                            <button type="submit" class="btn btn-primary" id="annuity-btn-calcular">
                                <i data-lucide="play"></i> Calcular
                            </button>
                            <button type="button" class="btn btn-secondary" id="annuity-btn-limpiar">
                                Limpiar
                            </button>
                            <button type="button" class="btn btn-accent" id="annuity-btn-ejemplo">
                                Ejemplo Clase
                            </button>
                        </div>
                    </form>
                </div>
                
                <!-- Resultados en Tarjetas -->
                <div class="card" id="annuity-results-card" style="display: none;">
                    <h2 class="card-title">
                        <i data-lucide="trending-up"></i>
                        Resultados Obtenidos
                    </h2>
                    
                    <div class="results-display" id="annuity-results-display" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <!-- Tarjetas dinámicas de resultados -->
                    </div>
                </div>
            </div>

            <!-- Visualización 1: Línea de tiempo financiera -->
            <div class="card" id="annuity-timeline-card" style="margin-top: 32px; display: none;">
                <h2 class="card-title">
                    <i data-lucide="calendar"></i>
                    Línea de Tiempo del Flujo de Caja
                </h2>
                <div class="annuity-timeline" id="annuity-timeline-container">
                    <!-- Nodos de la anualidad -->
                </div>
            </div>

            <!-- Visualización 2: Gráfico Período a Período (Chart.js) -->
            <div class="card" id="annuity-chart-card" style="margin-top: 32px; display: none;">
                <h2 class="card-title">
                    <i data-lucide="bar-chart-2"></i>
                    Evolución Acumulada del Fondo
                </h2>
                <div style="position: relative; height: 350px; width: 100%;">
                    <canvas id="annuity-chart"></canvas>
                </div>
            </div>

            <!-- Visualización 3: Tabla Detallada -->
            <div class="card" id="annuity-table-card" style="margin-top: 32px; display: none;">
                <h2 class="card-title">
                    <i data-lucide="table"></i>
                    Tabla de Capitalización / Amortización
                </h2>
                <div class="table-container" style="max-height: 300px; overflow-y: auto;">
                    <table>
                        <thead>
                            <tr id="annuity-table-head">
                                <th>Período (t)</th>
                                <th>Aporte / Cuota</th>
                                <th>Interés</th>
                                <th>Saldo Acumulado</th>
                            </tr>
                        </thead>
                        <tbody id="annuity-table-body">
                            <!-- Inyectado dinámicamente -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Fórmulas y Procedimiento Paso a Paso -->
            <div class="card" id="annuity-academic-card" style="margin-top: 32px; display: none;">
                <h2 class="card-title">
                    <i data-lucide="book-open"></i>
                    Desarrollo Pedagógico y Fórmulas
                </h2>
                
                <div class="formula-card">
                    <h3 style="font-size: 1rem; margin-bottom: 12px;">Ecuaciones de Anualidades</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="formula-box">
                            <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary);">VALOR FUTURO (VF)</span>
                            <span class="math-text" style="font-size: 1.15rem;">VF = R[(1+i)<sup>n</sup> - 1]/i</span>
                        </div>
                        <div class="formula-box">
                            <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary);">VALOR PRESENTE (VP)</span>
                            <span class="math-text" style="font-size: 1.15rem;">VP = R[1 - (1+i)<sup>-n</sup>]/i</span>
                        </div>
                    </div>
                </div>

                <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 16px;">Explicación Paso a Paso</h3>
                <div class="step-list" id="annuity-step-by-step">
                    <!-- Inyectado dinámicamente -->
                </div>
            </div>
        `;
    }

    // --- FUNCIONES MATEMÁTICAS ---

    function calcularVFAnualidad(R, i, n, tipo) {
        let factor = (Math.pow(1 + i, n) - 1) / i;
        if (tipo === 'anticipada') {
            factor *= (1 + i);
        }
        const vf = R * factor;
        const capital = R * n;
        const interes = vf - capital;
        return { valorFuturo: vf, capitalAportado: capital, interesAcumulado: interes };
    }

    function calcularVPAnualidad(R, i, n, tipo) {
        let factor = (1 - Math.pow(1 + i, -n)) / i;
        if (tipo === 'anticipada') {
            factor *= (1 + i);
        }
        const vp = R * factor;
        const totalCuotas = R * n;
        const interesImplicito = totalCuotas - vp;
        return { valorPresente: vp, totalCuotas: totalCuotas, interesImplicito: interesImplicito };
    }

    function calcularCuota(valorBase, baseType, i, n, tipo) {
        let R = 0;
        let factor = 1;
        if (baseType === 'VP') {
            factor = (1 - Math.pow(1 + i, -n)) / i;
            if (tipo === 'anticipada') factor *= (1 + i);
            R = valorBase / factor;
        } else {
            factor = (Math.pow(1 + i, n) - 1) / i;
            if (tipo === 'anticipada') factor *= (1 + i);
            R = valorBase / factor;
        }
        return { cuota: R, factor: factor };
    }

    function calcularFondoAhorro(meta, R, i) {
        // Meta = R * [ (1+i)^n - 1 ] / i
        // n = ln( (Meta * i / R) + 1 ) / ln(1+i)
        const n = Math.log((meta * i / R) + 1) / Math.log(1 + i);
        return { periodos: n };
    }

    let activeTab = 'tab-vf';
    let chartInstance = null;

    function init() {
        if (window.lucide) {
            window.lucide.createIcons();
        }

        const form = document.getElementById('annuity-calc-form');
        const inputRate = document.getElementById('annuity-rate');
        const selectRateType = document.getElementById('annuity-rate-type');
        const inputN = document.getElementById('annuity-n');
        const selectAnnuityType = document.getElementById('annuity-type');
        
        const errorContainer = document.getElementById('annuity-validation-error');
        const validationMsg = document.getElementById('annuity-validation-msg');
        
        const resultsCard = document.getElementById('annuity-results-card');
        const resultsDisplay = document.getElementById('annuity-results-display');
        
        const timelineCard = document.getElementById('annuity-timeline-card');
        const timelineContainer = document.getElementById('annuity-timeline-container');
        
        const chartCard = document.getElementById('annuity-chart-card');
        const tableCard = document.getElementById('annuity-table-card');
        const tableHead = document.getElementById('annuity-table-head');
        const tableBody = document.getElementById('annuity-table-body');
        
        const academicCard = document.getElementById('annuity-academic-card');
        const stepContainer = document.getElementById('annuity-step-by-step');
        
        const btnLimpiar = document.getElementById('annuity-btn-limpiar');
        const btnEjemplo = document.getElementById('annuity-btn-ejemplo');

        // Pestañas (Tabs) click listener
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
                
                btn.classList.add('active');
                activeTab = btn.getAttribute('data-tab');
                
                const paneId = activeTab.replace('tab-', 'pane-');
                document.getElementById(paneId).classList.add('active');
                
                // Mostrar/ocultar inputs según pestaña
                const periodsGroup = document.getElementById('annuity-periods-group');
                const typeGroup = document.getElementById('annuity-type-group');
                
                if (activeTab === 'tab-fondo') {
                    periodsGroup.style.display = 'none';
                    typeGroup.style.display = 'none';
                } else {
                    periodsGroup.style.display = 'block';
                    typeGroup.style.display = 'block';
                }
            });
        });

        // Cargar Ejemplo Clase
        btnEjemplo.addEventListener('click', () => {
            if (activeTab === 'tab-vf') {
                document.getElementById('vf-R').value = "100000"; // $100.000 COP
                inputRate.value = "2"; // 2%
                selectRateType.value = "mensual";
                inputN.value = "12"; // 12 meses
                selectAnnuityType.value = "ordinaria";
            } else if (activeTab === 'tab-vp') {
                document.getElementById('vp-R').value = "200000"; // $200.000 COP
                inputRate.value = "1.5"; // 1.5%
                selectRateType.value = "mensual";
                inputN.value = "24"; // 24 meses
                selectAnnuityType.value = "ordinaria";
            } else if (activeTab === 'tab-renta') {
                document.getElementById('renta-know').value = "VP";
                document.getElementById('renta-val').value = "10000000"; // $10.000.000 COP
                inputRate.value = "10"; // 10%
                selectRateType.value = "EA"; // EA convertido a mensual
                inputN.value = "36"; // 36 meses
                selectAnnuityType.value = "ordinaria";
            } else if (activeTab === 'tab-fondo') {
                document.getElementById('fondo-meta').value = "600000"; // $600.000 COP
                document.getElementById('fondo-dep').value = "10000"; // $10.000 COP
                inputRate.value = "36"; // 36%
                selectRateType.value = "nominal_mes"; // Nominal Anual Conv. Mensual
            }
            
            errorContainer.style.display = 'none';
            form.dispatchEvent(new Event('submit'));
        });

        // Limpiar
        btnLimpiar.addEventListener('click', () => {
            form.reset();
            errorContainer.style.display = 'none';
            resultsCard.style.display = 'none';
            timelineCard.style.display = 'none';
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
            
            const rateVal = parseFloat(inputRate.value);
            const rateType = selectRateType.value;
            const annType = selectAnnuityType.value;
            
            // --- VALIDACIONES ---
            if (isNaN(rateVal) || rateVal <= 0) {
                showError("La tasa de interés debe ser mayor a cero.");
                return;
            }
            
            let i = 0;
            // Convertir tasa periódica efectiva
            if (rateType === 'mensual') i = rateVal / 100;
            if (rateType === 'trimestral') i = rateVal / 100;
            if (rateType === 'semestral') i = rateVal / 100;
            if (rateType === 'EA') {
                // EA convertida a mensual: (1+EA)^(1/12) - 1
                i = Math.pow(1 + (rateVal / 100), 1 / 12) - 1;
            }
            if (rateType === 'nominal_mes') {
                // Nominal convertida a mensual: j / 12
                i = (rateVal / 100) / 12;
            }

            if (activeTab === 'tab-vf') {
                const R = parseFloat(document.getElementById('vf-R').value);
                const n = parseInt(inputN.value);
                
                if (isNaN(R) || R <= 0 || isNaN(n) || n <= 0) {
                    showError("La cuota y el número de períodos deben ser mayores a cero.");
                    return;
                }

                const res = calcularVFAnualidad(R, i, n, annType);
                
                resultsDisplay.innerHTML = `
                    <div class="result-card" style="grid-column: span 2;">
                        <span class="result-lbl">Valor Futuro (VF)</span>
                        <div class="result-val" style="color: var(--primary); font-size: 2rem;">$${res.valorFuturo.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP</div>
                    </div>
                    <div class="result-card">
                        <span class="result-lbl">Capital Aportado</span>
                        <div class="result-val">$${res.capitalAportado.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div class="result-card">
                        <span class="result-lbl">Interés Acumulado</span>
                        <div class="result-val" style="color: var(--accent);">$${res.interesAcumulado.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                `;
                
                resultsCard.style.display = 'block';
                academicCard.style.display = 'block';
                
                renderTimeline(R, n, 0, res.valorFuturo, annType);
                timelineCard.style.display = 'block';
                
                const tableData = simulateGrowthTable(R, i, n, annType, 'vf');
                drawChart(tableData.labels, tableData.contributions, tableData.interests, tableData.totals);
                chartCard.style.display = 'block';
                
                renderTable(tableData.rows, 'vf');
                tableCard.style.display = 'block';
                
                renderStepsVF(R, rateVal, rateType, i, n, annType, res);

            } else if (activeTab === 'tab-vp') {
                const R = parseFloat(document.getElementById('vp-R').value);
                const n = parseInt(inputN.value);
                
                if (isNaN(R) || R <= 0 || isNaN(n) || n <= 0) {
                    showError("La cuota y el número de períodos deben ser mayores a cero.");
                    return;
                }

                const res = calcularVPAnualidad(R, i, n, annType);
                
                resultsDisplay.innerHTML = `
                    <div class="result-card" style="grid-column: span 2;">
                        <span class="result-lbl">Valor Presente (VP)</span>
                        <div class="result-val" style="color: var(--primary); font-size: 2rem;">$${res.valorPresente.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP</div>
                    </div>
                    <div class="result-card">
                        <span class="result-lbl">Total de Cuotas</span>
                        <div class="result-val">$${res.totalCuotas.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div class="result-card">
                        <span class="result-lbl">Interés Implícito</span>
                        <div class="result-val" style="color: var(--accent);">$${res.interesImplicito.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                `;
                
                resultsCard.style.display = 'block';
                academicCard.style.display = 'block';
                
                renderTimeline(R, n, res.valorPresente, 0, annType);
                timelineCard.style.display = 'block';
                
                const tableData = simulateGrowthTable(R, i, n, annType, 'vp');
                drawChart(tableData.labels, tableData.contributions, tableData.interests, tableData.totals);
                chartCard.style.display = 'block';
                
                renderTable(tableData.rows, 'vp');
                tableCard.style.display = 'block';
                
                renderStepsVP(R, rateVal, rateType, i, n, annType, res);

            } else if (activeTab === 'tab-renta') {
                const rentaType = document.getElementById('renta-know').value;
                const refVal = parseFloat(document.getElementById('renta-val').value);
                const n = parseInt(inputN.value);
                
                if (isNaN(refVal) || refVal <= 0 || isNaN(n) || n <= 0) {
                    showError("El valor de referencia y los períodos deben ser mayores a cero.");
                    return;
                }

                const res = calcularCuota(refVal, rentaType, i, n, annType);
                
                resultsDisplay.innerHTML = `
                    <div class="result-card" style="grid-column: span 2;">
                        <span class="result-lbl">Cuota Periódica Requerida (R)</span>
                        <div class="result-val" style="color: var(--accent); font-size: 2.25rem;">$${res.cuota.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP</div>
                    </div>
                    <div class="result-card">
                        <span class="result-lbl">Valor de Referencia</span>
                        <div class="result-val">$${refVal.toLocaleString('es-CO')} (${rentaType})</div>
                    </div>
                    <div class="result-card">
                        <span class="result-lbl">Factor Despejado</span>
                        <div class="result-val">${res.factor.toFixed(6)}</div>
                    </div>
                `;
                
                resultsCard.style.display = 'block';
                academicCard.style.display = 'block';
                
                renderTimeline(res.cuota, n, rentaType === 'VP' ? refVal : 0, rentaType === 'VF' ? refVal : 0, annType);
                timelineCard.style.display = 'block';
                
                const tableData = simulateGrowthTable(res.cuota, i, n, annType, rentaType === 'VP' ? 'vp' : 'vf');
                drawChart(tableData.labels, tableData.contributions, tableData.interests, tableData.totals);
                chartCard.style.display = 'block';
                
                renderTable(tableData.rows, rentaType === 'VP' ? 'vp' : 'vf');
                tableCard.style.display = 'block';
                
                renderStepsRenta(refVal, rentaType, rateVal, rateType, i, n, annType, res);

            } else if (activeTab === 'tab-fondo') {
                const meta = parseFloat(document.getElementById('fondo-meta').value);
                const dep = parseFloat(document.getElementById('fondo-dep').value);
                
                if (isNaN(meta) || meta <= 0 || isNaN(dep) || dep <= 0) {
                    showError("La meta de ahorro y el depósito deben ser mayores a cero.");
                    return;
                }

                const res = calcularFondoAhorro(meta, dep, i);
                const n = Math.ceil(res.periodos);
                
                // Calcular acumulado exacto en el período n-1
                const nPrev = Math.floor(res.periodos);
                const resPrev = calcularVFAnualidad(dep, i, nPrev, 'ordinaria');
                
                // Depósito final adicional requerido al final del período n
                const acumPrevConInteres = resPrev.valorFuturo * (1 + i);
                const depositoFinalAdic = meta - acumPrevConInteres;
                
                resultsDisplay.innerHTML = `
                    <div class="result-card" style="grid-column: span 2;">
                        <span class="result-lbl">Número de Depósitos Necesarios (n)</span>
                        <div class="result-val" style="color: var(--primary); font-size: 2rem;">${res.periodos.toLocaleString('es-CO', { maximumFractionDigits: 2 })} depósitos</div>
                    </div>
                    <div class="result-card">
                        <span class="result-lbl">Valor Final Acumulado</span>
                        <div class="result-val" style="color: var(--accent);">$${meta.toLocaleString('es-CO')}</div>
                    </div>
                    <div class="result-card">
                        <span class="result-lbl">Depósito Final Adicional (P. ${n})</span>
                        <div class="result-val">$${depositoFinalAdic.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                `;
                
                resultsCard.style.display = 'block';
                academicCard.style.display = 'block';
                
                renderTimeline(dep, nPrev, 0, meta, 'ordinaria');
                timelineCard.style.display = 'block';
                
                const tableData = simulateFondoTable(dep, i, nPrev, meta, depositoFinalAdic);
                drawChart(tableData.labels, tableData.contributions, tableData.interests, tableData.totals);
                chartCard.style.display = 'block';
                
                renderTable(tableData.rows, 'vf');
                tableCard.style.display = 'block';
                
                renderStepsFondo(meta, dep, rateVal, rateType, i, res, nPrev, depositoFinalAdic);
            }
        });

        function showError(msg) {
            validationMsg.textContent = msg;
            errorContainer.style.display = 'block';
            resultsCard.style.display = 'none';
            timelineCard.style.display = 'none';
            chartCard.style.display = 'none';
            tableCard.style.display = 'none';
            academicCard.style.display = 'none';
        }

        // --- RENDERIZACIÓN DE VISUALIZACIONES ---

        function renderTimeline(R, n, vp, vf, tipoAnnuity) {
            let timelineHTML = `<div class="annuity-timeline-line"></div>`;
            
            // Renderizar un máximo de 5 nodos para no saturar visualmente
            const maxNodos = 5;
            const step = n > maxNodos ? Math.ceil(n / maxNodos) : 1;
            
            // Nodo Inicial
            timelineHTML += `
                <div class="annuity-node">
                    <span class="annuity-node-val">${vp > 0 ? `$${vp.toLocaleString('es-CO', { maximumFractionDigits: 0 })}` : ''}</span>
                    <div class="annuity-node-dot" style="background-color: var(--primary);"></div>
                    <span class="annuity-node-lbl">VP (0)</span>
                </div>
            `;
            
            // Nodos intermedios
            for (let t = step; t < n; t += step) {
                timelineHTML += `
                    <div class="annuity-node">
                        <span class="annuity-node-val">$${R.toLocaleString('es-CO', { maximumFractionDigits: 0 })}</span>
                        <div class="annuity-node-dot"></div>
                        <span class="annuity-node-lbl">P. ${t}</span>
                    </div>
                `;
            }
            
            // Nodo Final
            timelineHTML += `
                <div class="annuity-node">
                    <span class="annuity-node-val">${vf > 0 ? `$${vf.toLocaleString('es-CO', { maximumFractionDigits: 0 })}` : `$${R.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`}</span>
                    <div class="annuity-node-dot" style="background-color: var(--accent);"></div>
                    <span class="annuity-node-lbl">VF (${n})</span>
                </div>
            `;
            
            timelineContainer.innerHTML = timelineHTML;
        }

        function drawChart(labels, dataContrib, dataInterests, dataTotals) {
            const ctx = document.getElementById('annuity-chart').getContext('2d');
            if (chartInstance) {
                chartInstance.destroy();
            }
            chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Capital Aportado Acumulado',
                            data: dataContrib,
                            backgroundColor: '#2563eb'
                        },
                        {
                            label: 'Intereses Acumulados',
                            data: dataInterests,
                            backgroundColor: '#0f766e'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { stacked: true },
                        y: { stacked: true }
                    }
                }
            });
        }

        function simulateGrowthTable(R, i, n, tipo, mode) {
            const labels = [];
            const contributions = [];
            const interests = [];
            const totals = [];
            const rows = [];
            
            let saldo = 0;
            let capitalAcum = 0;
            
            labels.push("P. 0");
            contributions.push(0);
            interests.push(0);
            totals.push(0);
            
            for (let t = 1; t <= n; t++) {
                let interes = 0;
                let aporte = R;
                
                if (mode === 'vf') {
                    // Valor Futuro: acumula intereses sobre el saldo anterior
                    interes = saldo * i;
                    saldo = saldo + interes + R;
                    capitalAcum += R;
                } else {
                    // Valor Presente (Tabla de amortización típica para crédito)
                    // Iniciamos en VP y descontamos cuotas
                    if (t === 1) {
                        const vpRes = calcularVPAnualidad(R, i, n, tipo);
                        saldo = vpRes.valorPresente;
                    }
                    interes = saldo * i;
                    aporte = R;
                    saldo = Math.max(0, saldo + interes - R);
                    capitalAcum += (R - interes);
                }
                
                labels.push(`P. ${t}`);
                contributions.push(capitalAcum);
                interests.push(Math.max(0, (mode === 'vf' ? saldo - capitalAcum : capitalAcum * i))); // Simplificación ilustrativa
                totals.push(saldo);
                
                rows.push({
                    periodo: t,
                    aporte: R,
                    interes: interes,
                    saldo: saldo
                });
            }
            
            return { labels, contributions, interests, totals, rows };
        }

        function simulateFondoTable(R, i, nPrev, meta, depAdic) {
            const labels = [];
            const contributions = [];
            const interests = [];
            const totals = [];
            const rows = [];
            
            let saldo = 0;
            let capitalAcum = 0;
            
            labels.push("P. 0");
            contributions.push(0);
            interests.push(0);
            totals.push(0);
            
            for (let t = 1; t <= nPrev; t++) {
                const interes = saldo * i;
                saldo = saldo + interes + R;
                capitalAcum += R;
                
                labels.push(`P. ${t}`);
                contributions.push(capitalAcum);
                interests.push(saldo - capitalAcum);
                totals.push(saldo);
                
                rows.push({
                    periodo: t,
                    aporte: R,
                    interes: interes,
                    saldo: saldo
                });
            }
            
            // Período adicional final
            const tFinal = nPrev + 1;
            const interesFinal = saldo * i;
            saldo = saldo + interesFinal + depAdic;
            capitalAcum += depAdic;
            
            labels.push(`P. ${tFinal}`);
            contributions.push(capitalAcum);
            interests.push(saldo - capitalAcum);
            totals.push(saldo);
            
            rows.push({
                periodo: tFinal,
                aporte: depAdic,
                interes: interesFinal,
                saldo: saldo
            });
            
            return { labels, contributions, interests, totals, rows };
        }

        function renderTable(rows, mode) {
            tableHead.innerHTML = `
                <th>Período (t)</th>
                <th>Aporte / Cuota (R)</th>
                <th>Interés del Período</th>
                <th>${mode === 'vp' ? 'Saldo de Deuda' : 'Saldo Acumulado (VF)'}</th>
            `;
            
            let bodyHTML = '';
            rows.forEach(r => {
                bodyHTML += `
                    <tr>
                        <td><strong>${r.periodo}</strong></td>
                        <td>$${r.aporte.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>$${r.interes.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td><strong>$${r.saldo.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                    </tr>
                `;
            });
            tableBody.innerHTML = bodyHTML;
        }

        // --- EXPLICACIONES PASO A PASO DETALLADAS ---

        function renderStepsVF(R, rateVal, rateType, i, n, annType, res) {
            const antLabel = annType === 'anticipada' ? 'Sí (se multiplica factor por 1+i)' : 'No';
            stepContainer.innerHTML = `
                <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h4 class="step-title">Calcular la tasa periódica efectiva</h4>
                        <p class="step-desc">Se convierte el valor de tasa del <strong>${rateVal}% (${rateType})</strong> a tasa periódica efectiva:</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 4px;">
                            i = ${(i * 100).toFixed(6)}% por período.
                        </p>
                    </div>
                </div>
                
                <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h4 class="step-title">Calcular el capital total aportado</h4>
                        <p class="step-desc">Suma del capital sin incluir intereses generados:</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 4px;">
                            Capital = R &times; n = $${R.toLocaleString('es-CO')} &times; ${n} = $${res.capitalAportado.toLocaleString('es-CO')} COP
                        </p>
                    </div>
                </div>

                <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h4 class="step-title">Aplicar fórmula de Valor Futuro de la Anualidad</h4>
                        <p class="step-desc">Ecuación: VF = R &times; [ (1+i)<sup>n</sup> - 1 ] / i ${annType === 'anticipada' ? '&times; (1+i)' : ''}:</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 4px;">
                            VF = $${R.toLocaleString('es-CO')} &times; [ (1 + ${i.toFixed(6)})<sup>${n}</sup> - 1 ] / ${i.toFixed(6)} ${annType === 'anticipada' ? `&times; (1 + ${i.toFixed(6)})` : ''}<br>
                            VF = $${res.valorFuturo.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP
                        </p>
                    </div>
                </div>

                <div class="step-item">
                    <div class="step-number">4</div>
                    <div class="step-content">
                        <h4 class="step-title">Obtener intereses acumulados</h4>
                        <p class="step-desc">Diferencia entre el monto final acumulado y los depósitos realizados:</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 4px;">
                            Interés = VF - Capital = $${res.valorFuturo.toLocaleString('es-CO', { maximumFractionDigits: 0 })} - $${res.capitalAportado.toLocaleString('es-CO')}<br>
                            Interés Acumulado = $${res.interesAcumulado.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP
                        </p>
                    </div>
                </div>
            `;
        }

        function renderStepsVP(R, rateVal, rateType, i, n, annType, res) {
            stepContainer.innerHTML = `
                <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h4 class="step-title">Calcular la tasa periódica efectiva</h4>
                        <p class="step-desc">Se convierte el valor de tasa del <strong>${rateVal}% (${rateType})</strong> a tasa periódica efectiva:</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 4px;">
                            i = ${(i * 100).toFixed(6)}% por período.
                        </p>
                    </div>
                </div>
                
                <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h4 class="step-title">Calcular el valor de las cuotas agregadas</h4>
                        <p class="step-desc">Suma total nominal de las rentas comprometidas:</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 4px;">
                            Total Nominal = R &times; n = $${R.toLocaleString('es-CO')} &times; ${n} = $${res.totalCuotas.toLocaleString('es-CO')} COP
                        </p>
                    </div>
                </div>

                <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h4 class="step-title">Aplicar fórmula de Valor Presente de la Anualidad</h4>
                        <p class="step-desc">Ecuación: VP = R &times; [ 1 - (1+i)<sup>-n</sup> ] / i ${annType === 'anticipada' ? '&times; (1+i)' : ''}:</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 4px;">
                            VP = $${R.toLocaleString('es-CO')} &times; [ 1 - (1 + ${i.toFixed(6)})<sup>-${n}</sup> ] / ${i.toFixed(6)} ${annType === 'anticipada' ? `&times; (1 + ${i.toFixed(6)})` : ''}<br>
                            VP = $${res.valorPresente.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP
                        </p>
                    </div>
                </div>

                <div class="step-item">
                    <div class="step-number">4</div>
                    <div class="step-content">
                        <h4 class="step-title">Obtener intereses implícitos</h4>
                        <p class="step-desc">Diferencia entre el total de cuotas nominales y el valor actual (costo de financiación):</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 4px;">
                            Interés Implícito = Total Nominal - VP<br>
                            Interés Implícito = $${res.interesImplicito.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP
                        </p>
                    </div>
                </div>
            `;
        }

        function renderStepsRenta(refVal, rentaType, rateVal, rateType, i, n, annType, res) {
            const formText = rentaType === 'VP' 
                ? `R = VP / ( [ 1 - (1+i)<sup>-n</sup> ] / i )`
                : `R = VF / ( [ (1+i)<sup>n</sup> - 1 ] / i )`;
            stepContainer.innerHTML = `
                <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h4 class="step-title">Calcular la tasa periódica efectiva</h4>
                        <p class="step-desc">Tasa periódica calculada para la anualidad:</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 4px;">
                            i = ${(i * 100).toFixed(6)}% por período.
                        </p>
                    </div>
                </div>
                
                <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h4 class="step-title">Aplicar despeje algebraico de R</h4>
                        <p class="step-desc">Despejando la renta a partir del <strong>${rentaType}</strong> conocido. Fórmula: <strong>${formText}</strong>:</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 4px;">
                            Factor amortización obtenido = ${res.factor.toFixed(8)}<br>
                            R = $${refVal.toLocaleString('es-CO')} / ${res.factor.toFixed(8)}<br>
                            R = $${res.cuota.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP
                        </p>
                    </div>
                </div>
            `;
        }

        function renderStepsFondo(meta, dep, rateVal, rateType, i, res, nPrev, depAdic) {
            stepContainer.innerHTML = `
                <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h4 class="step-title">Calcular la tasa periódica efectiva</h4>
                        <p class="step-desc">Tasa periódica calculada para la capitalización:</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 4px;">
                            i = ${(i * 100).toFixed(6)}% por período.
                        </p>
                    </div>
                </div>
                
                <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h4 class="step-title">Calcular número exacto de depósitos (n)</h4>
                        <p class="step-desc">Fórmula logarítmica despejada de anualidades: n = ln((Meta &times; i / R) + 1) / ln(1+i):</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 4px;">
                            n = ln((600000 &times; ${i.toFixed(4)} / 10000) + 1) / ln(1 + ${i.toFixed(4)}) = ${res.periodos.toFixed(4)} depósitos.
                        </p>
                    </div>
                </div>

                <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h4 class="step-title">Determinar el depósito final adicional</h4>
                        <p class="step-desc">Dado que se requieren <strong>${res.periodos.toFixed(2)}</strong> períodos, realizamos <strong>${nPrev}</strong> depósitos ordinarios completos de $${dep.toLocaleString('es-CO')} y calculamos el valor acumulado al período final agregando los intereses sobre el saldo:</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 4px;">
                            Acumulado al mes ${nPrev} = $${(meta - depAdic).toLocaleString('es-CO', { maximumFractionDigits: 0 })} COP.<br>
                            Saldo capitalizado al mes ${nPrev + 1} = $${( (meta - depAdic) * (1+i) ).toLocaleString('es-CO', { maximumFractionDigits: 0 })} COP.<br>
                            Depósito adicional requerido = Meta - Saldo capitalizado = $${depAdic.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP.
                        </p>
                    </div>
                </div>
            `;
        }
    }

    // Registrar en el objeto global
    window.FinanceModules.anualidades = {
        title,
        description,
        render,
        calcularVFAnualidad,
        calcularVPAnualidad,
        calcularCuota,
        calcularFondoAhorro,
        init
    };
})();
