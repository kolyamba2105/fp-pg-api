import Category, { CategoryAttributes } from 'api/categories/category.model'
import { Repository } from 'db'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { WhereOptions } from 'sequelize'
import { CustomError, toError } from 'utils'

export default class CategoryRepository implements Repository<CategoryAttributes, Category> {
  private static Instance: CategoryRepository

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { }

  static get instance(): CategoryRepository {
    if (!CategoryRepository.Instance) {
      CategoryRepository.Instance = new CategoryRepository
    }

    return CategoryRepository.Instance
  }

  create(dto: CategoryAttributes): TE.TaskEither<CustomError, Category> {
    return TE.tryCatch(() => Category.create(dto), toError)
  }

  getAll(options?: WhereOptions): TE.TaskEither<CustomError, ReadonlyArray<Category>> {
    return TE.tryCatch(() => Category.findAll({ where: options }), toError)
  }

  getById(id: number): TE.TaskEither<CustomError, O.Option<Category>> {
    return TE.tryCatch(() => Category.findByPk(id).then(O.fromNullable), toError)
  }

  getOne(options: WhereOptions): TE.TaskEither<CustomError, O.Option<Category>> {
    return TE.tryCatch(() => Category.findOne({ where: options }).then(O.fromNullable), toError)
  }

  remove(options: WhereOptions): TE.TaskEither<CustomError, number> {
    return TE.tryCatch(() => Category.destroy({ where: options }), toError)
  }

  update(payload: Partial<Category>): (id: number) => TE.TaskEither<CustomError, [number, ReadonlyArray<Category>]> {
    return (id: number) => TE.tryCatch(() => Category.update(payload, { where: { id }, returning: true }), toError)
  }
}
