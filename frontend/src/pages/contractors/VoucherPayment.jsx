import React, { useState, useEffect } from "react";
import MuiCrudPage from "../../components/MuiCrudPage";
import axios from "axios";

export default function VoucherPayment() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        axios.get("/contractor-employees").then(res => {
            setEmployees(res.data.map(e => ({ label: e.name, value: e.id })));
        });
    }, []);

    const columns = [
        { key: "voucher_no", label: "Voucher No" },
        { key: "employee.name", label: "Employee" },
        { key: "voucher_date", label: "Date" },
        { key: "amount_paid", label: "Amount Paid" },
        { key: "payment_mode", label: "Mode" },
    ];

    const fields = [
        { name: "voucher_no", label: "Voucher No", required: true },
        {
            name: "contractor_employee_id",
            label: "Employee",
            type: "select",
            options: employees,
            required: true
        },
        { name: "voucher_date", label: "Date", type: "date", required: true },
        { name: "amount_paid", label: "Amount Paid", type: "number", required: true },
        {
            name: "payment_mode",
            label: "Payment Mode",
            type: "select",
            options: [
                { label: "Cash", value: "Cash" },
                { label: "Bank Transfer", value: "Bank Transfer" },
                { label: "Cheque", value: "Cheque" }
            ],
            required: true
        },
        { name: "remarks", label: "Remarks" },
    ];

    return (
        <MuiCrudPage
            title="Voucher Payment"
            endpoint="/contractor-vouchers"
            columns={columns}
            fields={fields}
        />
    );
}
