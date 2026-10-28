const STORAGE_KEY = "customerStore";

// 1. Get all previously saved customers
const getCustomers = () => {
    try {
        const savedCustomers = JSON.parse(
            localStorage.getItem(STORAGE_KEY) ?? "[]"
        );

        return Array.isArray(savedCustomers) ? savedCustomers : [];
    } catch (error) {
        console.error("Failed to load customers:", error);
        return [];
    }
};

// 2. Save the complete customer array
const storeCustomers = (customers) =>  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers))

// 3. Extract customer data from the form
const getCustomerdata = (formDetails) => {
    const formData = new FormData(formDetails);

    return {
        name: String(formData.get("customer-name") ?? "").trim(),
        email: String(formData.get("customer-email") ?? "")
            .trim()
            .toLowerCase()
    };
};

// 4. Display the available customers on the page
const renderCustomers = (customers) => {
    const customerList = document.querySelector("#customerList");

    // Stop if the customer list element does not exist
    if (!customerList) return;

    // Remove previously displayed customers
    customerList.replaceChildren();

    if (customers.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "No customers available yet.";
        customerList.append(emptyMessage);
        return;
    }

    // Display every customer
    customers.map((customer) => {
        const listItem = document.createElement("li");

        listItem.textContent = `${customer.name} — ${customer.email}`;

        customerList.append(listItem);
    });
};

// 5. Initialize the customer application
const initApp = () => {
    const customerForm = document.querySelector("#customerForm");
    const customerName = document.querySelector("#customer-name");
    const customerEmail = document.querySelector("#customer-email");
    const errMsg = document.querySelector("#err-msg");

    // Load saved customers when the page opens
    let availableCustomers = getCustomers();

    // Display the existing customers immediately
    renderCustomers(availableCustomers);

    if (!customerForm) {
        console.error("Customer form was not found.");
        return;
    }

    // 6. Listen for new customer submissions
    customerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        errMsg.textContent = "";

        // Get the incoming customer
        const customer = getCustomerdata(customerForm);

        // Validate required fields
        if (!customer.name || !customer.email) {
            errMsg.textContent = "Name and email are required!";

            if (!customer.name) {
                customerName.focus();
            } else {
                customerEmail.focus();
            }

            return;
        }

        // Reload the latest saved array before checking for duplicates
        availableCustomers = getCustomers();

        // Check whether the email already exists
        const customerExists = availableCustomers.some(
            (existingCustomer) =>
                existingCustomer.email?.trim().toLowerCase() ===
                customer.email
        );

        if (customerExists) {
            errMsg.textContent =
                "A customer with this email already exists.";
errMsg.classList.toggle("hidden")
            customerEmail.focus();
            return;
        }

        // Append the incoming customer to the existing array
        const allCustomers = [
            ...availableCustomers,
            customer
        ];

        // Save the complete list
        storeCustomers(allCustomers);

        // Update the in-memory customer list
        availableCustomers = allCustomers;

        // Refresh the displayed list immediately
        renderCustomers(availableCustomers);

        // Provide feedback and clear the form
        errMsg.textContent = "Customer added successfully!";

        customerForm.reset();
        customerName.focus();

        console.log("All customers:", availableCustomers);
    });

    // 7. Refresh the list if another tab changes localStorage
    window.addEventListener("storage", (event) => {
        if (event.key === STORAGE_KEY || event.key === null) {
            availableCustomers = getCustomers();
            renderCustomers(availableCustomers);
        }
    });
};

// 8. Start after the HTML has been parsed
document.addEventListener("DOMContentLoaded", initApp);