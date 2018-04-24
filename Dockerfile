FROM ubuntu:16.04
RUN apt-get update && apt-get install -y --no-install-recommends \
    g++ \
    gcc \
    libc6-dev \
    make \
    curl \
    ca-certificates \
    openssl \
    git \
    ssh \
    && rm -rf /var/lib/apt/lists/*

ENV GOLANG_VERSION 1.10
ENV GOLANG_DOWNLOAD_URL https://golang.org/dl/go$GOLANG_VERSION.linux-amd64.tar.gz
ENV GOLANG_DOWNLOAD_SHA256 b5a64335f1490277b585832d1f6c7f8c6c11206cba5cd3f771dcb87b98ad1a33

RUN  curl -fsSL "$GOLANG_DOWNLOAD_URL" -o golang.tar.gz \
    && echo "$GOLANG_DOWNLOAD_SHA256  golang.tar.gz" | sha256sum -c - \
    && tar -C /usr/local -xzf golang.tar.gz \
    && rm golang.tar.gz

ENV GOPATH /go
ENV PATH ${GOPATH}/bin:/usr/local/go/bin:${PATH}

RUN mkdir -p "${GOPATH}/src" "${GOPATH}/bin" && chmod -R 777 "${GOPATH}"

RUN curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh

# go get dependency to cache dependencies and speed up compilation on next rebuild
RUN go get github.com/eclipse/che-lib/websocket \
    github.com/docker/docker/api/types \
    github.com/docker/docker/client \
    github.com/eclipse/che/agents/go-agents/core/jsonrpc/jsonrpcws \
    github.com/eclipse/che/agents/go-agents/core/jsonrpc \
    github.com/eclipse/che/agents/go-agents/core/rest

# use workdirectory
ENV REPOSITORY=${GOPATH}/src/github.com/AndrienkoAleksandr/che-theia-terminal-plugin
COPY . ${REPOSITORY}

WORKDIR ${REPOSITORY}/machine-exec-server

ENTRYPOINT [ "compile.sh" ]