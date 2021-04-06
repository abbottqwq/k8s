docker build -t abbottqwq/multi-client ./client
docker build -t abbottqwq/multi-server ./server
docker build -t abbottqwq/multi-worker ./worker

docker push abbottqwq/multi-client
docker push abbottqwq/multi-server
docker push abbottqwq/multi-worker

kubectl delete -f k8s/
kubectl apply -f k8s/