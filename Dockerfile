FROM node:18

# Install Python, pip, ffmpeg, curl (required dependencies)
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg curl

# Install yt-dlp using pip
RUN pip3 install yt-dlp

WORKDIR /app
COPY . .

RUN npm install

CMD ["node", "index.js"]
