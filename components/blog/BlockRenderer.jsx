import { ParagraphBlock } from "./blocks/ParagraphBlock";
import { HeadingBlock } from "./blocks/HeadingBlock";
import { ImageBlock } from "./blocks/ImageBlock";
import { VideoBlock } from "./blocks/VideoBlock";
import { QuoteBlock } from "./blocks/QuoteBlock";
import { ListBlock } from "./blocks/ListBlock";
import { DividerBlock } from "./blocks/DividerBlock";
import { FormCotacao } from "./blocks/FormCotacao";

const RENDERERS = {
  paragraph: ParagraphBlock,
  heading: HeadingBlock,
  image: ImageBlock,
  video: VideoBlock,
  quote: QuoteBlock,
  list: ListBlock,
  divider: DividerBlock,
  form_cotacao: FormCotacao,
};

export function BlockRenderer({ blocks = [] }) {
  return (
    <div className="blog-content">
      {blocks.map((block, i) => {
        const Component = RENDERERS[block._type];
        if (!Component) return null;
        return <Component key={i} {...block} />;
      })}
    </div>
  );
}
