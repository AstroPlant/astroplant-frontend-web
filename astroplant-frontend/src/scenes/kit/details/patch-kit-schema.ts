import { TFunction } from "i18next";

export const schema = (t: TFunction) => ({
  type: "object",
  required: [],
  properties: {
    name: { type: "string", title: t("common.name") },
    description: { type: "string", title: t("common.description") },
    coordinate: {
      type: "object",
      required: ["latitude", "longitude"],
      properties: {
        latitude: { type: "number", title: t("common.latitude") },
        longitude: { type: "number", title: t("common.longitude") },
      },
    },
    privacyPublicDashboard: {
      type: "boolean",
      title: t("kit.privacyPublicDashboard"),
    },
    privacyShowOnMap: { type: "boolean", title: t("kit.privacyShowOnMap") },
  },
});

export const uiSchema = {
  description: {
    "ui:widget": "textarea",
  },
  coordinate: {
    "ui:field": "CoordinateField",
  },
};
