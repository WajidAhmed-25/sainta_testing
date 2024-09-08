export const getFormData = async object => {
  let newObj = {
    ...object,
  };
  const formData = new FormData();
  Object.keys(newObj).forEach(key => formData.append(key, object[key]));
  return formData;
};
