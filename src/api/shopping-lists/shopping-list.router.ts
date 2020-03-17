import AuthController from 'api/auth/auth.controller'
import ShoppingListController from 'api/shopping-lists/shopping-list.controller'
import { Router } from 'express'

const {
  addItemToShoppingList,
  createShoppingList,
  getShoppingList,
  getShoppingLists,
  removeShoppingList,
  removeItemFromShoppingList,
} = ShoppingListController.instance
const { verify } = AuthController.instance

export default Router()
  .get('/', verify, getShoppingLists)
  .get('/:id', verify, getShoppingList)
  .post('/', verify, createShoppingList)
  .post('/:id/items', verify, addItemToShoppingList)
  .delete('/:id', verify, removeShoppingList)
  .delete('/:id/items/:item', verify, removeItemFromShoppingList)
