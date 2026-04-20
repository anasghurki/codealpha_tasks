const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./config/db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/admin", express.static(path.join(__dirname, "Backend"))); 
app.use("/", express.static(path.join(__dirname, "Frontend"))); 


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });


app.get("/api/categories", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM categories ORDER BY name ASC");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post("/api/categories", async (req, res) => {
    try {
        const { name } = req.body;
        const [result] = await db.query("INSERT INTO categories (name) VALUES (?)", [name]);
        res.status(201).json({ message: "Category added successfully", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.delete("/api/categories/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM categories WHERE id = ?", [id]);
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get("/api/products", async (req, res) => {
    try {
        const query = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            ORDER BY p.created_at DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.id = ?
        `;
        const [rows] = await db.query(query, [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Product not found" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post("/api/products", upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 }
]), async (req, res) => {
    try {
        const { name, description, color, price, old_price, category_id } = req.body;

        const image1 = req.files['image1'] ? req.files['image1'][0].filename : null;
        const image2 = req.files['image2'] ? req.files['image2'][0].filename : null;
        const image3 = req.files['image3'] ? req.files['image3'][0].filename : null;

        const query = `
            INSERT INTO products (name, description, color, price, old_price, image1, image2, image3, category_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [name, description, color, price, old_price, image1, image2, image3, category_id]);

        res.status(201).json({ message: "Product added successfully", productId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.delete("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM products WHERE id = ?", [id]);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Backend", "dashboard.html"));
});




app.post("/api/orders", async (req, res) => {
    const connection = await db.getConnection(); 
    try {
        await connection.beginTransaction();

        const { customer_name, customer_email, customer_phone, shipping_address, total_amount, items } = req.body;

        
        const orderQuery = `
            INSERT INTO orders (customer_name, customer_email, customer_phone, shipping_address, total_amount, payment_method, status) 
            VALUES (?, ?, ?, ?, ?, 'COD', 'Pending')
        `;
        const [orderResult] = await connection.query(orderQuery, [customer_name, customer_email, customer_phone, shipping_address, total_amount]);
        const orderId = orderResult.insertId;

       
        const itemsQuery = `
            INSERT INTO order_items (order_id, product_id, product_name, quantity, price) 
            VALUES ?
        `;
        const itemValues = items.map(item => [orderId, item.id, item.name, item.quantity, item.price]);
        await connection.query(itemsQuery, [itemValues]);

        await connection.commit();
        res.status(201).json({ message: "Order placed successfully!", orderId });
    } catch (error) {
        await connection.rollback();
        console.error("ORDER ERROR:", error); 
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});


app.get("/api/orders", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM orders ORDER BY created_at DESC");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get("/api/orders/:id/items", async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query("SELECT * FROM order_items WHERE order_id = ?", [id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.patch("/api/orders/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
        res.json({ message: "Order status updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.delete("/api/orders/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM orders WHERE id = ?", [id]);
        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Signup
app.post("/api/auth/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existing.length > 0) return res.status(400).json({ error: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

        res.status(201).json({ message: "Account created successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) return res.status(400).json({ error: "Invalid credentials" });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, name: user.name } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
