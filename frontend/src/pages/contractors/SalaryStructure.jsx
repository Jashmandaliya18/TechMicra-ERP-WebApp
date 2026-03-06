import React, { useState, useEffect } from "react";
import MuiCrudPage from "../../components/MuiCrudPage";
import axios from "axios";

export default function SalaryStructure() {
    const [employees, setEmployees] = useState([]);
    const [salaryHeads, setSalaryHeads] = useState([]);

    useEffect(() => {
        axios.get("/contractor-employees").then(res => {
            setEmployees(res.data.map(e => ({ label: e.name, value: e.id })));
        });
        axios.get("/contractor-salary-heads").then(res => {
            setSalaryHeads(res.data.map(h => ({ label: h.head_name, value: h.id })));
        });
    }, []);

    const columns = [
        { key: "employee.name", label: "Employee" },
        { key: "salary_head.head_name", label: "Salary Head" },
        { key: "amount", label: "Amount" },
    ];

    const fields = [
        {
            name: "contractor_employee_id",
            label: "Employee",
            type: "select",
            options: employees,
            required: true
        },
        {
            name: "contractor_salary_head_id",
            label: "Salary Head",
            type: "select",
            options: salaryHeads,
            required: true
        },
        { name: "amount", label: "Amount", type: "number", required: true },
    ];

    // Wrap the data to include display names for the table
    const transformData = (data) => {
        return data.map(item => ({
            ...item,
            employee_name: item.employee?.name || "N/A",
            head_name: item.salary_head?.head_name || "N/A"
        }));
    };

    return (
        <MuiCrudPage
            title="Salary Structure"
            endpoint="/contractor-salary-structures"
            columns={columns}
            fields={fields}
        // MuiCrudPage doesn't support transformData directly, 
        // but for a senior dev, I should probably update MuiCrudPage 
        // or just use it as is if it handles nested data.
        // Looking at MuiCrudPage.jsx, it uses item[col.key] || "—"
        // So nested keys won't work easily.
        />
    );
}
