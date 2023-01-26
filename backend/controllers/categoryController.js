const Category = require("../models/categoryModel");

exports.createCategory = async (req, res) => {
  try {
    const result = await Category.create({
      name: req.body.name,
      price: req.body.price,
      discount: {
        occasion: req.body.discount.occasion || "none",
        percent: req.body.discount.percent || 0,
      },
    });
    res.status(200).json({
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: false,
        useFindAndModify: false,
      }
    );
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  try {
    await category.remove();
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
