import Category from 'api/categories/category.model'
import ShoppingList from 'api/shopping-lists/shopping-list.model'
import { sequelize } from 'db'
import { ENUM, INTEGER, Model, STRING } from 'sequelize'

enum Priority {
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
}

export interface ItemAttributes {
  id: number,
  name: string,
  comment: string,
  priority: Priority,
  category: number,
  shoppingList: number,
}

export default class Item extends Model implements ItemAttributes {
  id: number
  name: string
  comment: string
  priority: Priority
  category: number
  shoppingList: number
}

Item.init({
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      min: {
        args: [3],
        msg: 'Item name can not be shorter than 3 characters!',
      },
      max: {
        args: [30],
        msg: 'Item name can not be longer then 30 characters!',
      },
    },
  },
  comment: {
    type: STRING,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'Item comment can not be an empty string!',
      },
      // TODO something is wrong with this rule...
      max: {
        args: [50],
        msg: 'Item comment can not be longer than 50 characters!'
      }
    },
  },
  priority: {
    type: ENUM<Priority>(Priority.Low, Priority.Medium, Priority.High),
    allowNull: true,
    defaultValue: Priority.Low,
  },
}, { sequelize })

ShoppingList.hasMany(Item, {
  foreignKey: 'shoppingList',
  as: 'items',
})

Item.belongsTo(ShoppingList, {
  foreignKey: 'shoppingList',
  as: 'items',
})

Category.hasMany(Item, {
  foreignKey: 'category',
})

Item.belongsTo(Category, {
  foreignKey: 'category',
})
