module.exports = {
  build: {
    options: {
      archive: 'dist/tablet/<%= package.longname %>-<%= package.version %>.zip',
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
        //ios: 'release/<%= package.version %>/-<%= package.version %>.ipa',
        android: 'release/<%= package.version %>/<%= package.longname %>-<%= package.version %>.apk'
      }
    }
  }
};