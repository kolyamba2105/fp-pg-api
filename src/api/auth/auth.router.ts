import AuthController from 'api/auth/auth.controller'
import { Router } from 'express'

export default Router()
  .post('/', AuthController.instance.authenticate)
