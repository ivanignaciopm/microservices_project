## Managing microservices locally with Jenkins and Minikube with Persistent Storage

### Prerequisites

Before we start, make sure you have the following: 

1. **Minikube** installed.
2. **kubectl** installed. Or you could run:

   ```
   alias kubectl="minikube kubectl --"
   ```
3. Clone the project repository:

   ```bash
   git clone https://github.com/ivanignaciopm/microservices_project.git
   cd microservices_project
   ```

### Steps to Deploy the Services

#### 1. Start Minikube

First, let's get Minikube up and running:

```bash
minikube start
```

#### 2. Set Up Docker Environment

Configure your terminal to use Minikube's Docker environment. This lets us build Docker images directly in Minikube's Docker daemon:

```bash
eval $(minikube -p minikube docker-env)
```

#### 3. Build Docker Images

Now, we need to build the Docker images for each of our services. Run these commands:

```bash
# Build the Docker image for each service
docker build -t user-service:latest ./user-service
docker build -t order-service:latest ./order-service
docker build -t product-service:latest ./product-service
```

#### 4. Deploy Services to Kubernetes

Apply the Kubernetes configuration files for each service. These files define how your services should be deployed:

```bash
# Deploy the user-service
kubectl apply -f ./user-service/deployment.yaml

# Deploy the order-service
kubectl apply -f ./order-service/deployment.yaml

# Deploy the product-service
kubectl apply -f ./product-service/deployment.yaml

```

#### 5. Check the Status of Pods and Services

Make sure everything is running smoothly. Check the status of your pods:

```bash
kubectl get pods
```

You should see something like this, indicating that all pods are running:

```plaintext
NAME                               READY   STATUS    RESTARTS   AGE
jenkins-6d665584b7-x2vlq           1/1     Running   0          68s
order-service-7c85554cf4-vrqvv     1/1     Running   0          2m42s
product-service-76488ff68f-c2rnh   1/1     Running   0          2m42s
user-service-5949dbbd65-5hsd8      1/1     Running   0          10m
```

Then, check the list of services and their ports:

```bash
minikube service list
```

You should see something like this:

```plaintext
|----------------------|---------------------------|--------------|---------------------------|
|      NAMESPACE       |           NAME            | TARGET PORT  |            URL            |
|----------------------|---------------------------|--------------|---------------------------|
| default              | jenkins                   |           80 | http://192.168.49.2:30558 |
| default              | order-service             |           80 | http://192.168.49.2:32458 |
| default              | product-service           |           80 | http://192.168.49.2:30241 |
| default              | user-service              |           80 | http://192.168.49.2:32610 |
|----------------------|---------------------------|--------------|---------------------------|
```

#### 6. Test the Services

Let's make sure your services are working correctly. Use `curl` to test the endpoints exposed by each service:

```bash
# Test user-service
curl http://192.168.49.2:32610/users

# Test order-service
curl http://192.168.49.2:32458/orders

# Test product-service
curl http://192.168.49.2:30241/products
```

Replace `192.168.49.2` and the ports with the actual IP and port numbers from the `minikube service list` command.

### Jenkins

#### Deploying the PV and PVC

Run these commands in this order to create the PV, PVC and connect them:

```
kubectl apply -f ./jenkins/jenkins-pv.yaml
kubectl apply -f ./jenkins/jenkins-pvc.yaml

```

### Deploy jenkins

```
kubectl apply -f ./jenkins/deployment.yaml
```

### Password Admin

- **Checking Logs**: If a service isn't working, check the logs for any errors. You can find the Admin password here also.

  ```bash
  kubectl logs <pod-name>
  ```
- **Accessing Jenkins**: If you need to access the Jenkins container run:

  ```bash
  kubectl exec -it <jenkins-pod-name> -- /bin/cat 
  ```

  Here you could check if the plugins are installed correctly in the PV. so you will find them there when you restart the pod

  ```
  ls /var/jenkins_home/plugins
  ```

  To restart the pod just delete it:

  ```
  kubectl delete pod <jenkins-pod-name>
  ```

And that's it! You should now have your microservices running on Kubernetes with Minikube.

If you would like to contribute to this project, feel free to do it.
