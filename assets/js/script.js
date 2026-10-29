
const getCustomersData  =()=>{
    try{
        const records = JSON.parse(localStorage.getItem("customerData") ?? "[]")
        if(!Array.isArray(records)){
            throw  new Error("Customer data format is not compatible")
        }
        return records

    }
    catch(error){
        console.log("Failed to load the customer data!")
        return []

    }
    finally{
        console.log("Processing saved customer details")
    }
}
const storeCustomers = (availbaleCustomers,newRecord)=>{
        const customerRecords = [
            newRecord,
            ...availbaleCustomers
        ]
        localStorage.setItem("customerData",JSON.stringify(customerRecords))

    }
const renderCustomers = (customers, { onEdit, onDelete } = {}) => {
    const customerList = document.querySelector("#customerList");

    // 1. Check whether the customer list container exists
    if (!customerList) {
        console.error("Customer list section not found!");
        return;
    }

    // 2. Ensure customers is an array
    if (!Array.isArray(customers)) {
        console.error("Invalid customer data. Expected an array.");
        return;
    }

    // 3. Create the table
    const table = document.createElement("table");
    table.className = "customer-table";
    table.classList.add("w-full","table")
    table.setAttribute("aria-label", "Customer list");

    // 4. Create the table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    ["Initials", "Customer Name", "Email Address", "Actions"].forEach(
        (heading) => {
            const th = document.createElement("th");
            th.scope = "col";
            th.textContent = heading;
            headerRow.appendChild(th);
        }
    );

    thead.appendChild(headerRow);

    // 5. Create the table body
    const tbody = document.createElement("tbody");

    // Display a message when there are no customers
    if (customers.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 4;
        cell.textContent = "No customers available.";
        cell.className = "empty-state";

        row.appendChild(cell);
        tbody.appendChild(row);
    } else {
        // 6. Generate a row for each customer
        customers.forEach((customer) => {
            const row = document.createElement("tr");

            // Customer data with safe fallbacks
            const customerId = customer.id ?? "";
            const customerName =
                String(customer.name ?? "").trim() || "Unknown customer";

            const customerEmail =
                String(customer.email ?? "").trim() || "No email provided";

            // 7. Generate the customer abbreviation
            const nameParts = customerName.split(/\s+/);

          const firstInitial = nameParts[0]?.[0] ?? "";

const lastName = nameParts.length > 1
    ? nameParts[nameParts.length - 1]
    : "";

const lastInitial = lastName[0] ?? "";

// First letter of first name + first letter of last name
const abbreviation = (
    firstInitial + lastInitial
).toUpperCase();
            // Initials cell
            const initialsCell = document.createElement("td");
            const initialsBadge = document.createElement("span");

            initialsBadge.className = "customer-avatar";
            initialsBadge.textContent = abbreviation || "?";
            initialsBadge.setAttribute(
                "aria-label",
                `Customer initials: ${abbreviation || "unknown"}`
            );

            initialsCell.appendChild(initialsBadge);

            // Customer name cell
            const nameCell = document.createElement("td");
            const nameElement = document.createElement("p");

            nameElement.className = "customer-name";
            nameElement.textContent = customerName;

            nameCell.appendChild(nameElement);

            // Email cell
            const emailCell = document.createElement("td");

            emailCell.textContent = customerEmail;

            // 8. Create the actions cell
            const actionsCell = document.createElement("td");
            actionsCell.className = "customer-actions";

            // Edit button
            const editButton = document.createElement("button");

            editButton.type = "button";
            editButton.textContent = "Edit";
            editButton.className = "customer-edit-btn";
            editButton.setAttribute(
                "aria-label",
                `Edit ${customerName}`
            );

            editButton.addEventListener("click", () => {
                if (typeof onEdit === "function") {
                    onEdit(customer);
                } else {
                    customerList.dispatchEvent(
                        new CustomEvent("customer:edit", {
                            bubbles: true,
                            detail: customer
                        })
                    );
                }
            });

            // Delete button
            const deleteButton = document.createElement("button");

            deleteButton.type = "button";
            deleteButton.textContent = "Delete";
            deleteButton.className = "customer-delete-btn";
            deleteButton.id= `${customers.emai}`
            deleteButton.setAttribute(
                "aria-label",
                `Delete ${customerName}`
            );

            deleteButton.addEventListener("click", () => {
                if (typeof onDelete === "function") {
                    onDelete(customer);
                } else {
                    customerList.dispatchEvent(
                        new CustomEvent("customer:delete", {
                            bubbles: true,
                            detail: customer
                        })
                    );
                }
            });

            // Add buttons to the actions cell
            actionsCell.append(editButton, deleteButton);

            // 9. Add all cells to the row
            row.append(
                initialsCell,
                nameCell,
                emailCell,
                actionsCell
            );

            // Store the ID on the row if available
            if (customer.id != null) {
                row.dataset.customerId = String(customerId);
            }

            // Add the row to the table body
            tbody.appendChild(row);
        });
    }

    // 10. Assemble and render the completed table
    table.append(thead, tbody);

    // Replace old content instead of duplicating the table
    customerList.replaceChildren(table);

    return table;
};
const getCustomers  = (newUserDetails)=>{
    const form =  new FormData(newUserDetails)
    return{
        name: String(form.get("customer-name") ?? "").trim(),
        email: String(form.get("customer-email") ?? "").trim().toLowerCase()
    }
}
// * GLobal customer searching
const customerGlobalSearch = (dataSource,query)=>{
    const searchTerm = query.trim().toLowerCase()
    if (!searchTerm || searchTerm === null) {
        console.log("Please enter what you want to seach.")
        renderCustomers(dataSource)
        return dataSource  
    }

    const searchResult = dataSource.filter(user=>{
        const name = String(user.name.toLowerCase().trim() ?? "")
        const email =  String(user.email.toLowerCase().trim() ?? "")

        return(
        name.includes(searchTerm)|| email.includes(searchTerm)
        )
    })

    if (searchResult.length <= 0) {
    // loadingMessage.textContent = 'No Data Available!, Try Again!'
    // console.log("No data available...")
  } else {
    // loadingMessage.textContent = 'Loading Invoices...'
    // console.log("Loading data...")

  }
  const customerResults = searchResult.length > 0 ? searchResult : []
  renderCustomers(customerResults)
  return customerResults
}



const initApp = ()=>{
    // Add an event listener to the form
    const customerForm =  document.querySelector("#customerForm")
    const customerName=  document.querySelector("#customer-name")
    const customerEmail=  document.querySelector("#customer-email")
    const errMsg=  document.querySelector("#err-msg")
    const submitBtn=  document.querySelector("#submit-btn")
    const searchBtn=  document.querySelector("#search")
    const availableRecords =  document.querySelector("#available-records")
    errMsg.textContent = ""
    let availbaleCustomers= getCustomersData()
    availableRecords.textContent = `${availbaleCustomers.length}  Matching records.`
    console.log(availbaleCustomers)
    // ** Render available customers
    renderCustomers(availbaleCustomers)
    // validate customer form
    if (!customerForm) {
        console.log("Customer form not found!")
        return        
    }
    // Manage user search
    searchBtn?.addEventListener('keyup',(e)=>{
       const customerSearchedRecords =  customerGlobalSearch(availbaleCustomers,e.target.value)
        availableRecords.textContent = `${customerSearchedRecords.length}  Matching records.`

    })
    customerForm.addEventListener('submit',(e)=>{
        e.preventDefault()
        const customer =  getCustomers(customerForm)
        console.log(customer)
        // Check if all fields have data
        if (!customer.name || !customer.email) {
            errMsg.textContent = "Name and Email Address are required."
            errMsg.classList.toggle("hidden")
            if (!customer.name) {
                customerName.focus()
                
            }
            if (!customer.email) {
                customerEmail.focus()
                
            }
            return
            
        }
        // refresh the list here...
         availbaleCustomers= getCustomersData()
        // check if  user already exists
        const existingUser  = availbaleCustomers.find(user=>user.email.toLowerCase().trim() === customer.email)
        if (existingUser) {
          errMsg.textContent = "Customer with this email already exists!"
          errMsg.classList.toggle("hidden")
            errMsg.classList.add("text-red-700","bg-red-50")
                         errMsg.classList.remove("text-green-700","bg-green-50")
          customerEmail.focus()
            return       
        }
        else{
            // Save user
   submitBtn.textContent = "Processing..."

   submitBtn.disabled=true;
   customerForm.disabled=true;
   submitBtn.style.cursor = "wait"
   submitBtn.style.opacity = ".4"
   submitBtn.classList.add("animate-pulse")
            setTimeout(()=>{
                errMsg.textContent = "Customer saved sucessfully"
                         errMsg.classList.remove("hidden")
                         errMsg.classList.remove("text-red-700","bg-red-50")
                         errMsg.classList.add("text-green-700","bg-green-50")
                           submitBtn.disabled=true;
   submitBtn.style.cursor = "pointer"
   submitBtn.style.opacity = "1"
   submitBtn.disabled=false;
   customerForm.disabled=false;
   submitBtn.textContent = "Add Customer"

    submitBtn.classList.remove("animate-pulse")
                          customerForm.reset()
                         customerName.focus()
                         if (errMsg.classList.contains("text-green-700")) {
                             
                             setTimeout(() => {
                                              errMsg.classList.add("hidden")
                                               errMsg.classList.remove("text-red-700","bg-red-50")
                                               
                                            }, 4000);
                                        }
                                    },3000)
                                }
                                
                                
                                
                                // Store customer records to local storage
storeCustomers(availbaleCustomers,customer)
// refresh the  customer list
availbaleCustomers =  getCustomersData()
//    Render the customer data
renderCustomers(availbaleCustomers)
 availableRecords.textContent = `${availbaleCustomers.length}  Matching records.`

                                
    })




}


window.addEventListener('load',()=>{
    initApp()
})