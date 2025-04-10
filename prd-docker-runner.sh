# Build the Docker image
docker build -f DockerfileProd -t staff-portal-prod:v1.0.0 .

# Check if the container exists before attempting to stop and remove it
if [ "$(docker ps -q -f name=staff-portal-prod)" ]; then
    docker stop staff-portal-prod || true
    docker rm staff-portal-prod || true
fi

# Run the container
docker run --detach=true --name=staff-portal-prod --publish=4000:4000 --restart unless-stopped staff-portal-prod:v1.0.0
