## Getting Started
```
git clone https://github.com/serpient/practice_GraphQL_API.git
cd practice_GraphQL_API
npm start
```

## Possible Issues 
#### Port is already used
Go to task manager, and stop any postgres stuff running then run the command again

#### Fatal: role 'postgres' does not exist
`createuser postgres`

## Server
```
Generates New Postgres Database
initdb /usr/local/var/postgres

Starts Postgres Server
pg_ctl -D /usr/local/var/postgres start

Stops Postgres Server
pg_ctl -D /usr/local/var/postgres stop
```
