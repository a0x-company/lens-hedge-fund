export function CommentsSection() {
  return (
    <section className="p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        <button className="bg-brand-green-light text-black px-4 py-2 rounded-lg hover:bg-brand-green-light/80 transition-all shadow-md hover:shadow-lg">
          Connect Lens Account
        </button>
      </div>
    </section>
  );
}
