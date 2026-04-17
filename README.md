TELA DE LOGIN

Como o Sistema Funciona
Este projeto é um sistema de autenticação completo, dividido em Front-end (a interface que o usuário vê) e Back-end (o servidor que processa e salva os dados). Aqui está a explicação de como cada parte do código trabalha:

1. Interface (Front-end)
A interface foi construída usando o trio clássico da web e funciona como uma página única (SPA), escondendo e mostrando as telas sem precisar recarregar a página.

HTML (index.html): Cria a estrutura da página. Ele contém três "caixas" principais: a tela de Login, a tela de Cadastro e o Dashboard (área logada). Apenas uma delas fica visível por vez.

CSS (style.css): Responsável por deixar tudo com um visual moderno e responsivo. Ele adiciona cores, alinhamentos, bordas arredondadas e inclui pequenas animações, como o efeito de transição suave ao trocar de tela (fade-in) e o ícone de carregamento (spinner) nos botões de envio.

JavaScript (script.js): É o "cérebro" da tela. Suas principais funções são:

Alternar a visibilidade entre os formulários de login e cadastro.

Validar a senha no momento do cadastro (exigindo no mínimo 6 caracteres, letras e números).

Se comunicar com o servidor (usando fetch) para enviar os dados de login ou registro.

Salvar o nome do usuário no navegador (localStorage) para manter a sessão ativa mesmo se ele atualizar a página.

2. Servidor e Banco de Dados (Back-end)
O servidor foi construído em Node.js e é responsável por validar e armazenar os dados com segurança.

Node.js + Express (server.js): Cria a API que recebe as requisições do Front-end. Ele possui duas rotas principais:

/api/register: Recebe os dados de um novo usuário, verifica se o e-mail já existe, criptografa a senha e salva no banco.

/api/login: Recebe o e-mail e a senha, busca no banco de dados e verifica se a senha digitada bate com a senha criptografada salva.

Segurança com Bcrypt: Uma biblioteca essencial usada no código para transformar a senha do usuário em um "código embaralhado" (hash) antes de salvar no banco. Isso garante que as senhas não fiquem expostas caso o banco de dados seja acessado.

MySQL: O banco de dados relacional escolhido para guardar as informações dos usuários (ID, Nome, E-mail e Senha Criptografada).
