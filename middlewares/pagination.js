const paginationMiddleware = (req, res, next) => {
  const { page, limit } = req.query;

  const _page = parseInt(page) || 1;
  const _limit = parseInt(limit) || 9;

  const startIndex = (_page - 1) * _limit;
  const endIndex = _page * _limit;

  req.pagination = {
    page: _page,
    limit: _limit,
    startIndex,
    endIndex,
  };

  next();
};

module.exports = paginationMiddleware;
