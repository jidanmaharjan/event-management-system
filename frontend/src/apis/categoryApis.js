import axios from "axios";

export const getAllCategory = async () => {
  const options = {
    method: "GET",
    url: "/v1/category/all",
    params: {},
    headers: {},
    data: {},
  };
  const response = await axios.request(options);
  return response.data.data;
};

export const createCategory = async (categoryData) => {
  const options = {
    method: "POST",
    url: "/v1/category/new",
    params: {},
    headers: {},
    data: categoryData,
  };
  const response = await axios.request(options);
  return response.data;
};

export const updateCategory = async ({ updateData, editCategoryId }) => {
  const options = {
    method: "PUT",
    url: `/v1/category/action/${editCategoryId}`,
    params: {},
    headers: {},
    data: updateData,
  };
  const response = await axios.request(options);
  return response.data;
};

export const deleteCategory = async (categoryId) => {
  const options = {
    method: "DELETE",
    url: `/v1/category/action/${categoryId}`,
    params: {},
    headers: {},
    data: {},
  };
  const response = await axios.request(options);
  return response.data;
};
