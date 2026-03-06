import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function BankRecPage() {
    return (
        <MuiCrudPage
            title="Bank Reconciliation"
            endpoint="/bank-reconciliation"
            columns={[
                { key: "bank_account", label: "Bank Account" },
                { key: "statement_date", label: "Statement Date" },
                { key: "system_balance", label: "System Balance" },
                { key: "bank_balance", label: "Bank Balance" },
                { key: "unreconciled_amount", label: "Unreconciled" },
            ]}
            fields={[
                { name: "bank_account", label: "Bank Account", type: "text", required: false },
                { name: "statement_date", label: "Statement Date", type: "date" },
                { name: "system_balance", label: "System Balance (₹)", type: "number", required: false },
                { name: "bank_balance", label: "Bank Balance (₹)", type: "number", required: false },
                { name: "unreconciled_amount", label: "Unreconciled Amount (₹)", type: "number", required: false },
                { name: "remarks", label: "Remarks", type: "text", required: false },
            ]}
        />
    );
}
