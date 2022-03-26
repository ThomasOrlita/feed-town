FROM denoland/deno:1.16.4

EXPOSE 4000

WORKDIR /app

USER deno

ADD . .

RUN deno cache --unstable server/server.ts

CMD ["run", "--unstable", "--allow-net", "--allow-read", "--allow-write", "--allow-ffi", "--allow-env", "server/server.ts"]