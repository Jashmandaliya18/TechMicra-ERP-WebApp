import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function SalaryHeadMaster() {
    const columns = [
        { key: "head_name", label: "Head Name" },
        { key: "type", label: "Type" },
        { key: "is_active", label: "Active" },
    ];

    const fields = [
        { name: "head_name", label: "Head Name", required: true },
        {
            name: "type",
            label: "Type",
            type: "select",
            options: [
                { label: "Earning", value: "Earning" },
                { label: "Deduction", value: "Deduction" }
            ],
            required: true
        },
        {
            name: "is_active",
            label: "Is Active",
            type: "select",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false }
            ]
        },
    ];

    return (
        <MuiCrudPage
            title="Salary Head Master"
            endpoint="/contractor-salary-heads"
            columns={columns}
            fields={fields}
        />
    );
}
