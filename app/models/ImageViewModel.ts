import { IUnsplashImage } from "../api/images/IUnsplashImageHttp";
import { ImageExtractedFeatureTensorType } from "../hooks/useImageDatasetV2";

export class ImageViewModel {
  username: string = " ";
  id: string = "";
  likePredicted = false;
  source: string = "";
  description: string = "";

  // model properties
  imageFeatureTensor!: ImageExtractedFeatureTensorType;
  imageVisited: boolean = false;
  imageLiked: boolean = false;
  imageUsedInTraining: boolean = false;

  static mapFromHttpResponse(response: IUnsplashImage): ImageViewModel {
    const model = new ImageViewModel();
    model.description = response.description;
    model.id = response.id;
    model.source = response.urls.regular;
    model.username = response.user.username;
    return model;
  }

  setLikePredicted(predicted: boolean) {
    this.likePredicted = predicted;
  }

  setImageFeatureTensor(tensor: ImageExtractedFeatureTensorType) {
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
}
