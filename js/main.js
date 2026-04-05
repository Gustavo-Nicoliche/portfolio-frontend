/* ================================================
GUSTAVO NICOLICHE — PORTFÓLIO
main.js
Responsabilidades:
1. Header — efeito de scroll + active link
2. Menu mobile — abrir/fechar
3. Scroll suave (fallback para navegadores antigos)
4. Animações de entrada (Intersection Observer)
5. Formulário de contato — validação + envio para API
================================================ */
/* ================================================
1. HEADER — Adiciona sombra ao rolar a página
e destaca o link da seção atual na nav.
================================================ */
const header = document.getElementById('header');
const navLinks = document.querySelectorAll('.nav__link');
/**
* Intersection Observer para detectar qual seção
* está visível e marcar o link correspondente na nav.
*
* Como funciona:
* - Observamos todas as <section> com id.
* - Quando uma entra na tela com 40% de visibilidade,
* marcamos o link da nav correspondente como "active".
*/
const sections = document.querySelectorAll('section[id]');
const sectionObserver = new IntersectionObserver(
(entries) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
// Remove "active" de todos os links
navLinks.forEach((link) => link.classList.remove('active'));
// Adiciona "active" no link cujo href bate com o id da seção
const activeLink = document.querySelector(
`.nav__link[href="#${entry.target.id}"]`
);
if (activeLink) activeLink.classList.add('active');
}
});
},
{
// rootMargin: faz a detecção acontecer um pouco antes
// do topo da seção atingir o topo da tela.
rootMargin: `-${getComputedStyle(document.documentElement)
.getPropertyValue('--header-h')
.trim()} 0px -60% 0px`,
threshold: 0,
}
);
sections.forEach((section) => sectionObserver.observe(section));
// Adiciona classe "scrolled" ao header quando a página rola
window.addEventListener('scroll', () => {
header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });
/* ================================================
2. MENU MOBILE — Abrir e fechar o overlay
================================================ */
const navToggle = document.getElementById('navToggle');
const navClose = document.getElementById('navClose');
const navMobile = document.getElementById('navMobile');
const mobileLinks = document.querySelectorAll('.nav__mobile-link');
// Função auxiliar: bloqueia/libera scroll do body
const lockScroll = () => document.body.style.overflow = 'hidden';
const unlockScroll = () => document.body.style.overflow = '';
navToggle.addEventListener('click', () => {
navMobile.classList.add('open');
lockScroll();
// Reinicializa ícones Lucide dentro do menu
if (typeof lucide !== 'undefined') {
lucide.createIcons();
}
});
navClose.addEventListener('click', () => {
navMobile.classList.remove('open');
unlockScroll();
});
// Fecha o menu ao clicar em qualquer link
mobileLinks.forEach((link) => {
link.addEventListener('click', () => {
navMobile.classList.remove('open');
unlockScroll();
});
});
/* ================================================
3. SCROLL SUAVE — Fallback para Safari antigo
O CSS "scroll-behavior: smooth" já resolve para
a maioria dos navegadores, mas este fallback
garante compatibilidade total.
================================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
anchor.addEventListener('click', function (e) {
const target = document.querySelector(this.getAttribute('href'));
if (!target) return;
// Se o navegador já suporta scroll suave via CSS, não faz nada extra.
// Caso contrário, usa scrollIntoView.
if (!CSS.supports('scroll-behavior', 'smooth')) {
e.preventDefault();
target.scrollIntoView({ behavior: 'smooth' });
}
});
});
/* ================================================
4. ANIMAÇÕES DE ENTRADA (Reveal on Scroll)
Como funciona:
- Adicionamos a classe "reveal" nos elementos
que queremos animar ao entrar na tela.
- O IntersectionObserver monitora esses elementos.
- Quando entram na viewport, adiciona "visible",
que ativa a transição CSS de fade + slide.
================================================ */
// Elementos que vão receber animação de entrada
const revealTargets = document.querySelectorAll(
'.section-header, .sobre__avatar-wrap, .sobre__text, ' +
'.skill-item, .projetos__coming-soon, ' +
'.contato__form, .contato__aside, .hero__text, .hero__card'
);
revealTargets.forEach((el) => el.classList.add('reveal'));
const revealObserver = new IntersectionObserver(
(entries) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add('visible');
// Para de observar após animar (performance)
revealObserver.unobserve(entry.target);
}
});
},
{ threshold: 0.15 }
);
revealTargets.forEach((el) => revealObserver.observe(el));
/* ================================================
5. FORMULÁRIO DE CONTATO
Etapas:
a) Capturamos o evento de submit
b) Validamos os campos no frontend (UX)
c) Enviamos os dados para a API Spring Boot
via fetch() (requisição POST assíncrona)
d) Exibimos feedback de sucesso ou erro
A URL da API será configurada quando
o backend Spring Boot estiver pronto.
Por ora, aponta para localhost:8080.
================================================ */
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formFeedback = document.getElementById('formFeedback');
// URL base da API — altere para a URL do servidor em produção
const API_BASE_URL = 'https://portfolio-backend-production-0cbc.up.railway.app';
/**
* Valida um campo individualmente.
* @param {HTMLElement} input - O campo a validar
* @param {string} errorId - ID do span de erro
* @param {string} message - Mensagem de erro
* @returns {boolean} true se válido
*/
function validateField(input, errorId, message) {
const errorEl = document.getElementById(errorId);
const isEmpty = input.value.trim() === '';
if (isEmpty) {
input.classList.add('error');
errorEl.textContent = message;
return false;
}
input.classList.remove('error');
errorEl.textContent = '';
return true;
}
/**
* Valida o formato de e-mail com regex.
* @param {string} email
* @returns {boolean}
*/
function isValidEmail(email) {
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
/**
* Exibe o feedback de resultado do formulário.
* @param {'success'|'error'} type
* @param {string} message
*/
function showFeedback(type, message) {
formFeedback.hidden = false;
formFeedback.textContent = message;
formFeedback.className = `form__feedback ${
type === 'success' ? 'success' : 'error-msg'
}`;
// Rola suavemente até o feedback
formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
/**
* Coloca o botão de submit em estado de "loading"
* para evitar envios duplos e dar feedback visual.
* @param {boolean} loading
*/
function setSubmitLoading(loading) {
const btnIcon = submitBtn.querySelector('i[data-lucide]');
const btnText = submitBtn.querySelector('span');
submitBtn.disabled = loading;
if (loading) {
// Substitui o ícone por um spinner simples
if (btnIcon) btnIcon.setAttribute('data-lucide', 'loader-2');
if (btnText) btnText.textContent = 'Enviando...';
submitBtn.style.opacity = '0.75';
} else {
if (btnIcon) btnIcon.setAttribute('data-lucide', 'send');
if (btnText) btnText.textContent = 'Enviar mensagem';
submitBtn.style.opacity = '1';
}
// Re-renderiza ícones Lucide
lucide.createIcons();
}
// Escuta o evento de submit do formulário
contactForm.addEventListener('submit', async function (e) {
// Previne o comportamento padrão (recarregar a página)
e.preventDefault();
// Limpa feedback anterior
formFeedback.hidden = true;
formFeedback.className = 'form__feedback';
// ── VALIDAÇÃO FRONTEND ──────────────────────────
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const assuntoInput = document.getElementById('assunto');
const mensagemInput = document.getElementById('mensagem');
let isValid = true;
// Valida nome
if (!validateField(nomeInput, 'nomeError', 'Por favor, informe seu nome.')) {
isValid = false;
}
// Valida e-mail
if (!validateField(emailInput, 'emailError', 'Por favor, informe seu e-mail.')) {
isValid = false;
} else if (!isValidEmail(emailInput.value.trim())) {
emailInput.classList.add('error');
document.getElementById('emailError').textContent = 'E-mail inválido.';
isValid = false;
}
// Valida assunto (select)
if (!validateField(assuntoInput, 'assuntoError', 'Selecione um assunto.')) {
isValid = false;
}
// Valida mensagem (mínimo 10 caracteres)
if (!validateField(mensagemInput, 'mensagemError', 'Por favor, escreva uma mensagem.')) {
isValid = false;
} else if (mensagemInput.value.trim().length < 10) {
mensagemInput.classList.add('error');
document.getElementById('mensagemError').textContent =
'A mensagem deve ter ao menos 10 caracteres.';
isValid = false;
}
// Se algum campo inválido, interrompe o envio
if (!isValid) return;
// ── ENVIO PARA A API ────────────────────────────
setSubmitLoading(true);
/*
* Montamos um objeto JS com os dados do formulário.
* JSON.stringify() converte para string JSON — o formato
* que a API Spring Boot espera receber no body da requisição.
*
* O header 'Content-Type: application/json' avisa ao servidor
* que estamos enviando JSON.
*/
const payload = {
nome: nomeInput.value.trim(),
email: emailInput.value.trim(),
assunto: assuntoInput.value,
mensagem: mensagemInput.value.trim(),
};
try {
const response = await fetch(`${API_BASE_URL}/api/contato`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify(payload),
});
if (response.ok) {
// Sucesso! Limpa o formulário e exibe mensagem positiva.
contactForm.reset();
showFeedback(
'success',
' Mensagem enviada com sucesso! Responderei em breve.'
);
} else {
/*
* O servidor respondeu, mas com erro (ex: 400, 500).
* Tentamos ler a mensagem de erro do corpo da resposta.
*/
const errorData = await response.json().catch(() => null);
const errorMsg = errorData?.message || 'Erro ao enviar. Tente novamente.';
showFeedback('error', ` ${errorMsg}`);
}
} catch (error) {
/*
* Erro de rede — o servidor não foi alcançado.
* Isso acontece se o Spring Boot não estiver rodando
* ou se houver problema de CORS (configuraremos no backend).
*/
console.error('Erro ao enviar formulário:', error);
showFeedback(
'error',
' Não foi possível conectar ao servidor. Tente novamente mais tarde.'
);
} finally {
// Sempre restaura o botão, com sucesso ou erro
setSubmitLoading(false);
}
});
// Remove erro visual ao usuário começar a digitar novamente
document.querySelectorAll('.form__input').forEach((input) => {
input.addEventListener('input', function () {
this.classList.remove('error');
const errorEl = document.getElementById(`${this.id}Error`);
if (errorEl) errorEl.textContent = '';
});
});
/* ================================================
INICIALIZAÇÃO
Código que roda assim que o JS é carregado.
================================================ */
// Marca o link "Hero" como ativo ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
console.log(' Portfólio de Gustavo Nicoliche carregado.');
// Garante que todos os ícones foram renderizados
if (typeof lucide !== 'undefined') {
lucide.createIcons();
}
});