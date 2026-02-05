import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;
  const { pathname, searchParams } = url;

  if (!pathname.startsWith("/produtos/")) return NextResponse.next();

  const product = searchParams.get("product");
  if (!product) return NextResponse.next();

  const parts = pathname.split("/").filter(Boolean);
  const categoria = parts[1];

  if (!categoria) return NextResponse.next();

  const dest = new URL(req.url);
  dest.pathname = `/produtos/${categoria}/${product}`;
  dest.searchParams.delete("product");

  return NextResponse.redirect(dest, 301);
}

export const config = {
  matcher: ["/produtos/:path*"]
};
