# Stage 1: Build the React app
# Utiliza uma imagem Node.js leve para instalar dependências e compilar a aplicação.
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do container.
WORKDIR /app

# Copia os arquivos de configuração do projeto (package.json e package-lock.json)
# para que as dependências sejam instaladas de forma otimizada.
COPY package.json package-lock.json ./

# Instala as dependências do projeto de forma "limpa" para builds de produção.
RUN npm ci

# Copia todo o código-fonte da sua aplicação para o diretório de trabalho.
COPY . .

# Compila a aplicação React para produção. Os arquivos estáticos serão gerados na pasta 'dist'.
RUN npm run build

# Stage 2: Serve the app with Nginx
# Utiliza uma imagem Nginx super leve para servir os arquivos estáticos da aplicação.
FROM nginx:alpine AS production-stage

# Copia a sua configuração Nginx personalizada (nginx.conf) para sobrescrever a padrão do Nginx.
# ISSO É CRUCIAL PARA APLICAÇÕES SPA COMO O REACT.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos de build da sua aplicação (gerados no estágio 'builder')
# para o diretório padrão do Nginx que serve conteúdo web.
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta 80, que é a porta HTTP padrão onde o Nginx estará escutando.
EXPOSE 80

# Comando padrão para iniciar o Nginx e mantê-lo em execução em foreground.
CMD ["nginx", "-g", "daemon off;"]