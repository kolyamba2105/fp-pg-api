import UserController from 'api/users/user.controller'
import { Router } from 'express'

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  removeUser,
} = UserController.instance

export default Router()
  .get('/', getUsers)
  .get('/:id', getUser)
  .post('/', createUser)
  .patch('/:id', updateUser)
  .delete('/:id', removeUser)
