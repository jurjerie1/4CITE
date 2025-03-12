# Etape pour lancer le Backend

## Les dépendances du projet
### 1. Lancer un container MogoDB
```sh
docker run -d   --name mongodb  -p 27017:27017  -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=secret   -v mongodb_data:/data/db mongo:latest
```
Si vous ne pouvez pas utiliser docker, il vous faudra utiliser une autre solution pour avoir accès a une base de donnée MogoDB (en ligne : https://account.mongodb.com/).
Dans ce cas vous devrier changer la chainne de connexion dans le fichier /utils/connectDB.ts

### 2. Installer les dépendence d'expressjs
```sh
npm install
```

### 3. Mettre à jour les varivales d'environement
#### A.
renomer le fichier /.env.example en .env
```.env
MONGO_USER="" # User pour la base de données
MONGO_PWD="" # Mot de passe pour la base de données
MONGO_DB="" # Nom de la base de données
JWT_KEY="" # Clé secrète pour les tokens JWT ex : eugfuerygfuoerorfboueruoryreuberubpijpeiuhfzepugfoeruvebeirubvoeiruvoeuhfebfihlebpiybuyegfeirfierugfoegfierugfzuegflefcibzelrhvberliueriberlivreluxa

```


## Lancer le projet en mode DEV
```sh
npm run dev
```
L'api serra par la suite accèsible :
- la documentation swagger : http://localhost:3000/api-docs.
- L'api en général : http://localhost:3000/api/.

