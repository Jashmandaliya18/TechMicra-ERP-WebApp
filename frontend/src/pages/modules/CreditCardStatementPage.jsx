import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function CreditCardStatementPage() {
    return (
        <MuiCrudPage
            title="Credit Card Statement"
            endpoint="/credit-card-statements"
            columns={[
                { key: "card_no", label: "Card No" },
                { key: "statement_month", label: "Month" },
                { key: "transaction_date", label: "Transaction Date" },
                { key: "merchant", label: "Merchant" },
                { key: "amount", label: "Amount (₹)" },
                { key: "expense_head", label: "Expense Head" },
            ]}
            fields={[
                { name: "card_no", label: "Card No (last 4 digits)", type: "text", required: false },
                { name: "statement_month", label: "Statement Month (e.g. Mar-2026)", type: "text", required: false },
                { name: "transaction_date", label: "Transaction Date", type: "date", required: false },
                { name: "merchant", label: "Merchant / Vendor", type: "text", required: false },
                { name: "amount", label: "Amount (₹)", type: "number", required: false },
                { name: "expense_head", label: "Expense Head", type: "text", required: false },
                { name: "remarks", label: "Remarks", type: "text", required: false },
            ]}
        />
    );
}
