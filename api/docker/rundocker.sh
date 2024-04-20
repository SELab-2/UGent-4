yes | docker system prune -a >&2
docker build -t script-demo -f api/docker/Dockerfile .
docker run --mount type=bind,source="$(pwd)"/data/restricties/project_$2,target=/data/restricties --mount type=bind,source="$(pwd)"/data/indieningen/indiening_$1,target=/data --name demo -d script-demo
docker cp demo:/data/artefacten.zip /data
docker logs demo -f
