import { request } from "./api.js";
const token = localStorage.getItem("token");

const showProducts = async () => {
  try {
    const products = await request("/products");
    const list = document.getElementById("product-list");
    list.innerHTML = "";

    products.forEach((p) => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <h3>${p.name}</h3>
        <p>${p.description || "No description"}</p>
        <p>Price: $${p.price}</p>
        <button ${!token ? "disabled" : ""} data-id="${p._id}">Add to Cart</button>
      `;
      list.appendChild(div);
    });

    list.addEventListener("click", async (e) => {
      if (e.target.tagName === "BUTTON") {
        const productId = e.target.dataset.id;
        try {
          await request("/cart/add", "POST", { productId, quantity: 1 }, token);
          alert("Added to cart!");
        } catch (err) {
          alert("Error: " + err.message);
        }
      }
    });
  } catch (err) {
    document.getElementById("product-list").innerText = "Failed to load products";
  }
};

const showUser = () => {
  const info = document.getElementById("user-info");
  if (token) {
    info.innerHTML = `
      <p>✅ Logged in</p>
      <a href="cart.html">🛒 View Cart</a> |
      <a href="orders.html">📦 Orders</a> |
      <button id="logout">Logout</button>
    `;
    document.getElementById("logout").onclick = () => {
      localStorage.removeItem("token");
      location.reload();
    };
  } else {
    info.innerHTML = `<a href="login.html">Login</a> | <a href="register.html">Register</a>`;
  }
};

showUser();
showProducts();
