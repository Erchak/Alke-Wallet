$(document).ready(function() {
    $('#loginForm').submit(function(event) {
        event.preventDefault(); 

        let correo = $('#email').val();
        let contrasena = $('#password').val();

        // Validación según credenciales ficticias:
        if (correo === "admin@wallet.com" && contrasena === "12345") {
            
            
            localStorage.setItem('usuarioLogueado', "Administrador"); 
            
            
            if (!localStorage.getItem('saldo')) {
                localStorage.setItem('saldo', "5000.00");
            }

            // Mensaje de Feedback con Bootstrap:
            $('#alert-container').html(`
                <div class="alert alert-success border-0 shadow-sm" role="alert">
                    <strong>¡Bienvenido!</strong> Redirigiendo al menú principal...
                </div>
            `);

            // Redireccinar al menú principal:
            setTimeout(function() {
                window.location.href = 'menu.html';
            }, 1200);

        } else {
            // Mensaje de error de credenciales incorrectas:
            $('#alert-container').html(`
                <div class="alert alert-danger border-0 shadow-sm" role="alert">
                    <strong>Error:</strong> Correo o contraseña incorrectos.
                </div>
            `);
        }
    });
});