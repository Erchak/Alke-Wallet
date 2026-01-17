$(document).ready(function() {
    
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    if (!usuarioLogueado) {
        window.location.href = 'login.html';
        return;
    }
    $('body').css('opacity', 1);

    let saldoActual = parseFloat(localStorage.getItem('saldo')) || 0;
    let contactoSeleccionado = null;

    function cargarContactos() {
        const base = [
            { nombre: "Juan Pérez", alias: "juan.pago" },
            { nombre: "María García", alias: "maria.wallet" },
            { nombre: "Soporte Técnico", alias: "wallet.help" }
        ];
        const guardados = JSON.parse(localStorage.getItem('contactosPersonalizados')) || [];
        const todos = [...base, ...guardados];
        const lista = $('#listaContactos');
        
        lista.empty();
        todos.forEach(c => {
            lista.append(`
                <li class="list-group-item contacto-item border-0 shadow-sm" data-nombre="${c.nombre}">
                    <div class="d-flex align-items-center">
                        <div class="avatar-circle mr-3">${c.nombre.charAt(0).toUpperCase()}</div>
                        <div class="flex-grow-1">
                            <h6 class="mb-0 font-weight-bold">${c.nombre}</h6>
                            <small class="text-muted">@${c.alias}</small>
                        </div>
                        <i class="fas fa-check-circle text-primary check-mark" style="display:none;"></i>
                    </div>
                </li>
            `);
        });
    }
    cargarContactos();

    $(document).on('click', '.contacto-item', function() {
        $('.contacto-item').removeClass('contacto-seleccionado').find('.check-mark').hide();
        $(this).addClass('contacto-seleccionado').find('.check-mark').show();
        contactoSeleccionado = $(this).data('nombre');
        $('#btnAbrirEnvio').fadeIn(300);
    });

    $('#btnAbrirEnvio').click(function() {
       
        saldoActual = parseFloat(localStorage.getItem('saldo')) || 0;
        
        $('#nombreDestinatarioModal').text(contactoSeleccionado);
        $('#saldoDisponibleModal').text("$ " + saldoActual.toLocaleString('es-CL'));
        $('#montoEnvio').val('');
        $('#errorMonto').hide();
        $('#btnConfirmarTransferencia').prop('disabled', true);
        $('#modalMonto').modal('show');
    });

    $('#montoEnvio').on('input', function() {
        const monto = parseFloat($(this).val()) || 0;
        const superaSaldo = monto > saldoActual;
        const esInvalido = monto <= 0 || superaSaldo;

        $('#errorMonto').toggle(superaSaldo);
        $('#btnConfirmarTransferencia').prop('disabled', esInvalido);
    });

    $('#btnConfirmarTransferencia').click(function() {
        const monto = parseFloat($('#montoEnvio').val());
        
        if (monto > 0 && monto <= saldoActual) {
            $(this).prop('disabled', true).html('<i class="fas fa-circle-notch fa-spin"></i> Enviando...');

            saldoActual -= monto;
            localStorage.setItem('saldo', saldoActual.toFixed(2));

            const historial = JSON.parse(localStorage.getItem('historial')) || [];
            historial.unshift({
                fecha: new Date().toLocaleDateString('es-CL'),
                hora: new Date().toLocaleTimeString('es-CL', {hour:'2-digit', minute:'2-digit'}),
                tipo: 'Transferencia Enviada',
                monto: monto,
                destinatario: contactoSeleccionado,
                icono: 'fa-paper-plane',
                color: 'text-danger'
            });
            localStorage.setItem('historial', JSON.stringify(historial));

            // Mensaje de envío existoso:
            setTimeout(() => {
                $('#modalMonto').modal('hide');
                $('#confirmacionEnvio').html(`<i class="fas fa-check-circle mr-2"></i> Envío exitoso por $${monto.toLocaleString('es-CL')}`).slideDown();
                
                setTimeout(() => { window.location.href = 'menu.html'; }, 2000);
            }, 1200);
        }
    });

    $('#busqueda').on('keyup', function() {
        const query = $(this).val().toLowerCase();
        let encontrados = 0;
        
        $('.contacto-item').each(function() {
            const contenido = $(this).text().toLowerCase();
            const coincide = contenido.includes(query);
            $(this).toggle(coincide);
            if(coincide) encontrados++;
        });
        
        $('#no-results').toggle(encontrados === 0);
    });

    // Agregar un nuevo contacto:
    $('#btnNuevoContacto').click(() => $('#formContacto').slideToggle());
    $('#btnCancelar').click(() => $('#formContacto').slideUp());

    $('#btnGuardarContacto').click(function() {
        const n = $('#nuevoNombre').val().trim();
        const a = $('#nuevoAlias').val().trim();
        const c = $('#nuevoCbu').val().trim();

        if (n && c) {
            let personalizados = JSON.parse(localStorage.getItem('contactosPersonalizados')) || [];
            personalizados.push({ nombre: n, alias: a, cbu: c });
            localStorage.setItem('contactosPersonalizados', JSON.stringify(personalizados));
            
            cargarContactos(); 
            $('#formContacto').slideUp();
            $('#nuevoNombre, #nuevoAlias, #nuevoCbu').val('');
        } else {
            alert("El nombre y número de cuenta son obligatorios.");
        }
    });
});


// Fin de sendmoney.js 