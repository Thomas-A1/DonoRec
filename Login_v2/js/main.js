// (function ($) {
//     "use strict";

//     /*==================================================================
//     [ Focus input ]*/
//     $('.input100').each(function () {
//         $(this).on('blur', function () {
//             if ($(this).val().trim() != "") {
//                 $(this).addClass('has-val');
//             } else {
//                 $(this).removeClass('has-val');
//             }
//         });
//     });

//     /*==================================================================
//     [ Validate ]*/
//     var input = $('.validate-input .input100');

//     $('.validate-form').on('submit', function () {
//         var check = true;

//         for (var i = 0; i < input.length; i++) {
//             if (validate(input[i]) == false) {
//                 showValidate(input[i]);
//                 check = false;
//             }
//         }

//         return check;
//     });

//     $('.validate-form .input100').each(function () {
//         $(this).focus(function () {
//             hideValidate(this);
//         });
//     });

//     function validate(input) {
//         var value = $(input).val().trim();

//         if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
//             var emailRegex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/;
//             if (!emailRegex.test(value)) {
//                 return false;
//             }
//         }
//         else if ($(input).attr('name') == 'contact') {
//             var phoneRegex = /^[0-9]{10,}$/; // Only numbers, minimum 10 digits
//             if (!phoneRegex.test(value)) {
//                 return false;
//             }
//         }
//         else if ($(input).attr('name') == 'pass') {
//             var passwordRegex = /^(?=.*\d)[A-Za-z\d]{5,}$/; // Minimum 8 characters, at least one number
//             if (!passwordRegex.test(value)) {
//                 return false;
//             }
//         }
//         else if ($(input).attr('name') == 'confirm-pass') {
//             var password = $('input[name="pass"]').val().trim();
//             if (value !== password || value == '') {
//                 return false;
//             }
//         }
//         else {
//             if (value == '') {
//                 return false;
//             }
//         }
//         return true;
//     }

//     function showValidate(input) {
//         var thisAlert = $(input).parent();
//         $(thisAlert).addClass('alert-validate');
//     }

//     function hideValidate(input) {
//         var thisAlert = $(input).parent();
//         $(thisAlert).removeClass('alert-validate');
//     }

//     /*==================================================================
//     [ Show pass ]*/
//     var showPass = 0;
//     $('.btn-show-pass').on('click', function () {
//         if (showPass == 0) {
//             $(this).next('input').attr('type', 'text');
//             $(this).find('i').removeClass('zmdi-eye');
//             $(this).find('i').addClass('zmdi-eye-off');
//             showPass = 1;
//         } else {
//             $(this).next('input').attr('type', 'password');
//             $(this).find('i').addClass('zmdi-eye');
//             $(this).find('i').removeClass('zmdi-eye-off');
//             showPass = 0;
//         }
//     });

// })(jQuery);

// $(document).ready(function () {
//     // Adding the animations for loading and success
//     var loadingContainer = $("#loading-animation");
//     var errorContainer = $('#error-animation');
//     var successContainer = $("#success-animation");
//     var loadingMessage = $("#loading-message");
//     var error_Message = $('#error-message');
//     var successMessage = $("#success-message");

//     var loadingAnimation = lottie.loadAnimation({
//         container: document.getElementById("loading-animation"),
//         renderer: "svg",
//         loop: true,
//         autoplay: false,
//         path: "animations/loading.json"
//     });

//     var successAnimation = lottie.loadAnimation({
//         container: document.getElementById("success-animation"),
//         renderer: "svg",
//         loop: false,
//         autoplay: false,
//         path: "animations/success.json"
//     });

//     var errorAnimation = lottie.loadAnimation({
//         container: document.getElementById("error-animation"),
//         renderer: "svg",
//         loop: false,
//         autoplay: false,
//         path: "animations/error.json"
//     });



//     $(".validate-form").on("submit", function (event) {

//         // Show loading animation
//         loadingMessage.text("Creating account, please wait...");
//         loadingContainer.show();
//         loadingAnimation.play();

//         event.preventDefault(); // Prevent default form submission

//         var email = $("input[name='email']").val().trim();
//         var password = $("input[name='pass']").val().trim();
//         var confirmPassword = $("input[name='confirm-pass']").val().trim();
//         var recordername = $("input[name='name']").val().trim();

//         // Validate password match
//         if (password !== confirmPassword) {
//             alert("Passwords do not match!");
//             return;
//         }

//         // Prepare JSON payload
//         var payload = {
//             email: email,
//             password: password,
//             name: recordername,
//         };

//         // Send data to the API
//         $.ajax({
//             url: "http://127.0.0.1:5000/signup",
//             type: "POST",
//             contentType: "application/json",
//             data: JSON.stringify(payload),
//             success: function (response) {
//                 // Hide loading animation
//                 loadingContainer.hide();
//                 loadingAnimation.stop();

//                 // Show success animation with a message
//                 successMessage.text("Account created successfully!");
//                 successContainer.show();
//                 successAnimation.play();

//                 setTimeout(function () {
//                     window.location.href = "login.html";
//                 }, 5000);
//             },
//             error: function (xhr) {
//                 loadingContainer.hide();
//                 loadingAnimation.stop();

//                 // Display error message inside the loading container
//                 var errorMessage = xhr.responseJSON ? xhr.responseJSON.error : "Signup failed!";
//                 error_Message.text(errorMessage).css("color", "red");
//                 errorContainer.show();
//                 errorAnimation.play();
//             }
//         });
//     });

//     $(".login100-form").on("submit", function (event) {
//         event.preventDefault(); // Prevent page reload

//         // Show loading animation
//         loadingMessage.text("Logging in, please wait...");
//         loadingContainer.show();
//         loadingAnimation.play();

//         var email = $("input[name='email']").val().trim();
//         var password = $("input[name='pass']").val().trim();

//         // if (!email || !password) {
//         //     alert("Please enter both email and password.");
//         //     return;
//         // }

//         var payload = {
//             email: email,
//             password: password
//         };

//         $.ajax({
//             url: "http://127.0.0.1:5000/login",
//             type: "POST",
//             contentType: "application/json",
//             data: JSON.stringify(payload),
//             success: function (response) {
//                 // Hide loading animation
//                 loadingContainer.hide();
//                 loadingAnimation.stop();

//                 // Show success message
//                 successMessage.text("Login successful!");
//                 successContainer.show();
//                 successAnimation.play();

//                 setTimeout(function () {
//                     window.location.href = "/Landing"; // Redirect after success
//                 }, 3000);
//             },
//             error: function (xhr) {
//                 loadingContainer.hide();
//                 loadingAnimation.stop();

//                 // Show error message
//                 var errorMessage = xhr.responseJSON ? xhr.responseJSON.error : "Login failed!";
//                 error_Message.text(errorMessage).css("color", "red");
//                 errorContainer.show();
//                 errorAnimation.play();
//             }
//         });
//     });
// });

(function ($) {
    "use strict";

    /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function () {
        $(this).on('blur', function () {
            if ($(this).val().trim() !== "") {
                $(this).addClass('has-val');
            } else {
                $(this).removeClass('has-val');
            }
        });
    });

    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function (event) {
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (!validate(input[i])) {
                showValidate(input[i]);
                check = false;
            }
        }

        if (!check) {
            event.preventDefault(); // Prevent submission if validation fails
        }

        return check;
    });

    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        var value = $(input).val().trim();

        if ($(input).attr('type') === 'email' || $(input).attr('name') === 'email') {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        }
        else if ($(input).attr('name') === 'contact') {
            var phoneRegex = /^[0-9]{10,}$/; // At least 10 digits, only numbers
            return phoneRegex.test(value);
        }
        else if ($(input).attr('name') === 'pass') {
            var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
            return passwordRegex.test(value);
        }
        else if ($(input).attr('name') === 'confirm-pass') {
            var password = $('input[name="pass"]').val().trim();
            return value === password && value !== '';
        }
        else {
            return value !== '';
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).removeClass('alert-validate');
    }

    /*==================================================================
    [ Show pass ]*/
    $('.btn-show-pass').on('click', function () {
        var input = $(this).next('input');
        var icon = $(this).find('i');

        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            icon.removeClass('zmdi-eye').addClass('zmdi-eye-off');
        } else {
            input.attr('type', 'password');
            icon.addClass('zmdi-eye').removeClass('zmdi-eye-off');
        }
    });

})(jQuery);

$(document).ready(function () {
    // Adding the animations for loading and success
    var loadingContainer = $("#loading-animation");
    var errorContainer = $('#error-animation');
    var successContainer = $("#success-animation");
    var loadingMessage = $("#loading-message");
    var errorMessage = $('#error-message');
    var successMessage = $("#success-message");

    var loadingAnimation = lottie.loadAnimation({
        container: document.getElementById("loading-animation"),
        renderer: "svg",
        loop: true,
        autoplay: false,
        path: "animations/loading.json"
    });

    var successAnimation = lottie.loadAnimation({
        container: document.getElementById("success-animation"),
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "animations/success.json"
    });

    var errorAnimation = lottie.loadAnimation({
        container: document.getElementById("error-animation"),
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "animations/error.json"
    });

    $("#signup").on("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Show loading animation
        loadingMessage.text("Creating account, please wait...");
        loadingContainer.show();
        loadingAnimation.play();

        var email = $("input[name='email']").val().trim();
        var password = $("input[name='pass']").val().trim();
        var confirmPassword = $("input[name='confirm-pass']").val().trim();
        var name = $("input[name='name']").val().trim();

        // Validate password match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            loadingContainer.hide();
            loadingAnimation.stop();
            return;
        }

        // Prepare JSON payload
        var payload = {
            email: email,
            password: password,
            name: name,
        };

        // Send data to the API
        $.ajax({
            url: "http://127.0.0.1:5000/signup",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function () {
                // Hide loading animation
                loadingContainer.hide();
                loadingAnimation.stop();

                // Show success animation
                successMessage.text("Account created successfully!");
                successContainer.show();
                successAnimation.play();

                setTimeout(function () {
                    window.location.href = "login.html";
                }, 3000);
            },
            error: function (xhr) {
                loadingContainer.hide();
                loadingAnimation.stop();

                var errorText = xhr.responseJSON ? xhr.responseJSON.error : "Signup failed!";
                errorMessage.text(errorText).css("color", "red");
                errorContainer.show();
                errorAnimation.play();
            }
        });
    });

    $("#login").on("submit", function (event) {
        event.preventDefault(); // Prevent page reload

        // Show loading animation
        loadingMessage.text("Logging in, please wait...");
        loadingContainer.show();
        loadingAnimation.play();

        var email = $("input[name='email']").val().trim();
        var password = $("input[name='pass']").val().trim();

        if (!email || !password) {
            alert("Please enter both email and password.");
            loadingContainer.hide();
            loadingAnimation.stop();
            return;
        }

        var payload = {
            email: email,
            password: password
        };

        $.ajax({
            url: "/login",  // Updated to use relative URL
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(payload),
            xhrFields: {
                withCredentials: true  // Important for session cookies
            },
            success: function (response) {
                // Hide loading animation
                loadingContainer.hide();
                loadingAnimation.stop();

                // Show success message
                successMessage.text("Login successful!");
                successContainer.show();
                successAnimation.play();

                setTimeout(function () {
                    // Redirect to the landing page using the URL from the response or fallback
                    window.location.href = response.redirect || "/Landing";
                }, 3000);
            },
            error: function (xhr) {
                loadingContainer.hide();
                loadingAnimation.stop();

                var errorText = xhr.responseJSON ? xhr.responseJSON.error : "Login failed!";
                errorMessage.text(errorText).css("color", "red");
                errorContainer.show();
                errorAnimation.play();
            }
        });
    });
});

