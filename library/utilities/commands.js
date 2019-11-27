const commaList = function(value, _) {
  return value.split(',').map(v => v.trim());
}

module.exports = {
  commaList
}
