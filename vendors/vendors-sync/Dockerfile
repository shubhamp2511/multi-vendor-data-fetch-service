# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY index.js ./

# Install Express
RUN npm init -y && npm install express

# Expose port and start
EXPOSE 4000
CMD ["node", "index.js"]
