var options = {

    theme: {
        logo: "https://dl.dropboxusercontent.com/u/104095732/16388036_1703660259963949_4229443957888103359_n.jpg",
        primaryColor: "#bf0202"
    },
    languageDictionary: {
        emailInputPlaceholder: "editaistudio@gmail.com",
    }
};

// Initiating our Auth0Lock
var lock = new Auth0Lock(
    'Sbu2Ngdr1g2D3aFBKdojLQGUo2patuqF',
    'editai.auth0.com'
);

var btn_login = document.getElementById('bt-login');

btn_login.addEventListener('click', function() {
    lock.show({
        closable: false,
        allowedConnections: ["facebook"],
        theme: { "logo": "https://dl.dropboxusercontent.com/u/104095732/16388036_1703660259963949_4229443957888103359_n.jpg", "primaryColor": "#bf0202" },
        language: "pt-br",
        auth: {
            responseType: 'token',
            params: {
                scope: 'openid email'
            }
        }
    });
});

lock.on("authenticated", function(authResult) {
    lock.getProfile(authResult.idToken, function(error, profile) {
        if (error) {
            return;
        }
        localStorage.setItem('id_token', authResult.idToken);
        show_profile_info(profile);
    });
});

var retrieve_profile = function() {
    var id_token = localStorage.getItem('id_token');
    if (id_token) {
        lock.getProfile(id_token, function(err, profile) {
            if (err) {
                return alert('There was an error getting the profile: ' + err.message);
            }
            // Display user information
            show_profile_info(profile);
        });
    }
};

var show_profile_info = function(profile) {
    var avatar = document.getElementById('avatar');
    document.getElementById('nickname').textContent = profile.nickname;
    btn_login.style.display = "none";
    avatar.src = profile.picture;
    avatar.style.display = "block";
    btn_logout.style.display = "block";
};
