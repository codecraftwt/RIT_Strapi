const config = {
  locales: [],
};

const register = (app) => {
  app.addRBACMiddleware((ctx) => {
    return (next) => {
      return async (permissions) => {
        const result = await next(permissions);

        const isDeptAdmin =
          ctx.user?.roles?.some(
            (r) => r.code === 'strapi-dept-admin' || r.name === 'Dept Admin (HOD)'
          );

        if (isDeptAdmin) {
          return result.filter((p) => {
            if (p.subject === 'api::admin-department.admin-department') return false;
            if (p.subject === 'api::header.header') return false;
            if (p.subject === 'api::footer.footer') return false;
            if (p.subject === 'api::main-navbar.main-navbar') return false;
            if (p.subject === 'api::nav-item.nav-item') return false;
            return true;
          });
        }

        return result;
      };
    };
  });
};

const bootstrap = (app) => {};

export default {
  config,
  register,
  bootstrap,
};
