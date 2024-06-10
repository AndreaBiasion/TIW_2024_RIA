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

    function GroupListCreated(groupTitle, groupListBodyCreated) {
        this.groupListBodyCreated = groupListBodyCreated;

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
                                groupListBodyCreated.hidden = true;
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

            groups.forEach(function (group) {
                let row = document.createElement("tr");
                let groupTitle = document.createElement("td");
                let groupDetails = document.getElementById("group_details_invited");

                groupTitle.textContent = group.title;
                row.appendChild(groupTitle);
                row.appendChild(groupDetails);
                self.groupListBodyCreated.appendChild(row); // Aggiungi la riga al corpo della tabella
            });
        }

        this.reset = function() {
            groupTitle.hidden = true;
        }
    }

    function GroupListInvited(groupTitle, groupListBodyInvited) {
        this.groupListBodyInvited = groupListBodyInvited;

        this.show = function () {
            let self = this;
            makeCall("GET", 'GetGroupsInvited', null,
                function(req) {
                    if (req.readyState == 4) {
                        let message = req.responseText;
                        let errorMessage = document.getElementById("id_error_invited");

                        if(req.status === 200) {
                            let groups = JSON.parse(req.responseText);

                            if(groups.length === 0) {
                                errorMessage.textContent = "Nessun gruppo in cui sei invitato";
                                groupListBodyInvited.hidden = true;
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

            groups.forEach(function (group) {
                let row = document.createElement("tr");
                let groupTitle = document.createElement("td");
                let groupDetails = document.getElementById("group_details_invited");

                groupTitle.textContent = group.title;
                row.appendChild(groupTitle);
                row.appendChild(groupDetails)
                self.groupListBodyInvited.appendChild(row); // Aggiungi la riga al corpo della tabella
            });
        }

        this.reset = function() {
            groupTitle.hidden = true;
        }
    }

    function PageOrchestrator() {
        this.start = function () {
            document.getElementById("id_username").textContent = window.sessionStorage.getItem("user");

            // creating the group list created by the user
            groupListCreated = new GroupListCreated(
                document.getElementById("group_title_created"),
                document.getElementById("groupListBodyCreated")
            );

            groupListCreated.reset();
            groupListCreated.show();

            // creating the group list invited
            groupListInvited = new GroupListInvited(
                document.getElementById("group_title_invited"),
                document.getElementById("groupListBodyInvited")
            );

            groupListInvited.reset();
            groupListInvited.show();
        }
        this.refresh = function () {
            console.log("refreshed");
        }
    }
}
