# 🌐 Portfólio — Frontend

Landing page pessoal desenvolvida com HTML, CSS e JavaScript puro, com foco em design limpo, responsividade e integração com API REST.

🔗 **Acesse:** [gustavo-nicoliche.vercel.app](https://gustavo-nicoliche.vercel.app)

-----

## 📸 Visão Geral

Site de portfólio pessoal desenvolvido do zero, sem frameworks frontend, apresentando minhas habilidades, projetos e formas de contato.

-----

## 🚀 Tecnologias

- **HTML5** — estrutura semântica
- **CSS3** — design system com variáveis, animações e responsividade
- **JavaScript** — interatividade, validação de formulário e integração com API
- **Lucide Icons** — biblioteca de ícones SVG
- **Google Fonts** — tipografia (DM Serif Display + DM Sans)

-----

## ✨ Funcionalidades

- Layout responsivo (mobile, tablet e desktop)
- Animações de entrada com Intersection Observer
- Menu hambúrguer para mobile
- Formulário de contato integrado à API REST
- Botão flutuante de WhatsApp
- Scroll suave entre seções
- Seção de projetos pronta para receber cards com screenshot e link para GitHub

-----

## 📁 Estrutura do Projeto

```
portfolio/
├── index.html        # Estrutura HTML semântica
├── css/
│   └── style.css     # Design system, layout e responsividade
└── js/
    └── main.js       # Interatividade e integração com API
```

-----

## 🔌 Integração com Backend

O formulário de contato envia os dados via `fetch()` para a API REST:

```javascript
fetch('https://portfolio-backend-production-0cbc.up.railway.app/api/contato', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nome, email, assunto, mensagem })
});
```

-----

## 📦 Deploy

Hospedado na **Vercel** com deploy contínuo via GitHub.

Toda vez que um `push` é feito na branch `main`, o Vercel faz o deploy automaticamente.

-----

## 👨‍💻 Autor

**Gustavo Da Gama Nicoliche**

- GitHub: [@Gustavo-Nicoliche](https://github.com/Gustavo-Nicoliche)
- Portfolio: [gustavo-nicoliche.vercel.app](https://gustavo-nicoliche.vercel.app)