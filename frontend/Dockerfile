# Stage 1: Build the React app using Node.js and NPM
FROM node:16 as build
LABEL authors="kalin"
WORKDIR /app

# Clone the repository
RUN git clone https://github.com/Gerrux/securesight.git

# Change the working directory to the cloned repository's frontend folder
WORKDIR /app/securesight/frontend

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./

# Add a .env file for environment variables if needed
COPY .env ./

RUN npm run build

# Stage 2: Serve the built app using NGINX
FROM nginx:alpine

COPY --from=build /app/securesight/frontend/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
