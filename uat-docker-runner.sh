# Build the Docker image
docker build -t staff-portal-uat:1.0.0 .

# Check if the container exists before attempting to stop and remove it
if [ "$(docker ps -q -f name=staff-portal-uat)" ]; then
    docker stop staff-portal-uat
    docker rm staff-portal-uat
fi

# Run the container
docker run --detach=true --name=staff-portal-uat --publish=3000:3000 --restart unless-stopped staff-portal-uat:1.0.0
