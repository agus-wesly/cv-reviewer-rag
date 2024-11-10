import { getContextFromChroma } from "./utils/chroma";
import { extractCV } from "./utils/pdf";
import type { AspectKey } from "./utils/types";

const PORT = 5173;
const MAX_TIMEOUT = 255;

const server = Bun.serve({
    port: PORT,
    idleTimeout: MAX_TIMEOUT,
    static: {
        "/": new Response(await Bun.file("./src/index.html").bytes(), {
            headers: {
                "Content-Type": "text/html",
            },
        }),
        "/output.css": new Response(await Bun.file(`./src/output.css`).bytes(), {
            headers: {
                "Content-Type": "text/css",
            },
        }),
    },
    async fetch(req) {
        const url = new URL(req.url);
        if (req.method === "POST") {
            if (!isAllowedRequest(req))
                return new Response(JSON.stringify({ ok: false }), { status: 401 });
            if (url.pathname === "/review") {
                const cv = (await req.formData()).get("cv") as File;
                if (!cv)
                    return new Response(JSON.stringify({ ok: false }), { status: 401 });

                const content = await extractCV(cv);
                if (!content)
                    return new Response(
                        JSON.stringify({ message: "Cannot extract CV." }),
                        { status: 401 },
                    );
                console.log({ content });
                //TODO: Process the CV
                return new Response(JSON.stringify({ ok: true }), { status: 200 });
            }
        }
        return new Response("The page you are looking is not found", {
            status: 404,
        });
    },
});

console.log("Listening on server : ", server.port);

function isAllowedRequest(request: Request) {
    const allowed = ["http://localhost:5173"];
    const origin = request.headers.get("Origin");
    return allowed.includes(origin ?? "");
}
