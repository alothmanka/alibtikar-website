import type { CookieOptions, Request } from "express";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isIpAddress(host: string) {
  // Basic IPv4 check and IPv6 presence detection.
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes(":");
}

function isSecureRequest(req: Request) {
  if (req.protocol === "https") return true;

  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;

  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");

  return protoList.some(proto => proto.trim().toLowerCase() === "https");
}

export function getSessionCookieOptions(
  req: Request
): Pick<CookieOptions, "domain" | "httpOnly" | "path" | "sameSite" | "secure"> {
  const hostname = req.hostname;
  
  // Don't set domain for:
  // 1. Local/dev hosts
  // 2. Manus preview/proxy hosts (containing manus.computer or manus.space)
  // 3. Hosts with port-prefix pattern (e.g., 3000-xxxxx.sg1.manus.computer)
  const isManusPlatform = hostname.includes('manus.computer') || hostname.includes('manus.space');
  const hasPortPrefix = /^\d+-/.test(hostname);
  
  const shouldSetDomain =
    hostname &&
    !LOCAL_HOSTS.has(hostname) &&
    !isIpAddress(hostname) &&
    !isManusPlatform &&
    !hasPortPrefix &&
    hostname !== "127.0.0.1" &&
    hostname !== "::1";

  // Only set domain for real production domains like ibtikar-agri.sa
  const domain =
    shouldSetDomain && !hostname.startsWith(".")
      ? `.${hostname}`
      : undefined;

  return {
    // Don't set domain for any environment to avoid cookie conflicts
    // The browser will automatically scope cookies to the current domain
    domain: undefined,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: isSecureRequest(req),
  };
}
