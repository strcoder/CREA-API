import express from 'express';
import passport from 'passport';
import Services from '../services/user';
import cacheResponse from '../utils/cacheResponse';
import validationHandler from '../utils/middleware/validationHandler';
import scopesValidationHandler from '../utils/middleware/scopesValidationHandler';
import { userIdScehma, createUserSchema, updateUserSchema } from '../utils/schemas/user';
import { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } from '../utils/time';
import '../utils/auth/strategies/jwt';

const api = (app: any, scopes: any) => {
  const { getScope, postScope, putScope, deleteScope } = scopes;
  const collection = 'user';

  const router = express.Router();
  const services = new Services(collection);

  app.use('/api/user', router);

  router.get('/',
    // passport.authenticate('jwt', { session: false }),
    // scopesValidationHandler(getScope),
    async (req, res, next) => {
      cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
      const { tags, page, limit } = req.query;
      const pageInt = page && parseInt(page as string, 10);
      const limitInt = limit && parseInt(limit as string, 10);
      try {
        const [objects, count] = await services.getUsers({ email: undefined, nickname: undefined });
        if (objects && count) {
          res.status(200).json({
            data: objects,
            size: count,
            message: `${collection}s listed`
          });
        } else {
          res.status(200).json({
            data: [],
            size: 0,
            message: `${collection}s listed`
          });
        }
      } catch (error) {
        next(error);
      }
    }
  );

  router.get('/:objectId',
    // passport.authenticate('jwt', { session: false }),
    // scopesValidationHandler(getScope),
    validationHandler({ objectId: userIdScehma }, 'params'),

    async (req, res, next) => {
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
      const { objectId } = req.params;
      try {
        const object = await services.getUser({ userId: objectId });
        res.status(200).json({
          data: object,
          message: `${collection} recived`,
        });
      } catch (error) {
        next(error);
      }
    });


  router.post('/',
    // passport.authenticate('jwt', { session: false }),
    // scopesValidationHandler(postScope),
    validationHandler(createUserSchema),

    async (req, res, next) => {
      const { body: object } = req;
      try {
        const createdId = await services.createUser({ user: object });
        res.status(201).json({
          data: createdId,
          message: `${collection} created`
        });
      } catch (error) {
        next(error);
      }
    });

  router.put('/:objectId',
    // passport.authenticate('jwt', { session: false }),
    // scopesValidationHandler(putScope),
    validationHandler({ objectId: userIdScehma }, 'params'),
    validationHandler(updateUserSchema),
    async (req, res, next) => {
      const { objectId } = req.params;
      const { body: object } = req;
      try {
        const [updatedId] = await services.updateUser({ userId: objectId, user: object });
        res.status(200).json({
          data: updatedId,
          message: `${collection} updated`,
        });
      } catch (error) {
        next(error);
      }
    });

  router.delete('/:objectId',
    // passport.authenticate('jwt', { session: false }),
    // scopesValidationHandler(deleteScope),
    validationHandler({ objectId: userIdScehma }, 'params'),
    async (req, res, next) => {
      const { objectId } = req.params;
      try {
        const deletedId = await services.deleteUser({ userId: objectId });
        res.status(200).json({
          data: deletedId,
          message: `${collection} deleted`
        });
      } catch (error) {
        next(error);
      }
    }
  );

  // router.delete('/',
  //   // passport.authenticate('jwt', { session: false }),
  //   // scopesValidationHandler(deleteScope),
  //   // validationHandler({ objectId: idSchema }, 'params'),

  //   async (req, res, next) => {
  //     const { ids } = req.body;

  //     try {
  //       // let deletedId;
  //       // Object.entries(query).length !== 0
  //       //   ? deletedId = await services.deleteItem({ objectId, query })
  //       //   : deletedId = await services.deleteOne({ objectId });
  //       const deleteCount = await services.deleteMany({ objectsIds: ids });

  //       res.status(200).json({
  //         data: deleteCount,
  //         message: `${collection}s deleted`
  //       });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  // );
}

export default api;