// Remove the success message after 2 seconds

setTimeout(function() {
    var successMessage = document.getElementById('success-message');
    var errorMessage = document.getElementById('error-message');
    if (successMessage) {
        successMessage.remove();
    }
    else{
        errorMessage.remove();

    }
}, 2000);
