import ShoppingList, { ShoppingListAttributes } from 'api/shopping-lists/shopping-list.model'
import { Repository } from 'db/repository'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { Includeable, WhereOptions } from 'sequelize'
import { CustomError, toError } from 'utils'

export default class ShoppingListRepository implements Repository<ShoppingListAttributes, ShoppingList> {
  private static Instance: ShoppingListRepository

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { }

  static get instance(): ShoppingListRepository {
    if (!ShoppingListRepository.Instance) {
      ShoppingListRepository.Instance = new ShoppingListRepository
    }

    return ShoppingListRepository.Instance
  }

  create(dto: ShoppingListAttributes): TE.TaskEither<CustomError, ShoppingList> {
    return TE.tryCatch(() => ShoppingList.create(dto), toError)
  }

  getAll(options: WhereOptions, include?: Array<Includeable>): TE.TaskEither<CustomError, ReadonlyArray<ShoppingList>> {
    return TE.tryCatch(() => ShoppingList.findAll({ where: options, include }), toError)
  }

  getById(id: number): TE.TaskEither<CustomError, O.Option<ShoppingList>> {
    return TE.tryCatch(() => ShoppingList.findByPk(id).then(O.fromNullable), toError)
  }

  getOne(options: WhereOptions, include?: Array<Includeable>): TE.TaskEither<CustomError, O.Option<ShoppingList>> {
    return TE.tryCatch(() => ShoppingList.findOne({ where: options, include }).then(O.fromNullable), toError)
  }

  remove(options: WhereOptions): TE.TaskEither<CustomError, number> {
    return TE.tryCatch(() => ShoppingList.destroy({ where: options }), toError)
  }

  update(payload: Partial<ShoppingList>): (id: number) => TE.TaskEither<CustomError, [number, ReadonlyArray<ShoppingList>]> {
    return (id: number) => TE.tryCatch(() => ShoppingList.update(payload, { where: { id }, returning: true }), toError)
  }
}
