FROM frolvlad/alpine-glibc
COPY machine-exec-server /machine-exec/main
WORKDIR /machine-exec
RUN chmod +x main
EXPOSE 4444
ENTRYPOINT ["./main"]
