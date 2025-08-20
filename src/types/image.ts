export interface Image {
  id?: string;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
}

export type ImageOrString = Image | string;
