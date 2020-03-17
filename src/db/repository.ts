import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { Model, WhereOptions, Includeable } from 'sequelize'
import { CustomError } from 'utils'

export interface Repository<A extends object, T extends Model & A> {
  getAll(options?: WhereOptions, include?: Array<Includeable>): TE.TaskEither<CustomError, ReadonlyArray<T>>,

  getById(id: number, include?: Array<Includeable>): TE.TaskEither<CustomError, O.Option<T>>,

  getOne(options: WhereOptions, include?: Array<Includeable>): TE.TaskEither<CustomError, O.Option<T>>,

  create(dto: A): TE.TaskEither<CustomError, T>,

  update(payload: Partial<T>): (id: number) => TE.TaskEither<CustomError, [number, ReadonlyArray<T>]>,

  remove(options: WhereOptions): TE.TaskEither<CustomError, number>,
}
