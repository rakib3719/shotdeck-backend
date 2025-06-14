# Official Node.js 20 slim image
FROM node:20-bullseye-slim

# System dependencies install: python3, ffmpeg, curl
RUN apt-get update && apt-get install -y \
    python3 \
    ffmpeg \
    curl \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Install yt-dlp binary to /usr/local/bin
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
  && chmod +x /usr/local/bin/yt-dlp

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source code
COPY . .

# Start the app
CMD ["node", "src/server.js"]  
