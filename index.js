var signup = document.querySelector(".signup");

signup.addEventListener("click", () => {
  $(".mini.modal.m1Form").modal("show");
});

var firestore = firebase.firestore();
var auth = firebase.auth();


//handling signup
var signupForm = document.querySelector("#signupForm");
var fullName = document.querySelector("#fullName");
var email = document.querySelector("#email");
var password = document.querySelector("#password");

var signUpHandle = async e => {
  e.preventDefault();
  var displayName = fullName.value.trim();
  var mail = email.value.trim();
  var ps = password.value.trim();
  if (displayName && mail && ps) {
    try {
      //create new user
      var user = await auth.createUserWithEmailAndPassword(mail, ps);
      var userId = user.user.uid;
      var userObj = {
        displayName: displayName,
        email: mail,
        joinedAt: firebase.firestore.Timestamp.fromDate(new Date())
      };

      //saving personal user info in firestore
      await firestore
        .collection("users")
        .doc(userId)
        .set(userObj);
      //redirecting user to expenses page with his id
      location.assign(`expenses.html#${userId}`);
    } catch (error) {
      console.log(error);
    }
  }
};

signupForm.addEventListener("submit", e => {
  signUpHandle(e);
});

//signup with google
const googleLogin = document.querySelector(".googleLogin");
googleLogin.addEventListener('click', ()  => {
  
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    console.log("Google acces token"+token)
    var user = result.user;
    // ...
    console.log("sign-in user info"+user)
    
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    console.log("errors")
    console.log(errorCode);
    console.log(errorMessage);
    console.log(email);
    console.log(credential);
  });


})







//handle login
var loginForm = document.querySelector("#loginForm");
var loginEmail = document.querySelector("#loginEmail");
var loginPassword = document.querySelector("#loginPassword");

var handleLogin = async e => {
  e.preventDefault();
  var email = loginEmail.value.trim();
  var ps = loginPassword.value.trim();
  if (email && ps) {
    console.log("loged in");
    try {
      //login user with email and password
      var user = await auth.signInWithEmailAndPassword(email, ps);
      var userId = user.user.uid;
      //redirecting user to expenses page with his id
      location.assign(`expenses.html#${userId}`);
      
    } catch (error) {
      console.log(error);
    }
  }
};

loginForm.addEventListener("submit", e => {
  handleLogin(e);
});


