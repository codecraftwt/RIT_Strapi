const strapi = require('@strapi/strapi').createStrapi({}); 
strapi.load().then(async () => { 
  // 1. Find the role
  let role = await strapi.db.query('admin::role').findOne({ where: { code: 'strapi-dept-admin' } });
  
  if (role) {
    // 2. Delete all permissions explicitly linked to this role
    // Since strapi uses a join table, we can just use entityService or db query with relations
    const perms = await strapi.db.query('admin::permission').findMany({
      where: { role: role.id }
    });
    
    for (const p of perms) {
      await strapi.db.query('admin::permission').delete({ where: { id: p.id } });
    }
    console.log(`Deleted ${perms.length} old permissions.`);
  }

  // Now insert the new permissions
  const permissions = [
    { action: 'plugin::content-manager.explorer.read', subject: 'api::department.department', conditions: ['admin::is-dept-admin-for-dept'] },
    { action: 'plugin::content-manager.explorer.update', subject: 'api::department.department', conditions: ['admin::is-dept-admin-for-dept'] },
    { action: 'plugin::content-manager.explorer.read', subject: 'api::page.page', conditions: ['admin::is-dept-admin-for-content'] },
    { action: 'plugin::content-manager.explorer.update', subject: 'api::page.page', conditions: ['admin::is-dept-admin-for-content'] },
    { action: 'plugin::content-manager.explorer.create', subject: 'api::page.page', conditions: ['admin::is-dept-admin-for-content'] },
    { action: 'plugin::content-manager.explorer.delete', subject: 'api::page.page', conditions: ['admin::is-dept-admin-for-content'] },
    { action: 'plugin::content-type-builder.read', subject: null },
    { action: 'plugin::upload.read', subject: null },
    { action: 'plugin::upload.assets.create', subject: null },
    { action: 'plugin::upload.assets.update', subject: null },
    { action: 'plugin::upload.assets.download', subject: null },
    { action: 'plugin::upload.assets.copy-link', subject: null },
  ];

  for (const perm of permissions) {
    await strapi.db.query('admin::permission').create({
      data: {
        action: perm.action,
        subject: perm.subject,
        conditions: perm.conditions || [],
        role: role.id,
      }
    });
  }

  console.log("Seeded new permissions!");

  // Ensure users have this role
  const users = [
    'cse.hod@ritindia.edu',
    'it.hod@ritindia.edu',
    'entc.hod@ritindia.edu',
    'me.hod@ritindia.edu'
  ];

  for (const email of users) {
    const u = await strapi.db.query('admin::user').findOne({ where: { email } });
    if (u) {
      await strapi.db.query('admin::user').update({
        where: { id: u.id },
        data: { roles: [role.id] } // override with only dept admin role
      });
      console.log(`Updated roles for ${email}`);
    }
  }

  process.exit(0); 
}).catch(console.error);
