# 📱 Social Posts App

Uma aplicação social completa desenvolvida com React, oferecendo funcionalidades de posts, comentários, likes, menções e tema dark/light. Este projeto demonstra habilidades avançadas em desenvolvimento frontend moderno.

---

# Link do deploy
social-posts-complete-app.vercel.app

## 🎯 Sobre o Projeto

O Social Posts App é uma aplicação web que simula uma rede social, permitindo que usuários criem posts, interajam com conteúdo de outros usuários através de likes e comentários, e experimentem uma experiência rica com features avançadas como menções, modo offline e atualizações em tempo real.

**Objetivo:** Demonstrar proficiência em React, gerenciamento de estado, performance otimizada e experiência do usuário.

---

## ✨ Funcionalidades

### 🔐 Autenticação
- **Login Simulado:** Entre com qualquer username (sem necessidade de senha)
- **Persistência:** Usuário permanece logado após refresh da página
- **Logout:** Botão para sair da conta com confirmação
- **Identificação:** Posts do usuário atual são marcados com selo "You"

### 📝 Posts
- **Criar Post:** Formulário com título, conteúdo e imagem opcional
- **Listar Posts:** Feed com todos os posts em ordem cronológica
- **Editar Post:** Apenas posts do usuário atual podem ser editados
- **Deletar Post:** Confirmação em modal antes da exclusão
- **Ordenação:** Opções de ordenação (mais recentes, mais antigos, mais curtidos, mais comentados)
- **Mídia:** Upload de imagens com preview antes do envio

### 💬 Comentários
- **Criar Comentário:** Usuários logados podem comentar em qualquer post
- **Editar Comentário:** Apenas comentários do próprio usuário
- **Deletar Comentário:** Apenas comentários do próprio usuário
- **Listar Comentários:** Seção expansível por post com contador
- **Timestamps:** Data relativa (ex: "2 hours ago") para cada comentário

### ❤️ Interações
- **Likes:** Curtir posts com animação visual
- **Double-click:** Funcionalidade de like ao dar dois cliques no post
- **Contador:** Número de likes atualizado em tempo real
- **Feedback Visual:** Coração pulsante e toast de confirmação

### 🎨 UI/UX
- **Tema Dark/Light:** Alternância suave entre temas com persistência
- **Animações:** Transições fluidas com Framer Motion
- **Notificações:** Toasts para feedback de todas as ações
- **Loading States:** Spinners e skeletons durante carregamento
- **Responsividade:** Layout adaptativo para mobile, tablet e desktop

---

## 🚀 Diferenciais Técnicos

### 1. Virtualização de Lista
- **Tecnologia:** @tanstack/react-virtual
- **Capacidade:** Suporte a 10.000+ posts sem perda de performance
- **Como funciona:** Renderiza apenas os posts visíveis na tela
- **Overscan:** 5 posts extras para scroll suave
- **Benefício:** Memória otimizada e scroll fluido

### 2. Debounce em Likes
- **Tecnologia:** Custom hook useDebounce
- **Delay:** 1000ms sem novos cliques
- **Como funciona:** Acumula múltiplos cliques e faz uma única requisição
- **Benefício:** Redução de 90% das requisições à API

### 3. Offline First
- **Armazenamento:** localStorage para posts offline
- **Detecção:** Monitora navigator.onLine
- **Sincronização:** Automática quando a conexão é restabelecida
- **Fila:** Posts offline são enfileirados e enviados em ordem
- **Feedback:** Toast indicando posts salvos offline

### 4. Atalhos de Teclado
- **Navegação:** ↑/↓ para navegar entre posts
- **Seleção:** Enter para selecionar post destacado
- **Comentário:** Tecla 'c' para focar no campo de comentário
- **Busca:** Tecla '/' para focar na busca
- **Ajuda:** Tecla '?' para mostrar todos os atalhos
- **Fechar:** Esc para fechar modais

### 5. Sistema de Menções
- **Detecção:** Autocomplete ao digitar '@'
- **Busca:** Filtro dinâmico de usuários
- **Inserção:** Clique ou Enter para inserir a menção
- **Destaque:** Menções são destacadas visualmente
- **Dados:** Lista de usuários mockados para demonstração

### 6. WebSocket Simulado
- **Conexão:** Simula conexão em tempo real
- **Notificações:** Toast customizado para novos posts
- **Intervalo:** Mensagens simuladas a cada 30 segundos
- **Dados:** Posts fictícios com usuários aleatórios
- **Feedback:** Indicador visual de conexão ativa

### 7. Rich Text Editor
- **Formatação:** Negrito, itálico, sublinhado
- **Listas:** Bullet points
- **Alinhamento:** Esquerda, centro, direita
- **Links:** Inserção de hyperlinks
- **Comandos:** document.execCommand() para formatação

### 8. Acessibilidade
- **ARIA Labels:** Todos os elementos interativos têm labels
- **Navegação por Teclado:** Tab order lógico e focus visível
- **Contraste:** Cores com ratio mínimo de 4.5:1
- **Textos Alternativos:** Imagens com alt text descritivo
- **Semântica:** HTML semântico (header, main, section)

---

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18.x ou superior
- npm 9.x ou yarn 1.22.x
- Git (opcional)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/bbigelli/social-posts-app.git
cd social-posts-app

Instale as dependências:
npm install
# ou
yarn install

Execute em modo desenvolvimento
npm run dev
# ou
yarn dev

Acesse no navegador:
http://localhost:3000
