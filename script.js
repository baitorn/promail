/* =========================
   CHATMAIL - IA APPRENANTE
   HUMAIN + ROBOT
========================= */

/* =========================
   VARIABLES
========================= */
const authButtons = document.getElementById("auth-buttons");

const createEmailButton = document.getElementById("create-email-button");
const loginButton = document.getElementById("login-button");

const emailFormContainer = document.getElementById("email-form-container");
const loginFormContainer = document.getElementById("login-form-container");

const backButton = document.getElementById("back-button");
const backLoginButton = document.getElementById("back-login-button");

const emailForm = document.getElementById("email-form");
const loginForm = document.getElementById("login-form");

const userInfo = document.getElementById("user-info");
const userEmail = document.getElementById("user-email");

const logoutButton = document.getElementById("logout-button");

const chatSection = document.getElementById("chat-section");
const messages = document.getElementById("messages");

const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const clearButton = document.getElementById("clear-button");

/* =========================
   UTILISATEURS
========================= */
let users =
  JSON.parse(localStorage.getItem("users")) || [];

let currentUser = null;

/* =========================
   IA APPRENTISSAGE
========================= */
let apprentissage = false;

let questionEnCours = "";

/* =========================
   OUVRIR CREATION
========================= */
createEmailButton.addEventListener("click", () => {

  authButtons.classList.add("hidden");

  emailFormContainer.classList.remove("hidden");

});

/* =========================
   OUVRIR LOGIN
========================= */
loginButton.addEventListener("click", () => {

  authButtons.classList.add("hidden");

  loginFormContainer.classList.remove("hidden");

});

/* =========================
   RETOUR CREATION
========================= */
backButton.addEventListener("click", () => {

  emailFormContainer.classList.add("hidden");

  authButtons.classList.remove("hidden");

});

/* =========================
   RETOUR LOGIN
========================= */
backLoginButton.addEventListener("click", () => {

  loginFormContainer.classList.add("hidden");

  authButtons.classList.remove("hidden");

});

/* =========================
   CREATION COMPTE
========================= */
emailForm.addEventListener("submit", (e) => {

  e.preventDefault();

  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const avatar = document.getElementById("avatar").value;

  const userExists = users.find(
    user => user.email === email
  );

  if (userExists) {

    alert("Cette adresse existe déjà.");

    return;
  }

  const newUser = {
    nom,
    prenom,
    email,
    password,
    avatar
  };

  users.push(newUser);

  localStorage.setItem(
    "users",
    JSON.stringify(users)
  );

  alert("Compte créé avec succès !");

  emailForm.reset();

  emailFormContainer.classList.add("hidden");

  authButtons.classList.remove("hidden");

});

/* =========================
   CONNEXION
========================= */
loginForm.addEventListener("submit", (e) => {

  e.preventDefault();

  const email =
    document.getElementById("login-email").value;

  const password =
    document.getElementById("login-password").value;

  const user = users.find(
    user =>
      user.email === email &&
      user.password === password
  );

  if (!user) {

    alert("Email ou mot de passe incorrect.");

    return;
  }

  currentUser = user;

  userEmail.textContent = user.email;

  loginFormContainer.classList.add("hidden");

  userInfo.classList.remove("hidden");

  chatSection.classList.remove("hidden");

  loginForm.reset();

});

/* =========================
   DECONNEXION
========================= */
logoutButton.addEventListener("click", () => {

  currentUser = null;

  userInfo.classList.add("hidden");

  chatSection.classList.add("hidden");

  authButtons.classList.remove("hidden");

});

/* =========================
   AJOUTER MESSAGE
========================= */
function addMessage(text, sender = "user") {

  const messageDiv =
    document.createElement("div");

  messageDiv.classList.add("message");

  const avatarDiv =
    document.createElement("div");

  avatarDiv.classList.add("avatar");

  const messageText =
    document.createElement("div");

  messageText.classList.add("message-text");

  /* couleur robot */
  if (sender === "bot") {

    avatarDiv.style.backgroundColor = "#57F287";

  }

  messageText.textContent = text;

  messageDiv.appendChild(avatarDiv);

  messageDiv.appendChild(messageText);

  messages.appendChild(messageDiv);

  messages.scrollTop =
    messages.scrollHeight;

}

/* =========================
   IA APPRENANTE
========================= */
function botResponse(message) {

  const msg = message.toLowerCase();

  /* =========================
     MEMOIRE IA
  ========================= */

  let cerveau =
    JSON.parse(localStorage.getItem("cerveau")) || {};

  /* =========================
     MODE APPRENTISSAGE
  ========================= */

  if (apprentissage) {

    cerveau[questionEnCours] = message;

    localStorage.setItem(
      "cerveau",
      JSON.stringify(cerveau)
    );

    apprentissage = false;

    return "Merci 😊 J'ai appris quelque chose grâce à toi.";
  }

  /* =========================
     REPONSES DE BASE
  ========================= */

  if (
    msg.includes("bonjour") ||
    msg.includes("salut")
  ) {

    return "Bonjour 👋";
  }

  if (
    msg.includes("ça va")
  ) {

    return "Oui très bien 😄";
  }

  if (
    msg.includes("heure")
  ) {

    return "Il est : " +
      new Date().toLocaleTimeString();
  }

  if (
    msg.includes("date")
  ) {

    return "Nous sommes le : " +
      new Date().toLocaleDateString();
  }

  if (
    msg.includes("merci")
  ) {

    return "Avec plaisir 😊";
  }

  /* =========================
     IA APPREND
  ========================= */

  if (cerveau[msg]) {

    return cerveau[msg];
  }

  /* =========================
     SI INCONNU
  ========================= */

  questionEnCours = msg;

  apprentissage = true;

  return (
    "Je ne connais pas ce mot: \"" +
    message +
    "\" 🤔\n" +
    "Apprends-moi la bonne réponse pour la retenir."
  );

}

/* =========================
   ENVOYER MESSAGE
========================= */
function sendMessage() {

  const text =
    messageInput.value.trim();

  if (text === "") return;

  /* message utilisateur */
  addMessage(text, "user");

  /* réponse robot */
  const response =
    botResponse(text);

  setTimeout(() => {

    addMessage(response, "bot");

  }, 500);

  messageInput.value = "";

}

/* =========================
   BOUTON ENVOYER
========================= */
sendButton.addEventListener(
  "click",
  sendMessage
);

/* =========================
   TOUCHE ENTREE
========================= */
messageInput.addEventListener(
  "keypress",
  (e) => {

    if (e.key === "Enter") {

      sendMessage();

    }

  }
);

/* =========================
   EFFACER CHAT
========================= */
clearButton.addEventListener(
  "click",
  () => {

    messages.innerHTML = "";

  }
);

/* =========================
   VOIR MEMOIRE IA
========================= */
console.log(
  "Cerveau IA :",
  JSON.parse(localStorage.getItem("cerveau"))
);