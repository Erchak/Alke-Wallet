$(document).ready(function() {
    
    const user = localStorage.getItem('usuarioLogueado');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    $('body').animate({ opacity: 1 }, 500);

    
    let saldoActual = parseFloat(localStorage.getItem('saldo')) || 0;
    
    function refrescarSaldo() {
        $('#saldo-display').text("$ " + saldoActual.toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }));
    }
    refrescarSaldo();

    
    $('#depositForm').on('submit', function(e) {
        e.preventDefault();

        const input = $('#monto');
        const btn = $('#btnConfirmar');
        const monto = parseFloat(input.val());

        
        if (isNaN(monto) || monto <= 0) {
            notificar("El monto debe ser un número mayor a 0.", "danger");
            return;
        }

        // Estado visual de procesamiento del depósito:
        btn.prop('disabled', true).html('<i class="fas fa-sync fa-spin"></i> Procesando...');

        // Guardado en el almacenamiento local:
        saldoActual += monto;
        localStorage.setItem('saldo', saldoActual.toFixed(2));

        const log = {
            fecha: new Date().toLocaleDateString('es-CL'), 
            hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
            tipo: 'Depósito', 
            monto: monto, 
            destinatario: null 
        };

        let historial = JSON.parse(localStorage.getItem('historial')) || [];
        historial.unshift(log); 
        localStorage.setItem('historial', JSON.stringify(historial));

        
        refrescarSaldo();
        input.val('');
        
        $('#monto-leyenda')
            .hide()
            .text(`¡Depósito exitoso de $ ${monto.toLocaleString('es-AR')}!`)
            .slideDown(400);

        notificar("Saldo actualizado correctamente. Volviendo al menú...", "success");

        // Redirección al menú de la aplicación:
        setTimeout(() => {
            window.location.href = 'menu.html';
        }, 2200);
    });

    function notificar(msg, tipo) {
        const html = `
            <div class="alert alert-${tipo} border-0 shadow-sm alert-dismissible fade show" role="alert">
                ${msg}
                <button type="button" class="close" data-dismiss="alert">&times;</button>
            </div>`;
        $('#alert-container').empty().append(html);
    }
});