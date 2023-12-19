import { IUnsplashImage } from "../api/images/IUnsplashImageHttp";
import { ImageExtractedFeatureTensorType } from "../hooks/deprecated/useImageDatasetV2";
import type { Tensor, tensor } from "@tensorflow/tfjs";

export class ImageViewModel {
  username: string = " ";
  id: string = "";
  likePredicted = false;
  source: string = "";
  description: string = "";
  tags = "No Tags";


  // model properties
  imageFeatureTensor!: Float32Array | Int32Array | Uint8Array;
  imageVisited: boolean = false;
  imageLiked: boolean = false;
  imageUsedInTraining: boolean = false;
  imageEvaluated: boolean = false;

  static mapFromHttpResponse(response: IUnsplashImage): ImageViewModel {
    const model = new ImageViewModel();
    model.description = response.alt_description;
    model.id = response.id;
    model.source = response.urls.regular;
    model.username = response.user.username;
    if(response.topic_submissions) {
      model.tags = Object.keys(response.topic_submissions).map(key => `#${key}`).join(" ")
    }
    return model;
  }

  setLikePredicted(predicted: boolean) {
    this.likePredicted = predicted;
  }

  setImageFeatureTensor(tensor: Float32Array | Int32Array | Uint8Array) {
    this.imageFeatureTensor = tensor;
  }

  setImageVisited(visited: boolean) {
    this.imageVisited = visited;
  }

  setImageLiked(liked: boolean) {
    this.imageLiked = liked;
  }

  setImageUsedInTraining(trained: boolean) {
    this.imageUsedInTraining = trained;
  }

  setImageEvaluated(status: boolean) {
    this.imageEvaluated = status;
  }
}
