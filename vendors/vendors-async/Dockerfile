# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY index.js ./

# Install Express and Axios
RUN npm init -y && npm install express axios

# Expose port and start
EXPOSE 4001
CMD ["node", "index.js"]
