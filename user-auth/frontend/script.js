let accessToken = null;

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const body = Object.fromEntries(formData.entries());

    const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    accessToken = data.accessToken;
    alert("Registered!");
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const body = Object.fromEntries(formData.entries());

    const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    accessToken = data.accessToken;
    alert("Logged in!")
});

document.getElementById("getProfile").addEventListener("click", async (e) => {
    
    const res = await fetch("http://localhost:5000/api/profile", {
        headers: { 
            Authorization: `Bearer ${accessToken}`, 
        },
    });

    if(res.status === 401 || res.status === 403) {
         alert("Access token expired or invalid. Try logging in again.");
         return;
    }

    const data = await res.json();
    document.getElementById("profileData").innerText = JSON.stringify(data, null, 2);
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
    await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
    });

    accessToken = null;
    alert("Logged out!");
});
