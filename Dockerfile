FROM nginx:alpine

# Copy landing page assets
COPY index.html landing.css /usr/share/nginx/html/

# Copy app files to app directory
COPY app/ /usr/share/nginx/html/app/

# Create nginx config to serve app directory
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location /app/ { \
        try_files $uri $uri/ /app/index.html; \
    } \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

