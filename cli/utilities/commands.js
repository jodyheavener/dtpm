function commaList(value) {
  return value.split(',').map(v => v.trim());
}

module.exports = {
  commaList
}
