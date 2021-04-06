docker build -t abbottqwq/multi-client:lastest -t abbottqwq/multi-client:$SHA ./client
docker build -t abbottqwq/multi-server:lastest -t abbottqwq/multi-server:$SHA ./server
docker build -t abbottqwq/multi-worker:lastest -t abbottqwq/multi-worker:$SHA ./worker

docker push abbottqwq/multi-client:lastest
docker push abbottqwq/multi-server:lastest
docker push abbottqwq/multi-worker:lastest

docker push abbottqwq/multi-client:$SHA
docker push abbottqwq/multi-server:$SHA
docker push abbottqwq/multi-worker:$SHA

kubectl apply -f k8s/

kubectl set image deployment/server-deployment server=abbottqwq/multi-server:$SHA
kubectl set image deployment/client-deployment client=abbottqwq/multi-client:$SHA
kubectl set image deployment/worker-deployment worker=abbottqwq/multi-worker:$SHA