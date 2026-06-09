// modules/amortizacion.js
(function() {
    const title = "Amortización";
    const description = "Generación de tablas de amortización detalladas bajo los sistemas de cuota constante (Francés) y amortización constante (Alemán).";

    function render() {
        return `
            <div class="module-header">
                <h1>${title}</h1>
                <p class="module-description">${description}</p>
            </div>
            
            <div class="card" style="margin-bottom: 32px;">
                <h2 class="card-title">
                    <i data-lucide="settings"></i>
                    Parámetros del Crédito
                </h2>
                
                <form id="amort-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; align-items: end;">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label for="amort-system">Sistema de Amortización</label>
                        <div class="input-wrapper">
                            <i data-lucide="help-circle" class="input-icon"></i>
                            <select id="amort-system">
                                <option value="frances" selected>Francés (Cuota Fija)</option>
                                <option value="aleman">Alemán (Amortización Fija)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 0;">
                        <label for="amort-P">Monto del Préstamo ($)</label>
                        <div class="input-wrapper">
                            <i data-lucide="dollar-sign" class="input-icon"></i>
                            <input type="number" id="amort-P" placeholder="50000" value="50000" step="any" required>
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 0;">
                        <label for="amort-rate">Tasa del Período (% TEM)</label>
                        <div class="input-wrapper">
                            <i data-lucide="percent" class="input-icon"></i>
                            <input type="number" id="amort-rate" placeholder="1.5" value="1.5" step="any" required>
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 0;">
                        <label for="amort-n">Número de Cuotas (Meses)</label>
                        <div class="input-wrapper">
                            <i data-lucide="hash" class="input-icon"></i>
                            <input type="number" id="amort-n" placeholder="12" value="12" step="any" required>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="width: auto; height: 46px;">
                        <i data-lucide="table"></i> Generar Tabla
                    </button>
                </form>
            </div>
            
            <div class="card" id="amort-results-card" style="display: none;">
                <h2 class="card-title">
                    <i data-lucide="table-properties"></i>
                    Cronograma de Pagos
                </h2>
                
                <div class="results-display" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); display: grid; gap: 20px; margin-bottom: 24px;">
                    <div class="result-card" style="padding: 12px;">
                        <span class="result-lbl" style="font-size: 0.75rem;">Cuota Mensual Promedio</span>
                        <div class="result-val" id="amort-res-cuota" style="font-size: 1.5rem;">$0.00</div>
                    </div>
                    <div class="result-card" style="padding: 12px;">
                        <span class="result-lbl" style="font-size: 0.75rem;">Total Intereses Pagados</span>
                        <div class="result-val" id="amort-res-interes" style="font-size: 1.5rem;">$0.00</div>
                    </div>
                    <div class="result-card" style="padding: 12px;">
                        <span class="result-lbl" style="font-size: 0.75rem;">Costo Total del Crédito</span>
                        <div class="result-val" id="amort-res-total" style="font-size: 1.5rem;">$0.00</div>
                    </div>
                </div>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>N° Cuota</th>
                                <th>Saldo Pendiente</th>
                                <th>Amortización</th>
                                <th>Interés</th>
                                <th>Cuota Total</th>
                            </tr>
                        </thead>
                        <tbody id="amort-table-body">
                            <!-- Filled by JS -->
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
        
        const form = document.getElementById('amort-form');
        const selectSystem = document.getElementById('amort-system');
        const inputP = document.getElementById('amort-P');
        const inputRate = document.getElementById('amort-rate');
        const inputN = document.getElementById('amort-n');
        
        const resultsCard = document.getElementById('amort-results-card');
        const resCuota = document.getElementById('amort-res-cuota');
        const resInteres = document.getElementById('amort-res-interes');
        const resTotal = document.getElementById('amort-res-total');
        const tableBody = document.getElementById('amort-table-body');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const system = selectSystem.value;
            const P = parseFloat(inputP.value);
            const rateVal = parseFloat(inputRate.value) / 100;
            const n = parseInt(inputN.value);
            
            let tableRows = '';
            let saldo = P;
            let totalInterest = 0;
            let totalPaid = 0;
            let sumCuota = 0;
            
            if (system === 'frances') {
                const cuotaFija = P * ((rateVal * Math.pow(1 + rateVal, n)) / (Math.pow(1 + rateVal, n) - 1));
                
                for (let t = 1; t <= n; t++) {
                    const interes = saldo * rateVal;
                    const amortizacion = cuotaFija - interes;
                    const nuevoSaldo = saldo - amortizacion;
                    
                    tableRows += `
                        <tr>
                            <td><strong>${t}</strong></td>
                            <td>$${saldo.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td>$${amortizacion.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td>$${interes.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td><strong>$${cuotaFija.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                        </tr>
                    `;
                    
                    totalInterest += interes;
                    sumCuota += cuotaFija;
                    saldo = Math.max(0, nuevoSaldo);
                }
                resCuota.textContent = `$${cuotaFija.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            } else {
                const amortizacionFija = P / n;
                
                for (let t = 1; t <= n; t++) {
                    const interes = saldo * rateVal;
                    const cuota = amortizacionFija + interes;
                    const nuevoSaldo = saldo - amortizacionFija;
                    
                    tableRows += `
                        <tr>
                            <td><strong>${t}</strong></td>
                            <td>$${saldo.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td>$${amortizacionFija.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td>$${interes.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td><strong>$${cuota.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                        </tr>
                    `;
                    
                    totalInterest += interes;
                    sumCuota += cuota;
                    saldo = Math.max(0, nuevoSaldo);
                }
                const avgCuota = sumCuota / n;
                resCuota.textContent = `$${avgCuota.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Promedio)`;
            }
            
            totalPaid = P + totalInterest;
            resInteres.textContent = `$${totalInterest.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            resTotal.textContent = `$${totalPaid.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            
            tableBody.innerHTML = tableRows;
            resultsCard.style.display = 'block';
        });
    }

    // Registrar en el objeto global
    window.FinanceModules.amortizacion = {
        title,
        description,
        render,
        init
    };
})();
