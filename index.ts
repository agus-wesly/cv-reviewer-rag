import { extractCV, processCV } from "./utils/pdf";

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
        "/script.js": new Response(await Bun.file(`./src/script.js`).bytes(), {
            headers: {
                "Content-Type": "application/javascript; charset=utf-8",
            },
        }),
    },
    async fetch(req) {
        const url = new URL(req.url);
        if (isAssetsRequest(url)) {
            try {
                const pathname = url.pathname;
                return new Response(await Bun.file(`.${pathname}`).bytes(), {
                    status: 200,
                    headers: {
                        "Content-Type": getAssetsContentType(pathname)
                    }
                });
            } catch (error) {
                return new Response("Assets you request not found", {
                    status: 404,
                });
            }
        }
        else if (req.method === "POST") {
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
                const result = await processCV(content);
                return new Response(JSON.stringify(result), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }
        return new Response("The page you are looking is not found", {
            status: 404,
        });
    },
});

function isAssetsRequest(url: URL): boolean {
    return /^(https?:\/\/)?([a-zA-Z0-9.-]+(:\d+)?)(\/.*)?\/assets\/.*$/.test(url.toString());
}

function getAssetsContentType(pathname: string) {
    if (pathname.endsWith('.svg')) {
        return "image/svg+xml";
    }
    if (pathname.endsWith('.jpeg')) {
        return "image/jpeg";
    }
    if (pathname.endsWith('.png')) {
        return "image/png";
    }
    throw new Error('not supported format');
}

console.log("Listening on server : ", server.port);

function isAllowedRequest(request: Request) {
    const allowed = ["http://localhost:5173"];
    const origin = request.headers.get("Origin");
    return allowed.includes(origin ?? "");
}
