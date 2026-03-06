import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function GstJournalPage() {
    return (
        <MuiCrudPage
            title="Journal Voucher (GST)"
            endpoint="/gst-journals"
            columns={[
                { key: "date", label: "Date" },
                { key: "gst_ledger", label: "GST Ledger" },
                { key: "adjustment_type", label: "Adjustment Type" },
                { key: "amount", label: "Amount (₹)" },
                { key: "remarks", label: "Remarks" },
            ]}
            fields={[
                { name: "date", label: "Date", type: "date" },
                {
                    name: "gst_ledger", label: "GST Ledger", type: "select",
                    options: [
                        { value: "input", label: "Input GST" },
                        { value: "output", label: "Output GST" },
                    ],
                    required: false,
                },
                {
                    name: "adjustment_type", label: "Adjustment Type", type: "select",
                    options: [
                        { value: "reversal", label: "Reversal" },
                        { value: "adjustment", label: "Adjustment" },
                    ],
                    required: false,
                },
                { name: "amount", label: "Amount (₹)", type: "number", required: false },
                { name: "remarks", label: "Remarks", type: "text", required: false },
            ]}
        />
    );
}
