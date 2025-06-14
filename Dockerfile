# ---- Base Image ----
FROM node:20-bookworm-slim

# ---- Install System Dependencies ----
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      ffmpeg curl ca-certificates xz-utils gnupg \
 && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
      -o /usr/local/bin/yt-dlp \
 && chmod +x /usr/local/bin/yt-dlp \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# ---- Set Working Directory ----
WORKDIR /app

# ---- Copy Dependency Files ----
COPY package*.json ./

# ---- Install Dependencies ----
RUN npm ci --omit=dev

# ---- Copy Source Code ----
COPY . .

# ---- Expose Port (optional if needed) ----
# EXPOSE 3000

# ---- Default Command ----
CMD ["node", "src/server.js"]
