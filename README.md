## Installation

1. Install npm dependencies
```bash
$ npm install
```

2. Create postgres db. For example in docker. 
```
docker run -d \
   --name some-postgres \
   -e POSTGRES_PASSWORD=mysecretpassword \
   -e PGDATA=/var/lib/postgresql/data/pgdata \
   -v /custom/mount:/var/lib/postgresql/data \
   postgres
```
3. Run script in ```'./src/database.sql'``` in your db to create all tables.
4. Write db credentials in ```'.env'``` file. 
5. Run app

```bash
# development
$ npm run start

$ npm run start:dev

$ npm run start:prod
```
