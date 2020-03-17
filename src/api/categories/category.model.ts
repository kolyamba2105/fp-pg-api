import User from 'api/users/user.model'
import { sequelize } from 'db'
import { INTEGER, Model, STRING } from 'sequelize'

export interface CategoryAttributes {
  id: number,
  symbol: string,
  description: string,
  user: number,
}

export default class Category extends Model implements CategoryAttributes {
  id: number
  symbol: string
  description: string
  user: number
}

Category.init({
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  symbol: {
    type: STRING,
    allowNull: false,
    validate: {
      max: 20,
    },
  },
  description: {
    type: STRING,
    allowNull: false,
    validate: {
      max: 100,
    },
  },
}, { sequelize })

User.hasMany(Category, {
  foreignKey: 'user',
})

Category.belongsTo(User, {
  foreignKey: 'user',
})
