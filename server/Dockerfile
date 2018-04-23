FROM alpine:3.7
WORKDIR /machine-exec
COPY main /machine-exec/main
RUN chmod +x main
EXPOSE 4444
ENTRYPOINT ["/machine-exec/main"]
