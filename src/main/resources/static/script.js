const messagesKey = 'messages';
const chatContainer = document.getElementById('chatContainer');
const chatForm = document.getElementById('chatForm');
const scrollBtn = document.getElementById('scrollBtn');
const chatMenuBtn = document.getElementById('chatMenuBtn');
const chatMenu = document.getElementById('chatMenu');
const chatSubmit = document.getElementById('chatSubmit');
const loading = document.getElementById('loading');
const chatReset = chatMenu.querySelectorAll('button')[0];
const iconMenu = chatMenuBtn.querySelector('i');

let isMenuOpen = false;
let isLoading = false;

const messages = JSON.parse(localStorage.getItem(messagesKey)) ?? [];

noChat();

if (messages.length !== 0) chatContainer.innerHTML = '';

for (let i = 0; i <= messages.length - 1; i++) {
  bubbleChat(messages[i].role, messages[i].content);
}

document.addEventListener('DOMContentLoaded', scrollChat);

chatMenuBtn.addEventListener('click', () => {
  isMenuOpen = !isMenuOpen;
  openMenu(isMenuOpen);
});

chatReset.addEventListener('click', () => {
  localStorage.removeItem(messagesKey);
  messages.length = 0;

  chatContainer.innerHTML = '';
  noChat();

  isMenuOpen = false;
  openMenu(isMenuOpen);
});

chatForm.addEventListener('input', (event) => {
  const value = event.target.value;
  chatSubmit.disabled = value.length === 0;
});

chatForm.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') onChat();
});

chatSubmit.addEventListener('click', onChat);

chatContainer.addEventListener('scroll', () => {
  const scrollable =
    chatContainer.scrollTop >=
    chatContainer.scrollHeight - chatContainer.clientHeight - 60;

  if (scrollable) {
    scrollBtn.classList.add('hidden');
  } else {
    scrollBtn.classList.remove('hidden');
  }
});

scrollBtn.addEventListener('click', () => scrollChat({ smooth: true }));

function openMenu(status) {
  if (status) {
    chatMenu.classList.remove('hidden');
    iconMenu.classList.remove('fa-bars');
    iconMenu.classList.add('fa-xmark');
  } else {
    chatMenu.classList.add('hidden');
    iconMenu.classList.remove('fa-xmark');
    iconMenu.classList.add('fa-bars');
  }
}

function scrollChat({ smooth = false }) {
  chatContainer.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto',
  });
}

async function onChat() {
  if (isLoading) return;

  const userContent = chatForm.value;

  chatForm.value = '';
  chatSubmit.disabled = true;

  if (userContent.length === 0) return;

  saveMessages('user', userContent);

  isLoading = true;
  chatSubmit.classList.add('hidden');
  loading.classList.remove('hidden');

  try {
    const botContent = await fetchData(messages.slice(-10));
    saveMessages('system', botContent);
  } catch (_) {
    saveMessages(
      'system',
      'Terjadi kesalahan, silakan coba lagi dalam beberapa saat.'
    );
  }

  isLoading = false;
  loading.classList.add('hidden');
  chatSubmit.classList.remove('hidden');
}

async function fetchData(messages) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const url = window.location.origin + '/api/chat';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messages),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    throw error;
  }
}

function saveMessages(role, content) {
  const scrollable =
    chatContainer.scrollTop >=
    chatContainer.scrollHeight - chatContainer.clientHeight - 60;

  messages.push({ role, content });
  localStorage.setItem(messagesKey, JSON.stringify(messages));
  if (messages.length === 1) chatContainer.innerHTML = '';
  bubbleChat(role, content);
  if (scrollable) scrollChat({ smooth: true });
}

function noChat() {
  const divElement = document.createElement('div');
  divElement.classList.add(
    'h-full',
    'w-full',
    'flex',
    'flex-col',
    'justify-center',
    'text-center',
    'text-white/80'
  );

  const iconElement = document.createElement('i');
  iconElement.classList.add('fa-solid', 'fa-comment-slash');
  iconElement.style.fontSize = '4em';

  const textElement = document.createElement('p');
  textElement.classList.add('mt-4');
  textElement.textContent = 'Belum ada chat';

  divElement.appendChild(iconElement);
  divElement.appendChild(textElement);

  chatContainer.appendChild(divElement);
}

function bubbleChat(role, content) {
  const bubbleContainer = document.createElement('div');
  bubbleContainer.classList.add('my-1', 'flex');

  const chatElement = document.createElement('div');
  chatElement.classList.add(
    'bg-slate-700/80',
    'my-1',
    'mx-2',
    'p-2',
    'rounded-lg',
    'break-words'
  );
  chatElement.style.maxWidth = '80%';
  chatElement.textContent = content;

  const iconElement = document.createElement('i');
  iconElement.classList.add('fa-solid');

  if (role === 'system') {
    bubbleContainer.classList.add('justify-start');
    iconElement.classList.add('py-4', 'fa-robot');
    bubbleContainer.appendChild(iconElement);
    bubbleContainer.appendChild(chatElement);
  } else {
    bubbleContainer.classList.add('justify-end');
    iconElement.classList.add('py-4', 'fa-user');
    bubbleContainer.appendChild(chatElement);
    bubbleContainer.appendChild(iconElement);
  }

  chatContainer.appendChild(bubbleContainer);
}
