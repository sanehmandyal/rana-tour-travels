export default function StaticPage({ title, children }) {
  return (
    <div>
      <section className="bg-evening text-white py-16">
        <div className="container-app">
          <h1 className="font-display text-4xl font-bold">{title}</h1>
        </div>
      </section>
      <section className="container-app py-14 max-w-3xl mx-auto prose prose-navy text-navy/75 space-y-4">
        {children}
      </section>
    </div>
  );
}
