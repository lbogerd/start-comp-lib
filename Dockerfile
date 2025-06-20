# Stage 1: Install all dependencies (including devDependencies)
# This allows us to leverage Docker's cache for the dependencies layer.
FROM node:22-alpine AS deps
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy files required for pnpm to install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
# pnpm-workspace.yaml might not exist, so we use a wildcard and handle potential errors.
# If pnpm-workspace.yaml does not exist, the copy will silently fail for that file, which is fine.

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Build the application
# This stage uses the dependencies from the 'deps' stage and builds the application.
FROM node:22-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy all files from the 'deps' stage, including node_modules
COPY --from=deps /app/ ./

# Copy the rest of the application source code
# We copy this after pnpm install to leverage Docker cache more effectively.
# Files listed in .dockerignore will be excluded.
COPY . .

# Build the application
# Ensure your package.json's "build" script correctly builds the application.
RUN pnpm build

# Stage 3: Production image
# This stage creates the final, lean production image.
FROM node:22-alpine AS final
WORKDIR /app

ENV NODE_ENV=production

# Install pnpm
RUN npm install -g pnpm

# Copy package.json, pnpm-lock.yaml, and pnpm-workspace.yaml (if it exists)
# These are needed to install production dependencies.
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml* ./
# If pnpm-workspace.yaml does not exist in builder, the copy will silently fail for that file, which is fine.

# Install only production dependencies
# This command prunes devDependencies.
RUN pnpm install --prod --frozen-lockfile

# Copy the built application from the 'builder' stage.
# Vinxi typically outputs to a '.output' directory.
COPY --from=builder /app/.output ./.output

# Copy the libs directory containing component sources needed by getLibs at runtime
# getLibs expects them in src/libs relative to the app root
COPY --from=builder /app/src/libs ./src/libs

# Copy the src/logic directory needed by helper functions like getItemDependencies at runtime
COPY --from=builder /app/src/logic ./src/logic

# Copy public assets if they are not part of the .output directory and are served separately
# Adjust if your public assets are handled differently by Vinxi build
# COPY --from=builder /app/public ./public

# Expose the port the app runs on.
# TanStack Start / Vinxi default to 3000.
# Change this if your application uses a different port.
EXPOSE 3000

# Command to run the application.
# This should correspond to the "start" script in your package.json.
CMD ["node", ".output/server/index.mjs"] 
