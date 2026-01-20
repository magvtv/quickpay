interface InvoiceDetailPageProps {
  params: {
    id: string;
  };
}

export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Invoice Details</h1>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <p className="text-gray-600">Invoice ID: {params.id}</p>
        <p className="text-gray-600 mt-2">Invoice details coming soon...</p>
      </div>
    </div>
  );
}
