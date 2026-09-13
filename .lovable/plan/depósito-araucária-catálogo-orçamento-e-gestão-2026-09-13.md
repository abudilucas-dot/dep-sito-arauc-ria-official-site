# Depósito Araucária — catálogo, orçamento e gestão

## Objetivo
Construir uma presença digital completa com catálogo pesquisável, lista de materiais, orçamento por WhatsApp, autenticação real e painel administrativo protegido, preservando a identidade grafite e verde-limão da marca.

## O que será entregue

### Site público
- Cabeçalho fixo e responsivo, navegação completa, busca, Minha Lista, login e chamada para orçamento.
- Home com campanha visual da marca, busca real, categorias, destaques, benefícios, loja, localização, horário e Instagram.
- Catálogo em `/produtos` com busca, filtros, ordenação e paginação visual responsiva.
- Categorias em `/categorias`, ofertas em `/ofertas`, institucional em `/sobre` e contato em `/contato`.
- Produto em `/produto/:slug` com galeria, informações, estoque calculado, quantidade, lista e WhatsApp.
- Lista em `/minha-lista` com quantidades, subtotal estimado, remoção, limpeza e mensagem pronta para WhatsApp.
- Botão de WhatsApp em todas as páginas, usando o número salvo nas configurações da empresa.
- Rodapé completo e metadados próprios em cada página.

### Acesso e contas
- Login por e-mail/senha e Google.
- Cadastro com confirmação por e-mail, recuperação e redefinição de senha.
- Perfil completo com nome, telefone, avatar e preferências.
- Funções `admin` e `customer` armazenadas separadamente.
- Cabeçalho muda conforme a sessão e oferece saída segura.

### Painel administrativo
- Área `/admin` protegida no servidor e acessível apenas por administradores.
- Dashboard com totais, alertas de estoque e gráficos.
- Gestão real de produtos, categorias, estoque, orçamentos, clientes, banners e dados da empresa.
- Cadastro e edição de produto com preço opcional, promoção, estoque, especificações e imagens.
- Upload privado de imagens, prévia, troca, exclusão e seleção da imagem principal.
- Edição centralizada de telefone, WhatsApp, endereço, horários, Instagram, e-mail, mapa e logo.

### Dados e segurança
- Estrutura já criada para perfis, funções, produtos, imagens, categorias, estoque, orçamentos, itens, configurações, banners e favoritos.
- Dados iniciais da empresa e catálogo demonstrativo sem preços inventados.
- Regras de acesso: catálogo público; clientes veem apenas seus dados; administradores gerenciam conteúdo comercial.
- Imagens guardadas em armazenamento privado e entregues por acesso controlado.

## Direção visual
- Paleta centralizada: verde `#A3C832`, verde escuro `#91B825`, grafite `#292929`, preto `#191B1C`, cinza `#3A3A3A`, branco e cinza-claro `#F3F3F1`.
- Montserrat para uma linguagem forte, industrial e legível.
- Composição inspirada nas referências: diagonais verdes, linhas curvas discretas, hexágonos sutis, fotografia de obra e contraste alto.
- Movimento leve, sem excesso de sombras ou animações.
- Layout validado em 360, 390, 430, tablet e desktop, sem rolagem horizontal.

## Implementação técnica
- TanStack Start com rotas independentes e metadados únicos.
- Lovable Cloud para autenticação, banco e armazenamento.
- Leituras públicas por funções de servidor; operações privadas autenticadas e protegidas pelas regras do banco.
- Lista de materiais persistida no navegador para visitantes, com hidratação segura.
- Preço é opcional; quando ausente, a interface mostra “Consulte” em vez de inventar valor.
- Estoque exibido como `ESGOTADO`, `ÚLTIMAS UNIDADES` ou `EM ESTOQUE`, sem revelar a quantidade ao cliente.

## Validação
- Verificar rotas, navegação móvel, pesquisa, filtros, lista, cálculos e links do WhatsApp.
- Verificar login, logout, recuperação, bloqueio administrativo e operações de gestão.
- Verificar upload, estoque, categorias, configurações e banners.
- Executar testes direcionados, inspeção de erros e validação visual em tamanhos móveis e desktop.
