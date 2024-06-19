### ¿Es necesario el Dockerfile?

No es estrictamente necesario tener un `Dockerfile` en tu subcarpeta `jenkins` si tu archivo `deployment.yaml` ya especifica la imagen de Jenkins (`jenkins/jenkins:lts`). El `Dockerfile` es útil si deseas personalizar la imagen de Jenkins, pero en tu caso, puedes desplegar directamente usando la línea de imagen en el `deployment.yaml`.

### ¿Para qué es el puerto 50000?

El puerto 50000 se usa para la comunicación entre el Jenkins master y sus agentes (o "slaves"). Si no planeas usar agentes de Jenkins en tu configuración, puedes omitir este puerto.


### ¿Es necesario el Dockerfile?

No es estrictamente necesario tener un `Dockerfile` en tu subcarpeta `jenkins` si tu archivo `deployment.yaml` ya especifica la imagen de Jenkins (`jenkins/jenkins:lts`). El `Dockerfile` es útil si deseas personalizar la imagen de Jenkins, pero en tu caso, puedes desplegar directamente usando la línea de imagen en el `deployment.yaml`.


### Servicio (Service)

Un `Service` en Kubernetes expone una aplicación que se ejecuta en un conjunto de Pods. En tu caso, expone Jenkins.

**Definición del Service:**

<pre><div class="dark bg-gray-950 rounded-md border-[0.5px] border-token-border-medium"><div class="flex items-center relative text-token-text-secondary bg-token-main-surface-secondary px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span>yaml</span><div class="flex items-center"><span class="" data-state="closed"><button class="flex gap-1 items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" fill-rule="evenodd" d="M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z" clip-rule="evenodd"></path></svg>Copy code</button></span></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="!whitespace-pre hljs language-yaml">apiVersion: v1
kind: Service
metadata:
  name: jenkins
spec:
  selector:
    app: jenkins
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: NodePort
</code></div></div></pre>

* **Selector** : Indica qué Pods gestionará el `Service`, en este caso, aquellos con la etiqueta `app: jenkins`.
* **Ports** : Mapea el puerto 80 del `Service` al puerto 8080 del contenedor Jenkins.
* **Type: NodePort** : Hace que el `Service` esté accesible desde fuera del clúster de Kubernetes mediante un puerto en cada nodo del clúster.

**¿Por qué NodePort?**
Usar `NodePort` es una forma simple de hacer accesible tu aplicación desde fuera del clúster. Sin embargo, no es la opción más segura ni escalable para producción. Alternativas más robustas incluyen `LoadBalancer` (si tu proveedor de cloud lo soporta) o usando un `Ingress`.


### Creación y Enlace de PV y PVC

#### Creación del PV

El PV debe ser creado previamente y es independiente del Deployment. Este PV define el almacenamiento persistente en tu máquina.

**Ejemplo de `jenkins-pv.yaml`:**

<pre><div class="dark bg-gray-950 rounded-md border-[0.5px] border-token-border-medium"><div class="flex items-center relative text-token-text-secondary bg-token-main-surface-secondary px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span>yaml</span><div class="flex items-center"><span class="" data-state="closed"><button class="flex gap-1 items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" fill-rule="evenodd" d="M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z" clip-rule="evenodd"></path></svg>Copy code</button></span></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="!whitespace-pre hljs language-yaml">apiVersion: v1
kind: PersistentVolume
metadata:
  name: jenkins-pv
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /mnt/data/jenkins-pv
</code></div></div></pre>

Este manifiesto crea un PV que usa la ruta `/mnt/data/jenkins-pv` en tu máquina Linux.


### Relación con tu Máquina Linux

#### Ruta del Almacenamiento en tu Máquina

Cuando defines `hostPath: /mnt/data/jenkins-pv` en tu PV, los datos persistentes de Jenkins se almacenarán en esa ruta específica de tu máquina Linux. La estructura de carpetas sería algo así:

<pre><div class="dark bg-gray-950 rounded-md border-[0.5px] border-token-border-medium"><div class="flex items-center relative text-token-text-secondary bg-token-main-surface-secondary px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span>bash</span><div class="flex items-center"><span class="" data-state="closed"><button class="flex gap-1 items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" fill-rule="evenodd" d="M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z" clip-rule="evenodd"></path></svg>Copy code</button></span></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="!whitespace-pre hljs language-bash">/mnt/data/jenkins-pv/
</code></div></div></pre>

Dentro de esta ruta, Jenkins almacenará todos sus datos persistentes. En tu contenedor, estos datos estarán accesibles en `/var/jenkins_home` gracias a la configuración de `volumeMounts`.



### Verificación

Asegúrate de aplicar los manifiestos en el orden correcto:

1. `jenkins-pv.yaml`
2. `jenkins-pvc.yaml`
3. `deployment.yaml`

De esta manera, el PVC podrá enlazarse correctamente con el PV existente, y el Deployment usará el PVC para el almacenamiento persistente.

```
kubectl apply -f jenkins-pv.yaml
kubectl apply -f jenkins-pvc.yaml
kubectl apply -f deployment.yaml
```
