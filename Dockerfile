FROM tomcat:8.5.84-jre8-temurin-focal

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

RUN mkdir -p /usr/local/tomcat/webapps/dem
COPY dem/ /usr/local/tomcat/webapps/dem

COPY catalina.sh /usr/local/tomcat/bin/catalina.sh

RUN mkdir -p /opt/dmdbms
COPY dmdbms/ /opt/dmdbms

ENTRYPOINT ["/entrypoint.sh"]
