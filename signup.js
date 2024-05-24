function signup(event) {
    event.preventDefault();

    const newUsername = document.getElementById("newUsername").value;
    const newPassword = document.getElementById("newPassword").value;

    console.log("New username:", newUsername);
    console.log("New password:", newPassword); 

    const users = JSON.parse(localStorage.getItem("users")) || [];
    console.log("Existing users:", users);
    const existingUser = users.find(user => user.username === newUsername);
    console.log("Existing user:", existingUser);

    if (existingUser) {
        alert("Username already exists. Please choose a different username.");
        return;
    }

    users.push({ username: newUsername, password: newPassword });
    localStorage.setItem("users", JSON.stringify(users));

    alert("User registered successfully. Redirecting to login page.");
    window.location.href = "login.html";
}