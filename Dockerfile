FROM node:20-bullseye

# System libraries needed to build the 'av' package (FFmpeg dev headers)
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv \
    ffmpeg libavcodec-dev libavformat-dev libavutil-dev \
    libswscale-dev libavdevice-dev libavfilter-dev libswresample-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm install

# Install Python dependencies
COPY python/requirements.txt ./python/requirements.txt
RUN pip3 install -r python/requirements.txt

# Copy the rest of the app
COPY . .

EXPOSE 8000
CMD ["node", "src/server.js"]