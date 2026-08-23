import type { Diagram } from "@/lib/schemas";
import { ShieldFunnel } from "./shield-funnel";
import {
  ClustersDiagram,
  HubDiagram,
  JourneyDiagram,
  LatticeDiagram,
  ProjectionDiagram,
  ReviewDiagram,
  SpatialDiagram,
  StreamDiagram,
} from "./grammars";

/**
 * Maps a diagram's `kind` to its visual grammar. Each flagship deliberately
 * uses a different one so no two architecture visuals read the same.
 */
export function SystemDiagram({ diagram }: { diagram: Diagram }) {
  const { kind, stages, caption } = diagram;
  switch (kind) {
    case "funnel":
      return <ShieldFunnel stages={stages} caption={caption} />;
    case "stream":
      return <StreamDiagram stages={stages} caption={caption} />;
    case "lattice":
      return <LatticeDiagram stages={stages} caption={caption} />;
    case "projection":
      return <ProjectionDiagram stages={stages} caption={caption} />;
    case "clusters":
      return <ClustersDiagram stages={stages} caption={caption} />;
    case "review":
      return <ReviewDiagram stages={stages} caption={caption} />;
    case "hub":
      return <HubDiagram stages={stages} caption={caption} />;
    case "spatial":
      return <SpatialDiagram stages={stages} caption={caption} />;
    case "journey":
      return <JourneyDiagram stages={stages} caption={caption} />;
    default:
      return null;
  }
}
