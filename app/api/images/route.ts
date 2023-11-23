import { NextApiRequest } from "next";
import { JSONResponse } from "@/app/utils";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { IUnsplashImage } from "./IUnsplashImageHttp";

type ImageRequestPayload = {
  userId: string;
};

const client = new PrismaClient();
const UNSPLASH_BASE_API = "https://api.unsplash.com/";

export async function GET(request: NextRequest) {
  // parse request payload

  // const requestPayload = (await request.json()) as ImageRequestPayload;

  // fetch images

  const api = `${UNSPLASH_BASE_API}/photos/random?count=30`;
  const imagesResponse = await fetch(api, {
    next: {
      revalidate: 0,
    },
    headers: {
      Authorization: `Client-ID ${process.env.UNSPLASH_KEY}`,
    },
  });

  const imageData = (await imagesResponse.json()) as Array<IUnsplashImage>;

  // check if user is already registered

  // let user = null;
  // if (!requestPayload.userId) {
  //   user = await client.user.create({
  //     data: {
        
  //     }
  //   });
  // } else {
  //   user = await client.user.findFirst({
  //     where: {
  //       userUuid: requestPayload.userId,
  //     },
  //   });
  // }

  // // create session

  // const session = await client.userImageSession.create({
  //   data: {
  //     user: {
  //       connect: {
  //         id: user?.id,
  //       },
  //     },
  //     images: {
  //       createMany: {
  //         data: imageData.map((image) => ({
  //           color: image.color,
  //           description: image.description,
  //           height: image.height,
  //           imageUrl: image.urls.small,
  //           unsplash_id: image.id,
  //           width: image.width,
  //         })),
  //       },
  //     },
  //   },
  //   select: {
  //     images: {
  //       select: {
  //         id: true,
  //       },
  //     },
  //   },
  // });


  // 

  // construct response

  const response = new Response(
    JSONResponse({
      images: imageData,
      userId: null
    })
  );

  return response;
}
