FROM nginx:1.27-alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static web app files
COPY public/ /usr/share/nginx/html/

# Container Apps requires the container to listen on a non-privileged port
EXPOSE 8080

# Run nginx in foreground (PID 1)
CMD ["nginx", "-g", "daemon off;"]
