// Replace with your Firebase project's config
const firebaseConfig = {
    apiKey: "AIzaSyAr7Hv2ApKtNTxF11MhT5cuWeg_Dgsh0TY",
    authDomain: "smart-burme-app.firebaseapp.com",
    projectId: "smart-burme-app",
    storageBucket: "smart-burme-app.appspot.com",
    messagingSenderId: "851502425686",
    appId: "1:851502425686:web:f29e0e1dfa84794b4abdf7"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Login Logic
document.getElementById('loginBtn').addEventListener('click', () => {
    document.getElementById('login-modal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('login-modal').style.display = 'none';
});

window.onclick = function(event) {
    if (event.target == document.getElementById('login-modal')) {
        document.getElementById('login-modal').style.display = 'none';
    }
}

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Logged in:", userCredential.user);
            // Redirect to a member-only page or show chatbot
            alert("Login Successful! Chatbot is now enabled.");
            document.getElementById('login-modal').style.display = 'none';
            document.getElementById('toggleChatBtn').style.display = 'block';
        })
        .catch((error) => {
            alert(error.message);
        });
});

document.getElementById('google-login').addEventListener('click', () => {
    auth.signInWithPopup(googleProvider)
        .then((result) => {
            console.log("Logged in with Google:", result.user);
            alert("Login Successful! Chatbot is now enabled.");
            document.getElementById('login-modal').style.display = 'none';
            document.getElementById('toggleChatBtn').style.display = 'block';
        })
        .catch((error) => {
            alert(error.message);
        });
});
