import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useFetch from "../../hooks/useFetch";

const New = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [showPasswords, setShowPasswords] = useState({});
  const [errors, setErrors] = useState({});

  const location = useLocation();
  const path = location.pathname.split("/")[3];
  const { data, loading, error } = useFetch(`/api/users/${path}`);

  useEffect(() => {
    if (data) {
      setInfo(data);
    }
  }, [data]);

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const togglePasswordVisibility = (id) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors before submitting.');
      return;
    }

    try {
      let imageUrl = '';

      if (file) {
        // Chuyển đổi file sang Base64
        const base64 = await toBase64(file);

        // Gửi Base64 tới API upload
        const uploadRes = await axiosInstance.post("/api/upload-avatar", { image: base64, name_folder: "admin_uploads" });

        imageUrl = uploadRes.data.url;
      }

      const newUser = {
        full_name: info.username,
        email: info.email,
        password: info.password,
        phone: info.phone,
        address: info.address,
        country: info.country,
        dob: info.dob || null,
        role: info.role || 'Customer',
        avatar: imageUrl || null,
      };

      await axiosInstance.post('/auth/register', newUser);
      toast.success('Tạo người dùng thành công!');
    } catch (err) {
      console.error('Lỗi khi tạo người dùng:', err);
      toast.error('Đã xảy ra lỗi khi tạo người dùng!');
    }
  };

  // Chuyển file sang Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const validate = () => {
    const newErrors = {};

    // Kiểm tra Username
    if (!info.username || info.username.trim() === "") {
      newErrors.username = "Username is required.";
    }

    // Kiểm tra Email
    if (!info.email || info.email.trim() === "") {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(info.email)) {
      newErrors.email = "Invalid email format.";
    }

    // Kiểm tra Số điện thoại
    if (!info.phone || info.phone.trim() === "") {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10,15}$/.test(info.phone)) {
      newErrors.phone = "Phone number must be between 10-15 digits.";
    }

    // Kiểm tra Mật khẩu
    if (info.password && info.password.trim() !== "") {
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/.test(info.password)) {
        newErrors.password =
          "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, and a special character.";
      }
    }

    // Kiểm tra Address
    if (!info.address || info.address.trim() === "") {
      newErrors.address = "Address is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  {input.type === "password" ? (
                    <div className="password-container">
                      <input
                        type={showPasswords[input.id] ? "text" : "password"}
                        id={input.id}
                        value={info[input.id] || ""}
                        onChange={handleChange}
                        placeholder={input.placeholder}
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => togglePasswordVisibility(input.id)}
                      >
                        {showPasswords[input.id] ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  ) : input.type === "select" ? (
                    <select
                      id={input.id}
                      value={info[input.id] || ""}
                      onChange={handleChange}
                    >
                      {input.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      onChange={handleChange}
                      type={input.type}
                      placeholder={input.placeholder}
                      id={input.id}
                    />
                  )}
                </div>
              ))}
              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;