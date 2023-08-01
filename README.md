# DEM 镜像制作

## 新增 Dockerfile

## 新增 entrypoint.sh
* 1.变量替换DEM配置文件 dem/WEB-INF/db.xml
* 2.启动 tomcat

## 修改 catalina.sh
```
# 文件第二行新增
JAVA_OPTS="-server -Xms256m -Xmx1024m -Djava.library.path=/opt/dmdbms/bin"
```

## dem 目录
* DEM 部署包，来源为达梦安装目录下/web/dem.war，需解压
* 修改解压后dem/WEB-INF/db.xml
```
<?xml version="1.0" encoding="UTF-8"?>
<ConnectPool>
	<!-- 将以下四行值替换为变量，用于在脚本entrypoint.sh中进行替换操作 -->
	<Server>{{DM_SERVER_IP}}</Server>
	<Port>{{DM_SERVER_PORT}}</Port>
	<User>{{DM_SERVER_USER}}</User>
	<Password>{{DM_SERVER_PWD}}</Password>
	<InitPoolSize>5</InitPoolSize>
	<CorePoolSize>10</CorePoolSize>
	<MaxPoolSize>500</MaxPoolSize>
	<KeepAliveTime>60</KeepAliveTime>
	<DbDriver></DbDriver>
	<DbTestStatement>select 1</DbTestStatement>
	<SSLDir>../sslDir/client_ssl/SYSDBA</SSLDir>
	<SSLPassword></SSLPassword>
</ConnectPool>
```

## dmdbms 目录
* 集成达梦数据库bin目录
* 当前使用达梦版本dm8_20230727_rev178822_x86_rh6_64_ent_8.1.2.192

## 生成&推送镜像
```
docker login
docker build -t dm8_tomcat_dem .
docker tag dm8_tomcat_dem gaiokane/dm8_tomcat_dem:latest
docker tag dm8_tomcat_dem gaiokane/dm8_tomcat_dem:20230727
docker push gaiokane/dm8_tomcat_dem
```

## 部署
* 1.在达梦服务端初始化数据库，执行脚本 dem_init.sql [点击下载](https://raw.githubusercontent.com/Gaiokane/dm8_tomcat_dem/master/dem_init.sql)
```
# 将脚本 dem_init.sql 放到达梦数据库数据映射目录中，如/mnt/data/dm8/data/DAMENG/dem_init.sql

# 进入达梦数据库容器，启动 disql，登录
/opt/dmdbms/bin/disql

# 设置编码
set CHAR_CODE UTF8

# 执行脚本
start /opt/dmdbms/data/DAMENG/dem_init.sql
```
* 2.通过 compose 启动
```
version: '3.3'
services:
  tomcat:
    image: gaiokane/dm8_tomcat_dem
    environment:
      - TZ="Asia/Shanghai"
      - DM_SERVER_IP=<达梦服务端IP>
      - DM_SERVER_PORT=<达梦服务端端口>
      - DM_SERVER_USER=<达梦服务端账号>
      - DM_SERVER_PWD=<达梦服务端密码>
    ports:
      - 80:8080
    privileged: true
    user: root
    restart: always
```
* 3.访问 http://ip:80/dem/ ，默认登录账号密码为：admin/888888
