import pool from '../config/database.js';

// Lấy danh sách sân bay
export const getAllAirports = async (req, res) => {
    try {
        const [airports] = await pool.query(
            "SELECT airport_id AS id, name, city, country, iata_code, created_at, updated_at FROM airports"
        );
        res.status(200).json(airports);
    } catch (error) {
        console.error("Error fetching airports:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Lấy chi tiết sân bay theo ID
export const getAirportById = async (req, res) => {
    const { id } = req.params;
    try {
        const [airport] = await pool.query("SELECT * FROM airports WHERE airport_id = ?", [id]);
        if (airport.length === 0) {
            return res.status(404).json({ message: "Airport not found" });
        }
        res.status(200).json(airport[0]);
    } catch (error) {
        console.error("Error fetching airport:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Thêm sân bay mới
export const createAirport = async (req, res) => {
    const { name, city, country, iata_code } = req.body;
    try {
        const [result] = await pool.query(
            "INSERT INTO airports (name, city, country, iata_code) VALUES (?, ?, ?, ?)",
            [name, city, country, iata_code]
        );
        res.status(201).json({ message: "Airport created successfully", airport_id: result.insertId });
    } catch (error) {
        console.error("Error creating airport:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Cập nhật thông tin sân bay
export const updateAirport = async (req, res) => {
    console.log(res.params)
    const { id } = req.params;
    const { name, city, country, iata_code } = req.body;
    try {
        const [result] = await pool.query(
            "UPDATE airports SET name = ?, city = ?, country = ?, iata_code = ? WHERE airport_id = ?",
            [name, city, country, iata_code, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Airport not found" });
        }
        res.status(200).json({ message: "Airport updated successfully" });
    } catch (error) {
        console.error("Error updating airport:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Xóa sân bay
export const deleteAirport = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM airports WHERE airport_id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Airport not found" });
        }
        res.status(200).json({ message: "Airport deleted successfully" });
    } catch (error) {
        console.error("Error deleting airport:", error);
        res.status(500).json({ message: "Server error" });
    }
};
