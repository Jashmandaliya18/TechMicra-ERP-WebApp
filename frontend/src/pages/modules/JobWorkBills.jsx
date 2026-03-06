import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function JobWorkBills() {
    return (
        <MuiCrudPage
            title="Job Work Billbook"
            endpoint="/job-bills"
            columns={[
                { key: "bill_no", label: "Bill No" },
                { key: "job_order_ref", label: "Job Order Ref" },
                { key: "total_amount", label: "Total Amount" }
            ]}
            fields={[
                { name: "bill_no", label: "Bill No", type: "text" },
                { name: "job_order_ref", label: "Job Order Reference", type: "text" },
                { name: "labor_charges", label: "Labor Charges", type: "number" },
                { name: "gst", label: "GST Amount", type: "number" },
                { name: "total_amount", label: "Total Amount", type: "number" }
            ]}
        />
    );
}
