import Category, { CategoryAttributes } from 'api/categories/category.model'
import CategoryRepository from 'api/categories/category.repository'
import * as TE from 'fp-ts/lib/TaskEither'
import { CustomError } from 'utils'

interface RemoveOptions {
  id: number,
  user: number,
}

export default class CategoryService {
  private static Instance: CategoryService

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { }

  static get instance(): CategoryService {
    if (!CategoryService.Instance) {
      CategoryService.Instance = new CategoryService
    }

    return CategoryService.Instance
  }

  getCategories(user: number): TE.TaskEither<CustomError, ReadonlyArray<Category>> {
    return CategoryRepository.instance.getAll({ user })
  }

  createCategory(user: number, dto: CategoryAttributes): TE.TaskEither<CustomError, Category> {
    return CategoryRepository.instance.create({ user, ...dto })
  }

  removeCategory(removeOptions: RemoveOptions): TE.TaskEither<CustomError, number> {
    return CategoryRepository.instance.remove({ ...removeOptions })
  }
}
