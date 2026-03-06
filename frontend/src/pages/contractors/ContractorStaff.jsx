import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function ContractorStaff() {
    const columns = [
        { key: "employee_code", label: "Worker ID" },
        { key: "name", label: "Worker Name" },
        { key: "contractor_company", label: "Contractor Firm" },
        { key: "department", label: "Department" },
        { key: "designation", label: "Designation" },
        { key: "status", label: "Status" },
    ];

    const fields = [
        { name: "employee_code", label: "Worker ID", required: true },
        { name: "name", label: "Worker Name", required: true },
        { name: "contractor_company", label: "Contractor Firm", required: true },
        { name: "department", label: "Department" },
        { name: "designation", label: "Designation" },
        { name: "date_of_joining", label: "Date of Joining", type: "date", required: true },
        { name: "daily_wage", label: "Daily Wage", type: "number", required: true },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" }
            ],
            required: true
        },
    ];

    return (
        <MuiCrudPage
            title="Contractor Staff"
            endpoint="/contractor-employees"
            columns={columns}
            fields={fields}
        />
    );
}
