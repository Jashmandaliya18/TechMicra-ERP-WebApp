import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function JournalVoucherPage() {
    return (
        <MuiCrudPage
            title="Voucher Journal"
            endpoint="/journal-vouchers"
            columns={[
                { key: "journal_no", label: "Journal No" },
                { key: "date", label: "Date" },
                { key: "debit_account", label: "Debit Account" },
                { key: "credit_account", label: "Credit Account" },
                { key: "amount", label: "Amount (₹)" },
                { key: "narration", label: "Narration" },
            ]}
            fields={[
                { name: "journal_no", label: "Journal No", type: "text", required: false },
                { name: "date", label: "Date", type: "date" },
                { name: "debit_account", label: "Debit Account", type: "text", required: false },
                { name: "credit_account", label: "Credit Account", type: "text", required: false },
                { name: "amount", label: "Amount (₹)", type: "number", required: false },
                { name: "narration", label: "Narration", type: "text", required: false },
            ]}
        />
    );
}
