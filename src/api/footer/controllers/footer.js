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

  async incrementCounter(ctx) {
    try {
      // Find the footer entity (it's a single type)
      const footer = await strapi.entityService.findMany('api::footer.footer');
      
      if (!footer) {
        return ctx.notFound('Footer not found');
      }

      // Read current count, default to "10533074" if null or empty
      const currentCountStr = footer.websiteCounter || '10533074';
      const currentCount = parseInt(currentCountStr, 10) || 10533074;
      const newCount = currentCount + 1;

      // Update the footer entity
      const updatedFooter = await strapi.entityService.update('api::footer.footer', footer.id, {
        data: {
          websiteCounter: newCount.toString(),
        },
      });

      return { websiteCounter: updatedFooter.websiteCounter };
    } catch (err) {
      ctx.throw(500, err);
    }
  },
}));
