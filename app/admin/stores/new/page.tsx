import StoreForm from "../StoreForm";

export const dynamic = "force-dynamic";

export default function NewStorePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Store</h1>
      <StoreForm />
    </div>
  );
}
