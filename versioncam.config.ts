import { defineRecorder } from "versioncam";

export default defineRecorder({
    // EspoCRM from this checkout, served by the official espocrm/espocrm Apache
    // image on port 8080, with MySQL beside it. Containers outlive the command
    // that starts them, so the recorder does not start this stack itself:
    // .github/workflows/versioncam.yml starts it before recording, and the same
    // commands start it on your machine.
    baseUrl: "http://localhost:8080",
    clips: "demos/clips/**/*.clip.ts",
    // The clip walks the whole export flow, which takes 15 to 20 seconds to
    // show at a readable pace.
    review: { minSeconds: 15, maxSeconds: 20 },
    // The empty space right of the list's search bar; the default rests on a row.
    cursorStart: { x: 0.7, y: 0.13 },
    auth: {
        // EspoCRM shows its login form at any address until you sign in. The
        // account is the admin that the workflow creates in its own throwaway
        // container, so the password is not a secret anywhere else.
        login: async (page) => {
            await page.locator("#login-form, #header .navbar").first().waitFor();
            if (!(await page.locator("#login-form").isVisible())) return;
            await page.getByLabel("Username").fill("admin");
            await page.getByLabel("Password").fill("demo-recording");
            await page.getByRole("button", { name: "Log in" }).click();
            await page.locator("#header .navbar").waitFor();
        },
    },
});
