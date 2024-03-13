# Mini_projet_Info834

# Lancer le projet

## Pour un 1er démarrage

<aside>
⚠️ **Pour un 1er démarrage** 

→ Aller dans le dossier /backend

```powershell
npm install
```

→ Aller dans le dossier /frontend

```powershell
npm install
```

</aside>

## [BDD] Démarrer le server Mongo

**MACOS** 

```java
mongosh --port 27017
```

**WINDOWS** 

→ Ajouter `mongosh` dans le path 

⚠️ Si la commande vous affiche 

```java
ECONNREFUSED
```

Voir installation sur ce lien : https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/?fbclid=IwAR1rKFzOaRiTbiFkvx0gQxdAnnGfazShZu6cIHH2cVIFS6aTG7yS_G0TFfo

Ce tuto n’est à faire qu’une fois (même après redémarrage pc) 

```java
mongosh --port 27017
```

## [BACKEND] Démarrer le server

→ se placer dans le dossier /backend

```java
nodemon server 
```

**Server :** [http://localhost:3000/](http://localhost:4200/)

## [FRONTEND] Démarrer le server

→ se placer dans le dossier /frontend

```java
ng serve
```

**Server :** http://localhost:4200/

## [REDIS] Démarrer le server

→ Ajouter `redis` dans le path 

lancer la commande:

```java
redis-server 
```

Laisser le port par défaut : 6379
