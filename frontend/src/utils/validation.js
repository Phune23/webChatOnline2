// Các hàm validation đơn giản
export const isEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const isPassword = (password) => {
  return password.length >= 6;
};

export const isUsername = (username) => {
  return username.length >= 3 && username.length <= 30;
};

// Form validation
export const loginValidation = (values) => {
  let errors = {};
  
  if (!values.email) {
    errors.email = 'Email là bắt buộc';
  } else if (!isEmail(values.email)) {
    errors.email = 'Email không hợp lệ';
  }
  
  if (!values.password) {
    errors.password = 'Mật khẩu là bắt buộc';
  }
  
  return errors;
};

export const registerValidation = (values) => {
  let errors = {};
  
  if (!values.username) {
    errors.username = 'Tên người dùng là bắt buộc';
  } else if (!isUsername(values.username)) {
    errors.username = 'Tên người dùng phải có ít nhất 3 ký tự và tối đa 30 ký tự';
  }
  
  if (!values.email) {
    errors.email = 'Email là bắt buộc';
  } else if (!isEmail(values.email)) {
    errors.email = 'Email không hợp lệ';
  }
  
  if (!values.password) {
    errors.password = 'Mật khẩu là bắt buộc';
  } else if (!isPassword(values.password)) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }
  
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
  }
  
  return errors;
};