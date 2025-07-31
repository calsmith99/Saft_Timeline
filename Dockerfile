# Use an official Node.js runtime as a parent image
FROM node:22 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

RUN touch .env && echo "VITE_SPOTIFY_CLIENT_ID=$VITE_SPOTIFY_CLIENT_ID" >> .env && echo "VITE_SPOTIFY_CLIENT_ID=$VITE_SPOTIFY_CLIENT_ID" >> .env
RUN touch .env && echo "VITE_SPOTIFY_PLAYLIST_ID=$VITE_SPOTIFY_PLAYLIST_ID" >> .env && echo "VITE_SPOTIFY_PLAYLIST_ID=$VITE_SPOTIFY_PLAYLIST_ID" >> .env
RUN touch .env && echo "VITE_SPOTIFY_CLIENT_SECRET=$VITE_SPOTIFY_CLIENT_SECRET" >> .env && echo "VITE_SPOTIFY_CLIENT_SECRET=$VITE_SPOTIFY_CLIENT_SECRET" >> .env

# Build the React app
RUN npm run build

# Use an official Nginx image to serve the app
FROM nginx:alpine

# Copy the build output to Nginx's default public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]