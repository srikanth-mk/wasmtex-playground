# Use Ubuntu 20.04 as base image
FROM ubuntu:20.04

# Set environment variables to avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

# Update package lists and install all necessary packages in a single layer
RUN apt-get update && apt-get install -y \
    wget \
    perl \
    python3 \
    python3-pip \
    build-essential \
    libfontconfig1-dev \
    libx11-dev \
    libkpathsea6 \
    libssl-dev \
    libnet-sftp-foreign-perl \
    libauthen-sasl-perl \
    cpanminus \
    libtext-unidecode-perl \
    libdate-calc-perl \
    libyaml-tiny-perl \
    libfile-copy-recursive-perl \
    libfile-chdir-perl \
    libroman-perl \
    libyaml-perl \
    libjson-perl \
    libfile-find-rule-perl \
    libxml-simple-perl \
    libfile-bom-perl \
    libconfig-general-perl \
    software-properties-common \
    libxml-dom-xpath-perl \
    curl \
    ca-certificates \
    && add-apt-repository ppa:openjdk-r/ppa \
    && apt-get update \
    && apt-get install -y openjdk-11-jdk \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Perl modules
RUN cpanm --force --notest Net::AMQP::RabbitMQ

# Install TeXLive 2025 (current version)
RUN mkdir -p /tmp/texlive \
    && cd /tmp/texlive \
    && curl -L -o install-tl-unx.tar.gz \
       "https://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz" \
    && tar -xzf install-tl-unx.tar.gz \
    && cd install-tl-* \
    && echo "selected_scheme scheme-medium" > texlive.profile \
    && echo "option_doc 0" >> texlive.profile \
    && echo "option_src 0" >> texlive.profile \
    && echo "tlpdbopt_install_docfiles 0" >> texlive.profile \
    && echo "tlpdbopt_install_srcfiles 0" >> texlive.profile \
    && ./install-tl --profile=texlive.profile \
    && cd / \
    && rm -rf /tmp/texlive

# Set environment variables for TeXLive 2025
ENV PATH="/usr/local/texlive/2025/bin/x86_64-linux:${PATH}"
ENV TEXMFHOME="/usr/local/texlive/texmf-local"
ENV TEXMFCNF="/usr/local/texlive/2025/texmf-dist/web2c"

# Verify TeXLive installation
RUN tlmgr --version

# Copy application code into the Docker image
COPY requirements.txt /tmp/requirements.txt

# Install Python dependencies
RUN pip3 install --no-cache-dir -r /tmp/requirements.txt

COPY . /app
WORKDIR /app
CMD ["python3", "wsgi.py"]