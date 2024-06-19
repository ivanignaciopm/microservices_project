### Jenkinsfile

El `Jenkinsfile` se encargará de automatizar la construcción de la imagen Docker, la ejecución de pruebas, el push al registro Docker y el despliegue a Kubernetes.

### Flujo de trabajo completo

1. **Desarrollo del Código** : Trabajas en el código del microservicio y haces commit en el repositorio de GitHub.
2. **Automatización con Jenkins** :

* Jenkins clona el repositorio.
* Construye la imagen Docker usando el Dockerfile.
* Ejecuta las pruebas (opcional).
* Empuja la imagen construida a DockerHub.
* Actualiza el despliegue de Kubernetes con la nueva imagen.

1. **Despliegue en Kubernetes** :

* Kubernetes actualiza el despliegue con la nueva imagen desde DockerHub.
* El servicio se expone en el puerto definido, accesible a través de NodePort.

### Resumen

Este enfoque utiliza Jenkins para automatizar el flujo de CI/CD, desde la construcción de la imagen Docker hasta el despliegue en Kubernetes. Mantener Dockerfiles y Jenkinsfiles separados para cada microservicio facilita la gestión y automatización. Al subir las imágenes a DockerHub, Kubernetes puede extraer y desplegar las imágenes más recientes, asegurando que siempre estés ejecutando la última versión de tu microservicio.

### Deployment.yaml

```
spec:
      containers:
      - name: product-service
        image: product-service:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 3001
```

Cambios sugeridos:

1. **imagePullPolicy** : Cambiar a `Always` si estás utilizando un registro Docker para asegurarte de que Kubernetes siempre obtenga la imagen más reciente.
2. **image** : Cambiar `product-service:latest` por la imagen del registro DockerHub.

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: product-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: product-service
  template:
    metadata:
      labels:
        app: product-service
    spec:
      containers:
      - name: product-service
        image: your-dockerhub-username/product-service:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 3001
---
apiVersion: v1
kind: Service
metadata:
  name: product-service
spec:
  selector:
    app: product-service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3001
  type: NodePort

```
