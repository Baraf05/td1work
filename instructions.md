## Instructions



Pour héberger localement: 



* Mettre les fichiers de votre site dans le dossier www
* Lancer l'application docker.
* Ouvrir un terminal dans le dossier qui contient le dockercompose.
* Faire docker-compose up -d
* Vous pouvez voir le site sur http://localhost:8080
* PhpMyAdmin sur http://localhost:8081




Le -d correspond à détaché


Vous pouvez utiliser le fichier connect.php fourni avec les bonnes données. 



### Live reload


Les fichiers dans www/ sont montés dans le conteneur directement, si bien que toutes les modifications sont prises en compte immédiatement. Il n'y a pas besoin de rebuild à chaque changement de code. 



docker compose down pour arrêter. 



