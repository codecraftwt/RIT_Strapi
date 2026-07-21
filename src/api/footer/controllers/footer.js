'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { isSuperAdmin } = require('../../../policies/department-access');

module.exports = createCoreController('api::footer.footer', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    if (!user || !isSuperAdmin(user)) {
      return ctx.forbidden('Only Super Admin can create footer');
    }
    return super.create(ctx);
  },

  async update(ctx) {
    const user = ctx.state.user;
    if (!user || !isSuperAdmin(user)) {
      return ctx.forbidden('Only Super Admin can update footer');
    }
    return super.update(ctx);
  },

  async delete(ctx) {
    const user = ctx.state.user;
    if (!user || !isSuperAdmin(user)) {
      return ctx.forbidden('Only Super Admin can delete footer');
    }
    return super.delete(ctx);
  },
}));
