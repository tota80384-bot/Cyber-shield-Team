// Initialize reports from LocalStorage or use default mock data
let reports = JSON.parse(localStorage.getItem("incidentReports")) || [
  {
    id: "INC-2024-001",
    type: "Theft",
    location: "Locker Room B",
    date: "2024-10-24",
    status: "Pending",
  },
  {
    id: "INC-2024-002",
    type: "Safety",
    location: "Science Lab 3",
    date: "2024-10-23",
    status: "Resolved",
  },
  {
    id: "INC-2024-003",
    type: "Bullying",
    location: "Courtyard",
    date: "2024-10-22",
    status: "In Progress",
  },
];

// Save initial state if empty
if (!localStorage.getItem("incidentReports")) {
  localStorage.setItem("incidentReports", JSON.stringify(reports));
}

// Navigation Logic
function showPage(pageId) {
  // Hide all sections
  document.getElementById("home-page").classList.add("hidden");
  document.getElementById("report-page").classList.add("hidden");
  document.getElementById("success-message").classList.add("hidden");
  document.getElementById("admin-page").classList.add("hidden");

  // Show the requested section
  const page = document.getElementById(pageId + "-page");
  if (page) {
    page.classList.remove("hidden");
    window.scrollTo(0, 0);
  }

  if (pageId === "admin") {
    renderAdminDashboard();
  }
}

// Render Admin Dashboard
function renderAdminDashboard() {
  const tableBody = document.getElementById("reports-table-body");
  const totalCount = document.getElementById("total-reports-count");
  const pendingCount = document.getElementById("pending-reports-count");

  tableBody.innerHTML = ""; // Clear existing

  let pending = 0;

  reports.forEach((report) => {
    if (report.status === "Pending") pending++;

    const row = document.createElement("tr");
    row.className = "hover:bg-white/5 transition";
    row.innerHTML = `
            <td class="px-6 py-4 font-medium text-white">${report.id}</td>
            <td class="px-6 py-4">${capitalize(report.type)}</td>
            <td class="px-6 py-4">${report.location}</td>
            <td class="px-6 py-4">${report.date}</td>
            <td class="px-6 py-4">
                <span class="${getStatusColor(
                  report.status
                )} px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border border-current bg-opacity-10">${
      report.status
    }</span>
            </td>
            <td class="px-6 py-4">
                <button onclick="viewReport('${
                  report.id
                }')" class="text-cyan-400 hover:text-white transition"><i class="fas fa-eye"></i></button>
            </td>
        `;
    tableBody.prepend(row); // Add new ones to top
  });

  totalCount.textContent = reports.length;
  pendingCount.textContent = pending;
}

function getStatusColor(status) {
  switch (status) {
    case "Pending":
      return "text-red-400";
    case "In Progress":
      return "text-yellow-400";
    case "Resolved":
      return "text-green-400";
    default:
      return "text-gray-400";
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function viewReport(id) {
  alert("Viewing report details for: " + id);
}

// Form Submission Logic
document
  .getElementById("incidentForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Gather data
    const formData = new FormData(this);
    const newReport = {
      id: "INC-2024-" + String(reports.length + 1).padStart(3, "0"),
      type: formData.get("incidentType"),
      location: formData.get("location"),
      date: formData.get("date"),
      status: "Pending",
    };

    // Add to mock database and LocalStorage
    reports.push(newReport);
    localStorage.setItem("incidentReports", JSON.stringify(reports));

    // Show success message
    document.getElementById("report-page").classList.add("hidden");
    document.getElementById("success-message").classList.remove("hidden");
    window.scrollTo(0, 0);
  });

// Reset Form Logic
function resetForm() {
  document.getElementById("incidentForm").reset();
  showPage("home");

  // Reset anonymous state
  document.getElementById("contact-info").style.opacity = "1";
  document.getElementById("contact-info").style.pointerEvents = "auto";
  document.getElementById("reporterName").disabled = false;
  document.getElementById("anon-icon").className =
    "fas fa-user-secret text-2xl text-gray-500";
}

// Anonymous Toggle Logic
const anonymousCheckbox = document.getElementById("anonymous");
const contactInfoDiv = document.getElementById("contact-info");
const reporterNameInput = document.getElementById("reporterName");
const anonIcon = document.getElementById("anon-icon");

anonymousCheckbox.addEventListener("change", function () {
  if (this.checked) {
    contactInfoDiv.style.opacity = "0.3";
    contactInfoDiv.style.pointerEvents = "none";
    reporterNameInput.value = "";
    reporterNameInput.disabled = true;
    anonIcon.className = "fas fa-user-secret text-2xl text-cyan-400 text-glow";
  } else {
    contactInfoDiv.style.opacity = '1';
        contactInfoDiv.style.pointerEvents = 'auto';
        reporterNameInput.disabled = false;
        anonIcon.className = "fas fa-user-secret text-2xl text-gray-500";
    }
});

// Initial Render
renderAdminDashboard();