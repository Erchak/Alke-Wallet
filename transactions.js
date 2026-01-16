$(document).ready(function() {

    if (!localStorage.getItem('usuarioLogueado')) {
        window.location.href = 'login.html';
        return;
    }
    $('body').css('opacity', 1);

    const historialRaw = localStorage.getItem('historial');
    let historial = historialRaw ? JSON.parse(historialRaw) : [];

    /**
     
       @param {string} filtro 
     */
    function renderizarHistorial(filtro = 'todos') {
        const contenedor = $('#lista-movimientos');
        const emptyState = $('#mensaje-vacio');
        const tabla = $('#contenedor-datos');
        
        contenedor.empty();

        const filtrados = filtro === 'todos' 
            ? historial 
            : historial.filter(m => m.tipo === filtro);

        if (filtrados.length === 0) {
            tabla.hide();
            emptyState.fadeIn();
            return;
        }

        emptyState.hide();
        tabla.show();

        filtrados.forEach(m => {
            const esIngreso = m.tipo === 'Depósito'; 
            const signo = esIngreso ? '+' : '-';
            const colorMonto = esIngreso ? 'text-success font-weight-bold' : 'text-danger font-weight-bold';
            const badgeClass = esIngreso ? 'badge-success' : 'badge-danger';
            const icono = esIngreso ? 'fa-arrow-down' : 'fa-paper-plane';

            const montoFormato = Math.abs(parseFloat(m.monto || 0)).toLocaleString('es-CL');

            const fila = `
                <tr>
                    <td class="align-middle">
                        <div class="font-weight-bold" style="font-size:0.85rem;">${m.fecha}</div>
                        <div class="text-muted small">${m.hora || ''}</div>
                    </td>
                    <td class="align-middle">
                        <span class="badge ${badgeClass} p-2 text-uppercase" style="min-width: 100px;">
                            <i class="fas ${icono} mr-1"></i> ${m.tipo}
                        </span>
                    </td>
                    <td class="align-middle text-muted small">
                        ${m.destinatario ? '<i class="far fa-user mr-1"></i> ' + m.destinatario : 'Abono a cuenta'}
                    </td>
                    <td class="align-middle text-right ${colorMonto}" style="font-size:1.1rem;">
                        ${signo} $${montoFormato}
                    </td>
                </tr>
            `;
            contenedor.append(fila);
        });
    }

    renderizarHistorial();

    $('#filtroTipo').on('change', function() {
        const seleccion = $(this).val();
        renderizarHistorial(seleccion);
    });
});