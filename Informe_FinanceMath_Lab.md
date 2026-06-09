# FINANCEMATH LAB
## Herramienta Web Interactiva de Matemáticas Financieras

<div align="center">
  <br>
  <strong>Universidad del Tolima</strong><br>
  <strong>Programa:</strong> Administración Financiera<br>
  <strong>Asignatura:</strong> Matemáticas Financieras I<br>
  <strong>Estudiante:</strong> Leonardo Javier Bastidas Moreno<br>
  <strong>Popayán, 2026</strong>
  <br><br>
</div>

---

## Introducción

En la formación y el ejercicio de la **Administración Financiera**, la comprensión profunda de la equivalencia del dinero en el tiempo es fundamental para la planeación estratégica y la toma de decisiones. Conceptos como la capitalización simple y compuesta, el descuento de obligaciones, la conversión de tasas y el diseño de cronogramas de pagos sustentan la viabilidad financiera corporativa.

**FinanceMath Lab** es una plataforma educativa interactiva construida en formato de *Single-Page Application* (SPA) utilizando únicamente tecnologías web nativas (**HTML5, CSS3 y JavaScript Vanilla**). Su diseño responsive facilita el acceso tanto en equipos de escritorio como en dispositivos móviles, y al no requerir dependencias de frameworks ni servidores dinámicos de backend, es 100% compatible con **GitHub Pages** y ejecutable de forma local (`file:///`).

Este informe contiene el fundamento matemático, manual de usuario y ejemplos prácticos de verificación para cada uno de los módulos constitutivos del laboratorio.

---

## Módulo 1: Interés Simple

El interés simple se caracteriza porque los intereses generados en cada período no se acumulan al capital para producir nuevos intereses; es decir, se calculan siempre sobre el capital original.

### Formulación Matemática
* **Interés Generado ($I$)**:
  $$I = VP \times i \times n$$
* **Valor Futuro ($VF$)**:
  $$VF = VP \times (1 + i \times n)$$
  
*Donde:*
* $VP$: Valor Presente o Capital Inicial.
* $i$: Tasa de interés periódica en decimales.
* $n$: Número de períodos (ajustados a la base temporal de la tasa).

### Manual de Usuario
1. Ingrese el **Capital Inicial (COP)**.
2. Ingrese la **Tasa de Interés (%)** y seleccione su frecuencia de cobro (Anual, Semestral, etc.).
3. Especifique las fechas de la operación (**Fecha Inicial** y **Fecha Final**).
4. Seleccione la **Base del Año**: **360 días** (Comercial) o **365 días** (Civil/Calendario).
5. Presione **Calcular** para renderizar el resultado, la línea de tiempo dinámica y el desglose de pasos.
6. Presione **Cargar Ejemplo** para ver una demostración automática.

### Ejemplos de Prueba
* **Caso 1**: Capital de $10.000.000 COP, tasa del $8\%$ EA, plazo de $1$ año (365 días en base 365). 
  * *Resultado*: Interés = $800.000 COP, VF = $10.800.000 COP.
* **Caso 2**: Capital de $5.000.000 COP, tasa del $12\%$ anual, plazo de $180$ días en base 360.
  * *Resultado*: Interés = $300.000 COP, VF = $5.300.000 COP.

---

## Módulo 2: Interés Compuesto

A diferencia del interés simple, en el interés compuesto los intereses devengados se capitalizan periódicamente, integrándose al capital original para generar nuevos rendimientos en los períodos subsiguientes (crecimiento exponencial).

### Formulación Matemática
* **Conversión a Tasa Efectiva Anual (TEA)**:
  * Si es Efectiva Periódica ($i_p$): $\text{TEA} = (1 + i_p)^{m} - 1$
  * Si es Nominal ($j$) con capitalización $m$: $\text{TEA} = \left(1 + \frac{j}{m}\right)^m - 1$
* **Tasa Periódica Equivalente de la Operación ($i$)**:
  $$i = (1 + \text{TEA})^{1/m} - 1$$
* **Valor Futuro ($VF$)**:
  $$VF = VP \times (1 + i)^n$$
* **Interés Generado ($I$)**:
  $$I = VF - VP$$

### Manual de Usuario
1. Ingrese el **Capital Inicial (COP)** en el campo *VP*.
2. Digite la **Tasa de Interés (%)** e indique su modalidad (EA, Nominal Anual, Mensual, etc.).
3. Especifique el **Plazo** expresado en años.
4. Seleccione la **Frecuencia de Capitalización** deseada (Anual, Semestral, Trimestral o Mensual).
5. Haga clic en **Calcular**. El sistema mostrará la tasa equivalente, el número total de períodos capitalizados, el interés compuesto acumulado y el $VF$ final. Además, generará una tabla detallada período a período y un gráfico comparativo exponencial vs. lineal (interés simple).

### Ejemplos de Prueba (Tolerancia $\pm1\%$)
1. **Caso 1**: VP = $10.000.000, 12% EA, Plazo = 5 años, Capitalización Anual.
   * *VF Calculado*: $17.623.416,83 COP (Esperado: $\approx 17.623.416$).
2. **Caso 2**: VP = $1.000.000, 24% EA, Plazo = 3 años, Capitalización Anual.
   * *VF Calculado*: $1.906.624,00 COP (Esperado: $\approx 1.906.624$).
3. **Caso 3**: VP = $5.000.000, 18% EA, Plazo = 10 años, Capitalización Anual.
   * *VF Calculado*: $26.169.177,65 COP (Esperado: $\approx 26.173.000$).

---

## Módulo 3: Equivalencia de Tasas

Establece la relación de equivalencia entre tasas de interés de distintas periodicidades o modalidades (efectivas y nominales), garantizando que produzcan el mismo valor futuro al final de un año sobre un mismo capital.

### Formulación Matemática
El módulo realiza la conversión utilizando la **Tasa Efectiva Anual (TEA)** como base puente neutral:
1. **Fase de Entrada**: Tasa Origen $\rightarrow$ TEA.
2. **Fase de Salida**: TEA $\rightarrow$ Tasa Destino.

### Manual de Usuario
1. Ingrese el **Valor de la Tasa (%)** de origen.
2. Seleccione el **Tipo de Tasa Origen** y el **Tipo de Tasa Destino** (ej. Nominal Mes Vencido a EA).
3. Presione **Convertir**.
4. La aplicación mostrará el desarrollo matemático del cálculo y simulará el crecimiento de una inversión de $1.000.000 COP a 12 meses con ambas tasas para ilustrar gráficamente cómo sus curvas coinciden de manera exacta al final del período.

### Ejemplos de Prueba
* **Caso 1**: Convertir $36\%$ Nominal Mes Vencido a **EA**.
  * *Resultado*: $42,576\%$ EA.
* **Caso 2**: Convertir $24\%$ EA a **Efectiva Mensual**.
  * *Resultado*: $1,8087\%$ mensual.

---

## Módulo 4: Fecha Focal (Ecuaciones de Valor)

Las ecuaciones de valor permiten estructurar renegociaciones de obligaciones financieras (deudas y pagos) llevando todos los montos de dinero a un mismo momento del tiempo llamado **Fecha Focal**, basándose en el principio de equivalencia financiera.

### Formulación Matemática
* **Capitalización** (llevar al futuro cuando $t_{\text{vence}} < FF$):
  $$VF = VP \times (1 + i)^n \quad \text{(Compuesto)} \quad \text{o} \quad VF = VP \times (1 + i \times n) \quad \text{(Simple)}$$
* **Descuento** (traer al presente cuando $t_{\text{vence}} > FF$):
  $$VP = \frac{VF}{(1 + i)^n} \quad \text{(Compuesto)} \quad \text{o} \quad VP = \frac{VF}{(1 + i \times n)} \quad \text{(Simple)}$$

### Manual de Usuario
1. Defina la **Tasa de Interés (%)** de la renegociación, la **Frecuencia de Capitalización** y el **Régimen** (Simple o Compuesto).
2. Defina la **Fecha Focal** a la cual se trasladarán todas las obligaciones.
3. Agregue una o más **Obligaciones** ingresando su Concepto, Valor en pesos y la Fecha de Vencimiento.
4. Presione **Calcular Equivalencia**.
5. Se generará una línea de tiempo y un informe paso a paso del valor de cada obligación en la fecha focal, consolidando la suma equivalente total requerida para saldar la deuda en esa fecha.

### Ejemplo de Prueba
* **Caso**: Tres deudas ($500.000 con vencimiento el 15/03/2026, $800.000 el 10/08/2026, y $1.200.000 el 20/12/2026), evaluadas en la Fecha Focal del **01/10/2026** a una tasa de interés del $18\%$ EA bajo régimen de interés compuesto.
  * *Resultado*: Total en la Fecha Focal = $2.523.194,12 COP.

---

## Módulo 5: Anualidades

Las anualidades son series de flujos de caja de igual valor realizados a intervalos de tiempo constantes. El módulo resuelve cuatro tipos de problemas financieros recurrentes tanto para rentas ordinarias (vencidas) como anticipadas.

### Formulaciones Clave
* **Valor Futuro de Anualidad Vencida ($VF$)**:
  $$VF = A \times \frac{(1 + i)^n - 1}{i}$$
* **Valor Presente de Anualidad Vencida ($VP$)**:
  $$VP = A \times \frac{1 - (1 + i)^{-n}}{i}$$

### Manual de Usuario
1. Seleccione la pestaña según la incógnita a despejar: **Valor Futuro**, **Valor Presente**, **Cuota Periódica** o **Fondo de Ahorro**.
2. Complete las variables requeridas (Tasa de interés periódica, cuota, períodos, etc.).
3. Defina si el flujo es **Ordinario** (vencido) o **Anticipado**.
4. Obtenga el valor resultante junto con un gráfico de barras acumulado (Depósitos vs. Intereses) y el cuadro período a período del fondo o amortización.

### Ejemplo de Prueba
* **Caso (Fondo de Ahorro)**: Meta a ahorrar de $600.000 COP, mediante depósitos mensuales de $10.000 COP, a una tasa del $36\%$ nominal mes vencido ($3\%$ mensual).
  * *Resultado*: Períodos necesarios = $34,83 meses.

---

## Módulo 6: Amortización

Este módulo permite simular la extinción de una obligación financiera (crédito) mediante pagos periódicos estructurados bajo los dos sistemas principales de amortización bancaria.

### Sistemas Implementados
1. **Sistema Francés (Cuota Fija)**:
   * La cuota periódica permanece constante a lo largo del plazo de amortización. La porción de interés es decreciente y el abono a capital es creciente.
   * Fórmula de cuota constante ($A$):
     $$A = P \times \frac{i \times (1 + i)^n}{(1 + i)^n - 1}$$
2. **Sistema Alemán (Abono Fijo a Capital)**:
   * El abono a capital es constante en cada período. La cuota es decreciente ya que los intereses disminuyen gradualmente a medida que se reduce el saldo insoluto de la deuda.
   * Abono constante ($K$):
     $$K = \frac{P}{n}$$

### Manual de Usuario
1. Ingrese el **Monto del Crédito (COP)**.
2. Ingrese la **Tasa de Interés Periódica Mensual (%)** y el **Plazo** en meses.
3. Elija el **Sistema de Amortización** (Francés o Alemán).
4. Presione **Calcular Tabla** para desplegar el cuadro completo de amortización indicando período a período: Saldo Inicial, Cuota, Interés, Abono a Capital y Saldo Final de la deuda.

---

## Módulo de Aseguramiento de Calidad (Modo Pruebas Académicas)

FinanceMath Lab cuenta con un módulo de verificación automatizada interna accesible desde **Configuración → Pruebas Académicas**.

Este módulo ejecuta un banco de pruebas unitarias que evalúa los algoritmos de cálculo de cada una de las herramientas del laboratorio contra respuestas exactas. Las pruebas aseguran que las desviaciones relativas entre los valores teóricos y los calculados por los motores de JavaScript sean inferiores al **0.01%** (excepto en interés compuesto donde se admite hasta el $1\%$ debido al redondeo de decimales de uso común en guías didácticas de clase).

Al ejecutar la suite de pruebas se obtiene un informe detallando:
* Número total de pruebas ejecutadas.
* Cantidad de pruebas Aprobadas/Fallidas.
* Porcentaje de precisión matemática global de la plataforma.

---

## Conclusiones

1. **Sinergia Metodológica e Interactividad**: La interactividad ofrecida por **FinanceMath Lab** transforma variables financieras abstractas en componentes visuales interactivos (gráficos y líneas de tiempo dinámicas). Esto permite comprender de forma empírica y ágil el crecimiento exponencial del dinero y la equivalencia temporal.
2. **Exactitud y Rigor Matemático**: La suite de pruebas académicas integradas garantiza que las operaciones lógicas y de redondeo cumplan rigurosamente con los estándares matemáticos teóricos de la asignatura de Matemáticas Financieras I.
3. **Optimización Tecnológica**: La arquitectura libre de frameworks basada en JavaScript Vanilla permite un rendimiento instantáneo en cualquier navegador convencional y compatibilidad local completa sin problemas de políticas CORS, facilitando su uso educativo en múltiples entornos.

<br><br><br>

<div align="center">
  ___________________________________________<br>
  <strong>Leonardo Javier Bastidas Moreno</strong><br>
  Estudiante de Administración Financiera<br>
  Universidad del Tolima
</div>
