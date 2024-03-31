yes | docker system prune -a >&2
docker build -t script-demo --build-arg INDIENING_ID=$1 --build-arg PROJECT_ID=$2 .
docker run --mount type=bind,source="$(pwd)"/../../data,target=/data --name demo -d script-demo
docker logs demo -f
