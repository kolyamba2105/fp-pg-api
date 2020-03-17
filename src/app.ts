import auth from 'api/auth/auth.router'
import categories from 'api/categories/category.router'
import shoppingLists from 'api/shopping-lists/shopping-list.router'
import users from 'api/users/user.router'
import { sequelize, sync } from 'db'
import express from 'express'
import { console } from 'fp-ts'
import morgan from 'morgan'

const app = express()

sync(sequelize)().then(_ => console.log(_)())

app.use(express.json())
app.use(morgan('dev'))

app.use('/auth', auth)
app.use('/categories', categories)
app.use('/shopping-lists', shoppingLists)
app.use('/users', users)

const port = process.env.PORT || 3000

app.listen(port, console.log(`Listening on port ${port}...`))
