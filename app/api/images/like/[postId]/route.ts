import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  const requestPayload = (await request.json()) as { userId: number };
  const userId = requestPayload.userId;

  // add like in table

  if (userId && postId) {
    const recordedLike = await client.likes.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        post: {
          connect: {
            id: parseInt(postId),
          },
        },
      },
    });

    return new Response("OK", { status: 201 });
  } else {
    return new Response("Failed", {
      status: 403,
      statusText: "Invalid Parameters",
    });
  }
}
