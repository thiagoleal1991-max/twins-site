import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { ADMIN_COOKIE_NAME, validarSessionToken } from "@/lib/admin-auth";

// Emite o token de upload direto-do-navegador pro Vercel Blob (o arquivo
// nunca passa pelo nosso servidor — só esse endpoint autoriza e recebe o
// aviso de conclusão). Só quem está logado no /admin pode pedir um token,
// senão qualquer visitante conseguiria subir arquivo pro nosso storage.
export async function POST(request: Request): Promise<NextResponse> {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (!validarSessionToken(token)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/png", "image/jpeg", "image/webp", "image/gif"],
        addRandomSuffix: true,
        // 6MB é bastante folga pra uma imagem de banner 1920x600 otimizada.
        maximumSizeInBytes: 6 * 1024 * 1024,
      }),
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro no upload" },
      { status: 400 },
    );
  }
}
