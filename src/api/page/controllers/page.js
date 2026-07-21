'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { getUserDepartmentId } = require('../../../policies/department-access');

module.exports = createCoreController('api::page.page', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;

    if (user) {
      const userDeptDocumentId = await getUserDepartmentId(strapi, user);

      if (userDeptDocumentId) {
        const department = await strapi.documents('api::department.department').findOne({
          documentId: userDeptDocumentId,
        });

        if (!department) {
          return ctx.send({ data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } } });
        }

        const pages = await strapi.db.query('api::page.page').findMany({
          where: { department: department.id },
          populate: ['department'],
          limit: ctx.query?.pagination?.pageSize || 25,
          offset: (ctx.query?.pagination?.page - 1) * (ctx.query?.pagination?.pageSize || 25) || 0,
        });

        const total = await strapi.db.query('api::page.page').count({
          where: { department: department.id },
        });

        const pageSize = ctx.query?.pagination?.pageSize || 25;
        const page = ctx.query?.pagination?.page || 1;

        return ctx.send({
          data: pages,
          meta: {
            pagination: {
              page,
              pageSize,
              pageCount: Math.ceil(total / pageSize),
              total,
            },
          },
        });
      }
    }

    const result = await super.find(ctx);
    return result;
  },

  async findOne(ctx) {
    const user = ctx.state.user;

    if (user) {
      const userDeptDocumentId = await getUserDepartmentId(strapi, user);

      if (userDeptDocumentId) {
        const { id } = ctx.params;
        const page = await strapi.documents('api::page.page').findOne({
          documentId: id,
          populate: ['department'],
        });

        if (!page || !page.department || page.department.documentId !== userDeptDocumentId) {
          return ctx.forbidden('You can only access pages from your department');
        }
      }
    }

    const result = await super.findOne(ctx);
    return result;
  },

  async create(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Authentication required');

    const userDeptDocumentId = await getUserDepartmentId(strapi, user);

    if (userDeptDocumentId && ctx.request.body?.data) {
      ctx.request.body.data.department = userDeptDocumentId;
    }

    const result = await super.create(ctx);
    return result;
  },

  async update(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Authentication required');

    const userDeptDocumentId = await getUserDepartmentId(strapi, user);
    const { id } = ctx.params;

    if (userDeptDocumentId) {
      const page = await strapi.documents('api::page.page').findOne({
        documentId: id,
        populate: ['department'],
      });

      if (!page || !page.department || page.department.documentId !== userDeptDocumentId) {
        return ctx.forbidden('You can only update pages from your department');
      }
    }

    const result = await super.update(ctx);
    return result;
  },

  async delete(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Authentication required');

    const userDeptDocumentId = await getUserDepartmentId(strapi, user);
    const { id } = ctx.params;

    if (userDeptDocumentId) {
      const page = await strapi.documents('api::page.page').findOne({
        documentId: id,
        populate: ['department'],
      });

      if (!page || !page.department || page.department.documentId !== userDeptDocumentId) {
        return ctx.forbidden('You can only delete pages from your department');
      }
    }

    const result = await super.delete(ctx);
    return result;
  },
}));
