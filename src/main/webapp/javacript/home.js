{
    let groupListCreated, groupListInvited, groupDetails;

    let pageOrchestrator = new PageOrchestrator();

    window.addEventListener("load", () => {
        if(sessionStorage.getItem("user") == null) {
            window.location.hash = "login.html";
        } else {
            pageOrchestrator.start();
            pageOrchestrator.refresh();
        }
    }, false);



    function PageOrchestrator() {
        this.start = function () {
            console.log("user is logged");
        }
        this.refresh = function () {
            console.log("refreshed");
        }
    }
}