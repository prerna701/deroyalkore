import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validate } from '../middlewares/validate';
import {
  createUserSchema,
  getUserSchema,
  listUsersSchema,
  updateUserSchema,
} from '../validations/user.validation';

/**
 * ROUTES LAYER
 * ------------
 * Wires an HTTP method + path to: validation middleware -> controller.
 * This file should stay declarative - no logic here, just wiring.
 *
 * FOLLOW THIS PATTERN for every new resource/module you add
 * (e.g. product.routes.ts, order.routes.ts...).
 */
const router = Router();

router.get('/', validate(listUsersSchema), userController.getAllUsers);
router.get('/:id', validate(getUserSchema), userController.getUserById);
router.post('/', validate(createUserSchema), userController.createUser);
router.patch('/:id', validate(updateUserSchema), userController.updateUser);
router.delete('/:id', validate(getUserSchema), userController.deleteUser);

export default router;
