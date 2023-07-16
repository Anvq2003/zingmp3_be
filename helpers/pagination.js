const paginationHelper = async (model, query, options) => {
  const { page, limit, startIndex, endIndex } = options;

  const totalItems = await model.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);

  if (startIndex !== undefined && endIndex !== undefined) {
    query = query.skip(startIndex).limit(limit);
  }

  const data = await query;

  return {
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
    data,
  };
};

module.exports = paginationHelper;
