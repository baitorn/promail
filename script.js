window.addEventListener('load', () => {
  const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
  const savedMessages = JSON.parse(localStorage.getItem('messages')) || {};
  users.push(...savedUsers);
  if(currentUser){
    const messages = savedMessages[currentUser.email] || [];
    messages.forEach(msg => addMessage(msg.text, msg.className, msg.avatar, msg.timestamp));
  }
});

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
let users = []; // Tableau pour stocker les utilisateurs

// Event Listeners
createEmailButton.addEventListener('click', () => {
  emailFormContainer.classList.remove('hidden');
  loginFormContainer.classList.add('hidden');
  createEmailButton.classList.add('hidden');
  loginButton.classList.add('hidden');
});
loginButton.addEventListener('click', () => {
  loginFormContainer.classList.remove('hidden');
  emailFormContainer.classList.add('hidden');
  createEmailButton.classList.add('hidden');
  loginButton.classList.add('hidden');
});
backButton.addEventListener('click', () => {
  emailFormContainer.classList.add('hidden');
  createEmailButton.classList.remove('hidden');
  loginButton.classList.remove('hidden');
});
backLoginButton.addEventListener('click', () => {
  loginFormContainer.classList.add('hidden');
  createEmailButton.classList.remove('hidden');
  loginButton.classList.remove('hidden');
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
  alert(`Compte créé avec succès pour ${email} ! Vous pouvez maintenant vous connecter.`);
  emailForm.reset();
  emailFormContainer.classList.add('hidden');
  createEmailButton.classList.remove('hidden');
  loginButton.classList.remove('hidden');
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
    loginFormContainer.classList.add('hidden');
    chatSection.classList.remove('hidden');

    const savedMessages = JSON.parse(localStorage.getItem('messages')) || {};
    (savedMessages[currentUser.email] || []).forEach(msg => addMessage(msg.text, msg.className, msg.avatar, msg.timestamp));

    alert(`Bonjour ${user.prenom} ! Vous êtes maintenant connecté.`);
  } else {
    alert("Email ou mot de passe incorrect.");
  }
});
logoutButton.addEventListener('click', () => {
  currentUser = null;
  userInfo.classList.add('hidden');
  chatSection.classList.add('hidden');
  createEmailButton.classList.remove('hidden');
  loginButton.classList.remove('hidden');
  messagesContainer.innerHTML = '';
});
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', e => { if(e.key === 'Enter') sendMessage(); });
clearButton.addEventListener('click', () => {
  messagesContainer.innerHTML = '';
  if(currentUser){
    const allMessages = JSON.parse(localStorage.getItem('messages')) || {};
    allMessages[currentUser.email] = [];
    localStorage.setItem('messages', JSON.stringify(allMessages));
  }
});

// Functions
function sendMessage(){
  const text = messageInput.value.trim();
  if(text === '') return;
  const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  addMessage(text, 'user-message', currentUser.avatar, timestamp);
  messageInput.value = '';

  // Sauvegarder
  const allMessages = JSON.parse(localStorage.getItem('messages')) || {};
  if(!allMessages[currentUser.email]) allMessages[currentUser.email] = [];
  allMessages[currentUser.email].push({text, className:'user-message', avatar: currentUser.avatar, timestamp});
  localStorage.setItem('messages', JSON.stringify(allMessages));

  // Réponse bot
  setTimeout(() => {
    const botText = "Bonjour ! Je vous conseille d'utiliser ce site pour créer une adresse mail.";
    const botTimestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    addMessage(botText, 'bot-message', 'https://i.pravatar.cc/40?u=bot', botTimestamp);

    if(currentUser){
      const allMessages = JSON.parse(localStorage.getItem('messages')) || {};
      if(!allMessages[currentUser.email]) allMessages[currentUser.email] = [];
      allMessages[currentUser.email].push({text: botText, className:'bot-message', avatar:'https://i.pravatar.cc/40?u=bot', timestamp:botTimestamp});
      localStorage.setItem('messages', JSON.stringify(allMessages));
    }
  }, 1000);
}

function addMessage(text, className, avatar, timestamp){
  const div = document.createElement('div');
  div.classList.add('message', className);

  const img = document.createElement('img');
  img.src = avatar || 'https://i.pravatar.cc/40';
  img.classList.add('message-avatar');
  div.appendChild(img);

  const spanText = document.createElement('span');
  spanText.textContent = text;
  div.appendChild(spanText);

  const timeSpan = document.createElement('span');
  timeSpan.textContent = timestamp;
  timeSpan.classList.add('message-timestamp');
  div.appendChild(timeSpan);

  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}