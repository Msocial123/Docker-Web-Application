function validateFlightForm() {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let email = document.getElementById("email").value;
    if (firstName === "" || lastName === "" || email === "") {
        alert("Please fill all required fields.");
        return false;
    }
    return true;
}
