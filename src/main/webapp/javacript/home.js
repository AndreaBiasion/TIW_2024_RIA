{
    let groupListCreated, groupListInvited, groupDetails, groupListBodyCreated, groupListBodyInvited;

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
                linkText = document.createTextNode("Vedi Dettagli");
                anchor.appendChild(linkText);
                anchor.href = "#";
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
                linkText = document.createTextNode("Vedi Dettagli");
                anchor.appendChild(linkText);
                anchor.href = "#";
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
        }
        this.refresh = function () {

            groupListCreated.reset();
            groupListInvited.reset();
            console.log("refreshed");
        }
    }
}
