# zinli-webapp

Aplicación para el examen zinli, el usuario **root** es: root@zinli.com

## How to start

Para comenzar use las siguientes instrucciones en la línea de comandos:

```bash
# Download repo
git clone https://github.com/charlie-vzla/zinli-webapp.git
cd zinli-webapp

# Build the angular image, this is necessary for the execution of the app.
docker build -t angular -f Dockerfile-angular .

# Run docker image width tools (angular, node, npm, etc...)
docker run --name zinli-webapp -dit \
    -v "$PWD":/home/angular \
    -w /home/angular \
    -p 9022:9022 \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    angular

# Run docker execute to access the basic tools.
docker exec -it zinli-webapp bash
# From now on execute all the angular-related command lines inside the container

# Install the project's dependencies
npm install

# Watches your files and uses livereload by default run `npm start` for a dev server. Navigate to `http://localhost:9222/`. The app will automatically reload if you change any of the source files.
npm start
```

**NOTA**:
All created user are valid, as I am using nodemailer test server it seems mail do not arrive to the destination inbox.
