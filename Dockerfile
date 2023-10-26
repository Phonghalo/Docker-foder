### PENDING - FOR PRODUCTION
FROM ubuntu:22.04
LABEL Maintainer="phongnv <nvphong.halo1262000@gmail.com>" \
      Description="Nginx 1.14 & PHP-FPM 8.0 based on Ubuntu Linux."
      
RUN apt update
RUN apt-get -y install nginx
RUN apt install lsb-release ca-certificates apt-transport-https software-properties-common -y
RUN add-apt-repository ppa:ondrej/php

# RUN apt-get update && apt-get install -y gnupg2

# RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 6494C6D6997C215E

# Install packages
# RUN apt-get -y update --fix-missing
# RUN apt-get upgrade -y

# Install important libraries
# RUN apt-get -y install --fix-missing apt-utils build-essential git curl zip wget
# RUN apt-get -y install libmcrypt-dev vim software-properties-common

# NGINX
# RUN apt-get -y install nginx

# RUN apt install lsb-release ca-certificates apt-transport-https software-properties-common -y
# RUN add-apt-repository ppa:ondrej/php

# RUN apt-get update

# RUN apt-get install -y apt-transport-https

# RUN echo "deb http://archive.ubuntu.com/ubuntu/ bionic-proposed main" >> /etc/apt/sources.list

# Configure nginx
#COPY config/nginx.conf /etc/nginx/nginx.conf
# Remove default server definition
#RUN rm /etc/nginx/conf.d/default.conf

# RUN apt-cache search php8.0

# RUN apt install --no-install-recommends -y php8.0

# PHP8.0 && Extensions
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get -y install --fix-missing php8.0 php8.0-fpm php8.0-mysqli php8.0-curl \
    php8.0-phar php8.0-intl php8.0-ctype php8.0-gearman php8.0-igbinary php8.0-mcrypt\
    php8.0-xml php8.0-xmlreader php8.0-xmlrpc\
    php8.0-redis php8.0-xmlreader \
    php8.0-readline php8.0-soap php8.0-zip\
    php8.0-mbstring php8.0-gd php8.0-bcmath php8.0-mbstring php8.0-mongo
    
RUN apt-get -y install --fix-missing php8.1 php8.1-fpm php8.1-mysqli php8.1-curl \
    php8.1-phar php8.1-intl php8.1-ctype php8.1-gearman php8.1-igbinary php8.1-mcrypt\
    php8.1-xml php8.1-xmlreader php8.1-xmlrpc\
    php8.1-redis php8.1-xmlreader \
    php8.1-readline php8.1-soap php8.1-zip\
    php8.1-mbstring php8.1-gd php8.1-bcmath php8.1-mbstring php8.1-mongo

# PHP7.2 && Extensions
RUN apt-get -y install --fix-missing php7.2 php7.2-fpm php7.2-mysqli php7.2-json php7.2-curl php7.2-dev\
    php7.2-phar php7.2-intl php7.2-ctype php7.2-gearman php7.2-igbinary php7.2-mcrypt\
    php7.2-xml php7.2-xmlreader php7.2-xmlrpc\
    php7.2-redis php7.2-xmlreader\
    php7.2-readline php7.2-soap php7.2-zip\
    php7.2-mbstring php7.2-gd php7.2-bcmath php7.2-mbstring php7.4-mongo php7.4-xdebug

RUN apt-get -y install --fix-missing php7.4 php7.4-fpm php7.4-mysqli php7.4-json php7.4-curl php7.4-dev\
    php7.4-phar php7.4-intl php7.4-ctype php7.4-gearman php7.4-igbinary php7.4-mcrypt\
    php7.4-xml php7.4-xmlreader php7.4-xmlrpc\
    php7.4-redis php7.4-xmlreader\
    php7.4-readline php7.4-soap php7.4-zip\
    php7.4-mbstring php7.4-gd php7.4-bcmath php7.4-mbstring php7.4-mongo php7.4-xdebug

RUN php -v

RUN apt-get install -y net-tools htop
RUN apt-get install -y redis-server redis-tools libdbd-mysql-perl mysql-common 
#RUN wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | apt-key add - 

#RUN echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" |  tee -a /etc/apt/sources.list.d/elastic-8.x.list && apt-get install apt-transport-https elasticsearch

# Configure PHP-FPM

#COPY ./shared/config/php-pool.conf /etc/php8/php-fpm.d/www.conf
# ADD ./shared/config/php.ini /etc/php8.0/conf.d/custom.ini

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

#RUN wget "https://download.elastic.co/elasticsearch/release/org/elasticsearch/distribution/deb/elasticsearch/2.4.0/elasticsearch-2.4.0.deb" |
#    dpkg -i elasticsearch-2.4.0.deb | /
#    service elasticsearch status

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash && apt-get install -y nodejs
RUN npm -v
 
RUN npm install -g sails && npm install -g nodemon
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt update
RUN apt install yarn
RUN yarn --version

# Make sure files/folders needed by the processes are accessable when they run under the nobody user
#RUN chown -R nobody.nobody /run && \
#  chown -R nobody.nobody /var/lib/nginx && \
#  chown -R nobody.nobody /var/tmp/nginx && \
#  chown -R nobody.nobody /var/log/nginx
WORKDIR /var/www/html

ADD ./src ./

ADD ./environment/nginx/ /etc/nginx/sites-enabled/

CMD service nginx start && service php7.4-fpm start && service redis-server start && tail -f /dev/null
