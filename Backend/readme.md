# Étapes pour lancer le Backend

## Dépendances du projet

### 1. Lancer un conteneur MongoDB
```sh
docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=secret -v mongodb_data:/data/db mongo:latest
```
Si vous ne pouvez pas utiliser Docker, vous devrez utiliser une autre solution pour avoir accès à une base de données MongoDB (exemple en ligne : [MongoDB Atlas](https://account.mongodb.com/)).  
Dans ce cas, vous devrez modifier la chaîne de connexion dans le fichier `/utils/connectDB.ts`.

### 2. Installer les dépendances d'Express.js
```sh
npm install
```

### 3. Mettre à jour les variables d'environnement
#### A. Renommer le fichier `.env.example` en `.env`
#### B. Compléter le contenu du fichier `.env`
```.env
# Si vous utilisez une instance locale de MongoDB
MONGO_USER="" # Utilisateur pour la base de données
MONGO_PWD="" # Mot de passe pour la base de données
MONGO_DB="" # Nom de la base de données

# Si vous utilisez MongoDB Atlas
MONGO_ID=""  # Identifiant MongoDB Atlas
MONGO_PWD="" # Mot de passe MongoDB Atlas

# Clé secrète pour les tokens JWT
JWT_KEY="" # Exemple : eugfuerygfuoerorfboueruoryreuberubpijpeiuhfzepugfoeruvebeirubvoeiruvoeuhfebfihlebpiybuyegfeirfierugfoegfierugfzuegflefcibzelrhvberliueriberlivreluxa
```

## Lancer le projet en mode développement
```sh
npm run dev
```
L'API sera ensuite accessible :  
- **Documentation Swagger** : [http://localhost:3000/api-docs](http://localhost:3000/api-docs)  
- **API en général** : [http://localhost:3000/api/](http://localhost:3000/api/)  

## Lancer les tests
Pour exécuter les tests, utilisez la commande suivante :
```sh
npm run test
```

### ⚠️ Si vous utilisez un système autre que Windows  
Il est possible que la commande ci-dessus ne fonctionne pas correctement. Dans ce cas, utilisez cette alternative :
```sh
NODE_OPTIONS='--experimental-vm-modules' npx jest --runInBand
```


---
Projet 4CITE Tours 2025 : Pierre Van Maele & Kyllian CLAVEAU
