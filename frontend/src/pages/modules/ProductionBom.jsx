import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function ProductionBom() {
    return (
        <MuiCrudPage
            title="Bill of Materials"
            endpoint="/bom"
            columns={[
                { key: "finished_good", label: "Finished Good" },
                { key: "process_name", label: "Process Name" },
                { key: "machine", label: "Machine" },
                { key: "output_qty", label: "Output QTY" }
            ]}
            fields={[
                { name: "finished_good", label: "Finished Good", type: "text" },
                { name: "process_name", label: "Process Name", type: "text" },
                { name: "machine", label: "Machine", type: "text" },
                { name: "raw_material_input", label: "Raw Material Input (JSON or text)", type: "text" },
                { name: "output_qty", label: "Output Quantity", type: "number" }
            ]}
        />
    );
}
