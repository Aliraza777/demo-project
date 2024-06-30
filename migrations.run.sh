npm run build
node --require ts-node/register ./node_modules/typeorm/cli.js migration:run -d dist/ormconfig.js