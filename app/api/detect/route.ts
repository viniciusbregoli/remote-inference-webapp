import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:5000";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();

        const pythonApiResponse = await fetch(`${PYTHON_API_URL}/detect`, {
            method: "POST",
            body: formData,
            // Duplex stream is required for streaming the body
            // @ts-ignore
            duplex: "half",
        });

        if (!pythonApiResponse.ok) {
            const errorBody = await pythonApiResponse.text();
            return new NextResponse(errorBody, {
                status: pythonApiResponse.status,
                statusText: pythonApiResponse.statusText,
            });
        }

        const imageBlob = await pythonApiResponse.blob();

        return new NextResponse(imageBlob, {
            status: 200,
            headers: {
                "Content-Type": "image/jpeg",
            },
        });

    } catch (error) {
        console.error("Error proxying to detection API:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
} 