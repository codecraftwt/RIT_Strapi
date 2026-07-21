'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { isSuperAdmin } = require('../../../policies/department-access');

module.exports = createCoreController('api::header.header', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    if (!user || !isSuperAdmin(user)) {
      return ctx.forbidden('Only Super Admin can create header');
    }
    return super.create(ctx);
  },

  async update(ctx) {
    const user = ctx.state.user;
    if (!user || !isSuperAdmin(user)) {
      return ctx.forbidden('Only Super Admin can update header');
    }
    return super.update(ctx);
  },

  async delete(ctx) {
    const user = ctx.state.user;
    if (!user || !isSuperAdmin(user)) {
      return ctx.forbidden('Only Super Admin can delete header');
    }
    return super.delete(ctx);
  },
}));
