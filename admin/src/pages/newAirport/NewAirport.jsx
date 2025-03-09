import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";
import "./newAirport.scss";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const NewAirport = ({ inputs, title }) => {
    const [info, setInfo] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setInfo((prev) => ({ ...prev, [id]: value }));
    };

    const validate = () => {
        const newErrors = {};

        if (!info.name || info.name.trim() === "") {
            newErrors.name = "Airport name is required.";
        }

        if (!info.city || info.city.trim() === "") {
            newErrors.city = "City is required.";
        }

        if (!info.country || info.country.trim() === "") {
            newErrors.country = "Country is required.";
        }

        if (!info.iata_code || info.iata_code.trim() === "") {
            newErrors.iata_code = "IATA code is required.";
        } else if (info.iata_code.length !== 3) {
            newErrors.iata_code = "IATA code must be exactly 3 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fix the errors before submitting.");
            return;
        }

        try {
            await axiosInstance.post("/api/airports", info);
            toast.success("Airport added successfully!");
            setInfo({}); // Reset form after successful submission
        } catch (error) {
            console.error("Error adding airport:", error);
            toast.error("Failed to add airport. Please try again.");
        }
    };

    const handleBack = () => {
        navigate(-1); // Quay lại trang trước đó
    };

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{title}</h1>
                    <button onClick={handleBack} className="backButton">
                        Back Page
                    </button>
                </div>
                <div className="bottom">
                    <div className="right">
                        <form onSubmit={handleSubmit}>
                            {inputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    <input
                                        type={input.type}
                                        id={input.id}
                                        placeholder={input.placeholder}
                                        value={info[input.id] || ""}
                                        onChange={handleChange}
                                    />
                                    {errors[input.id] && (
                                        <span className="error-message">{errors[input.id]}</span>
                                    )}
                                </div>
                            ))}
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewAirport;
