const useAgent = (req, res, next) => {
  const userAgent = req.headers["user-agent"];
  console.log("User-Agent:", userAgent);
  next();
};

module.exports = useAgent;
