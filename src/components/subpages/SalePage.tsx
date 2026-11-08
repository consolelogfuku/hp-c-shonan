import { SalePropertyList } from "./SalePropertyList";
import { SubpageFrame } from "./Shared";
import type { PublicProperty } from "@/lib/cms/property-model";

export function SalePage({ properties }: { properties: PublicProperty[] }) {
  return (
    <SubpageFrame
      hero={{
        title: "売買物件"
      }}
    >
      <SalePropertyList properties={properties} />
    </SubpageFrame>
  );
}
