import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const SeatDetails = ({ inputs }) => {
    const location = useLocation();
    const seat_id = location.pathname.split("/")[4];
    const path = location.pathname.split("/")[1];

    const navigate = useNavigate();
    const [seat, setSeat] = useState(null);
    const [errors, setErrors] = useState({});
    const [search, setSearch] = useState("");
    const [seatInputs, setSeatInputs] = useState(inputs);

    const handleChange = (e) => {
        const { id, value } = e.target;

        setSeat((prev) => {
            const updatedSeat = { ...prev, [id]: value };

            // Nếu trường seat_number được thay đổi, cập nhật row_number
            if (id === "seat_number") {
                const rowNumber = parseInt(value.match(/^\d+/)) || ""; // Lấy số trước chữ cái
                updatedSeat.row_number = rowNumber;
            }

            return updatedSeat;
        });
    };

    // Lấy thông tin ghế từ API
    useEffect(() => {
        const fetchSeatDetails = async () => {
            try {
                const response = await axiosInstance.get(`/api/airplane-seats/seat/${seat_id}`);
                const seatData = response.data;

                seatData.is_occupied = seatData.is_occupied !== null ? seatData.is_occupied : 0;
                seatData.passenger_id = seatData.passenger_id || "";

                setSeat(seatData);
            } catch (error) {
                console.error("Failed to fetch seat details:", error);
                toast.error("Failed to fetch seat details.");
            }
        };

        fetchSeatDetails();
    }, [seat_id]);

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

    const handleBack = () => {
        navigate(-1); // Quay lại trang trước đó
    };

    const handleClick = async (e) => {
        e.preventDefault(); // Ngăn form gửi yêu cầu HTTP mặc định

        try {
            // Gửi dữ liệu cập nhật lên API
            await axiosInstance.put(`/api/airplane-seats/${seat_id}`, {
                seat_number: seat.seat_number,
                seat_class: seat.seat_class,
                rows_number: seat.rows_number,
                is_occupied: seat.is_occupied || 0,
                passenger_id: seat.passenger_id || null,
                price: seat.price || null,
                notes: seat.notes || null,
            });

            toast.success("Infomation seat updated successfully!");

            setTimeout(() => {
                navigate(-1); // Quay lại trang trước
            }, 4000);
        } catch (error) {
            console.error("Failed to update seat:", error);
            toast.error("Failed to update seat.");
        }
    };

    console.log(seat);
    if (!seat) return <div>Loading...</div>;

    // Lấy màu sắc dựa trên hạng ghế
    const getSeatColor = (seatClass) => {
        switch (seatClass) {
            case "Business":
                return "#6a5acd";
            case "First":
                return "#ffcc00";
            case "Economy":
                return "#87ceeb";
            default:
                return "#808080";
        }
    };

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>Seat Infomation</h1>
                    <button onClick={handleBack} className="backButton">
                        Back Page
                    </button>
                </div>
                <div className="bottom">
                    <div className="left">
                        <div
                            className="seat-preview"
                            style={{
                                width: "100px",
                                height: "100px",
                                backgroundColor: getSeatColor(seat.seat_class),
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "#fff",
                                fontWeight: "bold",
                                borderRadius: "8px",
                            }}
                        >
                            {seat.seat_class}
                        </div>
                    </div>
                    <div className="right">
                        <form onSubmit={handleClick}>
                            {seatInputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    {input.type === "select" ? (
                                        <select
                                            id={input.id}
                                            value={
                                                seat[input.id] !== undefined && seat[input.id] !== null
                                                    ? seat[input.id]
                                                    : ""
                                            }
                                            onChange={handleChange}
                                        >
                                            {input.id === "is_occupied"
                                                ? <option value="">Select value</option>
                                                : <option value="">Select Name</option>}

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
                                            value={seat[input.id] || ""}
                                        />
                                    )}

                                    {/* Hiển thị lỗi */}
                                    {errors[input.id] && <span className="error-message">{errors[input.id]}</span>}
                                </div>
                            ))}

                            <button type="submit" className="btn-submit">Send</button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SeatDetails;
