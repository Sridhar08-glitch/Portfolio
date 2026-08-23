import type { Diagram } from "@/lib/schemas";
import { ACCENT_HEX } from "@/lib/theme";
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
 * Maps a diagram's `kind` to its icon-pipeline grammar, tinted by the
 * project's accent. Each flagship deliberately uses a different topology so no
 * two architecture visuals read the same.
 */
export function SystemDiagram({
  diagram,
  accent = "mineral",
}: {
  diagram: Diagram;
  accent?: string;
}) {
  const { kind, stages, caption } = diagram;
  const color = ACCENT_HEX[accent] ?? ACCENT_HEX.mineral;
  switch (kind) {
    case "funnel":
      return <ShieldFunnel stages={stages} caption={caption} />;
    case "stream":
      return <StreamDiagram stages={stages} caption={caption} color={color} />;
    case "lattice":
      return <LatticeDiagram stages={stages} caption={caption} color={color} />;
    case "projection":
      return <ProjectionDiagram stages={stages} caption={caption} color={color} />;
    case "clusters":
      return <ClustersDiagram stages={stages} caption={caption} color={color} />;
    case "review":
      return <ReviewDiagram stages={stages} caption={caption} color={color} />;
    case "hub":
      return <HubDiagram stages={stages} caption={caption} color={color} />;
    case "spatial":
      return <SpatialDiagram stages={stages} caption={caption} color={color} />;
    case "journey":
      return <JourneyDiagram stages={stages} caption={caption} color={color} />;
    default:
      return null;
  }
}
