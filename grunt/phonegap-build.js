module.exports = {
  build: {
    options: {
      archive: 'dist/tablet/<%= package.name %>-<%= package.version %>.zip',
      appId: '1479575',
      user: {
        email: 'thesquidpeople@gmail.com',
        password: 'WWW3Badobe'
      },
      /*
      keys: {
        ios: {
          password: 'secret'
        }
      },
      */
      download: {
        //ios: 'target/<%= package.name %>-<%= package.version %>.ipa',
        android: 'release/<%= package.name %>-<%= package.version %>.apk'
      }
    }
  }
};