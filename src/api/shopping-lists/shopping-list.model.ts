import User from 'api/users/user.model'
import { sequelize } from 'db'
import { DataTypes, Model, STRING } from 'sequelize'

export interface ShoppingListAttributes {
  id: number,
  name: string,
  description: string,
  user: number,
}

export default class ShoppingList extends Model implements ShoppingListAttributes {
  description: string
  id: number
  name: string
  user: number
}

ShoppingList.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      max: 25,
    }
  },
  description: {
    type: STRING,
    allowNull: true,
    validate: {
      max: 100,
    },
  },
}, { sequelize })

User.hasMany(ShoppingList, {
  foreignKey: 'user',
})

ShoppingList.belongsTo(User, {
  foreignKey: 'user',
})
