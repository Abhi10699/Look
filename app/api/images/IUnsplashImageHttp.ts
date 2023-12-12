export interface IUnsplashImage {
  id: string;
  created_at: string;
  alt_description: string;
  updated_at: string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  downloads: number;
  likes: number;
  liked_by_user: boolean;
  public_domain: boolean;
  description: string;
  exif: IUnsplashImageExif;
  location: IUnsplashLocation;
  tags: Array<IUnsplashTag>;
  current_user_collections: Array<IUnsplashUserCollection>;
  urls: IUnsplashImageUrls;
  links: IUnsplashLinks;
  user: IUnsplashUser;
}

interface IUnsplashImageExif {
  make: string;
  model: string;
  name: string;
  exposure_time: string;
  aperture: string;
  focal_length: string;
  iso: number;
}

interface IUnsplashLocation {
  city: string;
  country: string;
  position: {
    latitude: number;
    longtitude: number;
  };
}

interface IUnsplashTag {
  title: string;
}

interface IUnsplashUserCollection {
  id: number;
  title: string;
  published_at: string;
  last_collected_at: string;
  updated_at: string;
  cover_photo: string;
  user: any;
}

interface IUnsplashImageUrls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: String;
}

interface IUnsplashLinks {
  self: string;
  html: string;
  download: string;
  download_location: string;
  photos: string;
  likes: string;
  portfolio: string;
}

interface IUnsplashUser {
  id: string;
  updated_at: string;
  username: string;
  name: string;
  portfolio_url: string;
  bio: string;
  location: string;
  total_likes: number;
  total_photos: number;
  total_collections: number;
  links: Partial<IUnsplashLinks>;
}
