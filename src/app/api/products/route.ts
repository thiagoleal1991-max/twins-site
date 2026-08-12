import { NextResponse } from "next/server";
import { listarProdutos } from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const resultado = await listarProdutos({
    busca: searchParams.get("busca") ?? undefined,
    categoria: searchParams.get("categoria") ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : undefined,
  });

  return NextResponse.json(resultado);
}
