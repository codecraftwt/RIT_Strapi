'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { isSuperAdmin } = require('../../../policies/department-access');

module.exports = createCoreController('api::admin-diploma.admin-diploma', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;
    if (!user || !isSuperAdmin(user)) {
      return ctx.forbidden('Only Super Admin can view diploma admin mappings');
    }
    return super.find(ctx);
  },

  async findOne(ctx) {
    const user = ctx.state.user;
    if (!user || !isSuperAdmin(user)) {
      return ctx.forbidden('Only Super Admin can view diploma admin mappings');
    }
    return super.findOne(ctx);
  },

  async create(ctx) {
    const user = ctx.state.user;
    if (!user || !isSuperAdmin(user)) {
      return ctx.forbidden('Only Super Admin can create diploma admin mappings');
    }
    return super.create(ctx);
  },

  async update(ctx) {
    const user = ctx.state.user;
    if (!user || !isSuperAdmin(user)) {
      return ctx.forbidden('Only Super Admin can update diploma admin mappings');
    }
    return super.update(ctx);
  },

  async delete(ctx) {
    const user = ctx.state.user;
    if (!user || !isSuperAdmin(user)) {
      return ctx.forbidden('Only Super Admin can delete diploma admin mappings');
    }
    return super.delete(ctx);
  },
}));
