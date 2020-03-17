import Item, { ItemAttributes } from 'api/shopping-lists/items/item.model'
import ItemRepository from 'api/shopping-lists/items/item.repository'
import ShoppingList, { ShoppingListAttributes } from 'api/shopping-lists/shopping-list.model'
import ShoppingListRepository from 'api/shopping-lists/shopping-list.repository'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as TE from 'fp-ts/lib/TaskEither'
import { CustomError } from 'utils'

interface GetShoppingListPayload {
  id: number,
  user: number,
}

interface AddItemPayload extends GetShoppingListPayload {
  dto: ItemAttributes,
}

interface RemoveItemPayload extends GetShoppingListPayload {
  item: number,
}

export default class ShoppingListService {
  private static Instance: ShoppingListService

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { }

  static get instance(): ShoppingListService {
    if (!ShoppingListService.Instance) {
      ShoppingListService.Instance = new ShoppingListService
    }

    return ShoppingListService.Instance
  }

  getShoppingLists(id: number): TE.TaskEither<CustomError, ReadonlyArray<ShoppingList>> {
    return ShoppingListRepository.instance.getAll({ id })
  }

  getShoppingList(options: GetShoppingListPayload): TE.TaskEither<CustomError, O.Option<ShoppingList>> {
    return ShoppingListRepository.instance.getOne({ ...options }, [{ model: Item, as: 'items' }])
  }

  createShoppingList(id: number, dto: ShoppingListAttributes): TE.TaskEither<CustomError, ShoppingList> {
    return ShoppingListRepository.instance.create({ user: id, ...dto })
  }

  addItemToShoppingList({ user, id, dto }: AddItemPayload): TE.TaskEither<CustomError, Item> {
    return pipe(
      ShoppingListRepository.instance.getOne({ user, id }),
      TE.chain(TE.fromOption(() => ({ message: 'Shopping List not found!' }))),
      TE.map((shoppingList: ShoppingList) => shoppingList.id),
      TE.map((shoppingList: number) => ({ shoppingList, ...dto })),
      TE.chain(ItemRepository.instance.create),
    )
  }

  removeShoppingList(options: GetShoppingListPayload): TE.TaskEither<CustomError, number> {
    return ShoppingListRepository.instance.remove({ ...options })
  }

  removeItemFromShoppingList({ user, id, item }: RemoveItemPayload): TE.TaskEither<CustomError, number> {
    return pipe(
      ShoppingListRepository.instance.getOne({ id, user }),
      TE.chain(TE.fromOption(() => ({ message: 'Shopping List not found!' }))),
      TE.map((shoppingList: ShoppingList) => shoppingList.id),
      TE.chain((shoppingList: number) => ItemRepository.instance.remove({ shoppingList, id: item })),
    )
  }
}
