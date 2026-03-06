import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function MtaPage() {
    return (
        <MuiCrudPage
            title="Material Transfer Acknowledgement (MTA)"
            endpoint="/mta"
            columns={[
                { key: "mta_no", label: "MTA No" },
                { key: "from_department", label: "From Dept" },
                { key: "to_department", label: "To Dept" },
                { key: "item", label: "Item" }
            ]}
            fields={[
                { name: "mta_no", label: "MTA No", type: "text" },
                { name: "from_department", label: "From Department", type: "text" },
                { name: "to_department", label: "To Department", type: "text" },
                { name: "item", label: "Item", type: "text" },
                { name: "qty", label: "Quantity", type: "number" },
                { name: "received_by", label: "Received By", type: "text" },
                { name: "transfer_date", label: "Transfer Date", type: "date" }
            ]}
        />
    );
}
