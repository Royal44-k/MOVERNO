import "./index.css";
import { Composition } from "remotion";
import { ShoeFilm } from "./ShoeFilm";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="A01" component={ShoeFilm} durationInFrames={900} fps={30} width={1080} height={1920} defaultProps={{shoeId:"A01"}} />
      <Composition id="A02" component={ShoeFilm} durationInFrames={900} fps={30} width={1080} height={1920} defaultProps={{shoeId:"A02"}} />
      <Composition id="A03" component={ShoeFilm} durationInFrames={900} fps={30} width={1080} height={1920} defaultProps={{shoeId:"A03"}} />
    </>
  );
};
