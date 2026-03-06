import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function ContraVoucherPage() {
    return (
        <MuiCrudPage
            title="Contra Voucher (Fund Transfer)"
            endpoint="/contra-vouchers"
            columns={[
                { key: "date", label: "Date" },
                { key: "from_account", label: "From Account" },
                { key: "to_account", label: "To Account" },
                { key: "amount", label: "Amount (₹)" },
                { key: "remarks", label: "Remarks" },
            ]}
            fields={[
                { name: "date", label: "Date", type: "date" },
                { name: "from_account", label: "From Account", type: "text", required: false },
                { name: "to_account", label: "To Account", type: "text", required: false },
                { name: "amount", label: "Amount (₹)", type: "number", required: false },
                { name: "remarks", label: "Remarks", type: "text", required: false },
            ]}
        />
    );
}
