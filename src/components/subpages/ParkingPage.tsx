import { RentPropertyList } from "./RentPropertyList";
import { SubpageFrame } from "./Shared";
import type { PublicProperty } from "@/lib/cms/property-model";

export function ParkingPage({ properties }: { properties: PublicProperty[] }) {
  return (
    <SubpageFrame hero={{ title: "貸駐車場" }}>
      <RentPropertyList properties={properties} mode="parking" />
    </SubpageFrame>
  );
}
