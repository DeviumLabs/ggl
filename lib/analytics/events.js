import { dlPush } from "./dataLayer";

const compactObject = (obj = {}) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

const buildProductItem = ({
  item_id,
  item_name,
  item_category,
  item_category2,
  item_variant,
  index
}) =>
  compactObject({
    item_id,
    item_name,
    item_category,
    item_category2,
    item_variant,
    index
  });

export function trackProductView({
  item_id,
  item_name,
  item_category,
  item_category2,
  item_variant,
  location = "product_page"
}) {
  dlPush("view_item", {
    items: [
      buildProductItem({
        item_id,
        item_name,
        item_category,
        item_category2,
        item_variant
      })
    ],
    item_id,
    item_name,
    item_category,
    location
  });
}

export function trackRequestQuoteClick({
  item_id,
  item_name,
  item_category,
  item_category2,
  item_variant,
  location = "product_page"
}) {
  dlPush("request_quote_click", {
    ...buildProductItem({
      item_id,
      item_name,
      item_category,
      item_category2,
      item_variant
    }),
    location
  });
}

export function trackProductVariantSelect({
  item_id,
  item_name,
  item_category,
  item_category2,
  item_variant,
  index,
  item_list_name = "product_thumbnails",
  location = "product_page"
}) {
  dlPush("select_item", {
    item_list_name,
    items: [
      buildProductItem({
        item_id,
        item_name,
        item_category,
        item_category2,
        item_variant,
        index
      })
    ],
    item_id,
    item_name,
    location
  });
}

export function trackHomepageView({ location = "home_page" } = {}) {
  dlPush("view_homepage", { location });
}

export function trackHomepageCategoryListView({
  items = [],
  location = "home_page",
  item_list_name = "Homepage categorias"
} = {}) {
  dlPush("view_item_list", {
    location,
    item_list_name,
    items
  });
}

export function trackCatalogView({ location = "home_page" } = {}) {
  dlPush("catalog_view", { location });
}

export function trackHomepageCtaClick({ position, text, location = "home_page" } = {}) {
  dlPush("cta_click", compactObject({ position, text, location }));
}

export function trackHomepageCategorySelect({
  item_id,
  item_name,
  location = "home_page",
  item_list_name = "Homepage categorias"
} = {}) {
  dlPush("select_item", {
    item_list_name,
    items: [compactObject({ item_id, item_name })],
    item_id,
    item_name,
    location
  });
}

export function trackCatalogDownload({ location, file } = {}) {
  dlPush("catalog_download", compactObject({ location, file }));
}

export function trackContactFormView({ form_id = "contact_form", location = "", item_name = "" } = {}) {
  dlPush("view_contact_form", compactObject({ form_id, location, item_name }));
}

export function trackContactFormProgress({ form_id = "contact_form", progress } = {}) {
  dlPush("form_progress", compactObject({ form_id, progress }));
}

export function trackContactFormStart({ form_id = "contact_form" } = {}) {
  dlPush("start_form", { form_id });
}

export function trackContactChannelModalOpen({ form_id = "contact_form", source_url } = {}) {
  dlPush("contact_channel_modal_open", compactObject({ form_id, source_url }));
}

export function trackContactChannelSelect({
  form_id = "contact_form",
  channel,
  lead_type,
  state,
  city,
  source_url
} = {}) {
  dlPush(
    "contact_channel_select",
    compactObject({
      form_id,
      channel,
      lead_type,
      state,
      city,
      source_url
    })
  );
}

export function trackContactFormSubmit({ form_id = "contact_form", channel } = {}) {
  dlPush("form_submit", compactObject({ form_id, channel }));
}

export function trackContactFormSubmitSuccess({
  form_id = "contact_form",
  channel,
  company,
  city,
  state,
  lead_type,
  source_url,
  item_name
} = {}) {
  dlPush(
    "form_submit_success",
    compactObject({
      form_id,
      channel,
      company,
      city,
      state,
      lead_type,
      source_url,
      item_name
    })
  );
}

const LEAD_VALUE_MAP = {
  orgao_publico: 3.0,
  empresa: 2.0,
  pf: 1.0
};

export function getLeadValue(lead_type) {
  return LEAD_VALUE_MAP[lead_type] ?? 1.0;
}

export function trackGenerateLead(payload = {}) {
  dlPush("generate_lead", payload);
}

export function trackScrollDepth({ depth, location, item_id } = {}) {
  dlPush("scroll_depth", compactObject({ depth, location, item_id }));
}

export function trackProductEngagement({ seconds, item_id, item_name, item_category, location = "product_page" } = {}) {
  dlPush("product_engagement", compactObject({ seconds, item_id, item_name, item_category, location }));
}

export function trackSearch({ search_term, location, result_count } = {}) {
  dlPush("search", compactObject({ search_term, location, result_count }));
}

export function trackContactFormSubmitError({ form_id = "contact_form", channel } = {}) {
  dlPush("form_submit_error", compactObject({ form_id, channel }));
}

export function trackViewItemList({ location, item_list_name, items = [] } = {}) {
  dlPush(
    "view_item_list",
    compactObject({
      location,
      item_list_name,
      items
    })
  );
}

export function trackSelectItem({ location, item_list_name, items = [] } = {}) {
  dlPush(
    "select_item",
    compactObject({
      location,
      item_list_name,
      items
    })
  );
}

export function trackViewVideoList({ location = "videos_page", item_list_name = "Videos", items = [] } = {}) {
  dlPush("view_video_list", compactObject({ location, item_list_name, items }));
}

export function trackVideoImpression({ video_id, video_name, visibility_threshold } = {}) {
  dlPush(
    "video_impression",
    compactObject({
      video_id,
      video_name,
      visibility_threshold
    })
  );
}

export function trackVideoClick({ video_id, video_name, location = "videos_page" } = {}) {
  dlPush("video_click", compactObject({ video_id, video_name, location }));
}

export function trackVideoPlay({ video_id, video_name, location = "videos_page" } = {}) {
  dlPush("video_play", compactObject({ video_id, video_name, location }));
}

export function trackNavigationClick({ location, link_text, link_url } = {}) {
  dlPush("navigation_click", compactObject({ location, link_text, link_url }));
}

export function trackLogoClick({ location } = {}) {
  dlPush("logo_click", compactObject({ location }));
}

export function trackClickToCall({ location, phone_number } = {}) {
  dlPush("click_to_call", compactObject({ location, phone_number }));
}

export function trackSocialClick({ location, platform, link_url } = {}) {
  dlPush("social_click", compactObject({ location, platform, link_url }));
}
