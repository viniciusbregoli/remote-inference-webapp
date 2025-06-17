import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:5000";

export async function POST(req: NextRequest) {
    try {
        const apiKey = req.headers.get("x-api-key");
        const contentType = req.headers.get("content-type");
        const body = req.body;

        if (!apiKey) {
            return new NextResponse(
                JSON.stringify({
                    detail: "Proxy error: API key is missing from original request",
                }),
                {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        if (!contentType) {
            return new NextResponse(
                JSON.stringify({ detail: "Proxy error: Content-Type header is missing" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const response = await fetch(`${API_URL}/detect`, {
            method: "POST",
            headers: {
                "X-API-Key": apiKey,
                "Content-Type": contentType,
            },
            body: body,
            // @ts-ignore
            duplex: "half",
        });

        return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
    } catch (error) {
        console.error("Error in proxy API route:", error);
        return new NextResponse(
            JSON.stringify({ detail: "An unexpected error occurred in the proxy." }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
} 