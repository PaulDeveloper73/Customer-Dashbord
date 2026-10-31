// * Updating User details
const processUserDetails = (lastestCustomerDetails,availbaleCustomers)=>{

    console.log("Processing user detailnow... ready1")
    const customer=cleanCustomerDetails(lastestCustomerDetails)
    console.log(customer)
    
}
export const cleanCustomerDetails = (customerDetails)=>{
const form = new FormData(customerDetails)
    return{
        name: String(form.get("customer-name") ?? ""),
        email: String(form.get("customer-email") ?? ""),
    }

}
export default processUserDetails;