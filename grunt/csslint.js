module.exports = {
  strict: {
    options: {
      import: 2
    },
    src: ['dist/<%= package.name %>.css']
  },
  lax: {
    options: {
      import: false
    },
    src: ['dist/<%= package.name %>.css']
  }
}