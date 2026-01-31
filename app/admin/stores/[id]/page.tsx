import { prisma } from "@/lib/prisma";
import StoreForm from "../StoreForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStorePage({ params }: PageProps) {
  const { id } = await params;
  const store = await prisma.store.findUnique({
    where: { id },
  });

  if (!store) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Store Not Found</h1>
        <a href="/admin/stores" className="text-blue-600 hover:underline">
          Back to Stores
        </a>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Store</h1>
      <StoreForm
        initialData={{
          id: store.id,
          name: store.name,
          slug: store.slug,
          logo: store.logo || "",
          isActive: store.isActive,
        }}
      />
    </div>
  );
}
