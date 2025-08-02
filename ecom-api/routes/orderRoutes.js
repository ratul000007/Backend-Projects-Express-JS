const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { checkout, getUserOrders } = require("../controllers/orderController");

router.use(protect);

router.post("/checkout", checkout);
router.get("/", getUserOrders);

module.exports = router;