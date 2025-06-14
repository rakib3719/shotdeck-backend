# ---- base image ----
FROM node:20-bookworm-slim

# ---- system deps ----
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      ffmpeg curl ca-certificates \
 && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
      -o /usr/local/bin/yt-dlp \
 && chmod +x /usr/local/bin/yt-dlp \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# ---- app ----
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

CMD ["node","index.js"]
