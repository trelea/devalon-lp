/**
 * Stable, first-party anonymous visitor id.
 *
 * The same value is used by the Meta Pixel (advanced matching) and by CAPI
 * (`external_id`). The pixel reads it from localStorage in an inline script,
 * so the logic there is generated from the same constants via
 * `visitorInitSnippet()` to avoid drift.
 */

export const VISITOR_ID_KEY = "dv_visitor_id";

export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  try {
    const match = document.cookie.match(
      new RegExp("(?:^|; )" + name.replace(/([.$?*+{}()[\]\\])/g, "\\$1") + "=([^;]*)")
    );
    return match ? decodeURIComponent(match[1]) : undefined;
  } catch {
    return undefined;
  }
}

export function setCookie(name: string, value: string, maxAge = 31536000): void {
  if (typeof document === "undefined") return;
  try {
    document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
  } catch {
    // no-op
  }
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `v${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Returns the persistent visitor id, creating it on first use. */
export function getExternalId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const stored = window.localStorage.getItem(VISITOR_ID_KEY);
    if (stored) return stored;

    let id = getCookie(VISITOR_ID_KEY);
    if (id) {
      try {
        window.localStorage.setItem(VISITOR_ID_KEY, id);
      } catch {
        // no-op
      }
      return id;
    }

    id = createId();
    try {
      window.localStorage.setItem(VISITOR_ID_KEY, id);
    } catch {
      // no-op
    }
    setCookie(VISITOR_ID_KEY, id);
    return id;
  } catch {
    return undefined;
  }
}

/**
 * Inline JS that resolves/creates the visitor id and initializes the pixel
 * with advanced matching. Must run after the fbevents.js bootstrap has
 * defined `fbq`.
 */
export function visitorInitSnippet(pixelId: string): string {
  const key = JSON.stringify(VISITOR_ID_KEY);
  const id = JSON.stringify(pixelId);
  return `(function(){var k=${key},v='';try{v=localStorage.getItem(k)||''}catch(e){};if(!v){try{var m=document.cookie.match(new RegExp('(?:^|; )'+k+'=([^;]*)'));if(m)v=decodeURIComponent(m[1])}catch(e){}}if(!v){v=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():('v'+Date.now()+'-'+Math.random().toString(36).slice(2));try{localStorage.setItem(k,v)}catch(e){};try{document.cookie=k+'='+encodeURIComponent(v)+';path=/;max-age=31536000;SameSite=Lax'}catch(e){}}if(v){fbq('init',${id},{external_id:v})}else{fbq('init',${id})}})();`;
}
