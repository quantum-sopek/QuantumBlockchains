FROM node:14-alpine
ENV NODE PRODUCTION
WORKDIR /app
COPY package.json .
RUN yarn
COPY dist .
COPY blocks ./blocks

EXPOSE 3016 3017
CMD [ "node", "peer.js" ]