var options = {
  language: 'pt-br'
};

var theme = {
  theme: {
    logo: "../assets/images/logo_preto.png",
    primaryColor: "#bf0202"
  }
};

// Initiating our Auth0Lock
var lock = new Auth0Lock(
  'Sbu2Ngdr1g2D3aFBKdojLQGUo2patuqF',
  'editai.auth0.com',
  options,
  theme
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
