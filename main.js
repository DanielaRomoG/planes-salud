const formulario = document.querySelector(".formulario");

if (formulario) {

    formulario.addEventListener("submit", async function (evento) {

        evento.preventDefault();

        if (!formulario.checkValidity()) {
            formulario.reportValidity();
            return;
        }

        const botonEnviar = formulario.querySelector(
            ".boton-formulario"
        );

        const textoOriginalBoton = botonEnviar.innerHTML;

        botonEnviar.disabled = true;
        botonEnviar.textContent = "Enviando información...";


        /* ==================================================
           OBTENER DATOS DEL FORMULARIO
        ================================================== */

        const nombre = document
            .getElementById("nombre")
            .value
            .trim();

        const apellido = document
            .getElementById("apellido")
            .value
            .trim();

        const correo = document
            .getElementById("correo")
            .value
            .trim();

        const telefono = document
            .getElementById("telefono")
            .value
            .trim();

        const region = document
            .getElementById("region")
            .value;

        const edad = document
            .getElementById("edad")
            .value;

        const renta = document
            .getElementById("renta")
            .value;


        const sistemaSeleccionado = document.querySelector(
            'input[name="sistema"]:checked'
        );

        const sistema = sistemaSeleccionado
            ? sistemaSeleccionado.value
            : "No informado";


        const clinicas = [];

        document
            .querySelectorAll('input[name="clinica"]:checked')
            .forEach(function (item) {

                clinicas.push(item.value);

            });


        const beneficios = [];

        document
            .querySelectorAll('input[name="beneficio"]:checked')
            .forEach(function (item) {

                beneficios.push(item.value);

            });


        const listaClinicas = clinicas.length
            ? clinicas.join(", ")
            : "Sin preferencia informada";

        const listaBeneficios = beneficios.length
            ? beneficios.join(", ")
            : "No informado";


        /* ==================================================
           MENSAJE PARA WHATSAPP
        ================================================== */

        const mensaje =
`Hola, quiero solicitar una evaluación gratuita de mi 7% de salud.

DATOS DE CONTACTO
Nombre: ${nombre} ${apellido}
Correo: ${correo}
Teléfono: ${telefono}
Región: ${region}
Edad: ${edad}
Renta imponible aproximada: ${renta}

SITUACIÓN ACTUAL
Sistema de salud: ${sistema}

PREFERENCIAS
Clínicas: ${listaClinicas}
Beneficios importantes: ${listaBeneficios}

Quedo atento/a a la asesoría.`;


        /* ==================================================
           CONFIGURACIÓN DE HUBSPOT
        ================================================== */

        const portalId = "51695232";

        const formGuid =
            "b3d71090-1214-4fed-a267-bec8943e1daf";

        const urlHubSpot =
            "https://api.hsforms.com/submissions/v3/integration/submit/" +
            portalId +
            "/" +
            formGuid;


        /*
        Estos son los nombres internos reales de las
        propiedades creadas en tu cuenta de HubSpot.
        */

        const datosHubSpot = {

            fields: [

                {
                    name: "firstname",
                    value: nombre
                },

                {
                    name: "lastname",
                    value: apellido
                },

                {
                    name: "email",
                    value: correo
                },

                {
                    name: "telefono",
                    value: telefono
                },

                {
                    name: "region",
                    value: region
                },

                {
                    name: "edad",
                    value: edad
                },

                {
                    name: "renta",
                    value: renta
                },

                {
                    name: "sistema_de_salud",
                    value: sistema
                },

                {
                    name: "clinicas_preferidas",
                    value: listaClinicas
                },

                {
                    name: "beneficios",
                    value: listaBeneficios
                }

            ],

            context: {

                pageUri: window.location.href,
                pageName: document.title

            },

            legalConsentOptions: {

                consent: {

                    consentToProcess: true,

                    text:
                        "Autorizo el uso de mis datos para gestionar mi solicitud.",

                    communications: []

                }

            }

        };


        /* ==================================================
           ENVIAR DATOS A HUBSPOT
        ================================================== */

        let envioCorrecto = false;

        try {

            const respuestaHubSpot = await fetch(
                urlHubSpot,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(datosHubSpot)
                }
            );


            const respuestaTexto =
                await respuestaHubSpot.text();


            if (!respuestaHubSpot.ok) {

                console.error(
                    "HubSpot rechazó el formulario:",
                    respuestaHubSpot.status,
                    respuestaTexto
                );

                alert(
                    "No fue posible guardar los datos en HubSpot. " +
                    "Igualmente se abrirá WhatsApp para continuar."
                );

            } else {

                envioCorrecto = true;

                console.log(
                    "Datos enviados correctamente a HubSpot.",
                    respuestaHubSpot.status,
                    respuestaTexto
                );

            }

        } catch (error) {

            console.error(
                "Error de conexión con HubSpot:",
                error
            );

            alert(
                "No se pudo conectar con HubSpot. " +
                "Igualmente se abrirá WhatsApp para continuar."
            );

        }


        /* ==================================================
           ABRIR WHATSAPP
        ================================================== */

        const numeroWhatsApp = "56985465991";

        const enlaceWhatsApp =
            "https://wa.me/" +
            numeroWhatsApp +
            "?text=" +
            encodeURIComponent(mensaje);

        window.open(
            enlaceWhatsApp,
            "_blank",
            "noopener,noreferrer"
        );


        /* ==================================================
           RESTAURAR BOTÓN Y LIMPIAR FORMULARIO
        ================================================== */

        botonEnviar.disabled = false;
        botonEnviar.innerHTML = textoOriginalBoton;


        if (envioCorrecto) {

            formulario.reset();

        }

    });

}


/* ==================================================
   CALCULADORA AUTOMÁTICA DEL 7%
================================================== */

const inputRentaCalculadora = document.getElementById(
    "renta-calculadora"
);

const resultadoCalculadora = document.getElementById(
    "resultado-calculadora"
);


function formatearPesos(valor) {

    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0
    }).format(valor);

}


function calcularSietePorCiento() {

    if (
        !inputRentaCalculadora ||
        !resultadoCalculadora
    ) {
        return;
    }

    const rentaCalculadora = Number(
        inputRentaCalculadora.value
    );

    if (
        !Number.isFinite(rentaCalculadora) ||
        rentaCalculadora <= 0
    ) {

        resultadoCalculadora.textContent = "$0";
        return;

    }

    const sietePorCiento =
        rentaCalculadora * 0.07;

    resultadoCalculadora.textContent =
        formatearPesos(sietePorCiento);

}


if (inputRentaCalculadora) {

    inputRentaCalculadora.addEventListener(
        "input",
        calcularSietePorCiento
    );

}


/* ==================================================
   TARJETAS GIRATORIAS
================================================== */

const tarjetas = document.querySelectorAll(
    ".tarjeta-giratoria"
);


tarjetas.forEach(function (tarjeta) {

    function girarTarjeta() {

        tarjeta.classList.toggle("girada");

    }


    tarjeta.addEventListener(
        "click",
        girarTarjeta
    );


    tarjeta.addEventListener(
        "keydown",
        function (evento) {

            if (
                evento.key === "Enter" ||
                evento.key === " "
            ) {

                evento.preventDefault();
                girarTarjeta();

            }

        }
    );

});