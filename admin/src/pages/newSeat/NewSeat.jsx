import "./newSeat.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import axiosInstance from "../../config/axiosInstance";

import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useLocation, useNavigate  } from "react-router-dom";

const NewSeat = ({ inputs }) => {
  const navigate = useNavigate();

  const [info, setInfo] = useState({});
  const [seatInputs, setSeatInputs] = useState(inputs);
  const [errors, setErrors] = useState({});

  const location = useLocation();
  const id = location.pathname.split("/")[2];

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/users");
        const users = response.data.map((user) => ({
          value: user.id,
          label: `${user.username}`,
        }));

        // Cập nhật danh sách người dùng vào seatInputs
        setSeatInputs((prevInputs) =>
          prevInputs.map((input) =>
            input.id === "passenger_id" ? { ...input, options: users } : input
          )
        );
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  const handleClick = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      // Gửi dữ liệu đến API
      const response = await axiosInstance.post("/api/airplane-seats", {
        airplane_id: id,
        seat_number: info.seat_number,
        seat_class: info.seat_class,
        rows_number: info.rows_number,
        price: info.price,
        notes: info.notes || null, // Trường notes có thể là null
      });

      // Thông báo thành công
      toast.success("Seat added successfully!");

      // Xử lý sau khi thêm ghế thành công (ví dụ: làm trống form hoặc điều hướng)
      setInfo({});
      setErrors({});
    } catch (error) {
      console.error("Error adding seat:", error);
      toast.error("Failed to add seat.");
    }
  };

  const validate = () => {
    const newErrors = {};

    // Kiểm tra seat_number
    if (!info.seat_number || info.seat_number.trim() === "") {
        newErrors.seat_number = "Seat Number is required.";
    } else if (!/^\d+[A-Z]$/.test(info.seat_number)) {
        newErrors.seat_number = "Seat Number must follow the format (e.g., 1A, 12B).";
    }

    // Kiểm tra seat_class
    if (!info.seat_class || info.seat_class.trim() === "") {
        newErrors.seat_class = "Seat Class is required.";
    } else if (!["Economy", "Business", "First"].includes(info.seat_class)) {
        newErrors.seat_class = "Invalid Seat Class.";
    }

    // Kiểm tra rows_number
    if (!info.rows_number || isNaN(info.rows_number)) {
        newErrors.rows_number = "Row Number is required and must be a number.";
    }

    // Kiểm tra price
    if (!info.price || isNaN(info.price) || info.price <= 0) {
        newErrors.price = "Price is required and must be a positive number.";
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
          <h1>Add New Seat</h1>

          <button onClick={handleBack} className="backButton">
            Back Page
          </button>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              {seatInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  {input.type === "select" ? (
                    <select
                      id={input.id}
                      value={info[input.id] || ""}
                      onChange={handleChange}
                    >
                      {input.id === "is_occupied"
                        ? <option value="">Select value</option>
                        : (input.id === "passenger_id"
                          ? <option value="">Select Name</option>
                          : <option value="">Select class</option>)}

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
                      value={info[input.id] || ""}
                    />
                  )}

                  {/* Hiển thị lỗi */}
                  {errors[input.id] && <span className="error-message">{errors[input.id]}</span>}
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

export default NewSeat;
