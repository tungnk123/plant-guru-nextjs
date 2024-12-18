// next.config.js
module.exports = {
    images: {
      domains: ['www.gravatar.com', 'i.pinimg.com'], // Add the hostname here
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'i.pinimg.com',
          port: '',
          pathname: '',
          search: '',
        },
      ],},
  };
  