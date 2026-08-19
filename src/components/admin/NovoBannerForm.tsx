"use client";

import { useRef, useState, useTransition } from "react";
import { upload } from "@vercel/blob/client";
import { criarBanner } from "@/app/admin/(protegido)/banners/actions";

// Upload direto do navegador pro Vercel Blob (ver
// src/app/api/admin/blob-upload/route.ts) — o arquivo nunca passa pelo
// nosso servidor. Só depois do upload terminar (e termos a URL final) que
// o formulário fica liberado pra criar o banner de verdade.
export function NovoBannerForm() {
  const [imagemUrl, setImagemUrl] = useState("");
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [enviandoUpload, setEnviandoUpload] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setEnviandoUpload(true);
    setErro(null);
    setImagemUrl("");

    try {
      const resultado = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/admin/blob-upload",
      });
      setImagemUrl(resultado.url);
      setNomeArquivo(file.name);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Falha no upload. Tenta de novo.");
    } finally {
      setEnviandoUpload(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!imagemUrl) return;

    const formData = new FormData(e.currentTarget);
    formData.set("imagem", imagemUrl);

    startTransition(async () => {
      await criarBanner(formData);
      formRef.current?.reset();
      if (fileInputRef.current) fileInputRef.current.value = "";
      setImagemUrl("");
      setNomeArquivo("");
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="form-orcamento">
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFile}
          disabled={enviandoUpload || pending}
        />
        {enviandoUpload && (
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>Enviando imagem...</p>
        )}
        {erro && <p style={{ fontSize: 12, color: "#ff8080", marginTop: 6 }}>{erro}</p>}
        {imagemUrl && !enviandoUpload && (
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>✓ {nomeArquivo} enviado</p>
        )}
      </div>
      <input name="href" placeholder="Link (opcional, ex: /catalogo?categoria=Verão)" />
      <input name="ordem" type="number" defaultValue={0} placeholder="Ordem de exibição" />
      <button
        className="btn-wpp"
        style={{ border: "none" }}
        type="submit"
        disabled={!imagemUrl || enviandoUpload || pending}
      >
        {pending ? "Criando..." : "Criar banner"}
      </button>
    </form>
  );
}
