import { validateEmail } from "./validate-email.js"
// * Updating User details
const processUserDetails = (lastestCustomerDetails,availbaleCustomers)=>{
    const customer=cleanCustomerDetails(lastestCustomerDetails)
    const upDatedRecords =  availbaleCustomers.map(user=>{
      if (user.email.trim().toLowerCase() === customer.email) {
    return{
        ...user,
        name:customer.name
    }
}
else{
    return user
}
    })
    return upDatedRecords
    
}
export const cleanCustomerDetails = (customerDetails)=>{
const form = new FormData(customerDetails)
    return{
        name: String(form.get("customer-name").trim() ?? ""),
        email: String(form.get("customer-email").trim().toLowerCase() ?? ""),
    }

}
export default processUserDetails;