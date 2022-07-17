module.exports.idService = async (idName) => {
  const id = await idName.replace(/\s+/g, "");
  return id;
};
