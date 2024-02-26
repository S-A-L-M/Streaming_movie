import KEYS from "/static/js/Keys.js";

const $d = document;
const $format = $d.getElementById("format");
const options = { headers: { Authorization: `Bearer ${KEYS.secret}` } };

let prices;

Promise.all([
        fetch("https://api.stripe.com/v1/prices", options)
    ])
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(json => {
        prices = json[0].data;
    })
    .catch(error => {
        let message = error.statusText || "Ocurrió un error en la petición";
        console.error(`Error: ${error.status}: ${message}`);
    });

$d.addEventListener("click", e => {
    if (e.target.matches("[name=plans]")) {
        let selectedPlan = e.target.value;

        let priceId = getPriceIdForPlan(selectedPlan);

        if (priceId) {
            redirectToCheckout(priceId);
        } else {
            console.error("Precio no encontrado para el plan seleccionado.");
        }
    }
});

function getPriceIdForPlan(plan) {

    switch (plan) {
        case "trial":
            return "price_1OKIXwF8Qno4dEBe6YFV1R3x";
        case "personal":
            return "price_1OKInmF8Qno4dEBeiETA3xod";
        case "duo":
            return "price_1OKIrKF8Qno4dEBelB8LYxf4";
        default:
            return null;
    }
}

function redirectToCheckout(priceId) {
    Stripe(KEYS.public).redirectToCheckout({
            lineItems: [{
                price: priceId,
                quantity: 1
            }],
            mode: "subscription",
            successUrl: window.location.origin + "/fronted/indexmain",
            cancelUrl: window.location.origin + "/fronted/indexregister"
        })
        .then(res => {
            if (res.error) {
                console.error(res.error.message);
            }
        });
}