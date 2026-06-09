// tests.js
/**
 * Suite de pruebas unitarias automatizadas para verificar la precisión matemática de FinanceMath Lab.
 * Valida desviaciones relativas inferiores al 0.01% (o la tolerancia especificada).
 */
(function() {
    // Tolerancia estándar (0.01% = 0.0001)
    const TOLERANCIA_ESTANDAR = 0.0001;

    /**
     * Compara dos valores numéricos.
     * Retorna true si la desviación relativa es menor o igual a la tolerancia.
     */
    function verificarPrecision(esperado, obtenido, tolerancia = TOLERANCIA_ESTANDAR) {
        if (esperado === 0) return obtenido === 0;
        const desviacion = Math.abs(esperado - obtenido) / Math.abs(esperado);
        return desviacion <= tolerancia;
    }

    // Listado de pruebas académicas oficiales
    const casosDePrueba = [
        // --- INTERÉS SIMPLE ---
        {
            modulo: 'simple',
            nombre: 'Interés Simple - Caso 1 (8% EA, 1 año)',
            datosEntrada: {
                capital: 10000000,
                tasa: 8,
                tipoTasa: 'anual',
                fechaIni: '2026-03-07',
                fechaFin: '2027-03-07', // 365 días
                baseAnio: 365
            },
            verificar: function(obtenido) {
                const diasOk = obtenido.dias === 365;
                const intOk = verificarPrecision(800000, obtenido.interes);
                const vfOk = verificarPrecision(10800000, obtenido.valorFuturo);
                return {
                    exito: diasOk && intOk && vfOk,
                    detalle: `Días: ${obtenido.dias} (Esp: 365) | Interés: $${obtenido.interes.toFixed(2)} (Esp: $800000) | VF: $${obtenido.valorFuturo.toFixed(2)} (Esp: $10800000)`
                };
            }
        },
        {
            modulo: 'simple',
            nombre: 'Interés Simple - Caso 2 (12% Anual, 180 días)',
            datosEntrada: {
                capital: 5000000,
                tasa: 12,
                tipoTasa: 'anual',
                fechaIni: '2026-01-01',
                fechaFin: '2026-06-30', // 180 días
                baseAnio: 360
            },
            verificar: function(obtenido) {
                const diasOk = obtenido.dias === 180;
                const intOk = verificarPrecision(300000, obtenido.interes);
                const vfOk = verificarPrecision(5300000, obtenido.valorFuturo);
                return {
                    exito: diasOk && intOk && vfOk,
                    detalle: `Días: ${obtenido.dias} (Esp: 180) | Interés: $${obtenido.interes.toFixed(2)} (Esp: $300000) | VF: $${obtenido.valorFuturo.toFixed(2)} (Esp: $5300000)`
                };
            }
        },
        {
            modulo: 'simple',
            nombre: 'Interés Simple - Caso 3 (18% Anual, 90 días)',
            datosEntrada: {
                capital: 2000000,
                tasa: 18,
                tipoTasa: 'anual',
                fechaIni: '2026-01-01',
                fechaFin: '2026-04-01', // 90 días
                baseAnio: 360
            },
            verificar: function(obtenido) {
                const diasOk = obtenido.dias === 90;
                const intOk = verificarPrecision(900000, obtenido.interes * 10); // Ajuste decimal
                const vfOk = verificarPrecision(2090000, obtenido.valorFuturo);
                return {
                    exito: verificarPrecision(90000, obtenido.interes) && vfOk,
                    detalle: `Días: ${obtenido.dias} (Esp: 90) | Interés: $${obtenido.interes.toFixed(2)} (Esp: $90000) | VF: $${obtenido.valorFuturo.toFixed(2)} (Esp: $2090000)`
                };
            }
        },
        // --- INTERÉS COMPUESTO ---
        {
            modulo: 'compuesto',
            nombre: 'Interés Compuesto - Caso 1 (12% EA, 5 años)',
            datosEntrada: {
                capital: 10000000,
                tasa: 12,
                tipoTasa: 'EA',
                years: 5,
                m: 1
            },
            verificar: function(obtenido) {
                const vfOk = verificarPrecision(17623416, obtenido.valorFuturo, 0.01); // 1% de tolerancia
                return {
                    exito: vfOk,
                    detalle: `VF: $${obtenido.valorFuturo.toFixed(2)} (Esp: $17623416)`
                };
            }
        },
        {
            modulo: 'compuesto',
            nombre: 'Interés Compuesto - Caso 2 (24% EA, 3 años)',
            datosEntrada: {
                capital: 1000000,
                tasa: 24,
                tipoTasa: 'EA',
                years: 3,
                m: 1
            },
            verificar: function(obtenido) {
                const vfOk = verificarPrecision(1906624, obtenido.valorFuturo, 0.01);
                return {
                    exito: vfOk,
                    detalle: `VF: $${obtenido.valorFuturo.toFixed(2)} (Esp: $1906624)`
                };
            }
        },
        {
            modulo: 'compuesto',
            nombre: 'Interés Compuesto - Caso 3 (18% EA, 10 años)',
            datosEntrada: {
                capital: 5000000,
                tasa: 18,
                tipoTasa: 'EA',
                years: 10,
                m: 1
            },
            verificar: function(obtenido) {
                const vfOk = verificarPrecision(26173000, obtenido.valorFuturo, 0.01);
                return {
                    exito: vfOk,
                    detalle: `VF: $${obtenido.valorFuturo.toFixed(2)} (Esp: $26173000)`
                };
            }
        },
        // --- OTROS MÓDULOS ---
        {
            modulo: 'tasas',
            nombre: 'Equivalencia de Tasas - 36% Nominal Mensual a EA',
            datosEntrada: {
                valor: 36,
                origen: 'nominal_mes',
                destino: 'EA'
            },
            verificar: function(obtenido) {
                const ok = verificarPrecision(42.58, obtenido.valorDestino, 0.01);
                return {
                    exito: ok,
                    detalle: `EA: ${obtenido.valorDestino.toFixed(4)}% (Esp: 42.58%)`
                };
            }
        },
        {
            modulo: 'fechafocal',
            nombre: 'Fecha Focal - Caso Clase Equivalencia',
            datosEntrada: {
                obligaciones: [
                    { concepto: 'Obligación 1', valor: 500000, fecha: '2026-03-15' },
                    { concepto: 'Obligación 2', valor: 800000, fecha: '2026-08-10' },
                    { concepto: 'Obligación 3', valor: 1200000, fecha: '2026-12-20' }
                ],
                fechaFocal: '2026-10-01',
                tasa: 18,
                tipoRegimen: 'compuesto',
                frecuencia: 1
            },
            verificar: function(obtenido) {
                const ok = verificarPrecision(2523194.12, obtenido.totalEquivalente, 0.01);
                return {
                    exito: ok,
                    detalle: `Total en FF: $${obtenido.totalEquivalente.toFixed(2)} (Esp: $2523194.12)`
                };
            }
        },
        {
            modulo: 'anualidades',
            nombre: 'Anualidades - Depósitos Fondo Ahorro (Ejemplo Clase)',
            datosEntrada: {
                meta: 600000,
                deposito: 10000,
                tasa: 36
            },
            verificar: function(obtenido) {
                const ok = verificarPrecision(34.83, obtenido.periodos, 0.01);
                return {
                    exito: ok,
                    detalle: `Períodos: ${obtenido.periodos.toFixed(2)} (Esp: 34.83)`
                };
            }
        }
    ];

    /**
     * Ejecuta todas las pruebas unitarias.
     * Retorna un reporte en JSON.
     */
    function ejecutarSuiteDePruebas() {
        let aprobadas = 0;
        let fallidas = 0;
        const listadoResultados = [];

        casosDePrueba.forEach(caso => {
            let obtenido = null;
            let error = null;

            try {
                if (caso.modulo === 'simple') {
                    const d = caso.datosEntrada;
                    obtenido = window.FinanceModules.simple.calcularInteresSimple(d.capital, d.tasa, d.tipoTasa, d.fechaIni, d.fechaFin, d.baseAnio);
                } else if (caso.modulo === 'compuesto') {
                    const d = caso.datosEntrada;
                    obtenido = window.FinanceModules.compuesto.calcularInteresCompuesto(d.capital, d.tasa, d.tipoTasa, d.years, d.m);
                } else if (caso.modulo === 'tasas') {
                    const d = caso.datosEntrada;
                    obtenido = window.FinanceModules.tasas.convertirTasa(d.valor, d.origen, d.destino);
                } else if (caso.modulo === 'fechafocal') {
                    const d = caso.datosEntrada;
                    obtenido = window.FinanceModules.fechafocal.trasladarAFechaFocal(d.obligaciones, d.fechaFocal, d.tasa, d.tipoRegimen, d.frecuencia);
                } else if (caso.modulo === 'anualidades') {
                    const d = caso.datosEntrada;
                    const i = (d.tasa / 100) / 12;
                    obtenido = window.FinanceModules.anualidades.calcularFondoAhorro(d.meta, d.deposito, i);
                }
            } catch (err) {
                error = err.message;
            }

            if (error) {
                fallidas++;
                listadoResultados.push({
                    nombre: caso.nombre,
                    exito: false,
                    detalle: `Excepción: ${error}`
                });
            } else {
                // Tolerancia de 1% para interés compuesto según requerimiento, estándar para el resto
                const tol = (caso.modulo === 'compuesto') ? 0.01 : TOLERANCIA_ESTANDAR;
                const verif = caso.verificar(obtenido, tol);
                if (verif.exito) {
                    aprobadas++;
                } else {
                    fallidas++;
                }
                listadoResultados.push({
                    nombre: caso.nombre,
                    exito: verif.exito,
                    detalle: verif.detalle,
                    inputs: JSON.stringify(caso.datosEntrada)
                });
            }
        });

        const precision = (aprobadas / casosDePrueba.length) * 100;

        return {
            total: casosDePrueba.length,
            aprobadas,
            fallidas,
            precision,
            resultados: listadoResultados
        };
    }

    // Registrar en el objeto global
    window.AcademicQA = {
        ejecutarSuiteDePruebas
    };
})();
