// modules/simple.js
(function() {
    const title = "Interés Simple";
    const description = "Módulo interactivo para calcular y comprender el interés simple, valor futuro, días transcurridos y el tiempo financiero bajo bases comerciales y calendario.";

    /**
     * Renderiza la interfaz de usuario en HTML para el módulo de Interés Simple.
     */
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
                        Parámetros de la Operación
                    </h2>
                    
                    <form id="simple-calc-form">
                        <div class="form-group">
                            <label for="simple-P">Capital Inicial (P - COP)</label>
                            <div class="input-wrapper">
                                <i data-lucide="dollar-sign" class="input-icon"></i>
                                <input type="number" id="simple-P" placeholder="Ej. 10000000" min="0.01" step="any" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="simple-i">Tasa de Interés (%)</label>
                            <div class="input-wrapper">
                                <i data-lucide="percent" class="input-icon"></i>
                                <input type="number" id="simple-i" placeholder="Ej. 8" min="0.0001" step="any" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="simple-tipo-tasa">Tipo de Tasa</label>
                            <div class="input-wrapper">
                                <i data-lucide="calendar" class="input-icon"></i>
                                <select id="simple-tipo-tasa">
                                    <option value="anual" selected>Anual</option>
                                    <option value="semestral">Semestral</option>
                                    <option value="trimestral">Trimestral</option>
                                    <option value="mensual">Mensual</option>
                                    <option value="diaria">Diaria</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div>
                                <label for="simple-fecha-ini">Fecha Inicial</label>
                                <input type="date" id="simple-fecha-ini" required>
                            </div>
                            <div>
                                <label for="simple-fecha-fin">Fecha Final</label>
                                <input type="date" id="simple-fecha-fin" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="simple-tipo-anio">Tipo de Año / Base</label>
                            <div class="input-wrapper">
                                <i data-lucide="scale" class="input-icon"></i>
                                <select id="simple-tipo-anio">
                                    <option value="360">Comercial (360 días)</option>
                                    <option value="365" selected>Calendario (365 días)</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Alerta de Validación -->
                        <div id="simple-validation-error" style="display: none; color: #ef4444; margin-bottom: 20px; font-size: 0.85rem; font-weight: 600;">
                            <i data-lucide="alert-circle" style="width: 16px; height: 16px; display: inline; vertical-align: middle;"></i>
                            <span id="validation-msg">Error de validación</span>
                        </div>

                        <!-- Botonera -->
                        <div class="actions-grid">
                            <button type="submit" class="btn btn-primary" id="btn-calcular">
                                <i data-lucide="play"></i> Calcular
                            </button>
                            <button type="button" class="btn btn-secondary" id="btn-limpiar">
                                Limpiar
                            </button>
                            <button type="button" class="btn btn-accent" id="btn-ejemplo">
                                Ejemplo
                            </button>
                        </div>
                    </form>
                </div>
                
                <!-- Resultados Visuales -->
                <div class="card" id="results-card" style="display: none;">
                    <h2 class="card-title">
                        <i data-lucide="trending-up"></i>
                        Resultados del Análisis
                    </h2>
                    
                    <div class="results-display" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="result-card">
                            <span class="result-lbl">Número de Días</span>
                            <div class="result-val" id="res-dias" style="font-size: 1.75rem;">0</div>
                        </div>
                        <div class="result-card">
                            <span class="result-lbl">Tiempo Financiero (n)</span>
                            <div class="result-val" id="res-tiempo" style="font-size: 1.75rem;">0.0000</div>
                        </div>
                        <div class="result-card" style="grid-column: span 2;">
                            <span class="result-lbl">Interés Generado (I)</span>
                            <div class="result-val" id="res-interes" style="color: var(--accent); font-size: 2.25rem;">$0.00</div>
                        </div>
                        <div class="result-card" style="grid-column: span 2;">
                            <span class="result-lbl">Valor Futuro (VF)</span>
                            <div class="result-val" id="res-vf" style="color: var(--primary); font-size: 2.25rem;">$0.00</div>
                        </div>
                    </div>

                    <!-- Línea de Tiempo Horizontal -->
                    <div class="timeline-container">
                        <h3 style="font-size: 0.9rem; font-weight: 600; margin-bottom: 16px;">Línea de Tiempo del Crédito</h3>
                        <div class="timeline-wrapper">
                            <div class="timeline-line"></div>
                            <div class="timeline-progress" id="timeline-prog" style="width: 100%;"></div>
                            <div class="timeline-points">
                                <div class="timeline-point">
                                    <div class="point-dot"></div>
                                    <span class="point-label">Inicio</span>
                                    <span class="point-date" id="timeline-start-date">--/--/----</span>
                                </div>
                                <div class="timeline-point" style="align-items: flex-end;">
                                    <div class="point-dot end"></div>
                                    <span class="point-label">Fin</span>
                                    <span class="point-date" id="timeline-end-date">--/--/----</span>
                                </div>
                            </div>
                        </div>
                        <div class="timeline-info-badge">
                            <span class="timeline-badge" id="timeline-info-text">196 Días / 0.5370 Años</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Fórmulas y Explicación Académica -->
            <div class="card" id="academic-card" style="margin-top: 32px; display: none;">
                <h2 class="card-title">
                    <i data-lucide="book-open"></i>
                    Marco Metodológico y Paso a Paso
                </h2>
                
                <div class="formula-card">
                    <h3 style="font-size: 1rem; margin-bottom: 12px;">Fórmulas Aplicadas</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="formula-box">
                            <span class="math-text">I = P &times; i &times; n</span>
                            <span class="math-legend"><strong>I</strong> = Interés Generado<br><strong>P</strong> = Capital Inicial<br><strong>i</strong> = Tasa de Interés del período<br><strong>n</strong> = Tiempo financiero</span>
                        </div>
                        <div class="formula-box">
                            <span class="math-text">VF = P + I</span>
                            <span class="math-legend"><strong>VF</strong> = Valor Futuro (Monto)<br><strong>P</strong> = Capital Inicial<br><strong>I</strong> = Interés Acumulado</span>
                        </div>
                    </div>
                </div>

                <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 16px;">Cálculo Explicado Detalladamente</h3>
                <div class="step-list" id="step-by-step-content">
                    <!-- Se inyecta dinámicamente -->
                </div>
            </div>
        `;
    }

    /**
     * Función principal solicitada por requerimiento.
     * Calcula el interés simple dados los parámetros financieros.
     */
    function calcularInteresSimple(capital, tasaPercent, tipoTasa, fechaIniStr, fechaFinStr, baseAnio) {
        const dIni = new Date(fechaIniStr + 'T00:00:00');
        const dFin = new Date(fechaFinStr + 'T00:00:00');
        
        // 1. Calcular días transcurridos reales
        const diffTime = dFin.getTime() - dIni.getTime();
        const dias = Math.round(diffTime / (1000 * 3600 * 24));
        
        // 2. Determinar la base del período de la tasa según el tipo de año elegido
        let basePeriodo = 365;
        if (tipoTasa === 'anual') {
            basePeriodo = baseAnio;
        } else if (tipoTasa === 'semestral') {
            basePeriodo = baseAnio / 2;
        } else if (tipoTasa === 'trimestral') {
            basePeriodo = baseAnio / 4;
        } else if (tipoTasa === 'mensual') {
            basePeriodo = baseAnio / 12;
        } else if (tipoTasa === 'diaria') {
            basePeriodo = 1;
        }
        
        // 3. Convertir días transcurridos a tiempo financiero (n)
        const tiempo = dias / basePeriodo;
        
        // 4. Calcular interés simple (I = P * i * n)
        const i = tasaPercent / 100;
        const interes = capital * i * tiempo;
        
        // 5. Calcular valor futuro (VF = P + I)
        const valorFuturo = capital + interes;
        
        return {
            dias: dias,
            tiempo: tiempo,
            interes: interes,
            valorFuturo: valorFuturo,
            basePeriodo: basePeriodo
        };
    }

    /**
     * Inicializa los eventos del módulo e interactividad.
     */
    function init() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        const form = document.getElementById('simple-calc-form');
        const inputP = document.getElementById('simple-P');
        const inputI = document.getElementById('simple-i');
        const selectTipoTasa = document.getElementById('simple-tipo-tasa');
        const inputFechaIni = document.getElementById('simple-fecha-ini');
        const inputFechaFin = document.getElementById('simple-fecha-fin');
        const selectTipoAnio = document.getElementById('simple-tipo-anio');
        
        const errorContainer = document.getElementById('simple-validation-error');
        const validationMsg = document.getElementById('validation-msg');
        
        const resultsCard = document.getElementById('results-card');
        const academicCard = document.getElementById('academic-card');
        
        const resDias = document.getElementById('res-dias');
        const resTiempo = document.getElementById('res-tiempo');
        const resInteres = document.getElementById('res-interes');
        const resVf = document.getElementById('res-vf');
        
        const tStart = document.getElementById('timeline-start-date');
        const tEnd = document.getElementById('timeline-end-date');
        const tInfo = document.getElementById('timeline-info-text');
        
        const stepContent = document.getElementById('step-by-step-content');
        
        const btnLimpiar = document.getElementById('btn-limpiar');
        const btnEjemplo = document.getElementById('btn-ejemplo');

        btnEjemplo.addEventListener('click', () => {
            inputP.value = "10000000";
            inputI.value = "8";
            selectTipoTasa.value = "anual";
            inputFechaIni.value = "2026-03-07";
            inputFechaFin.value = "2026-09-19";
            selectTipoAnio.value = "365";
            
            errorContainer.style.display = 'none';
            form.dispatchEvent(new Event('submit'));
        });

        btnLimpiar.addEventListener('click', () => {
            form.reset();
            errorContainer.style.display = 'none';
            resultsCard.style.display = 'none';
            academicCard.style.display = 'none';
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            errorContainer.style.display = 'none';
            
            const P = parseFloat(inputP.value);
            const rate = parseFloat(inputI.value);
            const tipoTasa = selectTipoTasa.value;
            const fechaIni = inputFechaIni.value;
            const fechaFin = inputFechaFin.value;
            const baseAnio = parseInt(selectTipoAnio.value);
            
            if (isNaN(P) || P <= 0) {
                showError("El capital inicial debe ser un valor numérico mayor que cero.");
                return;
            }
            
            if (isNaN(rate) || rate <= 0) {
                showError("La tasa de interés debe ser un porcentaje mayor que cero.");
                return;
            }
            
            const dateInit = new Date(fechaIni + 'T00:00:00');
            const dateEnd = new Date(fechaFin + 'T00:00:00');
            
            if (dateEnd <= dateInit) {
                showError("La fecha final debe ser estrictamente posterior a la fecha inicial.");
                return;
            }

            const result = calcularInteresSimple(P, rate, tipoTasa, fechaIni, fechaFin, baseAnio);
            
            resDias.textContent = result.dias.toLocaleString('es-CO');
            resTiempo.textContent = result.tiempo.toLocaleString('es-CO', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
            resInteres.textContent = `$${result.interes.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP`;
            resVf.textContent = `$${result.valorFuturo.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP`;
            
            const formatFecha = (dateStr) => {
                const parts = dateStr.split('-');
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
            };
            
            tStart.textContent = formatFecha(fechaIni);
            tEnd.textContent = formatFecha(fechaFin);
            
            const unidadTiempo = tipoTasa === 'anual' ? 'Años' : tipoTasa + 's';
            tInfo.textContent = `${result.dias} Días transcurridos (${result.tiempo.toFixed(4)} ${unidadTiempo} de base ${result.basePeriodo.toFixed(1)} días)`;
            
            resultsCard.style.display = 'block';
            academicCard.style.display = 'block';
            
            renderStepByStep(P, rate, tipoTasa, result, formatFecha(fechaIni), formatFecha(fechaFin), baseAnio);
            
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });

        function showError(msg) {
            validationMsg.textContent = msg;
            errorContainer.style.display = 'block';
            resultsCard.style.display = 'none';
            academicCard.style.display = 'none';
            errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function renderStepByStep(P, rate, tipoTasa, result, fIniStr, fFinStr, baseAnio) {
            const rateDec = rate / 100;
            
            stepContent.innerHTML = `
                <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h4 class="step-title">Calcular días transcurridos reales</h4>
                        <p class="step-desc">Se obtiene la diferencia entre la fecha inicial (<strong>${fIniStr}</strong>) y la fecha final (<strong>${fFinStr}</strong>):</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 6px;">
                            ${fFinStr} - ${fIniStr} = ${result.dias} días reales.
                        </p>
                    </div>
                </div>
                
                <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h4 class="step-title">Convertir días a tiempo financiero (n)</h4>
                        <p class="step-desc">Dado que la tasa ingresada es <strong>${tipoTasa}</strong>, dividimos los días transcurridos por el número de días equivalentes en dicho período (base del período: <strong>${result.basePeriodo.toFixed(1)} días</strong> según el año de ${baseAnio} días):</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 6px;">
                            n = ${result.dias} / ${result.basePeriodo.toFixed(1)} = ${result.tiempo.toFixed(6)} períodos (${tipoTasa}s).
                        </p>
                    </div>
                </div>
                
                <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h4 class="step-title">Aplicar la fórmula de interés simple</h4>
                        <p class="step-desc">Multiplicamos el capital inicial (<strong>P</strong>) por la tasa de interés en decimal (<strong>i</strong>) por el tiempo financiero obtenido (<strong>n</strong>):</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 6px;">
                            I = ${P.toLocaleString('es-CO')} &times; ${rateDec} &times; ${result.tiempo.toFixed(6)}<br>
                            I = $${result.interes.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP
                        </p>
                    </div>
                </div>
                
                <div class="step-item">
                    <div class="step-number">4</div>
                    <div class="step-content">
                        <h4 class="step-title">Obtener el valor futuro total</h4>
                        <p class="step-desc">Sumamos el capital original prestado/invertido más los intereses generados calculados en el paso anterior:</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 6px;">
                            VF = P + I<br>
                            VF = $${P.toLocaleString('es-CO')} + $${result.interes.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br>
                            VF = $${result.valorFuturo.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP
                        </p>
                    </div>
                </div>
            `;
        }
    }

    // Registrar en el namespace global
    window.FinanceModules.simple = {
        title,
        description,
        render,
        calcularInteresSimple,
        init
    };
})();
