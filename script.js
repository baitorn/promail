// DOM Elements
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

// State
let currentUser = null;
let users = [];
let userMemory = {};

// LOAD
window.addEventListener('load', () => {
  const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
  const savedMessages = JSON.parse(localStorage.getItem('messages')) || {};

  users.push(...savedUsers);
  userMemory = JSON.parse(localStorage.getItem('memory')) || {};

  if(currentUser){
    const messages = savedMessages[currentUser.email] || [];
    messages.forEach(msg => addMessage(msg.text, msg.className, msg.avatar, msg.timestamp));
  }
});

// UI
createEmailButton.addEventListener('click', () => {
  emailFormContainer.classList.remove('hidden');
});

loginButton.addEventListener('click', () => {
  loginFormContainer.classList.remove('hidden');
});

backButton.addEventListener('click', () => {
  emailFormContainer.classList.add('hidden');
});

backLoginButton.addEventListener('click', () => {
  loginFormContainer.classList.add('hidden');
});

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

    const savedMessages = JSON.parse(localStorage.getItem('messages')) || {};
    (savedMessages[currentUser.email] || []).forEach(msg =>
      addMessage(msg.text, msg.className, msg.avatar, msg.timestamp)
    );
  }
});

// CHAT
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', e => { if(e.key === 'Enter') sendMessage(); });

function sendMessage(){
  const text = messageInput.value.trim();
  if(!text || !currentUser) return;

  const time = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

  addMessage(text, 'user-message', currentUser.avatar, time);
  messageInput.value = '';

  save(text, 'user-message', currentUser.avatar, time);

  setTimeout(() => {
    const prenom = currentUser.prenom;

    let botText = "";

    const t = text.toLowerCase();

    if(t.includes("bonjour")) botText = `Bonjour ${prenom} 👋`;
    else if(t.includes("ça va")) botText = `Oui ${prenom} 😄 et toi ?`;
    else if(t.includes("merci")) botText = `Avec plaisir ${prenom} 😊`;
    else if(t.includes("qui")) botText = `Je suis ton assistant ${prenom} 🤖`;
    else if(t.includes("film")) botText = `Tu aimes les films ${prenom} 🎬 ?`;
    else if(t.includes("jeu")) botText = `Les jeux c’est cool 🎮 !`;
    else if(t.includes("musique")) botText = `La musique 🎵 c’est génial !`;
    else botText = `Je comprends ${prenom} 🤔`;

    const botTime = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

    addMessage(botText, 'bot-message', 'https://i.pravatar.cc/40?u=bot', botTime);

    save(botText, 'bot-message', 'https://i.pravatar.cc/40?u=bot', botTime);

  }, 800);
}

// SAVE
function save(text, className, avatar, timestamp){
  const all = JSON.parse(localStorage.getItem('messages')) || {};
  if(!all[currentUser.email]) all[currentUser.email] = [];

  all[currentUser.email].push({text, className, avatar, timestamp});

  localStorage.setItem('messages', JSON.stringify(all));
}

// DISPLAY
function addMessage(text, className, avatar, timestamp){
  const div = document.createElement('div');
  div.classList.add('message', className);

  const img = document.createElement('img');
  img.src = avatar;
  img.classList.add('message-avatar');

  const span = document.createElement('span');
  span.textContent = text;

  const time = document.createElement('span');
  time.textContent = timestamp;
  time.classList.add('message-timestamp');

  div.appendChild(img);
  div.appendChild(span);
  div.appendChild(time);

  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}