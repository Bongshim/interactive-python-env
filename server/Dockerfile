FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml (if you have it)
COPY package*.json ./

# Use pnpm to install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .


EXPOSE 3000

CMD ["node", "index.js"]