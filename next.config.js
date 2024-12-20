// next.config.js
module.exports = {
    images: {
      domains: [],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**', 
          port: '',
          pathname: '**', 
        },
      ],},
  };
  