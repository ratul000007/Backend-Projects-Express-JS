const express = require("express");
const router = express.Router();

const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");


// Extra: Only admin users
const adminOnly = (req, res, next) => {
    if (req.user && req.user.isAdmin) return next();
    return res.status(403).json({ message: "Admin only" });
};

//public
router.get("/", getAllProducts);
router.get("/:id", getProductById);

//admin only

router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;