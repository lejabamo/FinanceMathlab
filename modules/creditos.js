// modules/creditos.js
(function() {
    const title = "Créditos Académicos";
    const description = "Información institucional sobre los autores, colaboradores y el propósito formativo del proyecto FinanceMath Lab.";

    function render() {
        return `
            <div class="module-header">
                <h1>${title}</h1>
                <p class="module-description">${description}</p>
            </div>
            
            <div class="card" style="max-width: 800px; margin: 0 auto; padding: 40px;">
                <div style="text-align: center; margin-bottom: 32px;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background-color: var(--accent-light); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                        <i data-lucide="award" style="width: 40px; height: 40px; color: var(--accent);"></i>
                    </div>
                    <h2 style="font-family: var(--font-heading); font-size: 1.75rem; color: var(--text-primary); margin-bottom: 8px;">
                        FinanceMath <span class="accent-text">Lab</span>
                    </h2>
                    <p style="color: var(--text-secondary); font-size: 0.95rem;">Versión 1.0 (Lanzamiento Académico)</p>
                </div>
                
                <hr style="border: 0; border-top: 1px solid var(--border-color); margin-bottom: 32px;">
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">
                    <div>
                        <h3 style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="users" style="width: 18px; height: 18px; color: var(--accent);"></i>
                            Desarrollo Académico
                        </h3>
                        <p style="font-size: 0.9rem; line-height: 1.6; color: var(--text-secondary);">
                            <strong>Autor Principal:</strong><br>
                            Leonardo Javier Bastidas Moreno<br>
                            Estudiante de Administración Financiera<br><br>
                            <strong>Materia:</strong><br>
                            Matemáticas Financieras
                        </p>
                    </div>
                    
                    <div>
                        <h3 style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="book" style="width: 18px; height: 18px; color: var(--accent);"></i>
                            Propósito del Proyecto
                        </h3>
                        <p style="font-size: 0.9rem; line-height: 1.6; color: var(--text-secondary);">
                            FinanceMath Lab es una plataforma interactiva diseñada para facilitar la enseñanza y el aprendizaje de las matemáticas financieras mediante simuladores visuales y guías paso a paso.
                        </p>
                    </div>
                </div>
                
                <div style="background-color: var(--bg-app); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 20px; text-align: center;">
                    <h4 style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <i data-lucide="shield-check" style="width: 16px; height: 16px; color: var(--accent);"></i>
                        Licencia y Uso
                    </h4>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                        Proyecto desarrollado con fines estrictamente académicos e ilustrativos. Permitida su copia, modificación y distribución para fines de enseñanza secundaria o universitaria.
                    </p>
                </div>
            </div>
        `;
    }

    function init() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // Registrar en el objeto global
    window.FinanceModules.creditos = {
        title,
        description,
        render,
        init
    };
})();
