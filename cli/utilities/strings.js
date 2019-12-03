function parameterize(value) {
  return value.toLowerCase().replace(/ /g, '-');
}

module.exports = {
  parameterize
}
