const { DataTypes } = require("sequelize");
const crypto = require("crypto");
const sequelize = require("../config/db");

const UserAccess = sequelize.define(
  "UserAccess",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    accessKey: {
      type: DataTypes.STRING(96),
      allowNull: false,
      unique: true,
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
  },
  {
    tableName: "user_access",
    timestamps: true,
    hooks: {
      beforeValidate: (row) => {
        if (!row.accessKey) {
          row.accessKey = crypto.randomBytes(32).toString("hex");
        }
      },
    },
    indexes: [
      { unique: true, fields: ["user_id"] },
      { unique: true, fields: ["accessKey"] },
    ],
  }
);

module.exports = UserAccess;
