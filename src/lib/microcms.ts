import { createClient } from "microcms-js-sdk";

export type MicroCMSEnsemble = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  name: string;
  sub: string;
  region: string;
  regionColor: string;
  desc: string;
  tagline?: string;
  philosophy?: string;
  img?: { url: string };
  active: boolean;
  activities?: { fieldId: string; icon: string; title: string; desc: string }[];
  stats?: { fieldId: string; label: string; value: string }[];
  gallery?: { url: string }[];
};

const isConfigured =
  !!process.env.MICROCMS_SERVICE_DOMAIN && !!process.env.MICROCMS_API_KEY;

const client = isConfigured
  ? createClient({
      serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
      apiKey: process.env.MICROCMS_API_KEY!,
    })
  : null;

const ENDPOINT = "ansanbulu";

export async function getEnsembleList(): Promise<MicroCMSEnsemble[]> {
  if (!client) return [];
  const res = await client.getList<MicroCMSEnsemble>({
    endpoint: ENDPOINT,
    queries: { limit: 50 },
  });
  return res.contents;
}

export async function getEnsembleContent(
  id: string
): Promise<MicroCMSEnsemble | null> {
  if (!client) return null;
  try {
    return await client.getListDetail<MicroCMSEnsemble>({
      endpoint: ENDPOINT,
      contentId: id,
    });
  } catch {
    return null;
  }
}

export async function updateEnsembleContent(
  id: string,
  data: Partial<Omit<MicroCMSEnsemble, "id" | "createdAt" | "updatedAt" | "publishedAt">>
): Promise<boolean> {
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const writeApiKey = process.env.MICROCMS_WRITE_API_KEY;
  if (!serviceDomain || !writeApiKey) return false;

  const res = await fetch(
    `https://${serviceDomain}.microcms.io/api/v1/${ENDPOINT}/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-MICROCMS-API-KEY": writeApiKey,
      },
      body: JSON.stringify(data),
    }
  );
  return res.ok;
}
