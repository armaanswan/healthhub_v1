exports.getHomePage = (req, res) => {
  res.json({
    message: "Welcome to the Home Page!",
    status: "success",
    data: null,
  });
};
