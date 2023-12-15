import { JSONResponse } from "@/app/utils";
import { NextRequest } from "next/server";
import { IUnsplashImage } from "./IUnsplashImageHttp";

const UNSPLASH_BASE_API = "https://api.unsplash.com/";

export async function GET(request: NextRequest) {
  const api = `${UNSPLASH_BASE_API}/photos/random?count=30`;
  const imagesResponse = await fetch(api, {
    next: {
      revalidate: 10,
    },
    headers: {
      Authorization: `Client-ID ${process.env.UNSPLASH_KEY}`,
    },
  });

  const imageData = (await imagesResponse.json()) as Array<IUnsplashImage>;

  const response = new Response(
    JSONResponse({
      images: imageData,
      userId: null,
    })
  );

  return response;
}
