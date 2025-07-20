# Use the official Node.js Long-Term Support (LTS) version as a base image
FROM node:lts-alpine

# Install curl using the Alpine package manager (apk)
# --no-cache is used to keep the image size small by not storing the package index
RUN apk add --no-cache curl

# Set the working directory inside the container
WORKDIR /app

# Install Google Apps Script CLI (clasp) globally
# --unsafe-perm is used to handle potential permission issues during global npm installs
RUN npm install -g @google/clasp --unsafe-perm

# Set the default command to execute when the container starts.
# This will start an interactive shell, allowing us to run clasp commands manually.
CMD ["/bin/sh"]