import AuthController from 'api/auth/auth.controller'
import CategoryController from 'api/categories/category.controller'
import { Router } from 'express'

const {
  createCategory,
  getCategories,
  removeCategory,
} = CategoryController.instance
const { verify } = AuthController.instance

export default Router()
  .get('/', verify, getCategories)
  .post('/', verify, createCategory)
  .delete('/:id', verify, removeCategory)
