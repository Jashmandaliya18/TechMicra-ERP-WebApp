import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function PaymentReceiptPage() {
    return (
        <MuiCrudPage
            title="Payment & Receipt Vouchers"
            endpoint="/payment-receipts"
            columns={[
                { key: "voucher_type", label: "Type" },
                { key: "date", label: "Date" },
                { key: "party_name", label: "Party Name" },
                { key: "amount", label: "Amount (₹)" },
                { key: "mode", label: "Mode" },
                { key: "reference_no", label: "Ref No" },
            ]}
            fields={[
                {
                    name: "voucher_type", label: "Voucher Type", type: "select",
                    options: [
                        { value: "payment", label: "Payment" },
                        { value: "receipt", label: "Receipt" },
                    ],
                },
                { name: "date", label: "Date", type: "date" },
                { name: "party_name", label: "Party Name", type: "text", required: false },
                { name: "amount", label: "Amount (₹)", type: "number", required: false },
                {
                    name: "mode", label: "Mode", type: "select",
                    options: [
                        { value: "cash", label: "Cash" },
                        { value: "bank", label: "Bank" },
                        { value: "cheque", label: "Cheque" },
                        { value: "online", label: "Online" },
                    ],
                    required: false,
                },
                { name: "reference_no", label: "Reference No", type: "text", required: false },
                { name: "remarks", label: "Remarks", type: "text", required: false },
            ]}
        />
    );
}
