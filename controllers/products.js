const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  //any error thrown here can be handled in custom error handler (even errors with mongoose)
  //throw new Error("Testing async errors");
  const search = "ab";
  //sort by name ascending if decsending use -name, with space, you factor in more sort opt
  const products = await Product.find({}).sort("-name price");
  //   const products = await Product.find({
  //     name: { $regex: search, $options: "i" },
  //   });
  res.status(200).json({
    products,
    nbHits: products.length,
  });
};
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  //if featured is provided
  if (featured) {
    //check the value of featured which is a string
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };

    const regEx = /\b(<|>|>=|=|<=)\b/g;

    //replace match signs with mathcing operators
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );

    //the only number fields and are our only expectation
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = {
          [operator]: Number(value),
        };
      }
    });
  }

  //console.log(queryObject);
  // else work with empty object which returns everything
  let result = Product.find(queryObject);
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  if (fields) {
    const fieldList = fields.split(",").join(" ");
    result = result.select(fieldList);
    //else return all fields
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  //here we did all chaining before awaiting
  const products = await result;

  res.status(200).json({
    products,
    nbHits: products.length,
  });
};

module.exports = { getAllProductsStatic, getAllProducts };
