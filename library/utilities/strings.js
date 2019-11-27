const parameterize = function(value) {
  return value.toLowerCase().replace(/ /g, '-');
}

module.exports = {
  parameterize
}
