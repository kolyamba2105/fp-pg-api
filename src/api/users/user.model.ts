import UserService from 'api/users/user.service'
import { sequelize } from 'db'
import { pipe } from 'fp-ts/lib/pipeable'
import * as T from 'fp-ts/lib/Task'
import { DataTypes, Model, STRING } from 'sequelize'

export interface UserAttributes {
  id: number,
  name: string,
  email: string,
  password: string,
}

export default class User extends Model implements UserAttributes {
  id: number
  name: string
  email: string
  password: string
}

User.init({
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
      isAlpha: {
        msg: 'Name must contain only letters!',
      },
      notEmpty: {
        msg: 'Name cannot be an empty string!',
      },
    },
  },
  email: {
    type: STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'E-mail is not valid!',
      },
    },
  },
  password: {
    type: STRING,
    allowNull: false,
  },
}, {
  sequelize,
  hooks: {
    beforeCreate(user: User): Promise<void> | void {
      const assignPassword = (hashedPassword: string): void => {
        user.password = hashedPassword
      }

      return pipe(UserService.instance.hashPassword(user.password), T.map(assignPassword))()
    }
  }
})
