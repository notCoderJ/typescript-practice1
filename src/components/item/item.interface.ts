export const ItemType = {
  image: 'image',
  video: 'video',
  text: 'text',
} as const;

export type ItemType = (typeof ItemType)[keyof typeof ItemType];

type TextProps = {
  title: string;
  description?: string;
};

type MediaProps = {
  url: string;
  width?: number;
  height?: number;
};

export type TextItemProps = {
  type: typeof ItemType.text;
} & TextProps;

export type ImageItemProps = {
  type: typeof ItemType.image;
  alt?: string;
} & MediaProps &
  TextProps;

export type VideoItemProps = {
  type: typeof ItemType.video;
} & MediaProps &
  TextProps;
