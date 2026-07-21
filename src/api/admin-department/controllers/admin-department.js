'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { isSuperAdmin } = require('../../../policies/department-access');

module.exports = createCoreController('api::admin-department.admin-department', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;
    if (!user || !isSuperAdmin(user)) {
      return ctx.forbidden('Only Super Admin can view department admin mappings');
    }
    return super.find(ctx);
  },

  async findOne(ctx) {
    const user = ctx.state.user;
    if (!user || !isSuperAdmin(user)) {
      return ctx.forbidden('Only Super Admin can view department admin mappings');
    }
    return super.findOne(ctx);
  },

  async create(ctx) {
    const user = ctx.state.user;
    if (!user || !isSuperAdmin(user)) {
      return ctx.forbidden('Only Super Admin can create department admin mappings');
    }
    return super.create(ctx);
  },

  async update(ctx) {
    const user = ctx.state.user;
    if (!user || !isSuperAdmin(user)) {
      return ctx.forbidden('Only Super Admin can update department admin mappings');
    }
    return super.update(ctx);
  },

  async delete(ctx) {
    const user = ctx.state.user;
    if (!user || !isSuperAdmin(user)) {
      return ctx.forbidden('Only Super Admin can delete department admin mappings');
    }
    return super.delete(ctx);
  },
}));
