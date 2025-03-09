import "./newFlight.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect  } from "react";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";

const NewFlight = ({ inputs, title }) => {
    const navigate = useNavigate();
    const [info, setInfo] = useState({});
    const [errors, setErrors] = useState({});
    const [airplanes, setAirplanes] = useState([]);
    const [airports, setAirports] = useState([]);

    useEffect(() => {
        const fetchAirplanesAndAirports = async () => {
            try {
                const airplaneRes = await axiosInstance.get("/api/airplanes"); // API danh sách máy bay
                const airportRes = await axiosInstance.get("/api/airports"); // API danh sách sân bay

                setAirplanes(airplaneRes.data);
                console.log(airports)
                setAirports(airportRes.data);
            } catch (error) {
                console.error("Failed to fetch airplanes or airports:", error);
                toast.error("Failed to fetch data. Please try again.");
            }
        };

        fetchAirplanesAndAirports();
    }, []);

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleClick = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fix the errors before submitting.");
            return;
        }

        try {
            // Gửi dữ liệu chuyến bay đến API
            await axiosInstance.post("/api/airplane-flights", info);
            toast.success("Flight created successfully!");
            setInfo({}); // Làm trống form
        } catch (err) {
            console.error("Error creating flight:", err);
            toast.error("Failed to create flight.");
        }
    };

    const validate = () => {
        const newErrors = {};

        // Kiểm tra thông tin cần thiết
        if (!info.airplane_id) newErrors.airplane_id = "Airplane is required.";
        if (!info.departure_airport_id) newErrors.departure_airport_id = "Departure airport is required.";
        if (!info.arrival_airport_id) newErrors.arrival_airport_id = "Arrival airport is required.";
        if (!info.departure_time) newErrors.departure_time = "Departure time is required.";
        if (!info.arrival_time) newErrors.arrival_time = "Arrival time is required.";
        if (!info.ticket_price || isNaN(info.ticket_price)) newErrors.ticket_price = "Valid ticket price is required.";

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
                    <button onClick={handleBack} className="backButton">
                        Back Page
                    </button>
                </div>
                <div className="bottom">
                    <div className="right">
                        <form>
                            {inputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    {input.id === "airplane_id" ? (
                                        // Dropdown danh sách máy bay
                                        <select
                                            id={input.id}
                                            value={info[input.id] || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Airplane</option>
                                            {airplanes.map((airplane) => (
                                                <option key={airplane.id} value={airplane.id}>
                                                    {airplane.model} ({airplane.id})
                                                </option>
                                            ))}
                                        </select>
                                    ) : input.id === "departure_airport_id" || input.id === "arrival_airport_id" ? (
                                        // Dropdown danh sách sân bay
                                        <select
                                            id={input.id}
                                            value={info[input.id] || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Airport</option>
                                            {airports.map((airport) => (
                                                <option key={airport.id} value={airport.id}>
                                                    {airport.name} ({airport.iata_code})
                                                </option>
                                            ))}
                                        </select>
                                    ) : input.type === "select" ? (
                                        <select
                                            id={input.id}
                                            value={info[input.id] || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select {input.label}</option>
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

export default NewFlight;
