// modules/fechafocal.js
(function() {
    const title = "Fecha Focal";
    const description = "Módulo interactivo para resolver ecuaciones de valor trasladando múltiples obligaciones a un punto común de referencia en el tiempo (Fecha Focal).";

    function render() {
        return `
            <div class="module-header">
                <h1>${title}</h1>
                <p class="module-description">${description}</p>
            </div>
            
            <div class="module-grid">
                <!-- Formulario de Entrada y Tabla Dinámica -->
                <div class="card" style="grid-column: span 2;">
                    <h2 class="card-title">
                        <i data-lucide="calculator"></i>
                        Ecuación de Valor y Parámetros
                    </h2>
                    
                    <form id="focal-calc-form">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 24px;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label for="focal-rate-val">Tasa de Interés (%)</label>
                                <div class="input-wrapper">
                                    <i data-lucide="percent" class="input-icon"></i>
                                    <input type="number" id="focal-rate-val" placeholder="Ej. 18" min="0.0001" step="any" required>
                                </div>
                            </div>
                            
                            <div class="form-group" style="margin-bottom: 0;">
                                <label for="focal-rate-type">Tipo de Tasa</label>
                                <div class="input-wrapper">
                                    <i data-lucide="settings" class="input-icon"></i>
                                    <select id="focal-rate-type">
                                        <option value="compuesto" selected>Compuesto (Capitalización)</option>
                                        <option value="simple">Simple</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-group" style="margin-bottom: 0;">
                                <label for="focal-frec">Frecuencia / Base de Tasa</label>
                                <div class="input-wrapper">
                                    <i data-lucide="calendar" class="input-icon"></i>
                                    <select id="focal-frec">
                                        <option value="1" selected>Anual (EA / Simple Anual)</option>
                                        <option value="2">Semestral</option>
                                        <option value="4">Trimestral</option>
                                        <option value="12">Mensual</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-group" style="margin-bottom: 0;">
                                <label for="focal-date-val">Fecha Focal</label>
                                <input type="date" id="focal-date-val" required>
                            </div>
                        </div>
                        
                        <!-- Tabla Dinámica de Obligaciones -->
                        <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 12px; color: var(--text-primary);">Obligaciones Financieras</h3>
                        <div class="dynamic-table-container">
                            <table id="obligaciones-table">
                                <thead>
                                    <tr>
                                        <th>Concepto / Descripción</th>
                                        <th style="width: 200px;">Valor Original ($ COP)</th>
                                        <th style="width: 200px;">Fecha de Vencimiento</th>
                                        <th style="width: 50px;">Acción</th>
                                    </tr>
                                </thead>
                                <tbody id="obligaciones-tbody">
                                    <!-- Filas dinámicas -->
                                </tbody>
                            </table>
                        </div>
                        
                        <div style="display: flex; gap: 12px; margin-bottom: 24px;">
                            <button type="button" class="btn btn-secondary" id="btn-add-row" style="width: auto; padding: 10px 20px;">
                                <i data-lucide="plus"></i> Agregar Obligación
                            </button>
                        </div>
                        
                        <!-- Alerta de Validación -->
                        <div id="focal-validation-error" style="display: none; color: #ef4444; margin-bottom: 20px; font-size: 0.85rem; font-weight: 600;">
                            <i data-lucide="alert-circle" style="width: 16px; height: 16px; display: inline; vertical-align: middle;"></i>
                            <span id="focal-validation-msg">Error de validación</span>
                        </div>

                        <!-- Botonera -->
                        <div class="actions-grid">
                            <button type="submit" class="btn btn-primary" id="focal-btn-calcular">
                                <i data-lucide="play"></i> Calcular Equivalencias
                            </button>
                            <button type="button" class="btn btn-secondary" id="focal-btn-limpiar">
                                Limpiar Todo
                            </button>
                            <button type="button" class="btn btn-accent" id="focal-btn-ejemplo">
                                Cargar Ejemplo Clase
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- Resultados y Línea de Tiempo -->
            <div class="card" id="focal-results-card" style="margin-top: 32px; display: none;">
                <h2 class="card-title">
                    <i data-lucide="trending-up"></i>
                    Resultados en la Fecha Focal
                </h2>
                
                <div class="results-display" style="margin-bottom: 24px;">
                    <div class="result-card">
                        <span class="result-lbl">Total Equivalente en Fecha Focal</span>
                        <div class="result-val" id="focal-res-total" style="color: var(--accent); font-size: 2.5rem;">$0.00 COP</div>
                    </div>
                </div>

                <!-- Línea de Tiempo Interactiva -->
                <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 12px;">Línea de Tiempo Interactiva</h3>
                <div class="focal-timeline-wrapper">
                    <div class="focal-timeline-line"></div>
                    <div class="focal-timeline-dots" id="focal-timeline-dots-container">
                        <!-- Puntos inyectados -->
                    </div>
                </div>
                <p style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; margin-top: 8px;">Pasa el mouse sobre cada marcador para ver los detalles originales y equivalentes.</p>
            </div>
            
            <!-- Tabla de Resultados Comparativos -->
            <div class="card" id="focal-table-card" style="margin-top: 32px; display: none;">
                <h2 class="card-title">
                    <i data-lucide="table-properties"></i>
                    Desglose de Equivalencias
                </h2>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Concepto</th>
                                <th>Valor Original</th>
                                <th>Fecha</th>
                                <th>Días Diferencia</th>
                                <th>Operación (Dirección)</th>
                                <th>Factor Utilizado</th>
                                <th>Valor Equivalente</th>
                            </tr>
                        </thead>
                        <tbody id="focal-table-body">
                            <!-- Inyectado dinámicamente -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Explicación Paso a Paso -->
            <div class="card" id="focal-academic-card" style="margin-top: 32px; display: none;">
                <h2 class="card-title">
                    <i data-lucide="book-open"></i>
                    Desarrollo Matemático Paso a Paso
                </h2>
                
                <div class="formula-card">
                    <h3 style="font-size: 1rem; margin-bottom: 12px;">Fórmulas según Régimen</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="formula-box">
                            <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary);">INTERÉS COMPUESTO</span>
                            <span class="math-text" style="font-size: 1.15rem;">VF = VP(1+i)<sup>n</sup> / VP = VF/(1+i)<sup>n</sup></span>
                        </div>
                        <div class="formula-box">
                            <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary);">INTERÉS SIMPLE</span>
                            <span class="math-text" style="font-size: 1.15rem;">VF = VP(1+i&middot;n) / VP = VF/(1+i&middot;n)</span>
                        </div>
                    </div>
                </div>

                <div class="step-list" id="focal-step-by-step">
                    <!-- Inyectado dinámicamente -->
                </div>
            </div>
        `;
    }

    /**
     * Calcula la diferencia de días entre dos fechas.
     */
    function calcularDias(fecha1, fecha2) {
        const d1 = new Date(fecha1 + 'T00:00:00');
        const d2 = new Date(fecha2 + 'T00:00:00');
        const diff = d2.getTime() - d1.getTime();
        return Math.round(diff / (1000 * 3600 * 24));
    }

    /**
     * Calcula el factor financiero de interés simple.
     */
    function calcularFactorSimple(i, n, direccion) {
        if (direccion === 'futuro') {
            return 1 + (i * n);
        } else {
            return 1 / (1 + (i * n));
        }
    }

    /**
     * Calcula el factor financiero de interés compuesto.
     */
    function calcularFactorCompuesto(i, n, direccion) {
        if (direccion === 'futuro') {
            return Math.pow(1 + i, n);
        } else {
            return 1 / Math.pow(1 + i, n);
        }
    }

    /**
     * Traslada obligaciones financieras a la fecha focal indicada.
     */
    function trasladarAFechaFocal(obligaciones, fechaFocalStr, tasaPercent, tipoRégimen, frecuenciaM) {
        const m = parseInt(frecuenciaM);
        const rVal = tasaPercent / 100;
        
        let i = 0;
        let baseAnio = 365; // Año calendario para matemáticas financieras

        // Determinar tasa periódica i
        if (tipoRégimen === 'compuesto') {
            // Si es compuesto, asumimos que la tasa ingresada es Efectiva Anual (EA)
            // i_periodica = (1 + TEA)^(1/m) - 1
            i = Math.pow(1 + rVal, 1 / m) - 1;
        } else {
            // Simple: i_periodica = tasa_anual / m
            i = rVal / m;
        }

        // Período base en días para convertir días a períodos (n)
        const basePeriodo = baseAnio / m;
        
        const resultados = obligaciones.map(ob => {
            const dias = calcularDias(ob.fecha, fechaFocalStr);
            const n = Math.abs(dias) / basePeriodo;
            
            let direccion = 'focal';
            let factor = 1;
            
            if (dias > 0) {
                // La obligación vence antes de la fecha focal: Capitalización (Futuro)
                direccion = 'futuro';
                factor = (tipoRégimen === 'compuesto') 
                    ? calcularFactorCompuesto(i, n, 'futuro')
                    : calcularFactorSimple(i, n, 'futuro');
            } else if (dias < 0) {
                // La obligación vence después de la fecha focal: Descuento (Presente)
                direccion = 'presente';
                factor = (tipoRégimen === 'compuesto') 
                    ? calcularFactorCompuesto(i, n, 'presente')
                    : calcularFactorSimple(i, n, 'presente');
            }
            
            const valorEquivalente = ob.valor * factor;
            
            return {
                concepto: ob.concepto,
                valorOriginal: ob.valor,
                fecha: ob.fecha,
                dias: dias,
                n: n,
                direccion: direccion,
                factor: factor,
                valorEquivalente: valorEquivalente
            };
        });
        
        const totalEquivalente = resultados.reduce((sum, r) => sum + r.valorEquivalente, 0);
        
        return {
            resultados,
            totalEquivalente,
            tasaPeriodica: i,
            basePeriodo
        };
    }

    function init() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        const form = document.getElementById('focal-calc-form');
        const inputRate = document.getElementById('focal-rate-val');
        const selectType = document.getElementById('focal-rate-type');
        const selectFrec = document.getElementById('focal-frec');
        const inputFocalDate = document.getElementById('focal-date-val');
        
        const tbody = document.getElementById('obligaciones-tbody');
        const btnAddRow = document.getElementById('btn-add-row');
        
        const errorContainer = document.getElementById('focal-validation-error');
        const validationMsg = document.getElementById('focal-validation-msg');
        
        const resultsCard = document.getElementById('focal-results-card');
        const timelineDotsContainer = document.getElementById('focal-timeline-dots-container');
        const tableCard = document.getElementById('focal-table-card');
        const tableBody = document.getElementById('focal-table-body');
        const academicCard = document.getElementById('focal-academic-card');
        const stepContainer = document.getElementById('focal-step-by-step');
        
        const btnLimpiar = document.getElementById('focal-btn-limpiar');
        const btnEjemplo = document.getElementById('focal-btn-ejemplo');

        // Función para agregar filas a la tabla
        function addRow(concepto = '', valor = '', fecha = '') {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="text" class="ob-concepto" placeholder="Ej. Factura 102" value="${concepto}" required></td>
                <td><input type="number" class="ob-valor" placeholder="Ej. 500000" min="0.01" step="any" value="${valor}" required></td>
                <td><input type="date" class="ob-fecha" value="${fecha}" required></td>
                <td>
                    <button type="button" class="delete-row-btn" aria-label="Eliminar Obligación">
                        <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
                    </button>
                </td>
            `;
            
            tr.querySelector('.delete-row-btn').addEventListener('click', () => {
                tr.remove();
            });
            
            tbody.appendChild(tr);
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }

        // Agregar fila inicial vacía por defecto
        addRow();

        btnAddRow.addEventListener('click', () => addRow());

        // Cargar ejemplo
        btnEjemplo.addEventListener('click', () => {
            inputRate.value = "18";
            selectType.value = "compuesto";
            selectFrec.value = "1"; // Anual (EA)
            inputFocalDate.value = "2026-10-01"; // 01/10/2026
            
            tbody.innerHTML = '';
            addRow("Obligación 1", "500000", "2026-03-15");
            addRow("Obligación 2", "800000", "2026-08-10");
            addRow("Obligación 3", "1200000", "2026-12-20");
            
            errorContainer.style.display = 'none';
            form.dispatchEvent(new Event('submit'));
        });

        // Limpiar todo
        btnLimpiar.addEventListener('click', () => {
            form.reset();
            tbody.innerHTML = '';
            addRow();
            errorContainer.style.display = 'none';
            resultsCard.style.display = 'none';
            tableCard.style.display = 'none';
            academicCard.style.display = 'none';
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            errorContainer.style.display = 'none';
            
            const tasa = parseFloat(inputRate.value);
            const tipoRegimen = selectType.value;
            const frec = selectFrec.value;
            const fechaFocal = inputFocalDate.value;
            
            // Obtener obligaciones del DOM
            const rows = tbody.querySelectorAll('tr');
            const obligaciones = [];
            
            let hasError = false;
            
            rows.forEach((row, idx) => {
                const concepto = row.querySelector('.ob-concepto').value.trim();
                const valor = parseFloat(row.querySelector('.ob-valor').value);
                const fecha = row.querySelector('.ob-fecha').value;
                
                if (!concepto || isNaN(valor) || valor <= 0 || !fecha) {
                    hasError = true;
                } else {
                    obligaciones.push({ concepto, valor, fecha });
                }
            });
            
            if (hasError || obligaciones.length === 0) {
                showError("Por favor, rellene correctamente todos los campos de las obligaciones.");
                return;
            }
            if (isNaN(tasa) || tasa <= 0) {
                showError("La tasa de interés debe ser mayor a cero.");
                return;
            }
            if (!fechaFocal) {
                showError("La fecha focal es obligatoria.");
                return;
            }

            // --- EJECUTAR CÁLCULOS ---
            const res = trasladarAFechaFocal(obligaciones, fechaFocal, tasa, tipoRegimen, frec);
            
            // --- MOSTRAR RESULTADOS ---
            document.getElementById('focal-res-total').textContent = `$${res.totalEquivalente.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP`;
            
            // Inyectar tabla de desglose
            let tableHTML = '';
            res.resultados.forEach(r => {
                const dirLabel = r.direccion === 'futuro' ? 'Capitalizar (Futuro)' : (r.direccion === 'presente' ? 'Descontar (Presente)' : 'Fecha Focal');
                tableHTML += `
                    <tr>
                        <td><strong>${r.concepto}</strong></td>
                        <td>$${r.valorOriginal.toLocaleString('es-CO')}</td>
                        <td>${formatFecha(r.fecha)}</td>
                        <td>${r.dias > 0 ? '+' : ''}${r.dias} días</td>
                        <td><span class="badge" style="background-color: ${r.direccion === 'futuro' ? 'var(--accent-light)' : 'rgba(37, 99, 235, 0.1)'}; color: ${r.direccion === 'futuro' ? 'var(--accent)' : 'var(--primary)'};">${dirLabel}</span></td>
                        <td>${r.factor.toFixed(6)}</td>
                        <td><strong>$${r.valorEquivalente.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                    </tr>
                `;
            });
            tableBody.innerHTML = tableHTML;
            
            resultsCard.style.display = 'block';
            tableCard.style.display = 'block';
            academicCard.style.display = 'block';
            
            // --- RENDERIZAR LÍNEA DE TIEMPO INTERACTIVA ---
            renderTimeline(obligaciones, fechaFocal, res.resultados);
            
            // --- RENDERIZAR PASO A PASO ---
            renderSteps(res.resultados, res.tasaPeriodica, res.basePeriodo, res.totalEquivalente, tipoRegimen);
            
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });

        function showError(msg) {
            validationMsg.textContent = msg;
            errorContainer.style.display = 'block';
            resultsCard.style.display = 'none';
            tableCard.style.display = 'none';
            academicCard.style.display = 'none';
        }

        function formatFecha(dateStr) {
            const parts = dateStr.split('-');
            return `${parts[2]}/${parts[1]}/${parts[2] ? parts[0] : ''}`;
        }

        function renderTimeline(obligaciones, fechaFocal, resultados) {
            // Combinar todas las fechas y ordenarlas
            const todosLosPuntos = [
                { type: 'focal', dateStr: fechaFocal, label: 'Fecha Focal', valor: 0, valEq: 0, dateObj: new Date(fechaFocal + 'T00:00:00') }
            ];
            
            resultados.forEach(r => {
                todosLosPuntos.push({
                    type: 'ob',
                    dateStr: r.fecha,
                    label: r.concepto,
                    valor: r.valorOriginal,
                    valEq: r.valorEquivalente,
                    dateObj: new Date(r.fecha + 'T00:00:00')
                });
            });
            
            // Ordenar por fecha cronológicamente
            todosLosPuntos.sort((a, b) => a.dateObj - b.dateObj);
            
            // Renderizar puntos
            let dotsHTML = '';
            todosLosPuntos.forEach(p => {
                const esFocal = p.type === 'focal';
                dotsHTML += `
                    <div class="focal-timeline-dot-container">
                        <div class="focal-timeline-dot ${esFocal ? 'focal' : ''}"></div>
                        <span class="focal-timeline-label">${esFocal ? 'F. Focal' : p.label}</span>
                        <span class="focal-timeline-sublabel">${formatFecha(p.dateStr)}</span>
                        
                        <!-- Tooltip enriquecido -->
                        <div class="tooltip">
                            <strong style="color: ${esFocal ? 'var(--accent)' : 'var(--primary)'};">${p.label}</strong><br>
                            <span style="font-size: 0.8rem;">Fecha: ${formatFecha(p.dateStr)}</span><br>
                            ${!esFocal ? `
                            <span style="font-size: 0.8rem;">Val. Original: $${p.valor.toLocaleString('es-CO')}</span><br>
                            <span style="font-size: 0.8rem; font-weight: 700;">Val. en FF: $${p.valEq.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            ` : `
                            <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent);">Punto de valuación</span>
                            `}
                        </div>
                    </div>
                `;
            });
            
            timelineDotsContainer.innerHTML = dotsHTML;
        }

        function renderSteps(resultados, iPeriodica, basePeriodo, total, regimen) {
            let stepsHTML = '';
            
            resultados.forEach((r, idx) => {
                const dirText = r.direccion === 'futuro' ? 'se traslada hacia el futuro (capitalización)' : (r.direccion === 'presente' ? 'se traslada al presente (descuento)' : 'se encuentra en la misma fecha focal');
                const formText = regimen === 'compuesto' 
                    ? (r.direccion === 'futuro' ? `VF = VP &times; (1 + i)<sup>n</sup>` : `VP = VF / (1 + i)<sup>n</sup>`)
                    : (r.direccion === 'futuro' ? `VF = VP &times; (1 + i&middot;n)` : `VP = VF / (1 + i&middot;n)`);
                
                stepsHTML += `
                    <div class="step-item" style="border-left: 4px solid ${r.direccion === 'futuro' ? 'var(--accent)' : 'var(--primary)'}; padding-left: 20px; margin-bottom: 24px;">
                        <h3 style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Obligación: ${r.concepto} ($${r.valorOriginal.toLocaleString('es-CO')})</h3>
                        <div class="step-list">
                            <div class="step-item" style="padding: 10px; margin-bottom: 8px;">
                                <div class="step-number">1</div>
                                <div class="step-content">
                                    <h4 class="step-title">Calcular la diferencia de tiempo en días</h4>
                                    <p class="step-desc">Diferencia entre la fecha del documento (${formatFecha(r.fecha)}) y la fecha focal:</p>
                                    <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 4px;">
                                        Días = ${Math.abs(r.dias)} días de diferencia.
                                    </p>
                                </div>
                            </div>
                            
                            <div class="step-item" style="padding: 10px; margin-bottom: 8px;">
                                <div class="step-number">2</div>
                                <div class="step-content">
                                    <h4 class="step-title">Determinar dirección del flujo</h4>
                                    <p class="step-desc">La obligación ${dirText} y requiere calcular un número de períodos financieros:</p>
                                    <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 4px;">
                                        n = ${Math.abs(r.dias)} / ${basePeriodo.toFixed(1)} = ${r.n.toFixed(6)} períodos.
                                    </p>
                                </div>
                            </div>

                            <div class="step-item" style="padding: 10px; margin-bottom: 8px;">
                                <div class="step-number">3</div>
                                <div class="step-content">
                                    <h4 class="step-title">Aplicar fórmula y factor financiero</h4>
                                    <p class="step-desc">Fórmula utilizada: <strong>${formText}</strong> con tasa periódica i = ${(iPeriodica * 100).toFixed(6)}%:</p>
                                    <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 4px;">
                                        Factor = ${r.factor.toFixed(8)}
                                    </p>
                                </div>
                            </div>

                            <div class="step-item" style="padding: 10px; margin-bottom: 8px;">
                                <div class="step-number">4</div>
                                <div class="step-content">
                                    <h4 class="step-title">Obtener valor equivalente</h4>
                                    <p class="step-desc">Multiplicamos el valor original por el factor financiero calculado:</p>
                                    <p class="step-desc" style="font-family: monospace; font-weight: bold; margin-top: 4px;">
                                        Valor Equivalente = $${r.valorOriginal.toLocaleString('es-CO')} &times; ${r.factor.toFixed(8)} = $${r.valorEquivalente.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            // Paso 5: suma total
            stepsHTML += `
                <div class="step-item" style="border-top: 2px dashed var(--border-color); padding-top: 20px; background-color: var(--accent-light);">
                    <div class="step-number" style="background-color: var(--accent);">5</div>
                    <div class="step-content">
                        <h4 class="step-title" style="color: var(--accent);">Sumar todos los valores equivalentes</h4>
                        <p class="step-desc" style="color: var(--text-primary);">Se consolida la ecuación sumando el valor de cada una de las obligaciones valuadas en la fecha focal común:</p>
                        <p class="step-desc" style="font-family: monospace; font-weight: 700; margin-top: 8px; font-size: 1rem; color: var(--accent);">
                            Total = ${resultados.map(r => `$${r.valorEquivalente.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`).join(' + ')}<br>
                            Total Equivalente en Fecha Focal = $${total.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP
                        </p>
                    </div>
                </div>
            `;
            
            stepContainer.innerHTML = stepsHTML;
        }
    }

    // Registrar globalmente
    window.FinanceModules.fechafocal = {
        title,
        description,
        render,
        calcularDias,
        calcularFactorSimple,
        calcularFactorCompuesto,
        trasladarAFechaFocal,
        init
    };
})();
