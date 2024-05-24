function login(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "exampleUser" && password === "examplePassword") {
        window.location.href = "shopping.html";
    } else {
        alert("Invalid username or password. Please try again.");
    }
}