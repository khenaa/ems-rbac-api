# INIT
FROM --platform=linux/amd64 node:22.3.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
# CODE COPY
COPY src ./src
COPY server.mjs ./server.mjs
COPY createAdminScript.mjs ./createAdminScript.mjs

# NETWORK
EXPOSE 9000

# RUN
CMD [ "node", "server.mjs" ]