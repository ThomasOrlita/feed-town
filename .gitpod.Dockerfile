FROM gitpod/workspace-full
USER gitpod

# Node.js v17
RUN bash -c ". .nvm/nvm.sh     && nvm install 17     && nvm use 17     && nvm alias default 17"
RUN echo "nvm use default &>/dev/null" >> ~/.bashrc.d/51-nvm-fix

# Deno
RUN curl -fsSL https://deno.land/x/install@v0.1.4/install.sh | sh
RUN /home/gitpod/.deno/bin/deno completions bash > /home/gitpod/.bashrc.d/90-deno && echo 'export DENO_INSTALL="/home/gitpod/.deno"' >> /home/gitpod/.bashrc.d/90-deno && echo 'export PATH="$DENO_INSTALL/bin:$PATH"' >> /home/gitpod/.bashrc.d/90-deno
RUN /home/gitpod/.deno/bin/deno install -qAn vr https://deno.land/x/velociraptor@1.3.0/cli.ts