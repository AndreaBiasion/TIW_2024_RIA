function passwordMatch() {
    let pswd1 = document.getElementById("password").value;
    let pswd2 = document.getElementById("repassword").value;

    console.log("Password1:", pswd1);
    console.log("Password2:", pswd2);

    if (pswd1 != null && pswd2 != null && pswd1 !== "" && pswd2 !== "") {
        return pswd1.match(pswd2);
    }

    return false;
}

// Funzione per validare l'email
function isValidEmail() {

    let email = document.getElementById("email").value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

(function() { // avoid variables ending up in the global scope

    document.getElementById("registerForm").addEventListener('submit', (e) => {
        e.preventDefault();

        console.log("Form submitted");

        let form = e.target;

        if (form.checkValidity()) {
            if (!passwordMatch()) {
                document.getElementById("errorMessage").textContent = "Le password non corrispondono (o sono mancanti)!";
                document.getElementById("errorMessage").hidden = false;
                return false;
            }

            if (!isValidEmail()) {
                document.getElementById("errorMessage").textContent = "Email non valida";
                document.getElementById("errorMessage").hidden = false;
                return false;
            }

            console.log("Passwords match, making call");

            makeCall("POST", 'CheckRegister', form,
                function(req) {
                    if (req.readyState === XMLHttpRequest.DONE) {
                        let message = req.responseText;

                        switch (req.status) {
                            case 200:
                                console.log("going to login")
                                window.location.href = "login.html";
                                break;
                            case 400: // bad request
                            case 401: // unauthorized
                            case 409: // conflict
                            case 500: // server error
                                document.getElementById("errorMessage").textContent = message;
                                document.getElementById("errorMessage").hidden = false;
                                break;
                        }
                    }
                }
            );
        } else {
            document.getElementById("errorMessage").hidden = true;
            form.reportValidity();
        }
    });
})();
