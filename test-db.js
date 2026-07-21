const strapi = require('@strapi/strapi').createStrapi({}); 
strapi.load().then(async () => { 
  const user = await strapi.db.query('admin::user').findOne({ 
    where: { email: 'cse.hod@ritindia.edu' }, 
    populate: ['roles', 'roles.permissions'] 
  }); 
  console.log(JSON.stringify(user.roles, null, 2)); 
  
  const conditions = strapi.admin.services.permission.conditionProvider.getAll();
  console.log("Conditions:", conditions.map(c => c.name));

  process.exit(0); 
}).catch(console.error);
