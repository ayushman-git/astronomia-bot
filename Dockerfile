# Use Node.js 21 Alpine for smaller size but with necessary build tools
FROM node:21-alpine

# Install dependencies for canvas
RUN apk add --no-cache \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev \
    pixman-dev \
    python3 \
    make \
    g++ \
    pkgconfig

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY .npmrc ./

# Install dependencies
RUN npm ci --production=false --verbose

# Copy app source
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "src/index.js"]
