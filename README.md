# zinli-test
admin-webapp

docker run --name zinli-webapp -dit \
    -v "$PWD":/home/angular \
    -w /home/angular \
    -p 9022:9022 \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    angular