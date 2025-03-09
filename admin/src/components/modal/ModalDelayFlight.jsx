import React, { useState, useEffect } from "react";
import "./modalDelayFlight.scss";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const ModalDelayFlight = ({ show, onClose, onConfirm, initialDepartureTime, initialArrivalTime }) => {
    const [newDepartureTime, setNewDepartureTime] = useState("");
    const [newArrivalTime, setNewArrivalTime] = useState("");

    // Cập nhật giá trị ban đầu khi modal mở
    useEffect(() => {
        if (initialDepartureTime && initialArrivalTime) {
            setNewDepartureTime(dayjs(initialDepartureTime).local().format("YYYY-MM-DDTHH:mm"));
            setNewArrivalTime(dayjs(initialArrivalTime).local().format("YYYY-MM-DDTHH:mm"));
        }
    }, [initialDepartureTime, initialArrivalTime]);

    const handleConfirm = () => {
        if (!newDepartureTime || !newArrivalTime) {
            alert("Please fill in both departure and arrival times.");
            return;
        }

        // Gọi hàm onConfirm với giá trị thời gian mới
        onConfirm(
            dayjs(newDepartureTime).utc().toISOString(),
            dayjs(newArrivalTime).utc().toISOString()
        );
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modalDelayFlight__overlay">
            <div className="modalDelayFlight__container">
                <div className="modalDelayFlight__header">
                    <h2>Update Flight Times</h2>
                    <button className="closeButton" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modalDelayFlight__body">
                    <label htmlFor="departureTime">New Departure Time:</label>
                    <input
                        type="datetime-local"
                        id="departureTime"
                        value={newDepartureTime}
                        onChange={(e) => setNewDepartureTime(e.target.value)}
                    />

                    <label htmlFor="arrivalTime">New Arrival Time:</label>
                    <input
                        type="datetime-local"
                        id="arrivalTime"
                        value={newArrivalTime}
                        onChange={(e) => setNewArrivalTime(e.target.value)}
                    />
                </div>
                <div className="modalDelayFlight__footer">
                    <button className="confirmButton" onClick={handleConfirm}>
                        Confirm
                    </button>
                    <button className="cancelButton" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalDelayFlight;
