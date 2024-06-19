### Pasos para Configurar Todo

1. **Crear una Cuenta en DockerHub** :

* Ve a [DockerHub]() y regístrate para obtener una cuenta gratuita.
* Crea un nuevo repositorio en DockerHub para cada uno de tus microservicios.

1. **Configurar Credenciales en Jenkins** :

* En la configuración de Jenkins, agrega tus credenciales de DockerHub (username y password/token) como un "Secret text" o "Username and password" bajo "Manage Jenkins" > "Manage Credentials".

1. **Configuración de Kubernetes** :

* Asegúrate de que Kubernetes esté configurado para acceder al registro DockerHub. Esto se puede hacer creando un secreto en Kubernetes para tus credenciales de DockerHub y añadiéndolo a los despliegues.

### Cambios en el Dockerfile

El cambio de `WORKDIR /usr/src/app` a `WORKDIR /app` es solo un cambio de convención de nombres. Ambos son válidos, pero `/app` es más corto y generalmente suficiente para la mayoría de los proyectos. No tiene un impacto significativo en el funcionamiento del contenedor.

### Dockerfile Original

<pre><div class="dark bg-gray-950 rounded-md border-[0.5px] border-token-border-medium"><div class="flex items-center relative text-token-text-secondary bg-token-main-surface-secondary px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span>dockerfile</span><div class="flex items-center"><span class="" data-state="closed"><button class="flex gap-1 items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" fill-rule="evenodd" d="M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z" clip-rule="evenodd"></path></svg>Copy code</button></span></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="!whitespace-pre hljs language-dockerfile">FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "index.js"]
</code></div></div></pre>

### Dockerfile Simplificado

<pre><div class="dark bg-gray-950 rounded-md border-[0.5px] border-token-border-medium"><div class="flex items-center relative text-token-text-secondary bg-token-main-surface-secondary px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span>dockerfile</span><div class="flex items-center"><span class="" data-state="closed"><button class="flex gap-1 items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" fill-rule="evenodd" d="M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z" clip-rule="evenodd"></path></svg>Copy code</button></span></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="!whitespace-pre hljs language-dockerfile">FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "index.js"]
</code></div></div></pre>

### Explicación de las Instrucciones del Dockerfile

* `FROM node:14`: Utiliza la imagen base de Node.js versión 14.
* `WORKDIR /app`: Establece el directorio de trabajo dentro del contenedor en `/app`.
* `COPY package*.json ./`: Copia los archivos `package.json` y `package-lock.json` (si existen) al directorio de trabajo del contenedor.
* `RUN npm install`: Ejecuta `npm install` para instalar las dependencias definidas en `package.json`.
* `COPY . .`: Copia todos los archivos del directorio actual en tu máquina host al directorio de trabajo del contenedor.
* `EXPOSE 3001`: Expone el puerto 3001 para que el contenedor pueda recibir tráfico en ese puerto.
* `CMD ["node", "index.js"]`: Define el comando que se ejecutará al iniciar el contenedor, en este caso, ejecuta el archivo `index.js` con Node.js.

### Jenkinsfile

Tu `Jenkinsfile` se encargará de automatizar la construcción y despliegue de las imágenes Docker.

### Pasos de Configuración Adicional

1. **Configurar Credenciales de Kubernetes** :

* Si aún no lo has hecho, agrega tus credenciales de acceso a tu clúster de Kubernetes en Jenkins bajo "Manage Jenkins" > "Manage Credentials".

1. **Jenkinsfile Completo**

<pre><div class="dark bg-gray-950 rounded-md border-[0.5px] border-token-border-medium"><div class="flex items-center relative text-token-text-secondary bg-token-main-surface-secondary px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span>groovy</span><div class="flex items-center"><span class="" data-state="closed"><button class="flex gap-1 items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" fill-rule="evenodd" d="M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z" clip-rule="evenodd"></path></svg>Copy code</button></span></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="!whitespace-pre hljs language-groovy">pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials-id')
        DOCKER_IMAGE = "your-dockerhub-username/product-service"
        KUBECONFIG_CREDENTIALS = credentials('kubeconfig-credentials-id')
    }

    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/ivanignaciopm/product-service.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${env.BUILD_ID}")
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    // Aquí puedes agregar comandos para ejecutar pruebas
                    // Por ejemplo, si usas Node.js:
                    // sh 'npm install'
                    // sh 'npm test'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'DOCKERHUB_CREDENTIALS') {
                        docker.image("${DOCKER_IMAGE}:${env.BUILD_ID}").push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'KUBECONFIG_CREDENTIALS', variable: 'KUBECONFIG')]) {
                        sh '''
                        kubectl --kubeconfig=$KUBECONFIG set image deployment/product-service product-service=${DOCKER_IMAGE}:${env.BUILD_ID}
                        '''
                    }
                }
            }
        }
    }
}
</code></div></div></pre>

### Resumen

1. **Crea una cuenta en DockerHub** y configura repositorios para cada microservicio.
2. **Agrega credenciales de DockerHub** en Jenkins.
3. **Configura tus Dockerfiles** como se explicó.
4. **Configura tu Jenkinsfile** para automatizar el pipeline de CI/CD.
5. **Despliega tus microservicios en Kubernetes** usando los despliegues YAML y actualiza las imágenes con Jenkins.

Este enfoque mejora la automatización y la profesionalización del despliegue de tus microservicios, alineándolos con las prácticas estándar de la industria.
