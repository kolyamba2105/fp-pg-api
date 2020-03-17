import Item, { ItemAttributes } from 'api/shopping-lists/items/item.model'
import { Repository } from 'db'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { WhereOptions } from 'sequelize'
import { CustomError, toError } from 'utils'

export default class ItemRepository implements Repository<ItemAttributes, Item> {
  private static Instance: ItemRepository

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { }

  static get instance(): ItemRepository {
    if (!ItemRepository.Instance) {
      ItemRepository.Instance = new ItemRepository
    }

    return ItemRepository.Instance
  }

  create(dto: ItemAttributes): TE.TaskEither<CustomError, Item> {
    return TE.tryCatch(() => Item.create(dto), toError)
  }

  getAll(options?: WhereOptions): TE.TaskEither<CustomError, ReadonlyArray<Item>> {
    return TE.tryCatch(() => Item.findAll({ where: options }), toError)
  }

  getById(id: number): TE.TaskEither<CustomError, O.Option<Item>> {
    return TE.tryCatch(() => Item.findByPk(id).then(O.fromNullable), toError)
  }

  getOne(options: WhereOptions): TE.TaskEither<CustomError, O.Option<Item>> {
    return TE.tryCatch(() => Item.findOne({ where: options }).then(O.fromNullable), toError)
  }

  remove(options: WhereOptions): TE.TaskEither<CustomError, number> {
    return TE.tryCatch(() => Item.destroy({ where: options }), toError)
  }

  update(payload: Partial<Item>): (id: number) => TE.TaskEither<CustomError, [number, ReadonlyArray<Item>]> {
    return (id: number) => TE.tryCatch(() => Item.update(payload, { where: { id } }), toError)
  }
}
