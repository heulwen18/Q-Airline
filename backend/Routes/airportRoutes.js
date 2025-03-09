import express from "express";
import {
    getAllAirports,
    getAirportById,
    createAirport,
    updateAirport,
    deleteAirport,
} from "../controller/airportController.js";

const router = express.Router();

router.get("/airports", getAllAirports);
router.get("/airports/:id", getAirportById);
router.post("/airports", createAirport);
router.put("/airports/:id", updateAirport);
router.delete("/airports/:id", deleteAirport);

export default router;
