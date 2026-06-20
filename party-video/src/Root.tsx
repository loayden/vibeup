import "./index.css";
import { Composition } from "remotion";
import {
  BedouinCartoonFestival,
  BedouinCartoonFestival3D,
} from "./CartoonFestival";
import { PartyFilm } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PartyFilm"
        component={PartyFilm}
        durationInFrames={720}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BedouinCartoonFestival"
        component={BedouinCartoonFestival}
        durationInFrames={720}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="BedouinCartoonFestival3D"
        component={BedouinCartoonFestival3D}
        durationInFrames={720}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
