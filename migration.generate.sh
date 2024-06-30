echo "Enter Migration Name" && read migration_name
npm run build
node --require ts-node/register ./node_modules/typeorm/cli.js migration:run -d dist/ormconfig.js
node --require ts-node/register ./node_modules/typeorm/cli.js migration:generate src/migrations/$migration_name -d dist/ormconfig.js