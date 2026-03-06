import React, { useState, useEffect } from "react";
import MuiCrudPage from "../../components/MuiCrudPage";
import axios from "axios";

export default function AdvanceMemo() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        axios.get("/contractor-employees").then(res => {
            setEmployees(res.data.map(e => ({ label: e.name, value: e.id })));
        });
    }, []);

    const columns = [
        { key: "advance_no", label: "Advance No" },
        { key: "employee.name", label: "Employee" },
        { key: "advance_date", label: "Date" },
        { key: "amount", label: "Amount" },
        { key: "remaining_amount", label: "Remaining" },
    ];

    const fields = [
        { name: "advance_no", label: "Advance No", required: true },
        {
            name: "contractor_employee_id",
            label: "Employee",
            type: "select",
            options: employees,
            required: true
        },
        { name: "advance_date", label: "Date", type: "date", required: true },
        { name: "amount", label: "Amount", type: "number", required: true },
        { name: "remaining_amount", label: "Remaining Amount", type: "number", required: true },
    ];

    return (
        <MuiCrudPage
            title="Advance Memo"
            endpoint="/contractor-advances"
            columns={columns}
            fields={fields}
        />
    );
}
