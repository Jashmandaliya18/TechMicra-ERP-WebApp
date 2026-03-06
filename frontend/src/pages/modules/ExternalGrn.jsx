import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function ExternalGrn() {
    return (
        <MuiCrudPage
            title="External GRN & IQC"
            endpoint="/external-grn"
            columns={[
                { key: "grn_no", label: "GRN No" },
                { key: "challan_ref", label: "Challan Ref" },
                { key: "received_qty", label: "Received Qty" },
                { key: "passed_qty", label: "Passed Qty" }
            ]}
            fields={[
                { name: "grn_no", label: "GRN No", type: "text" },
                { name: "challan_ref", label: "Challan Reference", type: "text" },
                { name: "received_qty", label: "Received Qty", type: "number" },
                { name: "passed_qty", label: "Passed Qty", type: "number" },
                { name: "rejected_qty", label: "Rejected Qty", type: "number" }
            ]}
        />
    );
}
