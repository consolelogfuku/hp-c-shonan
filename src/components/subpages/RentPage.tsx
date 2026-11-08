import { RentPropertyList } from "./RentPropertyList";
import { SubpageFrame } from "./Shared";
import type { PublicProperty } from "@/lib/cms/property-model";

export function RentPage({ properties }: { properties: PublicProperty[] }) {
  return (
    <SubpageFrame hero={{ title: "賃貸物件" }}>
      <RentPropertyList properties={properties} mode="rent" />
    </SubpageFrame>
  );
}
