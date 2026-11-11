export type EventName =
  | "page_view"
  | "lead"
  | "contact"
  | "view_content"
  | "click_cta"
  | "contact_click"
  | "outbound_click"
  | "section_view"
  | "section_engagement"
  | "scroll_depth"
  | "form_start"
  | "form_field_focus"
  | "form_field_change"
  | "form_submit"
  | "form_error"
  | "form_abandon"
  | "faq_open"
  | "faq_close";

export type EventParams = Record<string, unknown>;

export interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;
}

export interface TrackingPayload {
  name: EventName;
  params?: EventParams;
  userData?: UserData;
  eventId: string;
  url: string;
  userAgent: string;
  fbp?: string;
  fbc?: string;
}

export const META_EVENT: Record<EventName, string> = {
  page_view: "PageView",
  lead: "Lead",
  contact: "Contact",
  view_content: "ViewContent",
  click_cta: "CustomEvent",
  contact_click: "Contact",
  outbound_click: "OutboundClick",
  section_view: "SectionView",
  section_engagement: "SectionEngagement",
  scroll_depth: "ScrollDepth",
  form_start: "FormStart",
  form_field_focus: "FormFieldFocus",
  form_field_change: "FormFieldChange",
  form_submit: "FormSubmit",
  form_error: "FormError",
  form_abandon: "FormAbandon",
  faq_open: "FaqOpen",
  faq_close: "FaqClose",
};

export const GTM_EVENT: Record<EventName, string> = {
  page_view: "page_view",
  lead: "generate_lead",
  contact: "contact",
  view_content: "view_item",
  click_cta: "select_content",
  contact_click: "contact_click",
  outbound_click: "click",
  section_view: "section_view",
  section_engagement: "section_engagement",
  scroll_depth: "scroll_depth",
  form_start: "form_start",
  form_field_focus: "form_field_focus",
  form_field_change: "form_field_change",
  form_submit: "form_submit",
  form_error: "form_error",
  form_abandon: "form_abandon",
  faq_open: "faq_open",
  faq_close: "faq_close",
};