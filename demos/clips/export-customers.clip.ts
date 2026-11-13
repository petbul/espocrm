import { clip } from "versioncam";

// Sample accounts, so the list has something to filter and export. Most are
// customers; the others show that the filter does something.
const ACCOUNTS = [
    ["Northwind Traders", "Customer", "Retail", "United States"],
    ["Brightline Health", "Customer", "Healthcare", "France"],
    ["Copperleaf Manufacturing", "Customer", "Manufacturing", "Germany"],
    ["Harbor & Finch Bank", "Customer", "Banking", "United Kingdom"],
    ["Lumen Arena", "Partner", "Entertainment & Leisure", "Poland"],
    ["Meridian Finance", "Customer", "Finance", "Netherlands"],
    ["Voltix Electronics", "Customer", "Electronics", "Japan"],
    ["Atlas Venture Group", "Investor", "Finance", "United States"],
    ["Thread & Needle", "Customer", "Apparel & Accessories", "Italy"],
    ["Summit Sports Co.", "Customer", "Sports", "Canada"],
    ["Bluewave Logistics", "Reseller", "Shipping", "Denmark"],
    ["Greenfield Foods", "Customer", "Food & Beverage", "Spain"],
];

export default clip("export-customers", { title: "Export customers from the Accounts list", seed: 7 }, async (s) => {
    await s.offCamera(async (page) => {
        // The admin that the workflow creates in its throwaway container.
        const headers = { "Espo-Authorization": Buffer.from("admin:demo-recording").toString("base64") };
        const base = "http://localhost:8080/api/v1/Account";
        const existing = await (await page.request.get(`${base}?maxSize=1`, { headers })).json();
        if (existing.total > 0) return;
        for (const [name, type, industry, billingAddressCountry] of ACCOUNTS) {
            await page.request.post(base, { headers, data: { name, type, industry, billingAddressCountry } });
        }
    });
    await s.open("/#Account");
    s.caption("Export your customers from the Accounts list");
    await s.hold(900);

    // The menu beside the search button adds a filter on any field.
    await s.click(s.css(".search-row button[data-toggle='dropdown']:not(.filters-button)"));
    await s.settle();
    await s.hold(300);
    await s.click(s.css("a[data-action='addFilter'][data-name='type']"));
    await s.settle({ label: "type filter added" });
    await s.hold(500);

    await s.click(s.css(".filter-type .input-container .selectize-input"));
    await s.settle();
    await s.hold(300);
    await s.click(s.css(".filter-type .selectize-dropdown-content [data-value='Customer']"));
    await s.settle();
    await s.hold(500);

    await s.click(s.css(".search-row button[data-action='search']"));
    await s.settle({ label: "customers listed" });
    await s.hold(900);

    await s.click(s.css("th .checkbox-dropdown .dropdown-toggle"));
    await s.settle();
    await s.hold(300);
    await s.click(s.byRole("button", { name: "Select All Results" }));
    await s.settle({ label: "all selected" });
    await s.hold(800);

    await s.click(s.byRole("button", { name: "Actions" }));
    await s.settle({ label: "actions open" });
    await s.hold(900);

    await s.click(s.css(".actions-menu:visible a.mass-action[data-action='export']"));
    await s.settle({ label: "export dialog" });
    await s.hold(1500);

    await s.click(s.css(".modal-dialog button[data-name='export']"));
    await s.settle({ label: "exported" });
    await s.hold(1200);
});
