// DOM
const createEmailButton = document.getElementById('create-email-button');
const loginButton = document.getElementById('login-button');
const emailFormContainer = document.getElementById('email-form-container');
const loginFormContainer = document.getElementById('login-form-container');
const emailForm = document.getElementById('email-form');
const loginForm = document.getElementById('login-form');
const backButton = document.getElementById('back-button');
const backLoginButton = document.getElementById('back-login-button');
const userInfo = document.getElementById('user-info');
const userEmailSpan = document.getElementById('user-email');
const logoutButton = document.getElementById('logout-button');
const chatSection = document.getElementById('chat-section');
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const clearButton = document.getElementById('clear-button');

// STATE
let currentUser = null;
let users = [];
let swReg = null;

// SERVICE WORKER
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => swReg = reg);
}

// NOTIF PERMISSION
function enableNotifications(){
  if ("Notification" in window) {
    Notification.requestPermission();
  }
}

// LOAD
window.addEventListener('load', () => {
  const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
  users.push(...savedUsers);
});

// CREATE ACCOUNT
emailForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nom = document.getElementById('nom').value;
  const prenom = document.getElementById('prenom').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const avatar = document.getElementById('avatar').value || `https://i.pravatar.cc/40?u=${email}`;

  users.push({ nom, prenom, email, password, avatar });
  localStorage.setItem('users', JSON.stringify(users));

  alert("Compte créé !");
});

// LOGIN
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const user = users.find(u => u.email === email && u.password === password);

  if(user){
    currentUser = user;

    userEmailSpan.textContent = user.email;
    userInfo.classList.remove('hidden');
    chatSection.classList.remove('hidden');

    enableNotifications(); // 🔔 activation notif
  }
});

// SEND MESSAGE
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', e => {
  if(e.key === 'Enter') sendMessage();
});

function sendPush(title, body){
  if(swReg?.active){
    swReg.active.postMessage({
      type: "NOTIFICATION",
      title,
      body
    });
  }
}

function sendMessage(){
  const text = messageInput.value.trim();
  if(!text || !currentUser) return;

  const time = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

  addMessage(text, 'user-message', currentUser.avatar, time);
  messageInput.value = '';

  setTimeout(() => {

    const prenom = currentUser.prenom;
    let botText = "";

    const t = text.toLowerCase();

    if(t.includes("bonjour")) botText = `Bonjour ${prenom} 👋`;
    else if(t.includes("ça va")) botText = `Oui ${prenom} 😄 et toi ?`;
    else if(t.includes("merci")) botText = `Avec plaisir ${prenom} 😊`;
    else if(t.includes("qui")) botText = `Je suis ton assistant 🤖`;
    else botText = `Je comprends ${prenom} 🤔`;

    const botTime = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

    addMessage(botText, 'bot-message', 'https://i.pravatar.cc/40?u=bot', botTime);

    // 🔔 PUSH NOTIFICATION (WHATSAPP STYLE)
    sendPush("Nouveau message 💬", botText);

  }, 800);
}

// ADD MESSAGE
function addMessage(text, className, avatar, time){
  const div = document.createElement('div');
  div.classList.add('message', className);

  const img = document.createElement('img');
  img.src = avatar;
  img.classList.add('message-avatar');

  const span = document.createElement('span');
  span.textContent = text;

  const ts = document.createElement('span');
  ts.textContent = time;
  ts.classList.add('message-timestamp');

  div.appendChild(img);
  div.appendChild(span);
  div.appendChild(ts);

  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}