import React, { useState, useEffect } from "react";
import MuiCrudPage from "../../components/MuiCrudPage";
import axios from "axios";

export default function SalarySheet() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        axios.get("/contractor-employees").then(res => {
            setEmployees(res.data.map(e => ({ label: e.name, value: e.id })));
        });
    }, []);

    const columns = [
        { key: "employee.name", label: "Employee" },
        { key: "month", label: "Month" },
        { key: "year", label: "Year" },
        { key: "days_worked", label: "Days Worked" },
        { key: "net_payable", label: "Net Payable" },
        { key: "payment_status", label: "Status" },
    ];

    const fields = [
        {
            name: "contractor_employee_id",
            label: "Employee",
            type: "select",
            options: employees,
            required: true
        },
        { name: "month", label: "Month (1-12)", type: "number", required: true },
        { name: "year", label: "Year", type: "number", required: true },
        { name: "days_worked", label: "Days Worked", type: "number", required: true },
        { name: "gross_salary", label: "Gross Salary", type: "number", required: true },
        { name: "total_deductions", label: "Total Deductions", type: "number", required: true },
        { name: "net_payable", label: "Net Payable", type: "number", required: true },
        {
            name: "payment_status",
            label: "Payment Status",
            type: "select",
            options: [
                { label: "Pending", value: "Pending" },
                { label: "Paid", value: "Paid" }
            ],
            required: true
        },
    ];

    return (
        <MuiCrudPage
            title="Salary Sheet"
            endpoint="/contractor-salary-sheets"
            columns={columns}
            fields={fields}
        />
    );
}
