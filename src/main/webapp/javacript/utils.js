/**
 * AJAX call management
 */

function makeCall(method, url, formElement, cback, reset = true) {
    var req = new XMLHttpRequest(); // visible by closure
    req.onreadystatechange = function() {
        cback(req)
    }; // closure
    req.open(method, url);

    // Controlla se il form è null
    if (formElement == null) {
        // No form --> Invia senza data
        req.send();
    } else {
        // Invia il form
        req.send(new FormData(formElement));
    }

    if (formElement !== null && reset === true) {
        formElement.reset();
    }
}