#!/usr/bin/env bash
# 已弃用
# 镜像版本
image_version=`date +%Y%m%d%H%M`;
# 关闭msd_admin容器
#docker stop msd_admin || true;
# 删除msd_admin容器
#docker rm msd_admin || true;
# 删除msd/admin镜像
#docker rmi --force $(docker images | grep msd/admin | awk '{print $3}')
# 构建msd/admin:$image_version镜像
docker build . -t msd/admin:$image_version;
# 查看镜像列表
docker images;
# 基于msd/admin 镜像 构建一个容器 msd_admin
docker run -p 49003:443 -d --name msd_admin msd/admin:$image_version;
# 查看日志
docker logs msd_admin;
#删除build过程中产生的镜像    #docker image prune -a -f
docker rmi $(docker images -f "dangling=true" -q)
# 对空间进行自动清理
docker system prune -a -f