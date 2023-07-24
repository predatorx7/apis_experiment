FROM node:18-bookworm-slim

WORKDIR /opt/app/

COPY . .

## Uncomment the below lines to update image security content if any
# USER root
# RUN dnf -y update-minimal --security --sec-severity=Important --sec-severity=Critical && dnf clean all

COPY package*.json ./

# RUN ls -lA && yarn install --prod && yarn run compile
RUN ls -lA && yarn install && yarn run compile

# COPY licenses /licenses
# COPY public public

# ENV HOST=0.0.0.0 PORT=3001

# EXPOSE 3001/tcp

CMD ["yarn","run","serve"]