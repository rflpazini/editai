var options = {
  language: 'pt-br'
};

// Initiating our Auth0Lock
var lock = new Auth0Lock(
  'Sbu2Ngdr1g2D3aFBKdojLQGUo2patuqF',
  'editai.auth0.com',
  options
);
var btn_login = document.getElementById('btn-login');

btn_login.addEventListener('click', function() {
    lock.show();
});

lock.on("authenticated", function(authResult) {
    lock.getProfile(authResult.idToken, function(error, profile) {
        if (error) {
            // Handle error
            return;
        }
        localStorage.setItem('id_token', authResult.idToken);
        // Display user information
        show_profile_info(profile);
    });
});
