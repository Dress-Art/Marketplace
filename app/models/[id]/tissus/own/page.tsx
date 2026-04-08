import type { Metadata } from "next";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function OwnFabricRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Rediriger vers la page de mesure avec un tissuId spécial "own"
  redirect(`/models/${id}/tissus/own/mesure`);
}
