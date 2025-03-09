import pool from '../config/database.js';

export const getRoles = async (req, res) => {
    try {
        const [roles] = await pool.query(`SELECT role_id, role_name FROM roles`);
        res.status(200).json(roles);
    } catch (err) {
        console.error("Lỗi khi lấy danh sách vai trò:", err);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};
