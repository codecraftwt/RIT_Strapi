'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { getUserDepartmentId } = require('../../../policies/department-access');

module.exports = createCoreController('api::department.department', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;

    if (user) {
      const userDeptId = await getUserDepartmentId(strapi, user);
      if (userDeptId) {
        const dept = await strapi.documents('api::department.department').findOne({
          documentId: userDeptId,
        });
        return ctx.send({ data: dept ? [dept] : [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: dept ? 1 : 0 } } });
      }
    }

    const result = await super.find(ctx);
    return result;
  },

  async findOne(ctx) {
    const user = ctx.state.user;

    if (user) {
      const userDeptId = await getUserDepartmentId(strapi, user);
      const { id } = ctx.params;

      if (userDeptId) {
        const dept = await strapi.documents('api::department.department').findOne({
          documentId: id,
        });

        if (!dept || dept.documentId !== userDeptId) {
          return ctx.forbidden('You can only access your own department');
        }
      }
    }

    const result = await super.findOne(ctx);
    return result;
  },

  async update(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Authentication required');

    const userDeptId = await getUserDepartmentId(strapi, user);
    const { id } = ctx.params;

    if (userDeptId && id !== userDeptId) {
      return ctx.forbidden('You can only update your own department');
    }

    const result = await super.update(ctx);
    return result;
  },

  async delete(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Authentication required');

    const userDeptId = await getUserDepartmentId(strapi, user);
    const { id } = ctx.params;

    if (userDeptId && id !== userDeptId) {
      return ctx.forbidden('You can only delete your own department');
    }

    const result = await super.delete(ctx);
    return result;
  },
}));
