const cleanObject = function(uncleanedObject) {
  let cleanedObject = {};

  Object.keys(uncleanedObject).forEach((key) => {
    const item = uncleanedObject[key];

    if (item != null) {
      cleanedObject[key] = item;
    }
  });

  return cleanedObject;
}

const safeAccess = function(obj, ...stackItems) {
  let base = obj;

  const stackValid = stackItems.every((item) => {
    const isValid = base[item] != null;
    base = base[item];
    return isValid;
  });

  return stackValid ? base : null;
}

module.exports = {
  cleanObject,
  safeAccess
}
