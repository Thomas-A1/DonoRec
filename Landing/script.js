// TAKES ALL CSV FILES

// document.addEventListener("DOMContentLoaded", function () {
//     const dropZone = document.getElementById("drop-zone");
//     const fileInput = document.getElementById("file-input");
//     const dataTable = document.getElementById("data-table");

//     dropZone.addEventListener("click", () => fileInput.click());

//     dropZone.addEventListener("dragover", (e) => {
//         e.preventDefault();
//         dropZone.classList.add("drag-over");
//     });

//     dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));

//     dropZone.addEventListener("drop", (e) => {
//         e.preventDefault();
//         dropZone.classList.remove("drag-over");
//         const file = e.dataTransfer.files[0];
//         handleFile(file);
//     });

//     fileInput.addEventListener("change", (e) => {
//         const file = e.target.files[0];
//         handleFile(file);
//     });

//     function handleFile(file) {
//         if (!file) return;

//         const reader = new FileReader();
//         reader.onload = (e) => {
//             const data = new Uint8Array(e.target.result);
//             const workbook = XLSX.read(data, { type: "array" });
//             const sheetName = workbook.SheetNames[0];
//             const sheet = workbook.Sheets[sheetName];
//             const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//             displayTable(jsonData);
//         };
//         reader.readAsArrayBuffer(file);
//     }

//     function displayTable(data) {
//         const thead = dataTable.querySelector("thead");
//         const tbody = dataTable.querySelector("tbody");

//         thead.innerHTML = "";
//         tbody.innerHTML = "";

//         if (data.length === 0) return;

//         // Headers
//         const headerRow = document.createElement("tr");
//         data[0].forEach((header) => {
//             const th = document.createElement("th");
//             th.textContent = header;
//             headerRow.appendChild(th);
//         });
//         thead.appendChild(headerRow);

//         // Rows
//         data.slice(1).forEach((row) => {
//             const tr = document.createElement("tr");
//             row.forEach((cell) => {
//                 const td = document.createElement("td");
//                 td.textContent = cell;
//                 tr.appendChild(td);
//             });
//             tbody.appendChild(tr);
//         });
//     }
// });





// TAKES SPECIFIC CSV

// document.addEventListener("DOMContentLoaded", function () {
//     const dropZone = document.getElementById("drop-zone");
//     const fileInput = document.getElementById("file-input");
//     const dataTable = document.getElementById("data-table");
//     const errorMessage = document.createElement("p"); // Error message placeholder
//     errorMessage.className = "error-message";
//     dropZone.after(errorMessage);

//     // Expected headers
//     const REQUIRED_HEADERS = [
//         "DONOR ID", "DONATION TYPE", "ORGANIZATION NAME", "LAST NAME", "FIRST NAME (DONOR OR CONTACT)",
//         "TITLE", "GENDER", "ADDRESS", "CITY/TOWN", "COUNTRY", "MOBILE PHONE", "WHATSAPP NO",
//         "EMAIL(1)", "EMAIL(2)", "JOB TITLE", "EMPLOYER", "DONOR CATEGORY", "TRADITIONAL TITLE",
//         "DONATION DATE", "PAYMENT METHOD", "CURRENCY", "AMOUNT", "REFERENCE", "RECEIPT NO",
//         "DESCRIPTION (IN-KIND)", "CAMPAIGN EVENT", "REFERRED BY", "DATA ENTRY DATE",
//         "MONEY RECEIVED BY", "DATA ENTRY NAME"
//     ];

//     // Handle file selection
//     dropZone.addEventListener("click", () => fileInput.click());
//     dropZone.addEventListener("dragover", (e) => {
//         e.preventDefault();
//         dropZone.classList.add("drag-over");
//     });

//     dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
//     dropZone.addEventListener("drop", (e) => {
//         e.preventDefault();
//         dropZone.classList.remove("drag-over");
//         const file = e.dataTransfer.files[0];
//         handleFile(file);
//     });

//     fileInput.addEventListener("change", (e) => {
//         const file = e.target.files[0];
//         handleFile(file);
//     });

//     function handleFile(file) {
//         if (!file) return;

//         const reader = new FileReader();
//         reader.onload = (e) => {
//             const data = new Uint8Array(e.target.result);
//             const workbook = XLSX.read(data, { type: "array" });
//             const sheetName = workbook.SheetNames[0];
//             const sheet = workbook.Sheets[sheetName];
//             const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//             validateAndDisplayTable(jsonData);
//         };
//         reader.readAsArrayBuffer(file);
//     }

//     function validateAndDisplayTable(data) {
//         const thead = dataTable.querySelector("thead");
//         const tbody = dataTable.querySelector("tbody");
//         thead.innerHTML = "";
//         tbody.innerHTML = "";

//         if (data.length === 0) return;

//         // Extract headers from the file
//         const headers = data[0].map(header => header.trim().toUpperCase());

//         console.log("Extracted Headers:", headers);

//         // Find missing headers
//         const missingHeaders = REQUIRED_HEADERS.filter(h => !headers.includes(h));

//         if (missingHeaders.length > 0) {
//             dropZone.classList.add("error-border"); // Highlight dropzone in red
//             errorMessage.innerHTML = `❌ Missing headers: <strong>${missingHeaders.join(", ")}</strong>`;
//             return;
//         }

//         // If headers are correct, reset styles
//         dropZone.classList.remove("error-border");
//         errorMessage.innerHTML = "";

//         // Display headers in table
//         const headerRow = document.createElement("tr");
//         headers.forEach((header) => {
//             const th = document.createElement("th");
//             th.textContent = header;
//             headerRow.appendChild(th);
//         });
//         thead.appendChild(headerRow);

//         // Display rows
//         data.slice(1).forEach((row) => {
//             const tr = document.createElement("tr");
//             row.forEach((cell) => {
//                 const td = document.createElement("td");
//                 td.textContent = cell || ""; // Handle empty cells
//                 tr.appendChild(td);
//             });
//             tbody.appendChild(tr);
//         });
//     }
// });

document.addEventListener("DOMContentLoaded", function () {
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");
    const dataTable = document.getElementById("data-table");
    const errorMessage = document.createElement("p");
    errorMessage.className = "error-message";
    dropZone.after(errorMessage);

    const REQUIRED_HEADERS = [
        "DONOR ID", "DONATION TYPE", "ORGANIZATION NAME", "LAST NAME", "FIRST NAME (DONOR OR CONTACT)",
        "TITLE", "GENDER", "ADDRESS", "CITY/TOWN", "COUNTRY", "MOBILE PHONE", "WHATSAPP NO",
        "EMAIL(1)", "EMAIL(2)", "JOB TITLE", "EMPLOYER", "DONOR CATEGORY", "TRADITIONAL TITLE",
        "DONATION DATE", "PAYMENT METHOD", "CURRENCY", "AMOUNT", "REFERENCE", "RECEIPT NO",
        "DESCRIPTION (IN-KIND)", "CAMPAIGN EVENT", "REFERRED BY", "DATA ENTRY DATE",
        "MONEY RECEIVED BY", "DATA ENTRY NAME"
    ];

    dropZone.addEventListener("click", () => fileInput.click());
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("drag-over");
    });

    dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("drag-over");
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        handleFile(file);
    });

    function handleFile(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            validateAndDisplayTable(jsonData);
        };
        reader.readAsArrayBuffer(file);
    }

    function validateAndDisplayTable(data) {
        const thead = dataTable.querySelector("thead");
        const tbody = dataTable.querySelector("tbody");
        thead.innerHTML = "";
        tbody.innerHTML = "";

        if (data.length === 0) return;

        // Extract headers from the file
        const headers = data[0].map(header => header.trim().toUpperCase());

        console.log("Extracted Headers:", headers);

        // Find missing headers
        const missingHeaders = REQUIRED_HEADERS.filter(h => !headers.includes(h));

        if (missingHeaders.length > 0) {
            dropZone.classList.add("error-border"); // Highlight dropzone in red
            errorMessage.innerHTML = `❌ Missing headers: <strong>${missingHeaders.join(", ")}</strong>`;
            return;
        }

        // If headers are correct, reset styles
        dropZone.classList.remove("error-border");
        errorMessage.innerHTML = "";

        // Display headers in table
        const headerRow = document.createElement("tr");
        headers.forEach((header) => {
            const th = document.createElement("th");
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Find indexes of Created By, Modified By, and Date columns
        const createdByIndex = headers.indexOf("DATA ENTRY DATE");
        const modifiedByIndex = headers.indexOf("MODIFIED BY");
        const dateIndex = headers.indexOf("DATE");

        // Display rows
        data.slice(1).forEach((row, index) => {
            const tr = document.createElement("tr");
            tr.classList.add("clickable-row");

            row.forEach((cell) => {
                const td = document.createElement("td");
                td.textContent = cell || ""; // Handle empty cells
                tr.appendChild(td);
            });

            // Extract Created By, Modified By, and Date
            const createdBy = createdByIndex !== -1 ? row[createdByIndex] || "N/A" : "N/A";
            const modifiedBy = modifiedByIndex !== -1 ? row[modifiedByIndex] || "N/A" : "N/A";
            const date = dateIndex !== -1 ? row[dateIndex] || "N/A" : "N/A";

            // Create an expandable row with Created By, Modified By, and Date
            const expandRow = document.createElement("tr");
            expandRow.classList.add("expandable-row");
            expandRow.style.display = "none"; // Hidden initially

            const expandCell = document.createElement("td");
            expandCell.setAttribute("colspan", headers.length);
            expandCell.innerHTML = `
            <strong>Additional Details:</strong><br>
            <br>
            <b>Created By:</b> ${createdBy}<br>
            <b>Modified By:</b> ${modifiedBy}<br>
            <b>Date:</b> ${date}
        `;

            expandRow.appendChild(expandCell);
            tbody.appendChild(tr);
            tbody.appendChild(expandRow);

            // Add click event for expansion
            tr.addEventListener("click", () => {
                expandRow.style.display = expandRow.style.display === "none" ? "table-row" : "none";
            });
        });
    }

    document.getElementById("add-record-btn").addEventListener("click", function () {
        addNewRecord();
    });

    // Function to add a new row
    function addNewRecord() {
        let tableBody = document.querySelector("#data-table tbody");

        let newRow = document.createElement("tr");
        newRow.innerHTML = `
        <td contenteditable="true">New Name</td>
        <td contenteditable="true">New Email</td>
        <td contenteditable="true">New Phone</td>
        <td><button class="edit-btn">Edit</button></td>
    `;

        tableBody.appendChild(newRow);

        // Attach event listener to the new "Edit" button
        newRow.querySelector(".edit-btn").addEventListener("click", function () {
            editRecord(newRow);
        });
    }

    // Function to edit a record
    function editRecord(row) {
        let cells = row.querySelectorAll("td:not(:last-child)");
        cells.forEach(cell => {
            cell.contentEditable = true;
        });
    }


});
