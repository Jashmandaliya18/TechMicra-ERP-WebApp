# TechMicra ERP - Input Fields Dictionary

This document serves as a comprehensive guide to understanding the data entry fields across all major modules of the TechMicra ERP system. It explains what each field is for and the type of data it expects from the user.

---

## 1. Human Resources (HR) Module

### 1.1 Employee Master `(/employees)`
- **Employee Code**: `[Text/Alphanumeric]` A unique identifier assigned to the employee (e.g., EMP-001). Must be unique.
- **Name**: `[Text]` Full legal name of the employee.
- **Department**: `[Dropdown/Text]` The department the employee belongs to (e.g., Production, HR, Sales).
- **Designation**: `[Text]` The job title of the employee (e.g., Senior Welder, Sales Executive).
- **Mobile**: `[Number/Text]` Contact phone number of the employee.
- **Date of Joining**: `[Date DatePicker]` The exact date the employee started working at the company.
- **Basic Salary**: `[Number]` The base, fixed monthly wage of the employee before deductions or allowances.
- **Bank Details**: `[Text/Multiline]` Contains the Account Number, Bank Name, and IFSC code for salary deposits.
- **Status**: `[Dropdown]` Current employment status (`Active`, `On-Leave`, or `Terminated`).

### 1.2 Employee Advances / Loans `(/employee-advances)`
- **Employee**: `[Dropdown]` Select an existing employee from the system.
- **Advance Amount**: `[Number]` The total monetary value of the loan or advance being given.
- **Date**: `[Date DatePicker]` The date the advance was disbursed.
- **Deduction Per Month**: `[Number]` How much money should be automatically deducted from the employee's future salary sheets to repay the loan.
- **Remarks/Reason**: `[Text]` Optional notes explaining why the advance was given.

---

## 2. Finance & Accounting Module

### 2.1 Payment & Receipt Vouchers `(/payment-receipts)`
- **Voucher Type**: `[Dropdown]` Defines if money is coming into the business (`Receipt`) or leaving the business (`Payment`).
- **Date**: `[Date DatePicker]` The actual date the transaction took place.
- **Party Name**: `[Text/Dropdown]` The name of the client paying you, or the vendor you are paying.
- **Amount (₹)**: `[Number]` The exact financial value of the transaction.
- **Mode**: `[Dropdown]` How the transaction was executed (`Cash`, `Bank`, `Cheque`, or `Online`).
- **Reference No**: `[Text]` The Cheque number or UPI/UTR transaction ID for reconciliation purposes.
- **Remarks**: `[Text]` Specific notes regarding the payment.

### 2.2 Contra Vouchers `(/contra-vouchers)`
*(Used only for moving money entirely within the company's own accounts)*
- **Voucher Source**: `[Dropdown]` Where the money is coming from (e.g., Cash Drawer, HDFC Bank).
- **Voucher Destination**: `[Dropdown]` Where the money is going to (e.g., SBI Bank, Cash Drawer).
- **Amount**: `[Number]` Amount being transferred.
- **Date**: `[Date]` Date of internal transfer.
- **Mode & Reference**: `[Text]` Cheque number if depositing cash to a bank, or vice-versa.

### 2.3 Bank Reconciliation `(/bank-reconciliation)`
- **Bank Account**: `[Dropdown]` The specific company bank account being reconciled.
- **Statement Date**: `[Date DatePicker]` The ending date of the bank statement being evaluated.
- **Reconciled Amount**: `[Number]` The closing balance verified matching the physical bank statement.
- **Remarks**: `[Text]` Notes on any discrepancies or pending clearing cheques.

### 2.4 GST Journal Vouchers `(/gst-journals)`
- **GST Type**: `[Dropdown]` E.g., IGST, CGST, SGST.
- **Journal Type**: `[Dropdown]` e.g., `Input Tax Credit (ITC)` or `Output Liability`.
- **Amount**: `[Number]` Tax amount being recorded.
- **Applicable Invoice No**: `[Text]` Linking the GST entry to a specific sales or purchase invoice.

---

## 3. Production & Quality Module

### 3.1 Job Orders / Route Cards `(/routecards)`
- **Batch No**: `[Text]` A unique, auto-generated sequence number for the production run.
- **Product ID**: `[Dropdown]` The finished good being manufactured.
- **Planned Quantity**: `[Number]` The target amount of units to be produced.
- **Start Date & End Date**: `[Date]` The scheduled timeline for this manufacturing batch.
- **BOM Reference**: `[Dropdown]` The Bill of Materials (recipe) to be used to calculate raw material requirements.

### 3.2 Process Quality Control (QC) `(/process-quality-controls)`
- **Route Card / Batch No**: `[Dropdown]` Selecting the active production batch being inspected.
- **Stage**: `[Dropdown]` The specific manufacturing stage (e.g., Molding, Assembly, Polishing).
- **Inspected Quantity**: `[Number]` Number of items checked by the QA officer.
- **Accepted Quantity**: `[Number]` Number of items that passed quality parameters.
- **Rejected Quantity**: `[Number]` Number of defective items.
- **Reason for Rejection**: `[Text]` Root cause analysis or defect descriptions for the rejected items.

---

## 4. Sales & Logistics Module

### 4.1 Sale Orders `(/sale-orders)`
- **Customer Name**: `[Dropdown]` Client placing the order.
- **Order Date**: `[Date]` Date the PO was received.
- **Expected Delivery Date**: `[Date]` Promised timeline to dispatch goods.
- **Line Items**: `[Dynamic Table]` Requires selecting combinations of `Product`, `Quantity`, `Unit Price`, and calculating `Total Amount`.

### 4.2 Logistics Bookings & Dispatch `(/logistics-bookings)`
- **Transporter Name**: `[Dropdown]` The logistic partner or trucking company.
- **Vehicle Number**: `[Text]` License plate of the transport vehicle.
- **Driver Contact**: `[Text/Number]` Phone number of the logistics driver.
- **Freight Amount**: `[Number]` The cost of shipping.
- **Dispatch Advice / Challan Ref**: `[Dropdown]` Linking the shipment to the specific internal delivery challans representing the goods on board.

---

## 5. Summary Note
Every data table across the ERP uses these inputs to maintain referential integrity. `Dropdowns` usually pull data dynamically from a "Master" table (e.g., the Customer dropdown pulls from Customer Master, keeping spelling and billing addresses perfectly consistent). Date pickers enforce valid timeline formats, and Number fields natively prevent alphabetical characters from corrupting financial calculations.
