'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/footer/increment-counter',
      handler: 'footer.incrementCounter',
      config: {
        auth: false,
      },
    },
  ],
};
