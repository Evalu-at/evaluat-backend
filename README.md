# Evalu.at Backend API

This API was designed to facilitate student feedback on professors. This API enables students to evaluate professors based on predefined criterias by MEC (Minitério da Eduacação Brasileira), fostering transparency, accountability, 
and continuous improvement within the academic community. In resume, the API contributes to the enhancement of teaching quality and student satisfaction.

The API is used by the frontend of the Evalu.at application, where further information about its interface can be accessed [here](https://github.com/Evalu-at/evaluat-frontend)
<br><br>

## Development Technologies
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

The API was developed in <code>javascript</code> using the <code>node.js</code> framework, and for the database we used <code>postgresSQL</code>. To enhance the comprehension of every API endpoint, it was fully documented 
using the <code>swagger</code> framework, it can be accessed by the API route <code>/docs</code> or reading the <br> <code>"swagger-output.json"</code> file.
<br><br>

## Pre-requisites
1. Clone or fork this repository
2. Have <code>node.js</code> installed
3. Have Docker Desktop
4. Use the <code>postgres</code> database using a docker
5. Have the right <code>Pool</code> class credentials to access the docker
<br><br>

## Configure the Docker Container
1. Install the Docker Desktop and open it
2. Go to the searchbar (top of the app) and search for "postgres"
3. Click on "pull"
4. Go to images, click on run and then open the opitional settings
5. Give the container a name (example: evaluat)
6. Set the Hostport to "5432"
7. In the Environment variables set like this:

| Variable   | Value |
| ---------- | ------------- |
| POSTGRES_USER  | evaluat-adm  |
| POSTGRES_PASSWORD | <code>check at src\database\index.js</code>|

8. Click on run
9. Go to containers and start the evaluat container
10. Now you are ready to run the project
<br>

## Run the API
Install the project dependencies
```
npm i
```
Run the project while modifing it
```
npm run dev
```
Run the project whithout modifing it
```
npm start
```
<br>


## ⚠️ Commom Errors 
```
Error: Cannot find module 'express'
```
**Solution:** uninstall the <code>"node_modules"</code> directory and install it again by running the <code>npm i</code> command in terminal

----

```
error: password authentication failed for user "<nameuser>"
```
**Solution 1:** If you dont have access to this repository you need to change this database to your personal one<br>
**Solution 2:** Check the <code>pool</code> credentials and see if matches with the postgres docker that you configured before

----

```
error: autentica��o do tipo senha falhou para o usu�rio "evaluat-adm"
```
**Solution:** Stop the PostgresSQL services on your windows (you can see it in the task manager <code>crtl + shift + esc</code><br>
<br>

## Licences
_none at the moment_
