const prevBtns = document.querySelectorAll(".btn-prev");
// const prevBtns3 = document.getElementById("btn-prev3");
const nextBtns = document.querySelectorAll(".btn-next");
const progress = document.getElementById("progress");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");

let formStepsNum = 0;

/**
 * Esta función es para avanzar al siguiente paso del Form
 * Si lo vas a usar, solamente copias el  formStepsNum++; updateFormSteps(); updateProgressbar();
 */

// nextBtns.forEach((btn) => {
//     btn.addEventListener("click", () => {
//         formStepsNum++;
//         updateFormSteps();
//         updateProgressbar();
//     });
// });


/**
 * Esta función es para avanzar al volver al anterior paso del Form
 * Si lo vas a usar, solamente copias el  formStepsNum--; updateFormSteps(); updateProgressbar();
 */

prevBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
        formStepsNum--;
        updateFormSteps();
        updateProgressbar();
    });
});

const prevBtn3 = document.getElementById("btn-prev3");

prevBtn3.addEventListener("click", (event) => {
    // Retroceder dos pasos en lugar de uno
    formStepsNum -= 2;
    if (formStepsNum < 0) {
        formStepsNum = 0;
    }
    // Actualizar pasos y barra de progreso
    updateFormSteps();
    updateProgressbar();
});



//este BTN PREV VA ENFOCADO HACIA EL BOTON NUMERO 3

function updateFormSteps() {
    formSteps.forEach((formStep) => {
        formStep.classList.contains("form-step-active") &&
            formStep.classList.remove("form-step-active");
    });

    formSteps[formStepsNum].classList.add("form-step-active");
}

function updateProgressbar() {
    progressSteps.forEach((progressStep, idx) => {
        if (idx < formStepsNum + 1) {
            progressStep.classList.add("progress-step-active");
        } else {
            progressStep.classList.remove("progress-step-active");
        }
    });

    const progressActive = document.querySelectorAll(".progress-step-active");

    progress.style.width =
        ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + "%";
}

// Función para verificar datos y mostrar/ocultar el botón
function verificarDatos() {
    // Obtener los valores ingresados por el usuario
    const correo = document.getElementById('textemail').value;
    const contrasena = document.getElementById('password').value;

    // Verificar si la contraseña y el correo son válidos
    if (validarContrasena(contrasena) && validarCorreo(correo)) {
        // Mostrar el botón si ambos campos son válidos
        mostrarBotonNext();
    } else {
        // Ocultar el botón si alguno de los campos no es válido
        ocultarBotonNext();
    }
}

function mostrarBotonNext() {
    // Seleccionar el botón por su id
    const btnNext = document.getElementById('Next1');

    // Cambiar el estilo para mostrar el botón
    btnNext.style.display = 'block';
}

function ocultarBotonNext() {
    // Seleccionar el botón por su id
    const btnNext = document.getElementById('Next1');

    // Cambiar el estilo para ocultar el botón
    btnNext.style.display = 'none';
}

// Función para validar la contraseña
function validarContrasena(contrasena) {
    // Verificar que la contraseña tenga al menos 8 caracteres y contenga '@' y '.com'
    return contrasena.length >= 8
}

/***
 * 
 * ------FUNCION PARA ENVIAR CORREO CON UN CÓDIGO---------
 * 
 */

// Función para validar el correo electrónico
function validarCorreo(correo) {
    // Verificar que el correo contenga '@' y '.com'
    return correo.includes('@') && correo.includes('.com');
}

/**
 * ENVIO DE CORREO STEP
 */

let error429Recibido = false;

function VerificarEmail() {
    // Obtener el correo electrónico ingresado por el usuario
    const loader1 = document.getElementById('loader');
    const correo = document.getElementById('textemail').value;

    loader1.style.display = 'block';
    document.getElementById('Next1').disabled = true;

    const labelCodigo = document.getElementById('label-content');

    // Agregar el efecto de vidrio (backdrop-filter)
    labelCodigo.style.backdropFilter = 'blur(10px)'; // Ajusta el valor según tu preferencia

    if (error429Recibido) {
        document.getElementById('Next1').disabled = true;
    }

    if (navigator.onLine) {
        // Realizar la solicitud al servidor para verificar si el correo ya existe
        axios.post('checkemail', {
                fullemail: correo,
            })
            .then((response) => {
                console.log(response.data);

                // Verificar si el correo existe en la base de datos
                if (response.data.email_exists) {
                    // Mostrar un mensaje al usuario indicando que el correo ya existe
                    // mostrarMensajeError('El correo electrónico ya está registrado. Inténtelo con otro correo.');

                    // Deshabilitar el botón y mostrar el mensaje de error
                    document.getElementById('Next1').disabled = false;
                    mostrarMensajeErrorEmail('Este correo ya se existe o se encuentra registrado')

                    // Ocultar el loader después de que la carga ha terminado
                    ocultarLoader();
                } else {

                    const otpInputs = document.querySelectorAll('.container-OTP input');
                    otpInputs.forEach(input => input.value = '');

                    // Realizar la solicitud al servidor para enviar el código de verificación
                    axios.post('forgotpassword', {
                            fullcorreo: correo
                        }, { headers: { 'Content-Type': 'application/json' } })
                        .then((response) => {
                            console.log(response.data);

                            // Verificar si la solicitud fue exitosa
                            if (response.status === 200) {
                                // Mostrar un mensaje al usuario indicando que se envió el código
                                mostrarMensaje('Código de verificación enviado. Revise su correo electrónico.');
                                labelCodigo.textContent = `Te hemos enviado un código de verificación a la dirección de correo ${correo}. ¡Por favor, tómate un momento para revisar tu bandeja de entrada y asegúrate de echar un vistazo!`;

                                // Permitir que el botón responda incluso después de un código 429
                                document.getElementById('Next1').disabled = false;

                                // Establecer el color de fondo, la opacidad, y los bordes circulares
                                labelCodigo.style.background = 'linear-gradient(to bottom, rgba(107, 56, 193, 0.2), transparent)'; // Degradado desde morado oscuro con 30% de opacidad hasta transparente
                                labelCodigo.style.color = '#6b38c1'; // Color morado oscuro
                                labelCodigo.style.borderRadius = '10px'; // Bordes circulares

                                //Puede avanzar el mondongo
                                formStepsNum++;
                                updateFormSteps();
                                updateProgressbar();

                            } else {
                                // Accede a time_to_wait dentro del bloque catch
                                const timeToWait = response.data['time_to_wait'];
                                startTimer(timeToWait);
                                mostrarMensajeError('Error al enviar el código de verificación. Inténtelo nuevamente.');
                            }
                        })
                        .catch((error) => {
                            console.error(error);

                            // Accede a time_to_wait dentro del bloque catch
                            const timeToWait = error.response.data['time_to_wait'];

                            // Manejar errores según tu lógica
                            if (error.response && error.response.status === 429) {
                                // Error 429 - Too Many Requests
                                mostrarMensajeErrorInitial(`Demasiadas solicitudes. Por favor, espere un momento antes de intentarlo nuevamente en: ${formatTime(timeToWait)}`);

                                // Marcar que se recibió un error 429
                                error429Recibido = true;

                                startTimer(timeToWait);

                                // Después de un retardo, permitir que el botón responda nuevamente
                                setTimeout(() => {
                                    error429Recibido = false;
                                    document.getElementById('Next1').disabled = false;
                                }, 5000); // Establece el retardo en milisegundos (en este ejemplo, 5 segundos)
                            } else {
                                mostrarMensajeError('Error al enviar el código de verificación. Inténtelo nuevamente.');
                            }
                        })
                        .finally(() => {
                            // Ocultar el loader después de que la carga ha terminado
                            ocultarLoader();
                        });
                }
            })
            .catch((error) => {
                console.error(error);

                // Manejar errores según tu lógica
                if (error.response && error.response.status === 429) {
                    // Error 429 - Too Many Requests
                    const timeToWait = error.response.data['time_to_wait'];
                    mostrarMensajeErrorInitial(`Demasiadas solicitudes. Por favor, espere un momento antes de intentarlo nuevamente en: ${formatTime(timeToWait)}`);

                    // Marcar que se recibió un error 429
                    error429Recibido = true;

                    startTimer(timeToWait);

                    // Después de un retardo, permitir que el botón responda nuevamente
                    setTimeout(() => {
                        error429Recibido = false;
                        document.getElementById('Next1').disabled = false;
                    }, 5000); // Establece el retardo en milisegundos (en este ejemplo, 5 segundos)
                } else {
                    mostrarMensajeError('Error al verificar el correo electrónico. Inténtelo nuevamente.');
                }
            });
    }
}


function startTimer(initialTime) {
    let remainingTime = initialTime;
    const labelCodigo = document.getElementById('label-Step-Initial');

    const timerInterval = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime--;
            mostrarMensajeErrorInitial(`Demasiadas solicitudes. Por favor, espere un momento antes de intentarlo nuevamente en: ${formatTime(remainingTime)}`);
        } else {
            clearInterval(timerInterval);
            // Una vez que el temporizador llega a cero, oculta el mensaje con una animación
            labelCodigo.style.display = 'none';
        }
    }, 1000); // Actualiza cada segundo
}

// Función para formatear el tiempo restante
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${hours} hour(s), ${minutes} minute(s), and ${remainingSeconds} second(s)`;
}


// Nueva función para ocultar el loader
function ocultarLoader() {
    const loader = document.getElementById('loader');
    loader.style.display = 'none';
}

function mostrarMensajeError(mensaje) {
    // Mostrar el mensaje de error en el elemento con id 'label-Step'
    const mensajeErrorElement = document.getElementById('label-Step');

    // Verificar si el elemento existe antes de actualizar su contenido
    if (mensajeErrorElement) {
        mensajeErrorElement.textContent = mensaje;
        // Establecer el color del texto a rojo
        mensajeErrorElement.style.color = 'red';
    }
}

function mostrarMensajeErrorInitial(mensaje) {
    // Mostrar el mensaje de error en el elemento con id 'label-Step'
    const labelCodigo = document.getElementById('label-Step-Initial');

    // Verificar si el elemento existe antes de actualizar su contenido
    if (labelCodigo) {
        labelCodigo.textContent = mensaje;
        // Establecer el color del texto a rojo
        labelCodigo.style.color = 'red';
        labelCodigo.style.background = 'linear-gradient(to bottom, rgba(107, 56, 193, 0.2), transparent)';
        labelCodigo.style.borderRadius = '10px';
        // Hacer visible el mensaje
        labelCodigo.style.display = 'block';
    }
}

function mostrarMensajeErrorEmail(mensaje) {
    const mensajeErrorEmail = document.getElementById('label-Step-email');

    if (mensajeErrorEmail) {
        mensajeErrorEmail.textContent = mensaje;
        mensajeErrorEmail.style.color = 'red';
    }

    const isVisible = window.getComputedStyle(mensajeErrorEmail).display === 'block';

    if (isVisible) {
        mensajeErrorEmail.classList.add('shake');
    } else {
        mensajeErrorEmail.classList.remove('shake');
    }

    setTimeout(() => {
        mensajeErrorEmail.classList.remove('shake');
    }, 1000);

    // Mostrar el mensaje durante 3 segundos
    mensajeErrorEmail.style.opacity = '1'; // Establecer la opacidad a 1
    setTimeout(() => {
        mensajeErrorEmail.classList.add('fadeOut');
        mensajeErrorEmail.style.opacity = '0'; // Establecer la opacidad a 0
        setTimeout(() => {
            mensajeErrorEmail.classList.remove('fadeOut');
        }, 1000);
    }, 3000);
}



function mostrarMensaje(mensaje) {
    // Mostrar el mensaje en algún elemento HTML
    const mensajeElement = document.getElementById('mensaje');

    // Verificar si el elemento existe antes de actualizar su contenido
    if (mensajeElement) {
        mensajeElement.textContent = mensaje;

        // Avanzar al siguiente formulario solo si la bandera permite el avance
        if (puedeAvanzar) {
            avanzarAlSiguienteFormulario();
        }
    }
}

function avanzarAlSiguienteFormulario() {
    // Lógica para avanzar al siguiente formulario
    // Puedes agregar más acciones aquí si es necesario

    // Ejemplo: Mostrar el siguiente formulario o realizar otras acciones
    formStepsNum++;
    updateFormSteps();
    updateProgressbar();
    // Restablecer la bandera para futuras verificaciones
    puedeAvanzar = false;
}

/**
 * VERIFICACIÓN DE CÓDIGO
 */

function VerificarCode() {

    errorOccurred = false;
    // Obtener todos los campos de entrada en el contenedor OTP
    const otpInputs = document.querySelectorAll('.container-OTP input');
    const loader1 = document.getElementById('loader');

    // Obtener el valor completo del código combinando los valores de cada campo de entrada
    const verificationCode = Array.from(otpInputs).map(input => input.value).join('');

    const gmailInput = document.getElementById('textemail');
    const email = gmailInput.value;
    loader1.style.display = 'block';

    if (navigator.onLine) {
        // Realizar la solicitud al servidor para verificar el código
        axios.post('verificarcode', {
                verification_code: verificationCode,
            })
            .then((response) => {
                console.log(response.data);

                // Verificar si la solicitud fue exitosa
                if (response.status === 200) {
                    // Mostrar un mensaje al usuario indicando que se envió el código
                    mostrarMensaje('Fue correcto. Continuando.');

                    // Puede avanzar el mondongoz
                    formStepsNum++;
                    updateFormSteps();
                    updateProgressbar();

                    // Habilitar el botón de avance
                } else {
                    // Manejar otros casos según tu lógica
                    mostrarMensaje('Error. Inténtelo nuevamente.');
                    // Restablecer la bandera para bloquear el avance
                    // Puedes agregar más acciones aquí si es necesario
                }
            })
            .catch((error) => {
                console.error(error);

                // Manejar errores según tu lógica
                if (error.response && error.response.status === 401) {
                    // Error 429 - Too Many Requests
                    mostrarMensajeErrorCode('Oops! Parece que el código no es válido o ha expirado. Inténtalo Nuevamente');
                } else {
                    mostrarMensajeErrorCode('Error. Inténtelo nuevamente.');
                }
            })
            .finally(() => {
                // Ocultar el loader después de que la carga ha terminado
                ocultarLoader();
            });
    }
}



function mostrarMensajeErrorCode(mensaje) {
    // Mostrar el mensaje de error en el elemento con id 'label-Code'
    const mensajeErrorElement = document.getElementById('label-Code');

    // Verificar si el elemento existe antes de actualizar su contenido
    if (mensajeErrorElement) {
        mensajeErrorElement.textContent = mensaje;
        // Establecer el color del texto a rojo
        mensajeErrorElement.style.color = 'red';

        // Hacer visible el mensaje
        mensajeErrorElement.style.display = 'block';

        // Verificar si el mensaje es visible ('block')
        const isVisible = window.getComputedStyle(mensajeErrorElement).display === 'block';

        // Agregar o quitar la clase de animación según la visibilidad
        if (isVisible) {
            mensajeErrorElement.classList.add('shake');
        } else {
            mensajeErrorElement.classList.remove('shake');
        }

        // Eliminar la clase de animación después de 1 segundo (1000 ms)
        setTimeout(() => {
            mensajeErrorElement.classList.remove('shake');
        }, 1000);

        // Mostrar el mensaje durante 3 segundos
        setTimeout(() => {
            // Ocultar el mensaje después de 3 segundos
            mensajeErrorElement.style.display = 'none';
        }, 3000);
    }
}


function mostrarMensaje(mensaje) {
    // Mostrar el mensaje en algún elemento HTML
    const mensajeElement = document.getElementById('mensaje');

    // Verificar si el elemento existe antes de actualizar su contenido
    if (mensajeElement) {
        mensajeElement.textContent = mensaje;

        // Avanzar al siguiente formulario solo si la bandera permite el avance
        if (puedeAvanzar) {
            avanzarAlSiguienteFormulario();
        }
    }
}

function avanzarAlSiguienteFormulario() {
    // Lógica para avanzar al siguiente formulario
    // Puedes agregar más acciones aquí si es necesario

    // Ejemplo: Mostrar el siguiente formulario o realizar otras acciones
    formStepsNum++;
    updateFormSteps();
    updateProgressbar();
    // Restablecer la bandera para futuras verificaciones
    puedeAvanzar = false;
}

function VerifyBasicForms() {
    const usernamefield = document.getElementById('username').value;
    const fullnameInput = document.getElementById('fullname');
    const fullname = fullnameInput.value.trim();
    const loader1 = document.getElementById('loader');

    document.getElementById('next3').disabled = true;

    loader1.style.display = 'block';

    // Verificar si el campo de nombre completo está vacío
    if (fullname.length === 0) {
        mostrarMensajeErrorFullname('El nombre completo no puede estar vacío.');
        document.getElementById('next3').disabled = false;
        ocultarLoader();
        return; // Salir de la función si el nombre completo está vacío
    }

    // Verificar si el campo de nombre completo contiene números
    if (/\d/.test(fullname)) {
        mostrarMensajeErrorFullname('El nombre completo no puede contener números.');
        document.getElementById('next3').disabled = false;
        ocultarLoader();
        return; // Salir de la función si el nombre completo contiene números
    }

    // Verificar que el campo de nombre completo contenga solo letras y tenga entre 10 y 30 caracteres
    if (!/^[a-zA-Z\s]{10,70}$/.test(fullname)) {
        mostrarMensajeErrorFullname('El nombre completo debe contener entre 10 y 30 caracteres');
        document.getElementById('next3').disabled = true;
        ocultarLoader();
        return; // Salir de la función si el nombre completo no cumple con los requisitos
    }

    if (navigator.onLine) {
        // Realizar la solicitud al servidor para verificar el código
        axios.post('checkusername', {
                fullusername: usernamefield,
            })
            .then((response) => {
                console.log(response.data);

                // Verificar si la solicitud fue exitosa
                if (response.data.username_exists) {
                    // Si el username existe, mostrar un mensaje de error y bloquear el avance
                    mostrarMensajeErrorUsername('El username ya está en uso. Inténtelo con otro username.');
                    document.getElementById('next3').disabled = true;
                } else {
                    // Si el username no existe, permitir el avance y realizar otras acciones si es necesario
                    mostrarMensaje('Fue correcto. Continuando.');

                    // Puede avanzar el mondongo
                    formStepsNum++;
                    updateFormSteps();
                    updateProgressbar();
                }
            })
            .catch((error) => {
                console.error(error);

                // Manejar errores según tu lógica
                if (error.response && error.response.status === 401) {
                    // Error 429 - Too Many Requests
                    // mostrarMensajeErrorCode('Oops! Parece que ha ocurrido un error inesperado');

                    // Deshabilitar el botón y mostrar el mensaje de error
                    document.getElementById('next3').disabled = true;
                    // mostrarMensajeError('Demasiadas solicitudes. Por favor, espere un momento.');

                    // Establecer un tiempo de espera y luego habilitar el botón
                    setTimeout(() => {
                        error429Recibido = false;
                        document.getElementById('next3').disabled = false;
                    }, 5000); // Establece el retardo en milisegundos (en este ejemplo, 5 segundos)

                } else {
                    mostrarMensajeErrorCode('Error . Inténtelo nuevamente.');
                }
            })
            .finally(() => {
                // Ocultar el loader después de que la carga ha terminado
                ocultarLoader();
            });
    }
}

function mostrarMensajeErrorUsername(mensaje) {
    const mensajeErrorUsername = document.getElementById('label-Step-username');

    if (mensajeErrorUsername) {
        mensajeErrorUsername.textContent = mensaje;
        mensajeErrorUsername.style.color = 'red';
    }

    const isVisible = window.getComputedStyle(mensajeErrorUsername).display === 'block';

    if (isVisible) {
        mensajeErrorUsername.classList.add('shake');
    } else {
        mensajeErrorUsername.classList.remove('shake');
    }

    setTimeout(() => {
        mensajeErrorUsername.classList.remove('shake');
    }, 1000);

    // Mostrar el mensaje durante 3 segundos
    mensajeErrorUsername.style.opacity = '1'; // Establecer la opacidad a 1
    setTimeout(() => {
        mensajeErrorUsername.classList.add('fadeOut');
        mensajeErrorUsername.style.opacity = '0'; // Establecer la opacidad a 0
        setTimeout(() => {
            mensajeErrorUsername.classList.remove('fadeOut');
        }, 1000);
    }, 3000);
}

function mostrarMensajeErrorFullname(mensaje) {
    const mensajeErrorFullname = document.getElementById('label-Step-fullname');

    if (mensajeErrorFullname) {
        mensajeErrorFullname.textContent = mensaje;
        mensajeErrorFullname.style.color = 'red';
    }

    const isVisible = window.getComputedStyle(mensajeErrorFullname).display === 'block';

    if (isVisible) {
        mensajeErrorFullname.classList.add('shake');
    } else {
        mensajeErrorFullname.classList.remove('shake');
    }

    setTimeout(() => {
        mensajeErrorFullname.classList.remove('shake');
    }, 1000);

    // Mostrar el mensaje durante 3 segundos
    mensajeErrorFullname.style.opacity = '1'; // Establecer la opacidad a 1
    setTimeout(() => {
        mensajeErrorFullname.classList.add('fadeOut');
        mensajeErrorFullname.style.opacity = '0'; // Establecer la opacidad a 0
        setTimeout(() => {
            mensajeErrorFullname.classList.remove('fadeOut');
        }, 1000);
    }, 3000);
}

function SaveData() {
    // Obtén datos de los inputs
    const username = document.getElementById('username').value;
    const fullname = document.getElementById('fullname').value;
    const correo = document.getElementById('textemail').value;
    const contrasena = document.getElementById('password').value;

    // Obtener el valor del plan seleccionado
    const radios = document.querySelectorAll('input[type="radio"][name="plans"]');
    let format;
    radios.forEach(radio => {
        if (radio.checked) {
            format = radio.value;
        }
    });

    // Verificar si se ha seleccionado algún plan
    if (!format) {
        mostrarMensajeError('Por favor, selecciona un plan.');
        return;
    }

    // Realizar la solicitud al servidor para guardar los datos
    axios.post('saveUsuarios', {
            username: username,
            fullname: fullname,
            correo: correo,
            contrasena: contrasena,
            format: format
        })
        .then((response) => {
            console.log(response.data);

            // Verificar si la solicitud fue exitosa
            if (response.status === 200) {
                // Mostrar un mensaje al usuario indicando que se envió el código
                mostrarMensaje('Fue correcto. Continuando.');

                // Obtener el token de la respuesta
                const token = response.data.token;

                // Guardar el token en el localStorage
                localStorage.setItem('token', token);

                // Redirigir a la página principal
                window.location.href = '/fronted/indexmain';

            } else {
                mostrarMensaje('Error. Inténtelo nuevamente.');

            }
        })
        .catch((error) => {
            console.error(error);

            // Manejar errores según tu lógica
            if (error.response && error.response.status === 401) {
                // Error 429 - Too Many Requests
                mostrarMensajeError('Oops! Parece que el código no es válido o ha expirado.');

            } else {
                mostrarMensajeError('Error. Inténtelo nuevamente.');
                // Restablecer la bandera para bloquear el avance
                // Puedes agregar más acciones aquí si es necesario
            }
        });
}



const radioButtons = document.querySelectorAll('input[name="plans"]');

// Obtener el botón por su ID
const planButton = document.getElementById('planbtn');

// Agregar un evento change a cada radio button
radioButtons.forEach(function(radioButton) {
    radioButton.addEventListener('change', function() {
        // Verificar si algún radio button está seleccionado
        const isSelected = Array.from(radioButtons).some(radio => radio.checked);

        // Mostrar u ocultar el botón según si algún radio button está seleccionado
        planButton.style.display = isSelected ? 'block' : 'none';
    });
});

/**OTP SALTADO RAPIDO */

const nums = document.querySelectorAll('.num');

nums.forEach((num, index) => {
    num.dataset.id = index;

    num.addEventListener('input', (event) => {
        const currentInput = event.target;
        let currentInputValue = currentInput.value;

        // Utilizar una expresión regular para permitir solo dígitos
        currentInputValue = currentInputValue.replace(/\D/g, '');

        // Limitar la longitud del valor a 1
        if (currentInputValue.length > 1) {
            currentInput.value = currentInputValue.slice(0, 1);
        } else {
            currentInput.value = currentInputValue;
        }

        // Enfocar automáticamente el siguiente campo de entrada
        if (currentInputValue && index < nums.length - 1) {
            nums[parseInt(currentInput.dataset.id) + 1].focus();
        }
    });

    num.addEventListener('paste', (event) => {
        const clipboardData = event.clipboardData || window.clipboardData;
        const pastedData = clipboardData.getData('Text');

        // Verificar si todos los caracteres pegados son números
        if (/^\d+$/.test(pastedData)) {
            // Distribuir el código pegado en las casillas
            for (let i = 0; i < nums.length; i++) {
                if (pastedData[i]) {
                    nums[i].value = pastedData[i];
                }
            }

            // Enfocar automáticamente el último campo después de pegar
            nums[nums.length - 1].focus();
        }

        // Detener la propagación del evento para evitar que el valor original se pegue
        event.preventDefault();
    });

    num.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace' && index > 0 && num.value === '') {
            // Manejar el caso específico de retroceso (Backspace)
            const prevNum = nums[parseInt(num.dataset.id) - 1];

            if (prevNum) {
                prevNum.focus();
            }

            const mensajeElementCode = document.getElementById('label-Code');

            if (mensajeElementCode) {
                mensajeElementCode.style.display = 'none';
            }
        }
    });
});