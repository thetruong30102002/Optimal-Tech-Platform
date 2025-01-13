# Sử dụng Node.js làm base image
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Expose cổng để container sử dụng
EXPOSE 3000

# Chạy ứng dụng
CMD ["node", "src/app.js"]
