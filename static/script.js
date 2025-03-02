document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const copyCheckedPassword = document.getElementById("copyCheckedPassword");

    const generatedPasswordInput = document.getElementById("generatedPassword");
    const toggleGeneratedPassword = document.getElementById("toggleGeneratedPassword");

    const generatePassword = document.getElementById("generatePassword");
    const copyPassword = document.getElementById("copyPassword");
    const strengthBar = document.getElementById("strength-bar");
    const suggestionBox = document.getElementById("suggestion-box");
    const suggestionsText = document.getElementById("suggestions");


    const eyeOpenPath = "/static/eye-open.svg"; 
    const eyeClosedPath = "/static/eye-closed.svg";

    // ✅ Apply to both password fields
    const passwordField = document.getElementById("password");
    const togglePasswordIcon = document.getElementById("togglePassword");

    const generatedPasswordField = document.getElementById("generatedPassword");
    const toggleGeneratedPasswordIcon = document.getElementById("toggleGeneratedPassword");

    const characterInput = document.getElementById("character");
    const cityInput = document.getElementById("city");

    

    togglePassword.addEventListener("click", function () {
        toggleVisibility(passwordInput, togglePassword);
    });

    toggleGeneratedPassword.addEventListener("click", function () {
        toggleVisibility(generatedPasswordInput, toggleGeneratedPassword);
    });

    // Check password strength via Flask API
    passwordInput.addEventListener("input", function () {
        passwordInput.value = passwordInput.value.slice(0, 12).replace(/\s/g, ''); // Enforce length limit & remove spaces
        fetch("/check-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: passwordInput.value })
        })
        .then(response => response.json())
        .then(data => {
            strengthBar.style.width = data.score * 25 + "%";
            
            if (data.score < 4) {
                suggestionBox.classList.remove("hidden");
                suggestionsText.innerHTML = data.feedback.join("<br>");
            } else {
                suggestionBox.classList.add("hidden");
                suggestionsText.innerHTML = "";
            }
        });
    });
    copyCheckedPassword.addEventListener("click", function () {
        if (passwordInput.value.trim() !== "") {
            navigator.clipboard.writeText(passwordInput.value)
                .then(() => alert("Password copied to clipboard! ✅"))
                .catch(() => alert("Failed to copy password. ❌"));
        } else {
            alert("Enter a password to copy.");
        }
    });


    // Generate personalized password
    generatePassword.addEventListener("click", function () {
        fetch("/generate-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                character: characterInput.value,
                city: cityInput.value
            })
        })
        .then(response => response.json())
        .then(data => {
            generatedPasswordInput.value = data.password;
        });
    });

    // Copy generated password
    copyPassword.addEventListener("click", function () {
        if (generatedPasswordInput.value.trim() !== "") {
            navigator.clipboard.writeText(generatedPasswordInput.value);
            alert("Password copied to clipboard! ✅");
        } else {
            alert("Generate a password first.");
        }
    });
    //pasword visibility
    function setupPasswordToggle(inputField, toggleButton) {
        toggleButton.addEventListener("click", function () {
            if (inputField.type === "password") {
                inputField.type = "text"; // ✅ Show password
                toggleButton.src = eyeClosedPath; // ✅ Change to "hide" icon
            } else {
                inputField.type = "password"; // ✅ Hide password
                toggleButton.src = eyeOpenPath; // ✅ Change to "show" icon
            }
        });
    }

    if (passwordField && togglePasswordIcon) {
        setupPasswordToggle(passwordField, togglePasswordIcon, eyeOpenPath, eyeClosedPath);
    }

    if (generatedPasswordField && toggleGeneratedPasswordIcon) {
        setupPasswordToggle(generatedPasswordField, toggleGeneratedPasswordIcon, eyeOpenPath, eyeClosedPath);
    }
});