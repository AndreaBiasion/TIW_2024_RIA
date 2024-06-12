{
    let groupListCreated, groupListInvited, anagList, wizard, detailsList;

    let pageOrchestrator = new PageOrchestrator();

    window.addEventListener("load", () => {
        if(sessionStorage.getItem("user") == null) {
            window.location.hash = "login.html";
        } else {
            pageOrchestrator.start();
            pageOrchestrator.refresh();
        }
    }, false);

    function GroupListCreated(_groupCratedContainer, _groupListBodyCreated) {
        this.groupListBodyCreated = _groupListBodyCreated;
        this.groupCratedContainer = _groupCratedContainer;

        this.show = function () {
            let self = this;
            makeCall("GET", 'GetGroupsCreated', null,
                function(req) {
                    if (req.readyState === 4) {
                        let message = req.responseText;
                        let errorMessage = document.getElementById("id_error_created");

                        if(req.status === 200) {
                            let groups = JSON.parse(req.responseText);

                            if(groups.length === 0) {
                                errorMessage.textContent = "Nessun gruppo creato";
                                this.groupInvitedContainer.style.visibility = "hidden";
                                return;
                            }

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
                    detailsList = new showGroupDetails(group.id); // Show group details in modal
                });
                linkcell.appendChild(anchor);
                row.appendChild(linkcell);

                // Aggiungere la riga al corpo della tabella
                self.groupListBodyCreated.appendChild(row);
            });
            this.groupCratedContainer.style.visibility = "visible";
        }

        this.reset = function() {
            this.groupCratedContainer.style.visibility = "hidden";
        }
    }

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

                        if(req.status === 200) {
                            let groups = JSON.parse(req.responseText);

                            if(groups.length === 0) {
                                errorMessage.textContent = "Nessun gruppo in cui sei invitato";
                                this.groupInvitedContainer.style.visibility = "hidden";
                                return;
                            }

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
                    showGroupDetails(group.id);  // Show group details in modal
                });
                linkcell.appendChild(anchor);
                row.appendChild(linkcell);

                // Aggiungere la riga al corpo della tabella
                self.groupListBodyInvited.appendChild(row);
            });
            this.groupInvitedContainer.style.visibility = "visible";
        }

        this.reset = function() {
            this.groupInvitedContainer.style.visibility = "hidden";
        }
    }

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

                            console.log("ci sono utenti");

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

    // Function to show group details in the modal
    function showGroupDetails(groupId) {
        let errorMessage = document.getElementById("id_error_details");
        makeCall("GET", 'GetGroupDetails?id=' + groupId, null, function(req) {
            if (req.readyState === 4) {
                let message = req.responseText;

                if (req.status === 200) {
                    let groupDetails = JSON.parse(req.responseText);
                    let group = groupDetails.group;
                    let users = groupDetails.users;



                    // Fill the modal with group details
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

                        row.draggable = true;
                        row.setAttribute('data-username', user.username);
                        row.setAttribute('id_group', group.id);


                        row.addEventListener('dragstart', function(event) {
                            event.dataTransfer.setData('text/plain', JSON.stringify({username: this.getAttribute('data-username'), groupId: this.getAttribute('id_group')}));
                        });



                        detailsBody.appendChild(row);
                    });

                    // Show the modal
                    document.getElementById("myDetailModal").style.display = "block";
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

    function removeUserFromGroup(userData) {
        let { username, groupId } = JSON.parse(userData);
        console.log("Rimuovi utente:", username, "dal gruppo:", groupId);
        let errorMessage = document.getElementById("id_error_details");

        // Aggiungi la logica per rimuovere l'utente dal gruppo usando una chiamata al server
        makeCall("POST", "RemoveUser?id=" + groupId + "&username=" + username, null,
            function(req) {
                if (req.readyState === 4) {
                    if (req.status === 200) {
                        console.log("Utente rimosso con successo");
                        // Rimuovi la riga dalla tabella
                        let detailsBody = document.getElementById("detailListBody");
                        let rows = detailsBody.getElementsByTagName("tr");
                        for (let i = 0; i < rows.length; i++) {
                            if (rows[i].getAttribute('data-username') === username) {
                                detailsBody.removeChild(rows[i]);
                                break;
                            }
                        }
                    } else {

                        errorMessage.textContent = "Errore: hai raggiunto il minimo di partecipanti";
                        console.error("Errore nella rimozione dell'utente:", req.responseText);
                    }
                }
            });

        this.reset = function () {
            errorMessage.textContent = "";
        }
    }

    function Wizard(wizardId) {
        this.wizard = wizardId;

        let errorMessage = document.getElementById("errorMessage");

        this.registerEvents = function (orchestrator) {
            let form = this.wizard;
            var valid = true;

            console.log("sono vivo")

            form.addEventListener('submit', (e) => {
                e.preventDefault();

                console.log("inviato")

                if(form.checkValidity()){

                    let min_part = document.getElementById("min_part").value;
                    let max_part = document.getElementById("max_part").value;
                    let durata = document.getElementById("durata_att").value;


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
                    console.log("valido")

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


                                    span.onclick = function () {
                                        modal.style.display = "none";
                                    }

                                    window.onclick = function (event) {
                                        if (event.target === modal) {
                                            modal.style.display = "none";
                                        }
                                    }
                                }
                            }
                        }
                    );



                }


            })

        }

        this.reset = function () {
            this.wizard.reset();
        }
    }


    function PageOrchestrator() {
        this.start = function () {
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
                if (event.target == detailModal) {
                    detailModal.style.display = "none";
                    detailsList.reset();
                }
            }
        }

        this.refresh = function () {
            groupListCreated.reset();
            wizard.reset();
            groupListInvited.reset();
            console.log("refreshed");
        }
    }
}
