const { DataTypes } = require("sequelize");
const crypto = require("crypto");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    google_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
    ],
  }
);

module.exports = User;
