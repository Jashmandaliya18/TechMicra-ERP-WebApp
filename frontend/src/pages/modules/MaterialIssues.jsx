import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function MaterialIssues() {
    return (
        <MuiCrudPage
            title="Material Issues"
            endpoint="/material-issues"
            columns={[
                { key: "issue_id", label: "Issue ID" },
                { key: "route_card_ref", label: "Route Card Ref" },
                { key: "item", label: "Item" },
                { key: "qty_issued", label: "Qty Issued" }
            ]}
            fields={[
                { name: "issue_id", label: "Issue ID", type: "text" },
                { name: "route_card_ref", label: "Route Card Reference", type: "text" },
                { name: "item", label: "Item", type: "text" },
                { name: "qty_requested", label: "Qty Requested", type: "number" },
                { name: "qty_issued", label: "Qty Issued", type: "number" },
                { name: "issued_date", label: "Issued Date", type: "date" }
            ]}
        />
    );
}
