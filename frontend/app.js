const API_BASE_URL = "https://hostel-backend-ksuw.onrender.com";

// --- DOM Elements ---
const form = document.getElementById("complaintForm");
const complaintsContainer = document.getElementById("complaintsContainer");
const refreshBtn = document.getElementById("refreshBtn");
const formMessage = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");

// --- Auth Elements ---
const portalSelection = document.getElementById("portalSelection");
const studentPortalBtn = document.getElementById("studentPortalBtn");
const adminPortalBtn = document.getElementById("adminPortalBtn");
const backToPortalBtn = document.getElementById("backToPortalBtn");
const authTitle = document.getElementById("authTitle");

const authSection = document.getElementById("authSection");
const mainContent = document.getElementById("mainContent");
const studentFormSection = document.getElementById("studentFormSection");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");
const authMessage = document.getElementById("authMessage");
const loggedInUser = document.getElementById("loggedInUser");

// Read memory to see if we already have a wristband!
let jwtToken = localStorage.getItem("access_token");

// --- Page Load Logic ---
document.addEventListener("DOMContentLoaded", () => {
    if (jwtToken) {
        showMainApp(); // Welcome back!
    } else {
        showAuthScreen(); // Who are you?
    }
});

// Portal Buttons
studentPortalBtn.addEventListener("click", () => {
    portalSelection.style.display = "none";
    authSection.style.display = "block";
    authTitle.textContent = "Student Login";
    registerBtn.style.display = "block"; 
});

adminPortalBtn.addEventListener("click", () => {
    portalSelection.style.display = "none";
    authSection.style.display = "block";
    authTitle.textContent = "Warden Login Area";
    registerBtn.style.display = "none"; // Hide register button for Wardens
});

backToPortalBtn.addEventListener("click", showAuthScreen);

function showAuthScreen() {
    portalSelection.style.display = "block";
    authSection.style.display = "none";
    mainContent.style.display = "none";
    logoutBtn.style.display = "none";
    loggedInUser.textContent = "🔒 Security Locked: Select Portal";
}

function showMainApp() {
    portalSelection.style.display = "none";
    authSection.style.display = "none";
    mainContent.style.display = "grid";
    logoutBtn.style.display = "inline-flex";
    
    let isAdmin = false;
    let username = "";
    if (jwtToken) {
        try {
            const payload = JSON.parse(atob(jwtToken.split('.')[1]));
            isAdmin = payload.is_admin || false;
            username = payload.sub || "";
        } catch (e) {}
    }
    
    // --- DUAL DASHBOARD ROUTING ---
    if (isAdmin) {
        // ADMIN DASHBOARD
        studentFormSection.style.display = "none";
        mainContent.style.gridTemplateColumns = "1fr"; // Full width
    } else {
        // STUDENT DASHBOARD
        studentFormSection.style.display = "block";
        mainContent.style.gridTemplateColumns = ""; // Use CSS default
    }

    const roleStr = isAdmin ? '(Admin Warden)' : '(Student)';
    loggedInUser.textContent = `✅ Security Cleared! Welcome to the Hub, ${username} ${roleStr}.`;
    fetchComplaints(); 
}

// ============================================
// 0. REGISTRATION & LOGIN LOGIC
// ============================================
registerBtn.addEventListener("click", async () => {
    const un = document.getElementById("authUsername").value;
    const pw = document.getElementById("authPassword").value;
    
    try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: un, password: pw })
        });
        const data = await res.json();
        
        if (res.ok) {
            authMessage.className = "form-message success";
            authMessage.textContent = "Registered! You can now click Login.";
        } else {
            authMessage.className = "form-message error";
            authMessage.textContent = data.detail || "Registration failed!";
        }
    } catch(err) {
        authMessage.textContent = "Server offline.";
    }
});

loginBtn.addEventListener("click", async () => {
    const un = document.getElementById("authUsername").value;
    const pw = document.getElementById("authPassword").value;
    
    // FastAPI's specific format for logging in requires form-urlencoded data!
    const formData = new URLSearchParams();
    formData.append("username", un);
    formData.append("password", pw);

    try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData
        });
        const data = await res.json();
        
        if (res.ok) {
            // WE GOT THE WRISTBAND! Save it to the browser securely.
            jwtToken = data.access_token;
            localStorage.setItem("access_token", jwtToken);
            showMainApp();
        } else {
            authMessage.className = "form-message error";
            authMessage.textContent = "Wrong username or password.";
        }
    } catch(err) {
        authMessage.textContent = "Failed to login. Is server running?";
    }
});

logoutBtn.addEventListener("click", () => {
    jwtToken = null;
    localStorage.removeItem("access_token"); // Throw away the wristband
    showAuthScreen();
});


// ============================================
// 1. GET ALL COMPLAINTS (Requires Token!)
// ============================================
async function fetchComplaints() {
    try {
        complaintsContainer.innerHTML = '<div class="spinner">Fetching data from API...</div>';
        
        const response = await fetch(`${API_BASE_URL}/complaints`, {
            // IMPORTANT: We must send the JWT Token with EVERY request now!
            headers: { "Authorization": `Bearer ${jwtToken}` }
        });
        
        // If our token expired, log us out automatically
        if (response.status === 401) {
            alert("Your session expired. Please log in again.");
            logoutBtn.click();
            return;
        }
        
        const data = await response.json();
        renderComplaints(data.complaints);

    } catch (error) {
        complaintsContainer.innerHTML = `<div class="spinner" style="color:red">Error loading API.</div>`;
    }
}

// 2. RENDER THE COMPLAINTS (Display them)
function renderComplaints(complaints) {
    if (!complaints || complaints.length === 0) {
        complaintsContainer.innerHTML = '<div class="spinner">No complaints found. You are all good! 🎉</div>';
        return;
    }

    let isAdmin = false;
    if (jwtToken) {
        try {
            const payload = JSON.parse(atob(jwtToken.split('.')[1]));
            isAdmin = payload.is_admin || false;
        } catch (e) {}
    }

    complaints.sort((a, b) => b.id - a.id);
    complaintsContainer.innerHTML = "";
    
    complaints.forEach(complaint => {
        const card = document.createElement("div");
        card.className = "complaint-card";
        const statusClass = complaint.status.toLowerCase() === 'pending' ? 'pending' : 'resolved';
        const dateObj = complaint.created_at ? new Date(complaint.created_at) : new Date();
        const dateStr = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        card.innerHTML = `
            <div class="complaint-header">
                <div>
                    <div class="complaint-title">[${complaint.category}] Room ${complaint.room_number}</div>
                    <div class="complaint-meta">By ${complaint.student_name} • ${dateStr}</div>
                </div>
                <div>
                    <span class="badge ${statusClass}">${complaint.status}</span>
                </div>
            </div>
            <div class="complaint-body">${complaint.description}</div>
            ${(complaint.status === 'pending' && isAdmin) ? `
            <div class="complaint-footer">
                <button class="resolve-btn" onclick="markAsResolved(${complaint.id})">Mark as Resolved ✔️</button>
            </div>` : ''}
        `;
        complaintsContainer.appendChild(card);
    });
}

// ============================================
// 3. POST NEW COMPLAINT (Requires Token!)
// ============================================
refreshBtn.addEventListener("click", fetchComplaints);
form.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    
    const payload = {
        student_name: document.getElementById("studentName").value,
        room_number: document.getElementById("roomNumber").value,
        category: document.getElementById("category").value,
        description: document.getElementById("description").value
    };

    try {
        submitBtn.innerHTML = "Submitting to API...";
        submitBtn.disabled = true;

        const response = await fetch(`${API_BASE_URL}/complaints`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // IMPORTANT: Hand over the Wristband!
                "Authorization": `Bearer ${jwtToken}`
            },
            body: JSON.stringify(payload)
        });

        if (response.status === 401) {
            alert("Your session expired. Please log in again.");
            logoutBtn.click(); return;
        }

        formMessage.textContent = "Awesome! Complaint successfully sent via secure API!";
        formMessage.className = "form-message success";
        form.reset(); 
        fetchComplaints();

    } catch (error) {
        formMessage.textContent = "Error communicating with server.";
        formMessage.className = "form-message error";
    } finally {
        submitBtn.innerHTML = "Submit Complaint";
        submitBtn.disabled = false;
        setTimeout(() => { formMessage.textContent = ""; }, 4000);
    }
});

// ============================================
// 4. PUT REQUEST (Requires Token!)
// ============================================
async function markAsResolved(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/complaints/${id}/status?new_status=resolved`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${jwtToken}` } // Security Pass!
        });
        
        if (response.ok) {
            fetchComplaints(); 
        } else if (response.status === 401) {
            alert("Your session expired. Please log in again.");
            logoutBtn.click();
        } else {
            alert("Could not update status.");
        }
    } catch (error) {
        alert("Server communication error.");
    }
}
