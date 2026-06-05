# 1. Imagem base: Node.js versão 20 (LTS) na versão Alpine (muito mais leve)
FROM node:20-alpine

# 2. Define a pasta onde tudo vai acontecer dentro do container
WORKDIR /app

# 3. Copia APENAS os arquivos de manifesto (package.json e package-lock.json)
COPY package*.json ./

# 4. Instala as dependências do projeto
RUN npm install

# 5. Agora sim, copia todo o resto do seu código para dentro da pasta /app
COPY . .

# 6. Avisa o Docker que a aplicação vai rodar na porta 3000 internamente
EXPOSE 3000

# 7. O comando que dá o "play" na sua aplicação
CMD ["npm", "start"]