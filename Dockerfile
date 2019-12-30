FROM node

# 安装nginx
RUN apt-get update && apt-get install -y nginx

# 指定工作目录
WORKDIR /app

# 将当前目录下所有文件拷贝到工作目录下
COPY . /app/

# 声明运行时容器提供服务端口
EXPOSE 80

# 安装依赖
# 运行 npm run build
# 将 dist 目录所有文件拷贝到 nginx  的目录下
# 删除工作目录的文件，尤其是 node_modules 以减少镜像体积
RUN npm install && npm run build && cp -f -r dist/* /var/www/html && rm -rf /app

# 启动nginx
CMD [ "nginx","-g","daemon off;" ]