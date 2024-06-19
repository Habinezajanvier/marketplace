FROM node:20-alpine  AS builder
# Set a working directory
WORKDIR /usr/src/app
# Copy project's metadata
ENV NODE_ENV=development
COPY package.json yarn.lock ./
# Install project dependances
RUN yarn install --frozen-lockfile
# Copy the source file to the container file system
COPY . .
# Compile the typescript files
RUN yarn build
# Package the final docker image
FROM node:20-alpine AS live
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY --from=builder ./usr/src/app/dist ./dist
RUN chown -R node:node /usr/src/app
USER node
EXPOSE 9000
CMD ["yarn", "start"]