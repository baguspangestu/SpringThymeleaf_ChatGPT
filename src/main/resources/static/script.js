const chatContainer = document.getElementById('chatContainer');
const chatForm = document.getElementById('chatForm');
const scrollBtn = document.getElementById('scrollBtn');
const chatMenuBtn = document.getElementById('chatMenuBtn');
const chatMenu = document.getElementById('chatMenu');
const chatSubmit = document.getElementById('chatSubmit');
const loading = document.getElementById('loading');
const chatReset = chatMenu.querySelectorAll('button')[0];
const iconMenu = chatMenuBtn.querySelector('i');

const messagesKey = 'messages';
const messagesCount = 20;

const messages = JSON.parse(localStorage.getItem(messagesKey)) ?? [];
const sliceMsg = messages.slice(-messagesCount);

let isMenuOpen = false;
let isLoading = false;

emptyMessages();

for (let i = 0; i <= sliceMsg.length - 1; i++) {
  bubbleChat({ role: sliceMsg[i].role, content: sliceMsg[i].content });
}

document.addEventListener('DOMContentLoaded', scrollChat);

chatMenuBtn.addEventListener('click', () => {
  isMenuOpen = !isMenuOpen;
  openMenu(isMenuOpen);
});

chatReset.addEventListener('click', () => {
  localStorage.removeItem(messagesKey);
  messages.length = 0;

  emptyMessages();

  isMenuOpen = false;
  openMenu(isMenuOpen);

  onScroll();
});

chatForm.addEventListener('input', (event) => {
  const value = event.target.value;
  chatSubmit.disabled = value.length === 0;
});

chatForm.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') onChatSubmited();
});

chatSubmit.addEventListener('click', onChatSubmited);

chatContainer.addEventListener('scroll', () => {
  onScroll();

  if (chatContainer.scrollTop <= 60 && messages.length !== sliceMsg.length) {
    const endIndex = messages.length - sliceMsg.length; // Indeks awal
    const startIndex =
      endIndex - messagesCount >= 0 ? endIndex - messagesCount : 0;

    const beforeMsg = messages.slice(startIndex, endIndex).reverse();

    for (let i = 0; i <= beforeMsg.length - 1; i++) {
      const data = { role: beforeMsg[i].role, content: beforeMsg[i].content };
      sliceMsg.unshift(data);
      bubbleChat({
        ...data,
        onTop: true,
      });
    }
  }
});

scrollBtn.addEventListener('click', () => scrollChat({ smooth: true }));

function onScroll() {
  const inArea =
    chatContainer.scrollTop >=
    chatContainer.scrollHeight - chatContainer.clientHeight - 60;

  if (inArea) {
    scrollBtn.classList.add('hidden');
  } else {
    scrollBtn.classList.remove('hidden');
  }
}

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

async function onChatSubmited() {
  const content = chatForm.value;
  if (isLoading || content.length === 0) return;

  chatForm.value = '';
  chatSubmit.disabled = true;

  saveMessages('user', content);

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
    role === 'user' ||
    chatContainer.scrollTop >=
      chatContainer.scrollHeight - chatContainer.clientHeight - 60;
  const data = { role, content };
  messages.push(data);
  sliceMsg.push(data);
  localStorage.setItem(messagesKey, JSON.stringify(messages));
  bubbleChat({ role, content });
  if (scrollable) scrollChat({ smooth: true });
}

function emptyMessages() {
  const divElement = document.createElement('div');
  divElement.classList.add(
    'h-full',
    'w-full',
    'flex',
    'flex-col',
    'justify-center',
    'text-center',
    'text-red-500/80'
  );

  const iconElement = document.createElement('i');
  iconElement.classList.add('fa-solid', 'fa-comment-dots');
  iconElement.style.fontSize = '8em';

  const textElement = document.createElement('p');
  textElement.classList.add('mt-4', 'font-semibold');
  textElement.textContent = 'Ketikan pesan apapun untuk memulai';

  divElement.appendChild(iconElement);
  divElement.appendChild(textElement);

  chatContainer.innerHTML = divElement.outerHTML;
}

function bubbleChat({ role, content, onTop = false }) {
  const relpacedContent = content.replace(/\n/g, '<br>');

  const bubbleChats = chatContainer.querySelectorAll('.chat-bubble');
  const bubbleContainer = document.createElement('div');
  bubbleContainer.classList.add('chat-bubble', 'my-1', 'flex');

  const chatElement = document.createElement('div');
  chatElement.classList.add(
    'my-1',
    'mx-2',
    'p-2',
    'rounded-lg',
    'break-words',
    'text-black/80'
  );
  chatElement.style.maxWidth = '80%';
  chatElement.innerHTML = relpacedContent;

  const iconElement = document.createElement('i');
  iconElement.classList.add('fa-solid');

  if (role === 'system') {
    chatElement.classList.add('bg-red-300/80');
    bubbleContainer.classList.add('justify-start');
    iconElement.classList.add('py-4', 'fa-robot');
    bubbleContainer.appendChild(iconElement);
    bubbleContainer.appendChild(chatElement);
  } else {
    chatElement.classList.add('bg-red-400/80');
    bubbleContainer.classList.add('justify-end');
    iconElement.classList.add('py-4', 'fa-user');
    bubbleContainer.appendChild(chatElement);
    bubbleContainer.appendChild(iconElement);
  }

  if (bubbleChats.length === 0) {
    chatContainer.innerHTML = bubbleContainer.outerHTML;
  } else if (onTop) {
    const firstChild = chatContainer.firstChild;
    chatContainer.insertBefore(bubbleContainer, firstChild);
  } else {
    chatContainer.appendChild(bubbleContainer);
  }
}
