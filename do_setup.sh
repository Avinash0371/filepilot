#!/bin/bash

echo "🚀 Starting FilePilot Deployment on DigitalOcean..."

# 1. Update & Install Docker
echo "📦 Installing Docker..."
sudo apt-get update
sudo apt-get install -y docker.io git curl ufw

# 2. Configure Firewall (UFW)
echo "🛡️ Configuring Firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
echo "y" | sudo ufw enable

# 3. Clone Repository
# Note: Ensure this URL matches your actual public repository
REPO_URL="https://github.com/Avinash0371/filepilot.git"

if [ -d "filepilot" ]; then
    echo "📂 Repository exists. Pulling latest changes..."
    cd filepilot
    git pull
else
    echo "📂 Cloning repository..."
    git clone $REPO_URL
    cd filepilot
fi

# 4. Build Docker Image
echo "🔨 Building Docker Image (This may take 5-10 minutes)..."
# We limit build memory to prevent crashing the 1GB droplet during build
# Adding swap temporarily can help if build fails
sudo fallocate -l 2G /swapfile || true
sudo chmod 600 /swapfile || true
sudo mkswap /swapfile || true
sudo swapon /swapfile || true

sudo docker build -t filepilot .

# 5. Run App
echo "▶️ Starting Application..."
# Stop existing container if running
sudo docker stop filepilot || true
sudo docker rm filepilot || true

# Run new container
sudo docker run -d \
  --restart always \
  -p 80:3000 \
  --name filepilot \
  filepilot

echo "✅ Deployment Complete!"
echo "🌍 Your site should be live at: http://$(curl -s ifconfig.me)"
