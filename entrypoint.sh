#!/bin/bash

sed -i "s/{{DM_SERVER_IP}}/$DM_SERVER_IP/g" /usr/local/tomcat/webapps/dem/WEB-INF/db.xml
sed -i "s/{{DM_SERVER_PORT}}/$DM_SERVER_PORT/g" /usr/local/tomcat/webapps/dem/WEB-INF/db.xml
sed -i "s/{{DM_SERVER_USER}}/$DM_SERVER_USER/g" /usr/local/tomcat/webapps/dem/WEB-INF/db.xml
sed -i "s/{{DM_SERVER_PWD}}/$DM_SERVER_PWD/g" /usr/local/tomcat/webapps/dem/WEB-INF/db.xml

source /usr/local/tomcat/bin/catalina.sh run
