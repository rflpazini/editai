window.addEventListener('load', function() {
    var lock = new Auth0Lock('DwpE477F4CL4zEP6Kdj5MO6KS0fIPp6x', 'editai.auth0.com');
    var btn_login = document.getElementById('bt-login');
    var btn_logout = document.getElementById('bt-logout');

    var config = {
        apiKey: "AIzaSyA9ouh_oaGmBpGsjc4wdJAZrQeG_1diLm0",
        authDomain: "editai-base.firebaseapp.com",
        databaseURL: "https://editai-base.firebaseio.com",
        storageBucket: "editai-base.appspot.com",
        messagingSenderId: "861660898535"
    };

    function init() {
        firebase.initializeApp(config);
        routes();
    }

    if (btn_logout) {
        btn_logout.addEventListener('click', function() {
            logout();
        });
    }

    if (btn_login) {
        btn_login.addEventListener('click', function() {
            var id_token = localStorage.getItem('id_token');
            if (id_token) {
                routes();
            } else {
                lock.show({
                    closable: false,
                    theme: { "logo": "https://dl.dropboxusercontent.com/u/104095732/16388036_1703660259963949_4229443957888103359_n.jpg", "primaryColor": "#bf0202" },
                    language: "pt-br",
                    languageDictionary: { emailInputPlaceholder: "editaistudio@gmail.com", title: "Editaí" },
                    auth: {
                        responseType: 'token',
                        params: {
                            scope: 'openid email'
                        }
                    }
                });
            }
        });
    }


    lock.on("authenticated", function(authResult) {
        lock.getProfile(authResult.idToken, function(error, profile) {
            if (error) {
                localStorage.removeItem('id_token');
                localStorage.removeItem('profile');
                return alert('There was an error getting the profile: ' + error.message);
            } else {
                localStorage.setItem('id_token', authResult.idToken);
                localStorage.setItem('profile', JSON.stringify(profile));
                // writeNewUser(profile.nickname, profile.email, profile.user_id);

                window.location.href = "/console.html";
                show_profile_info(profile);
            }

        });
    });

    function show_profile_info(profile) {
        var avatar = document.getElementById('avatar');

        if (avatar) {
            avatar.src = profile.picture;
            avatar.style.display = "block";
            document.getElementById('complete-name').textContent = profile.nickname;
            document.getElementById('email').textContent = profile.email;
            document.getElementById('nickname').textContent = profile.nickname;
        }

    };

    function logout() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('profile');
        window.location.href = "/";
        document.location.href = "/";
    };

    function routes() {
        var id_token = localStorage.getItem('id_token');
        var current_location = window.location.pathname;

        if (id_token) {
            var profile = JSON.parse(localStorage.getItem('profile'));

            switch (current_location) {
                case "/video-upload.html":
                    retrieve_profile();
                    break;
                case "/console.html":
                    retrieve_profile();
                    retrieveProjects(profile);
                    break;
                case "/":
                    window.location.href = '/console.html';
                    break;
            };

        } else {
            if ("/" != current_location) {
                logout();
            }
        }
    };

    function retrieve_profile() {
        var id_token = localStorage.getItem('id_token');
        if (id_token) {
            lock.getProfile(id_token, function(err, profile) {
                if (err) {
                    return alert('There was an error getting the profile: ' + err.message);
                } else {
                    show_profile_info(profile);
                }
            });
        }
    };

    function writeNewUser(email, name, id) {
        firebase.database().ref().child('users').child(id).set({
            username: name,
            email: email,
            uId: id
        });
    };

    function addNewProject(title, description, user, email) {
        var newPostKey = firebase.database().ref().child('projects').child(user).push().key;

        var postData = {
            title: title,
            desc: description,
            user_id: user,
            user_email: email
        };

        firebase.database().ref('projects/' + user + '/' + newPostKey).set(postData);
    };

    function retrieveProjects(profile) {
        var commentsRef = firebase.database().ref().child('projects').child(profile.user_id);
        commentsRef.on('child_added', function(data) {
            console.log(data.val().title + " - " + data.val().desc);
            addCommentElement(data.key, data.val().title, data.val().desc);
        });
    }

    function addCommentElement(id, title, desc) {
        var comment = document.createElement('a');
        comment.classList.add('list-group-item');
        comment.innerHTML = '<h4 class="list-group-item-heading"></h4><p class="list-group-item-text"></p>';
        comment.getElementsByClassName('list-group-item-heading')[0].innerText = title;
        comment.getElementsByClassName('list-group-item-text')[0].innerText = desc;

        $("#list").append(comment);
    }

    $('#video-form').submit(function(e) {
        e.preventDefault();
        var id_token = localStorage.getItem('id_token');
        if (id_token) {
            lock.getProfile(id_token, function(err, profile) {
                if (err) {
                    return alert('There was an error getting the profile while trying to save new PROJECT: ' + err.message);
                } else {
                    var title = localStorage.getItem('proj-name');
                    var desc = localStorage.getItem('proj-comment');
                    addNewProject(title, desc, profile.user_id, profile.email);
                }
            });
        }
    });

    init();
});
