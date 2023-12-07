import { IUnsplashImage } from "../api/images/IUnsplashImageHttp";

export class ImageViewModel {
  username: string = " ";
  id: string = "";
  likePredicted = false;
  source: string = "";
  description: string = "";

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
}
