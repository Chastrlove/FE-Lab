const { getOptions } = require("loader-utils");

module.exports = function loader(source) {
  const options = getOptions(this);

  source = source.replace(/\[name\]/g, options.name);
  this.callback(null, `export default ${JSON.stringify(source)}`);

};
