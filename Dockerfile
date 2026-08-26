
# 1. Choose a lightweight base image. First we choose a base image (blueprint).
# it is a kind of tiny os (here alpine linux an existing image) enough to install dependencies and run the server.
# [LANGUAGE_NAME]:[VERSION_NUMBER]-[OS_VARIANT]
FROM node:20-alpine

# 2. Set the working directory inside the container
# we have created the base image (set up system and language), now we make a folder and move to that folder. it is equivalent to:
# mkdir -p /whiteboard_backend (Creates the folder if it isn't already there)
# cd /whiteboard_backend

WORKDIR /whiteboard_backend

# 3. Copy package files first (to leverage Docker caching)
# now we copy the package.json and package-lock.json file in the folder (whiteboard_backend)

COPY package*.json ./

# 4. Install backend dependencies
# now we install dependencies, npm ci first clean old install and then install from scratch and match exact version from package-lock.json
# --only=production tells that skip any dependencies that were just there for development and no need in production
RUN npm ci --only=production

# 5. Copy the rest of the backend source code
# First dot (.) - The Source: This tells Docker to look at your local project folder on your laptop where your Dockerfile lives and grab every file and folder inside it.
# Second dot (.) - The Destination: This tells Docker where to paste those files. Because you previously wrote WORKDIR /whiteboard_backend, the second dot means 
# "paste everything right here inside /whiteboard_backend."
COPY . .

# 6. Tell Docker which network port the backend listens on
EXPOSE 5000

# 7. Define the command to start your server
CMD ["npm","start"]

# now by running build we create our own backend image using node:20-alpine as base image 
# (template for creating containers)
# it basically says give the image a name whiteboard_backend_image and . means use the current directory i am in
# docker build -t whiteboard_backend_image .


# Now we create the container using the image we built, for local testing proving .env file in command but 
# in production this is not done. first port (5000) is host/compute port the second port (5000) is container port
# docker run --env-file .env -p 5000:5000 whiteboard_backend_image