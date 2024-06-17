{
    let groupListCreated, groupListInvited, anagList, wizard, detailsList;

    let pageOrchestrator = new PageOrchestrator();

    //Evento: caricamento della home page
    window.addEventListener("load", () => {
        if(sessionStorage.getItem("user") == null) {
            window.location.hash = "login.html";
        } else {
            pageOrchestrator.start();
            pageOrchestrator.refresh();


        }
    }, false);
    //Mostra la lista dei gruppi creati dall'utente
    function GroupListCreated(_groupCreatedContainer, _groupListBodyCreated) {
        this.groupListBodyCreated = _groupListBodyCreated;
        this.groupCreatedContainer = _groupCreatedContainer;

        this.show = function () {
            let self = this;
            makeCall("GET", 'GetGroupsCreated', null,
                function(req) {
                    if (req.readyState === 4) {
                        let message = req.responseText;
                        let errorMessage = document.getElementById("id_error_created");
                        //Il server ha risposto correttamente
                        if(req.status === 200) {
                            let groups = JSON.parse(req.responseText);

                            if(groups.length === 0) {
                                errorMessage.textContent = "Nessun gruppo creato";
                                this.groupCreatedContainer.style.visibility = "hidden";
                                return;
                            }

                            errorMessage.textContent = "";
                            self.update(groups);
                        } else if(req.status === 403) {
                            window.location.href = req.getResponseHeader("Location");
                            window.sessionStorage.removeItem("user");
                        } else {
                            errorMessage.textContent = message;
                        }
                    }
                })
        }
        //Aggiorna la lista dei gruppi creati dall'utente
        this.update = function (groups) {
            this.groupListBodyCreated.innerHTML = "";
            let self = this;
            var row, titlecell, linkcell, anchor, linkText;

            groups.forEach(function (group) {
                row = document.createElement("tr");

                // Creare la cella del titolo
                titlecell = document.createElement("td");
                titlecell.textContent = group.title;
                row.appendChild(titlecell);

                // Creare la cella del link
                linkcell = document.createElement("td");
                anchor = document.createElement("a");
                linkText = document.createTextNode("Dettagli");
                anchor.appendChild(linkText);
                anchor.href = "#";

                anchor.addEventListener("click", function(event) {
                    event.preventDefault();
                    detailsList = new showGroupDetails(group.id, _groupListBodyCreated); // Mostra i dettagli del gruppo in un modal
                });
                linkcell.appendChild(anchor);
                row.appendChild(linkcell);

                // Aggiungere la riga al corpo della tabella
                self.groupListBodyCreated.appendChild(row);
            });
            this.groupCreatedContainer.style.visibility = "visible";
        }

        this.reset = function() {
            // Mostro i gruppi creati
            this.show();
        }
    }
    //Mostra la lista dei gruppi in cui l'utente è invitato
    function GroupListInvited(_groupInvitedContainer, _groupListBodyInvited) {
        this.groupListBodyInvited = _groupListBodyInvited;
        this.groupInvitedContainer = _groupInvitedContainer;

        this.show = function () {
            let self = this;
            makeCall("GET", 'GetGroupsInvited', null,
                function(req) {
                    if (req.readyState === 4) {
                        let message = req.responseText;
                        let errorMessage = document.getElementById("id_error_invited");
                        //Il server ha risposto correttamente
                        if(req.status === 200) {
                            let groups = JSON.parse(req.responseText);

                            if(groups.length === 0) {
                                errorMessage.textContent = "Nessun gruppo in cui sei invitato";
                                this.groupInvitedContainer.style.visibility = "hidden";
                                return;
                            }
                            //aggiorno la lista
                            self.update(groups);
                        } else if(req.status === 403) {
                            window.location.href = req.getResponseHeader("Location");
                            window.sessionStorage.removeItem("user");
                        } else {
                            errorMessage.textContent = message;
                        }
                    }
                })
        }
        //Aggiorna la lista dei gruppi in cui l'utente è invitato
        this.update = function (groups) {
            this.groupListBodyInvited.innerHTML = "";
            let self = this;
            var row, titlecell, linkcell, anchor, linkText;

            groups.forEach(function (group) {
                row = document.createElement("tr");
                // Creare la cella del titolo
                titlecell = document.createElement("td");
                titlecell.textContent = group.title;
                row.appendChild(titlecell);
                // Creare la cella del link
                linkcell = document.createElement("td");
                anchor = document.createElement("a");
                linkText = document.createTextNode("Dettagli");
                anchor.appendChild(linkText);
                anchor.href = "#";
                anchor.addEventListener("click", function(event) {
                    event.preventDefault();
                    detailsList = new showGroupDetails(group.id, _groupListBodyInvited);  // Show group details in modal
                });
                linkcell.appendChild(anchor);
                row.appendChild(linkcell);
                // Aggiungere la riga al corpo della tabella
                self.groupListBodyInvited.appendChild(row);
            });
            this.groupInvitedContainer.style.visibility = "visible";
        }

        this.reset = function() {
            // Mostra i gruppi in cui l'utente è invitato
            this.show();
        }
    }
    //Mostra la lista degli utenti
    function UsersList(_anagListContainer, _anagListBody) {
        this.anagListBody = _anagListBody;
        this.anagListContainer = _anagListContainer;

        this.show = function () {
            let self = this;
            makeCall("GET", 'GetUsersAnag', null,
                function (req) {
                    if (req.readyState === 4) {
                        let message = req.responseText;
                        let errorMessage = document.getElementById("id_error_anag");

                        if (req.status === 200) {
                            let users = JSON.parse(req.responseText);

                            if (users.length === 0) {
                                errorMessage.textContent = "Nessun utente";
                                this.anagListContainer.style.visibility = "hidden";
                                return;
                            }
                            //Aggiorna la lista degli utenti
                            self.update(users);
                        } else if (req.status === 403) {
                            window.location.href = req.getResponseHeader("Location");
                            window.sessionStorage.removeItem("user");
                        } else {
                            errorMessage.textContent = message;
                        }
                    }
                })
        }
        //Aggiorna la lista degli utenti
        this.update = function (users, selectedUsers) {
            this.anagListBody.innerHTML = "";
            let self = this;
            var row, cell, checkbox, label;

            users.forEach(function (user) {
                row = document.createElement("tr");
                // Creare la cella del contenuto
                cell = document.createElement("td");
                // Creare l'input checkbox
                checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.className = "form-check-input";
                checkbox.name = "selectedUsers";
                checkbox.value = user.username;
                checkbox.id = "flexCheckDefault" + user.username;
                // Impostare l'attributo checked se l'utente è selezionato
                if (selectedUsers && selectedUsers.includes(user.username)) {
                    checkbox.checked = true;
                }
                // Creare l'etichetta per il checkbox
                label = document.createElement("label");
                label.className = "form-check-label";
                label.htmlFor = checkbox.id;
                label.textContent = user.name + ' ' + user.surname;
                // Aggiungere l'input e l'etichetta alla cella
                cell.appendChild(checkbox);
                cell.appendChild(label);
                // Aggiungere la cella alla riga
                row.appendChild(cell);
                // Aggiungere la riga al corpo della tabella
                self.anagListBody.appendChild(row);
            });
            this.anagListContainer.style.visibility = "visible";
        }

        this.reset = function() {
            this.anagListContainer.style.visibility = "hidden";
        }
    }

    //Funzione per mostrare i dettagli del gruppo
    function showGroupDetails(groupId, body) {
        let errorMessage = document.getElementById("id_error_details");
        makeCall("GET", 'GetGroupDetails?id=' + groupId, null, function(req) {
            if (req.readyState === 4) {
                let message = req.responseText;
                //Il server ha risposto correttamente
                if (req.status === 200) {
                    let groupDetails = JSON.parse(req.responseText);
                    let group = groupDetails.group;
                    let users = groupDetails.users;
                    //Aggiorna i dettagli del gruppo
                    document.getElementById("group_name").textContent = group.title;
                    document.getElementById("group_creation_date").textContent = "Creato il: " + group.date_creation;
                    document.getElementById("group_duration").textContent = "Durata attivita': " + group.activity_duration;

                    let detailsBody = document.getElementById("detailListBody");
                    detailsBody.innerHTML = "";
                    users.forEach(function(user) {
                        let row = document.createElement("tr");
                        let nameCell = document.createElement("td");
                        nameCell.textContent = user.name;
                        row.appendChild(nameCell);
                        let surnameCell = document.createElement("td");
                        surnameCell.textContent = user.surname;
                        row.appendChild(surnameCell);
                        //Se sono il creatore del gruppo, posso rimuovere gli utenti
                        if(body === document.getElementById("groupListBodyCreated")) {
                            row.draggable = true;
                            row.setAttribute('data-username', user.username);
                            row.setAttribute('id_group', group.id);

                            document.getElementById("trashBin").style.display = "block";

                            row.addEventListener('dragstart', function(event) {
                                event.dataTransfer.setData('text/plain', JSON.stringify({username: this.getAttribute('data-username'), groupId: this.getAttribute('id_group')}));
                            });
                        }

                        detailsBody.appendChild(row);
                    });

                    // Show the modal
                    document.getElementById("myDetailModal").style.display = "block";
                    sessionStorage.setItem("detailModalOpen", "true");
                    sessionStorage.setItem("currentGroupId", groupId);

                } else if (req.status === 403) {
                    window.location.href = req.getResponseHeader("Location");
                    window.sessionStorage.removeItem("user");
                } else {
                    errorMessage.textContent = message;
                }
            }
        });

        this.reset = function (){
            errorMessage.textContent = "";
            document.getElementById("trashBin").style.display = "none";
        }
    }

    // Event listeners for drag and drop
    document.getElementById("trashBin").addEventListener('dragover', function(event) {
        event.preventDefault();
        this.style.backgroundColor = '#f1f1f1';
    });

    document.getElementById("trashBin").addEventListener('dragleave', function(event) {
        this.style.backgroundColor = 'transparent';
    });

    document.getElementById("trashBin").addEventListener('drop', function(event) {
        event.preventDefault();
        let username = event.dataTransfer.getData('text/plain');
        removeUserFromGroup(username);
        this.style.backgroundColor = 'transparent';
    });

    //Rimuovi l'utente dal gruppo
    function removeUserFromGroup(userData) {
        let { username, groupId } = JSON.parse(userData);
        let errorMessage = document.getElementById("id_error_details");
        let currentUser = sessionStorage.getItem("user").trim();

        if(username.trim() === currentUser) {
            errorMessage.textContent = "Non puoi eliminare te stesso";
            return;
        }


        //Logica per rimuovere l'utente dal gruppo usando una chiamata al server
        makeCall("POST", "RemoveUser?id=" + groupId + "&username=" + username, null,
            function(req) {
                if (req.readyState === 4) {
                    if (req.status === 200) {
                        errorMessage.textContent = "Utente rimosso con successo";
                        // Rimuovi la riga dalla tabella
                        let detailsBody = document.getElementById("detailListBody");
                        let rows = detailsBody.getElementsByTagName("tr");
                        for (let i = 0; i < rows.length; i++) {
                            if (rows[i].getAttribute('data-username') === username) {
                                detailsBody.removeChild(rows[i]);
                                break;
                            }
                        }
                        pageOrchestrator.refresh();
                    } else {
                        errorMessage.textContent = req.responseText;
                    }
                }
            });

        this.reset = function () {
            errorMessage.textContent = "";
        }
    }
    //Funzione per creare un gruppo
    function Wizard(wizardId) {
        this.wizard = wizardId;

        let errorMessage = document.getElementById("errorMessage");

        this.registerEvents = function (orchestrator) {
            let form = this.wizard;
            let titolo;
            let durata;
            let min_part;
            let max_part;
            //Evento: submit del form
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                if(form.checkValidity()){
                    titolo = document.getElementById("title").value;
                    min_part = document.getElementById("min_part").value;
                    max_part = document.getElementById("max_part").value;
                    durata = document.getElementById("durata_att").value;

                    if(min_part > max_part || min_part <= 1) {
                        errorMessage.textContent = "Errore: numero partecipanti invalido";
                        orchestrator.refresh();
                        return;
                    }

                    if(durata <= 0) {
                        errorMessage.textContent = "Errore: durata attivita' invalida";
                        orchestrator.refresh();
                        return;
                    }

                    errorMessage.textContent = "";

                    makeCall("POST", 'CheckGroup', form,
                        function(req) {
                            if (req.readyState === XMLHttpRequest.DONE) {
                                let message = req.responseText;

                                if(req.status === 200) {
                                    anagList = new UsersList(
                                        document.getElementById("anagListContainer"),
                                        document.getElementById("anagListBody")
                                    );

                                    anagList.show();

                                    const modal = document.getElementById("myModal");
                                    const span = document.getElementsByClassName("anag_close")[0];

                                    modal.style.display = "block";
                                    sessionStorage.setItem("anagModalOpen", "true");

                                    span.onclick = function () {
                                        modal.style.display = "none";
                                    }
                                    //Escludo il creatore
                                    let inf = min_part - 1;
                                    let sup = max_part - 1;

                                    if(inf === sup) {
                                        document.getElementById("id_error_anag").textContent = "Puoi invitare " + inf + " utenti";
                                    }else {
                                        document.getElementById("id_error_anag").textContent = "Puoi invitare da " + inf + " a " + sup + " utenti";
                                    }
                                    //Evento: click sul bottone di cancella
                                    const cancelBtn = document.getElementById("cancelBtn");
                                    cancelBtn.addEventListener("click", () => {
                                        let checkboxes = document.querySelectorAll('input[name="selectedUsers"]');
                                        checkboxes.forEach(checkbox => {
                                            checkbox.checked = false;
                                        });
                                    });
                                }
                            }
                        }
                    );
                }
            })

            let anagForm = document.getElementById("anagListForm");
            let errorCount= localStorage.getItem("errorCount");

            if (errorCount === null) {
                errorCount = 0;
            } else {
                errorCount = parseInt(errorCount);
            }

            anagForm.addEventListener("submit", (e) => {
                e.preventDefault();
                // Ottieni tutti gli input checkbox selezionati
                let selectedCheckboxes = Array.from(document.querySelectorAll('input[name="selectedUsers"]:checked'));
                // Estrai i valori associati alle checkbox selezionate
                let selectedValues = selectedCheckboxes.map(checkbox => checkbox.value);

                let inf = min_part - 1;
                let sup = max_part - 1;

                let formData = new FormData();
                selectedValues.forEach(value => formData.append("selectedUsers", value));

                if (selectedValues.length < inf) {
                    let delta = inf - selectedValues.length;
                    document.getElementById("id_error_anag").textContent = "Troppi pochi utenti selezionati, aggiungerne almeno " + delta;
                    errorCount++;
                    localStorage.setItem("errorCount", errorCount);
                }

                if (selectedValues.length > sup) {
                    let delta = selectedValues.length - sup;
                    document.getElementById("id_error_anag").textContent = "Troppi utenti selezionati, eliminarne almeno " + delta;
                    errorCount++;
                    localStorage.setItem("errorCount", errorCount);
                }

                if(errorCount > 2) {
                    document.getElementById("myModal").style.display = "none";
                    document.getElementById("id_error_anag").textContent = "";
                    errorMessage.textContent = "Errore nella creazione del gruppo";
                    errorCount = 0;
                    localStorage.setItem("errorCount", errorCount);
                    orchestrator.refresh();
                }

                if(selectedValues.length >= inf && selectedValues.length <= sup) {
                    makeCall("POST", "CreateGroup?title=" + titolo + "&durata=" + durata + "&min_part=" + min_part + "&max_part=" + max_part+"&selectedUsers="+selectedValues, form,
                        function (req) {
                            if (req.readyState === XMLHttpRequest.DONE) {
                                let message = req.responseText;

                                if (req.status === 200) {
                                    errorMessage.textContent = "Gruppo creato con successo";
                                    document.getElementById("myModal").style.display = "none";
                                    orchestrator.refresh();
                                } else {
                                    errorMessage.textContent = message;
                                    console.error("Errore nella creazione del gruppo:", message);
                                }
                            }
                        }
                    );
                }
            });
        }

        this.reset = function () {
            this.wizard.reset();
        }
    }

    function PageOrchestrator() {
        this.start = function () {

            localStorage.removeItem("errorCount");

            document.getElementById("id_username").textContent = window.sessionStorage.getItem("user");

            // creating the group list created by the user
            groupListCreated = new GroupListCreated(
                document.getElementById("groupCreatedContainer"),
                document.getElementById("groupListBodyCreated")
            );

            groupListCreated.show();
            // creating the group list invited
            groupListInvited = new GroupListInvited(
                document.getElementById("groupInvitedContainer"),
                document.getElementById("groupListBodyInvited")
            );

            groupListInvited.show();

            wizard = new Wizard(document.getElementById("create_group_form"));
            wizard.registerEvents(this);

            const detailModal = document.getElementById("myDetailModal");
            const detailSpan = document.getElementsByClassName("detail_close")[0];

            detailSpan.onclick = function() {
                detailModal.style.display = "none";
                detailsList.reset();
            }

            window.onclick = function(event) {
                if (event.target === detailModal) {
                    detailModal.style.display = "none";
                    detailsList.reset();
                }
            }
            // adding listener to logout button
            document.getElementById("logout_btn").addEventListener("click",
                () => {
                    sessionStorage.removeItem("user")
                }
            )
        }

        this.refresh = function () {
            groupListCreated.reset();
            groupListInvited.reset();
            wizard.reset();
        }
    }
}
