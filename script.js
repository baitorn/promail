/* =========================
   CHATMAIL - IA COMPLETE
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
   CREATION COMPTE
========================= */
createEmailButton.addEventListener("click", () => {

  authButtons.classList.add("hidden");

  emailFormContainer.classList.remove("hidden");

});

/* =========================
   LOGIN
========================= */
loginButton.addEventListener("click", () => {

  authButtons.classList.add("hidden");

  loginFormContainer.classList.remove("hidden");

});

/* =========================
   RETOUR
========================= */
backButton.addEventListener("click", () => {

  emailFormContainer.classList.add("hidden");

  authButtons.classList.remove("hidden");

});

backLoginButton.addEventListener("click", () => {

  loginFormContainer.classList.add("hidden");

  authButtons.classList.remove("hidden");

});

/* =========================
   CREER UTILISATEUR
========================= */
emailForm.addEventListener("submit", (e) => {

  e.preventDefault();

  const nom =
    document.getElementById("nom").value;

  const prenom =
    document.getElementById("prenom").value;

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  const avatar =
    document.getElementById("avatar").value;

  const userExists =
    users.find(user => user.email === email);

  if (userExists) {

    alert("Adresse déjà utilisée.");

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

  alert("Compte créé !");

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

    alert("Connexion impossible.");

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
   IA COMPLETE
========================= */
function botResponse(message) {

  const msg =
    message.toLowerCase().trim();

  /* =========================
     MEMOIRE IA
  ========================= */

  let cerveau =
    JSON.parse(localStorage.getItem("cerveau")) || {};

  let historique =
    JSON.parse(localStorage.getItem("historique")) || [];

  /* sauvegarde historique */
  historique.push(msg);

  localStorage.setItem(
    "historique",
    JSON.stringify(historique)
  );

  /* =========================
     GOOGLE
  ========================= */

  if (
    msg.startsWith("recherche ")
  ) {

    const recherche =
      message.replace("recherche ", "");

    window.open(
      "https://www.google.com/search?q=" +
      encodeURIComponent(recherche),
      "_blank"
    );

    return "Recherche Google : " +
      recherche + " 🔎";
  }

  /* =========================
     YOUTUBE
  ========================= */

  if (
    msg.startsWith("youtube ")
  ) {

    const recherche =
      message.replace("youtube ", "");

    window.open(
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(recherche),
      "_blank"
    );

    return "Recherche YouTube : " +
      recherche + " ▶️";
  }

  /* =========================
     WIKIPEDIA
  ========================= */

  if (
    msg.startsWith("wiki ")
  ) {

    const recherche =
      message.replace("wiki ", "");

    window.open(
      "https://fr.wikipedia.org/wiki/" +
      encodeURIComponent(recherche),
      "_blank"
    );

    return "Ouverture Wikipédia : " +
      recherche + " 📚";
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

    return "Oui ça va très bien 😄";
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
     SI LE BOT CONNAIT
  ========================= */

  if (cerveau[msg]) {

    return cerveau[msg];
  }

  /* =========================
     RECHERCHE MOTS PROCHES
  ========================= */

  for (let question in cerveau) {

    if (
      msg.includes(question) ||
      question.includes(msg)
    ) {

      return cerveau[question];
    }
  }

  /* =========================
     APPRENTISSAGE AUTO
  ========================= */

  if (historique.length >= 2) {

    const ancienneQuestion =
      historique[historique.length - 2];

    cerveau[ancienneQuestion] = message;

    localStorage.setItem(
      "cerveau",
      JSON.stringify(cerveau)
    );
  }

  /* =========================
     REPONSES IA
  ========================= */

  const reponses = [

    "Intéressant 🤔",

    "Je retiens cela 📚",

    "Je continue d'apprendre 😊",

    "Merci pour l'information.",

    "Je mémorise ce message.",

    "Je comprends un peu mieux maintenant."
  ];

  return reponses[
    Math.floor(Math.random() * reponses.length)
  ];

}

/* =========================
   ENVOYER MESSAGE
========================= */
function sendMessage() {

  const text =
    messageInput.value.trim();

  if (text === "") return;

  /* utilisateur */
  addMessage(text, "user");

  /* bot */
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
   DEBUG IA
========================= */
console.log(
  "Cerveau IA :",
  JSON.parse(localStorage.getItem("cerveau"))
);

console.log(
  "Historique IA :",
  JSON.parse(localStorage.getItem("historique"))
);