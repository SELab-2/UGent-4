FROM ubuntu:latest
LABEL maintainer="Your Name <contact@techiescamp.com>"
RUN  apt-get update -y && \
     apt-get upgrade -y && \
     apt-get dist-upgrade -y && \
     apt-get -y autoremove && \
     apt-get clean
RUN apt-get install -y zip \
    unzip \
    python3 \
    && rm -rf /var/lib/apt/lists/*
# Copy the script to the container
ADD ./api/docker/testing_entrypoint.sh /
RUN chmod +x /testing_entrypoint.sh
# Set the entrypoint to the script with CMD arguments
ENTRYPOINT ["/testing_entrypoint.sh"]