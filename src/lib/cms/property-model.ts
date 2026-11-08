import { CmsError } from "./model.ts";

export type PropertySection = "sale" | "rent";
export type PropertyKind = "sale" | "residential" | "commercial" | "parking";
export type PropertyStatus = "available" | "closed";
export type PropertyImage = { src: string; alt: string; focalX?: number; focalY?: number };
export type PropertyDetailRow = { label: string; value: string };
export type PropertyDetails = {
  introduction: string;
  sitePlan: PropertyImage | null;
  sitePlanNote: string;
  referencePlan: PropertyImage | null;
  referencePlanNote: string;
  photos: PropertyImage[];
  nearby: PropertyDetailRow[];
  specifications: PropertyDetailRow[];
};

export type PropertyInput = {
  kind: PropertyKind;
  title: string;
  status: PropertyStatus;
  dealType: "owner" | "broker" | null;
  price: string;
  description: string;
  details?: PropertyDetails;
  image: PropertyImage | null;
  address: string;
  access: string;
  landArea: string;
  layout: string;
  propertyType: string;
  vacancy: number | null;
  linkUrl: string;
};

export type AdminProperty = {
  slug: string;
  property: PropertyInput;
  published: boolean;
  version: number;
  updatedAt: string;
};

export type PublicProperty = Pick<AdminProperty, "slug" | "property">;
export type PropertySaveAction = "draft" | "publish" | "unpublish";

export function sectionForKind(kind: PropertyKind): PropertySection {
  return kind === "sale" ? "sale" : "rent";
}

export function emptyPropertyDetails(kind: PropertyKind): PropertyDetails {
  const labels = kind === "sale"
    ? ["土地権利", "都市計画", "総区画数", "今回販売区画", "地目", "現況", "用途地域", "建ぺい率", "容積率", "設備", "接道状況", "備考", "開発許可番号"]
    : kind === "parking"
      ? ["契約期間", "敷金", "礼金", "利用開始時期", "備考"]
      : ["構造", "築年月", "所在階", "契約期間", "敷金", "礼金", "管理費", "駐車場", "入居時期", "設備", "備考"];
  return {
    introduction: "",
    sitePlan: null,
    sitePlanNote: "",
    referencePlan: null,
    referencePlanNote: "",
    photos: [],
    nearby: [],
    specifications: labels.map((label) => ({ label, value: "" })),
  };
}

export function emptyProperty(section: PropertySection): PropertyInput {
  return {
    kind: section === "sale" ? "sale" : "residential",
    title: "",
    status: "available",
    dealType: section === "sale" ? "owner" : null,
    price: "",
    description: "",
    details: emptyPropertyDetails(section === "sale" ? "sale" : "residential"),
    image: null,
    address: "",
    access: "",
    landArea: "",
    layout: "",
    propertyType: "",
    vacancy: section === "rent" ? null : null,
    linkUrl: "/contact/",
  };
}

const limits = {
  title: 80,
  price: 60,
  description: 2000,
  address: 200,
  access: 200,
  landArea: 100,
  layout: 100,
  propertyType: 100,
  linkUrl: 300,
} as const;

function text(input: Record<string, unknown>, key: keyof typeof limits, label: string) {
  const value = input[key];
  if (typeof value !== "string" || value.length > limits[key]) throw new CmsError(`${label}を確認してください。`);
  return value.trim();
}

function propertyImage(value: unknown, label: string): PropertyImage | null {
  if (value == null) return null;
  if (typeof value !== "object") throw new CmsError(`${label}をアップロードし直してください。`);
  const item = value as Record<string, unknown>;
  const validSrc = typeof item.src === "string" && (/^\/media\/[a-f0-9-]{36}\.webp$/.test(item.src) || /^https:\/\/www\.c-shonan\.co\.jp\/global-image\//.test(item.src));
  if (!validSrc || typeof item.alt !== "string" || item.alt.length > 200) throw new CmsError(`${label}をアップロードし直してください。`);
  const focalX = item.focalX === undefined ? 50 : item.focalX;
  const focalY = item.focalY === undefined ? 50 : item.focalY;
  if (typeof focalX !== "number" || !Number.isFinite(focalX) || focalX < 0 || focalX > 100 || typeof focalY !== "number" || !Number.isFinite(focalY) || focalY < 0 || focalY > 100) throw new CmsError(`${label}の中心位置を指定し直してください。`);
  return { src: item.src as string, alt: item.alt.trim(), focalX, focalY };
}

function detailText(value: unknown, label: string, max: number) {
  if (typeof value !== "string" || value.length > max) throw new CmsError(`${label}を確認してください。`);
  return value.trim();
}

function detailRows(value: unknown, label: string, maxRows: number): PropertyDetailRow[] {
  if (!Array.isArray(value) || value.length > maxRows) throw new CmsError(`${label}を確認してください。`);
  return value.map((raw) => {
    if (!raw || typeof raw !== "object") throw new CmsError(`${label}を確認してください。`);
    const row = raw as Record<string, unknown>;
    return { label: detailText(row.label, `${label}の項目名`, 60), value: detailText(row.value, `${label}の内容`, 500) };
  });
}

function propertyDetails(value: unknown, kind: PropertyKind): PropertyDetails {
  if (value === undefined) return emptyPropertyDetails(kind);
  if (!value || typeof value !== "object") throw new CmsError("詳細ページの内容を確認してください。");
  const input = value as Record<string, unknown>;
  if (!Array.isArray(input.photos) || input.photos.length > 30) throw new CmsError("詳細写真は30枚以内にしてください。");
  return {
    introduction: detailText(input.introduction, "詳しい紹介文", 10000),
    sitePlan: propertyImage(input.sitePlan, "全体図"),
    sitePlanNote: detailText(input.sitePlanNote, "全体図の補足", 2000),
    referencePlan: propertyImage(input.referencePlan, "参考プラン"),
    referencePlanNote: detailText(input.referencePlanNote, "参考プランの補足", 3000),
    photos: input.photos.map((image, index) => {
      const result = propertyImage(image, `詳細写真${index + 1}`);
      if (!result) throw new CmsError("詳細写真をアップロードし直してください。");
      return result;
    }),
    nearby: detailRows(input.nearby, "周辺環境", 30),
    specifications: detailRows(input.specifications, "物件概要", 40),
  };
}

export function validateProperty(value: unknown, section: PropertySection, publishing: boolean): PropertyInput {
  if (!value || typeof value !== "object") throw new CmsError("物件の入力を確認してください。");
  const input = value as Record<string, unknown>;
  const allowedKinds: PropertyKind[] = section === "sale" ? ["sale"] : ["residential", "commercial", "parking"];
  if (!allowedKinds.includes(input.kind as PropertyKind)) throw new CmsError("物件の種別を選択してください。");
  if (input.status !== "available" && input.status !== "closed") throw new CmsError("募集状況を選択してください。");
  const kind = input.kind as PropertyKind;
  const dealType = kind === "sale" && (input.dealType === "owner" || input.dealType === "broker") ? input.dealType : null;
  if (kind === "sale" && !dealType) throw new CmsError("取引態様を選択してください。");

  let image: PropertyImage | null = null;
  if (kind !== "parking" && input.image != null) {
    image = propertyImage(input.image, "画像");
  }

  let vacancy: number | null = null;
  if (kind === "parking") {
    if (input.vacancy !== null && (!Number.isSafeInteger(input.vacancy) || Number(input.vacancy) < 0 || Number(input.vacancy) > 999)) throw new CmsError("空き台数は0〜999台で入力してください。");
    vacancy = input.vacancy === null ? null : Number(input.vacancy);
  }

  const property: PropertyInput = {
    kind,
    title: text(input, "title", "物件名"),
    status: kind === "parking" ? (vacancy && vacancy > 0 ? "available" : "closed") : input.status,
    dealType,
    price: text(input, "price", "価格・賃料"),
    description: kind === "parking" ? "" : text(input, "description", "説明"),
    details: propertyDetails(input.details, kind),
    image,
    address: text(input, "address", "所在地"),
    access: kind === "parking" ? "" : text(input, "access", "交通"),
    landArea: kind === "sale" ? text(input, "landArea", "土地面積") : "",
    layout: kind === "residential" || kind === "commercial" ? text(input, "layout", "間取り・広さ") : "",
    propertyType: kind === "sale" ? text(input, "propertyType", "物件種別") : "",
    vacancy,
    linkUrl: text(input, "linkUrl", "詳細ページURL"),
  };
  if (property.linkUrl && (!property.linkUrl.startsWith("/") || property.linkUrl.startsWith("//"))) throw new CmsError("詳細ページURLは / から始まるサイト内URLを入力してください。");
  if (publishing && !property.title) throw new CmsError("公開するには物件名を入力してください。");
  if (publishing && kind === "parking" && !property.address) throw new CmsError("駐車場を公開するには所在地を入力してください。");
  return property;
}

export function propertyImagePosition(image: PropertyImage) {
  return `${image.focalX ?? 50}% ${image.focalY ?? 50}%`;
}

export function propertyDetailHref(property: Pick<PublicProperty, "slug" | "property">) {
  return `/${sectionForKind(property.property.kind)}/${encodeURIComponent(property.slug)}`;
}

export function propertyKindLabel(kind: PropertyKind) {
  return kind === "sale" ? "売買物件" : kind === "residential" ? "居住用" : kind === "commercial" ? "貸店舗・事務所" : "貸駐車場";
}

export function propertyStatusLabel(property: PropertyInput) {
  if (property.kind === "sale") return property.status === "available" ? "販売中" : "成約済み";
  if (property.kind === "parking") return property.status === "available" ? "募集中" : "満車";
  return property.status === "available" ? "募集中" : "成約済み";
}
