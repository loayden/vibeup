import "./index.css";
import { Composition } from "remotion";
import { MasterplanDrone } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MasterplanDrone"
        component={MasterplanDrone}
        durationInFrames={720}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
