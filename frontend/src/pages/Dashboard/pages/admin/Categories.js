import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { showNotification } from "@mantine/notifications";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../../../../apis/categoryApis";

import { Button, Modal, NumberInput, TextInput } from "@mantine/core";

import { useForm } from "@mantine/form";

const Categories = () => {
  const queryClient = useQueryClient();
  const [createCategoryIsOpen, setCreateCategoryIsOpen] = useState(false);
  const [editCategoryIsOpen, setEditCategoryIsOpen] = useState(false);
  const [confirmDeleteIsOpen, setConfirmDeleteIsOpen] = useState(false);

  const [editCategoryId, setEditCategoryId] = useState(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  //category query
  const {
    isLoading: isCategoryLoading,
    data: category,
    isError: isCategoryError,
    error: categoryError,
    isFetching: isCategoryFetching,
    refetch: refetchCategory,
  } = useQuery(
    "category",

    () => getAllCategory(),
    {
      enabled: true,
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (category) => categorySuccess(category),
      onError: (categoryError) => categoryErrorHandler(categoryError),
    }
  );

  //Category Handlers
  function categorySuccess(category) {}
  function categoryErrorHandler(categoryError) {
    queryClient.invalidateQueries("profile");
  }
  //category create query
  const {
    isLoading: isCreateCategoryLoading,
    data: createcategory,
    isError: isCreateCategoryError,
    error: createCategoryError,
    isFetching: isCreateCategoryFetching,
    refetch: refetchCreateCategory,
  } = useQuery(
    "createCategory",

    () =>
      createCategory({
        name: createCategoryForm.values.name,
        price: createCategoryForm.values.price,
        discount: {
          occasion: createCategoryForm.values.occasion || null,
          percent: createCategoryForm.values.discountPercent || null,
        },
      }),
    {
      enabled: false,
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (createcategory) => createcategorySuccess(createcategory),
      onError: (createcategoryError) =>
        createcategoryErrorHandler(createcategoryError),
    }
  );

  //createCategory Handlers
  function createcategorySuccess(createcategory) {
    showNotification({
      title: "Category Created",
      message: createcategory.message,
      color: "green",
    });
    createCategoryForm.reset();
    setCreateCategoryIsOpen(false);
    refetchCategory();
  }
  function createcategoryErrorHandler(createcategoryError) {
    showNotification({
      title: "createCategory Error",
      message: createcategoryError.response.data.message,
      color: "red",
    });
  }

  //category update query
  const {
    isLoading: isupdateCategoryLoading,
    data: updatecategory,
    isError: isupdateCategoryError,
    error: updatecategoryError,
    isFetching: isupdateCategoryFetching,
    refetch: refetchupdateCategory,
  } = useQuery(
    "updatecategory",

    () =>
      updateCategory({
        updateData: {
          name: updateCategoryForm.values.name,
          price: updateCategoryForm.values.price,
          discount: {
            occasion: updateCategoryForm.values.occasion || null,
            percent: updateCategoryForm.values.discountPercent || null,
          },
        },
        editCategoryId,
      }),
    {
      enabled: false,
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (updatecategory) => updatecategorySuccess(updatecategory),
      onError: (updatecategoryError) =>
        updatecategoryErrorHandler(updatecategoryError),
    }
  );

  //updateCategory Handlers
  function updatecategorySuccess(updatecategory) {
    showNotification({
      title: "Category Updated",
      message: updatecategory.message,
      color: "green",
    });
    setEditCategoryIsOpen(false);
    refetchCategory();
  }
  function updatecategoryErrorHandler(updatecategoryError) {
    showNotification({
      title: "updateCategory Error",
      message: updatecategoryError.response.data.message,
      color: "red",
    });
  }

  //category delete query
  const {
    isLoading: isdeleteCategoryLoading,
    data: deletecategory,
    isError: isdeleteCategoryError,
    error: deletecategoryError,
    isFetching: isdeleteCategoryFetching,
    refetch: refetchdeleteCategory,
  } = useQuery(
    ["deletecategory", deleteCategoryId],

    () => deleteCategory(deleteCategoryId),
    {
      enabled: false,
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (deletecategory) => deletecategorySuccess(deletecategory),
      onError: (deletecategoryError) =>
        deletecategoryErrorHandler(deletecategoryError),
    }
  );

  //deleteCategory Handlers
  function deletecategorySuccess(deletecategory) {
    showNotification({
      title: "Category Deleted",
      message: deletecategory.message,
      color: "green",
    });
    setConfirmDeleteIsOpen(false);
    setDeleteCategoryId(null);
    refetchCategory();
  }
  function deletecategoryErrorHandler(deletecategoryError) {
    showNotification({
      title: "Delete Category Error",
      message: deletecategoryError.response.data.message,
      color: "red",
    });
    setConfirmDeleteIsOpen(false);
    refetchCategory();
  }

  const createCategoryForm = useForm({
    initialValues: {
      name: "",
      occasion: "",
      discountPercent: 0,
      price: 0,
    },

    // functions will be used to validate values at corresponding key
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,

      price: (value) => (value < 10 ? "Must put price" : null),
    },
  });

  const updateCategoryForm = useForm({
    initialValues: {
      name: "",
      occasion: "",
      discountPercent: null,
      price: null,
    },

    // functions will be used to validate values at corresponding key
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,

      price: (value) => (value < 1 ? "Must put price" : null),
    },
  });

  return (
    <div className="p-4 text-white font-poppins">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-xl">Categories</h3>
        <button
          onClick={() => setCreateCategoryIsOpen(true)}
          className="p-2 bg-green-400 rounded-sm font-semibold"
        >
          Create
        </button>
      </div>
      <Modal
        opened={createCategoryIsOpen}
        onClose={() => setCreateCategoryIsOpen(false)}
        withCloseButton={false}
        centered
        className=""
      >
        <div className="">
          <h3 className="font-semibold text-xl">Create a new Category</h3>
          <form
            disabled={isCreateCategoryFetching}
            onSubmit={createCategoryForm.onSubmit(() =>
              refetchCreateCategory()
            )}
          >
            <TextInput
              label="Category Name"
              placeholder="Category Name"
              {...createCategoryForm.getInputProps("name")}
            />
            <NumberInput
              mt="sm"
              label="Price"
              placeholder="Price"
              {...createCategoryForm.getInputProps("price")}
            />
            <h3 className="mt-4 font-semibold">Discount</h3>
            <TextInput
              mt="sm"
              label="Occasion"
              placeholder="Occasion"
              {...createCategoryForm.getInputProps("occasion")}
            />
            <NumberInput
              mt="sm"
              label="Percentage"
              placeholder="Percentage"
              {...createCategoryForm.getInputProps("discountPercent")}
            />
            <Button
              disabled={isCreateCategoryFetching}
              className="bg-green-500 hover:bg-green-400 w-full"
              type="submit"
              mt="sm"
            >
              Create
            </Button>
          </form>
        </div>
      </Modal>
      <Modal
        opened={editCategoryIsOpen}
        onClose={() => setEditCategoryIsOpen(false)}
        withCloseButton={false}
        centered
        className=""
      >
        <div className="">
          <h3 className="font-semibold text-xl">Update Category</h3>
          <form
            disabled={isupdateCategoryFetching}
            onSubmit={updateCategoryForm.onSubmit(() =>
              refetchupdateCategory()
            )}
          >
            <TextInput
              label="Category Name"
              placeholder="Category Name"
              {...updateCategoryForm.getInputProps("name")}
            />
            <NumberInput
              mt="sm"
              label="Price"
              placeholder="Price"
              {...updateCategoryForm.getInputProps("price")}
            />
            <h3 className="mt-4 font-semibold">Discount</h3>
            <TextInput
              mt="sm"
              label="Occasion"
              placeholder="Occasion"
              {...updateCategoryForm.getInputProps("occasion")}
            />
            <NumberInput
              mt="sm"
              label="Percentage"
              placeholder="Percentage"
              {...updateCategoryForm.getInputProps("discountPercent")}
            />
            <Button
              disabled={isupdateCategoryFetching}
              className="bg-green-500 hover:bg-green-400 w-full"
              type="submit"
              mt="sm"
            >
              Update
            </Button>
          </form>
        </div>
      </Modal>

      <Modal
        opened={confirmDeleteIsOpen}
        onClose={() => setConfirmDeleteIsOpen(false)}
        title="Are you sure to delete?"
        centered
      >
        <div>
          <div
            onClick={() => refetchdeleteCategory()}
            className="mt-4 text-white"
          >
            <button
              disabled={isdeleteCategoryFetching}
              className="p-2 rounded-sm bg-red-400 font-semibold font-poppins"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmDeleteIsOpen(false)}
              className="p-2 rounded-sm bg-blue-400 font-semibold font-poppins ml-4"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <div className="grid gap-4 md:grid-cols-4 mt-4">
        {category &&
          category.map((item, index) => {
            return (
              <div
                key={item._id}
                className={`p-4 bg-emerald-700 hover:bg-emerald-600 rounded-md`}
              >
                {/* <FaBirthdayCake className="text-2xl mx-auto" /> */}
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className={`${item.discount.percent > 0 && "line-through"}`}>
                  price: Rs. {item.price}
                </p>
                {item.discount.percent > 0 && (
                  <p className="">
                    price: Rs.{" "}
                    {(
                      item.price -
                      (item.price * item.discount.percent) / 100
                    ).toFixed(2)}
                  </p>
                )}
                <div className="mt-4 font-semibold">
                  <button
                    onClick={() => {
                      setEditCategoryIsOpen(true);
                      setEditCategoryId(item._id);
                      updateCategoryForm.setValues({
                        name: item.name,
                        price: item.price,
                        discountPercent: item.discount?.percent,
                        occasion: item.discount?.occasion,
                      });
                    }}
                    className="p-2 bg-blue-400 rounded-sm mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setConfirmDeleteIsOpen(true);
                      setDeleteCategoryId(item._id);
                    }}
                    className="p-2 bg-red-400 rounded-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Categories;
