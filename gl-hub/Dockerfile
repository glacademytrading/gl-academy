FROM node:22-alpine
WORKDIR /app/mcp-server
COPY mcp-server/package*.json ./
RUN npm ci --omit=dev
COPY mcp-server/src ./src
COPY conteudo /app/conteudo
ENV NODE_ENV=production PORT=3333
EXPOSE 3333
CMD ["node", "src/index.js"]
