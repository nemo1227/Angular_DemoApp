'use strict';

import { readdirSync } from 'fs';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import sequelize from '../db/sequelize.js';
import { DataTypes } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = {};
const basename = path.basename(__filename);

// Read all model files
readdirSync(__dirname)
  .filter(file => {
    return (
      file !== basename &&
      file.endsWith('.js') &&
      !file.endsWith('.test.js')
    );
  })
  .forEach(async file => {
    const modelModule = await import(join(__dirname, file));
    const model = modelModule.default(sequelize, DataTypes);
    db[model.name] = model;
  });

// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export
db.sequelize = sequelize;

export default db;
//This file dynamically imports all model files in the current directory, initializes them with Sequelize, sets up any associations, 
//and exports the models along with the Sequelize instance.