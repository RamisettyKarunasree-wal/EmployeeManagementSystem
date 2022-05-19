'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Manager extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Department, {
        foreignKey: 'manager',
        as: 'departments',
      });
    }
  }
  Manager.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      experience: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Manager',
    }
  );
  return Manager;
};
