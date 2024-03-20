# ---- Base Node ----
FROM node:18.17.1 AS base
ARG CI_JOB_TOKEN
ARG CODEARTIFACT_AUTH_TOKEN
WORKDIR /app
COPY package*.json .npmrc ./
RUN npm ci
COPY . ./

# Without this limit, the build failed with the following error:
# FATAL ERROR: Ineffective mark-compacts near heap limit allocation failed - javascript heap out of memory
#
# This SO thread suggested increasing the memory size to deal with the limit:
# https://stackoverflow.com/questions/53230823/fatal-error-ineffective-mark-compacts-near-heap-limit-allocation-failed-javas
ENV NODE_OPTIONS "--max-old-space-size=8192"
RUN npm run build
RUN npm prune --production

FROM node:18.17.1-alpine

RUN apk add jq py-pip && pip install yq

USER node
WORKDIR /home/node

COPY --from=base --chown=node:node /app/node_modules ./node_modules
COPY --from=base --chown=node:node /app/dist ./dist
COPY --from=base --chown=node:node /app/scripts/.k8s-pre-deploy-script.sh ./dist/scripts/.k8s-pre-deploy-script.sh
COPY --from=base --chown=node:node /app/config ./config
COPY --from=base --chown=node:node /app/resources ./resources
COPY --from=base --chown=node:node /app/open-api ./open-api
COPY --from=base --chown=node:node /app/package*.json ./

CMD ["npm", "run", "start:prod"]
