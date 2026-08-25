// =========================================
// VB Notes - Login
// =========================================

const BASE_URL = "https://notes-app-b63a.onrender.com";

// Password Show / Hide
$("#togglePassword").click(function () {

    let password = $("#password");

    let icon = $(this).find("i");

    if (password.attr("type") === "password") {

        password.attr("type", "text");

        icon.removeClass("fa-eye");
        icon.addClass("fa-eye-slash");

    } else {

        password.attr("type", "password");

        icon.removeClass("fa-eye-slash");
        icon.addClass("fa-eye");

    }

});


// Login

$("#loginForm").submit(function (e) {

    e.preventDefault();

    let email = $("#email").val().trim();

    let password = $("#password").val().trim();

    if (email == "" || password == "") {

        alert("Please fill all fields.");

        return;
    }

    $(".login-btn")
        .text("Logging in...")
        .prop("disabled", true);

    $.ajax({

        url: BASE_URL + "/users/login",

        type: "POST",

        contentType: "application/json",

        data: JSON.stringify({

            email: email,

            password: password

        }),

 success: function(response) {

    console.log(response);

    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(response)
    );

    localStorage.setItem(
        "userId",
        response.id.toString()
    );

    console.log(localStorage.getItem("loggedInUser"));
    console.log(localStorage.getItem("userId"));

    alert("Login Successful");

    window.location.href = "dashboard.html";

},

        error: function (xhr) {

            if (xhr.status == 401) {

                alert("Invalid Email or Password");

            } else {

                alert("Server Error");

            }

            $(".login-btn")
                .text("Login")
                .prop("disabled", false);

        }

    });

});
