'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { getUserDiplomaId } = require('../../../policies/department-access');

module.exports = createCoreController('api::diploma.diploma', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;

    if (user) {
      const userDiplomaId = await getUserDiplomaId(strapi, user);
      if (userDiplomaId) {
        const diploma = await strapi.documents('api::diploma.diploma').findOne({
          documentId: userDiplomaId,
        });
        return ctx.send({ data: diploma ? [diploma] : [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: diploma ? 1 : 0 } } });
      }
    }

    const result = await super.find(ctx);
    return result;
  },

  async findOne(ctx) {
    const user = ctx.state.user;

    if (user) {
      const userDiplomaId = await getUserDiplomaId(strapi, user);
      const { id } = ctx.params;

      if (userDiplomaId) {
        const diploma = await strapi.documents('api::diploma.diploma').findOne({
          documentId: id,
        });

        if (!diploma || diploma.documentId !== userDiplomaId) {
          return ctx.forbidden('You can only access your own diploma program');
        }
      }
    }

    const result = await super.findOne(ctx);
    return result;
  },

  async update(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Authentication required');

    const userDiplomaId = await getUserDiplomaId(strapi, user);
    const { id } = ctx.params;

    if (userDiplomaId && id !== userDiplomaId) {
      return ctx.forbidden('You can only update your own diploma program');
    }

    const result = await super.update(ctx);
    return result;
  },

  async delete(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Authentication required');

    const userDiplomaId = await getUserDiplomaId(strapi, user);
    const { id } = ctx.params;

    if (userDiplomaId && id !== userDiplomaId) {
      return ctx.forbidden('You can only delete your own diploma program');
    }

    const result = await super.delete(ctx);
    return result;
  },
}));
