const benefits = [
  ["↗", "Fast delivery", "2–4 business days"],
  ["◇", "Secure payments", "Protected checkout"],
  ["↺", "30-day returns", "Simple and flexible"],
  ["○", "Customer support", "Here when you need us"],
];

export default function TrustStrip() {
  return (
    <section className="border-y border-stone-200 bg-[#f7f5ef]" aria-label="Store benefits">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px md:grid-cols-4">
        {benefits.map(([icon, title, detail]) => (
          <div key={title} className="flex items-center gap-3 px-5 py-5 md:justify-center">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-[#173f35]" aria-hidden="true">{icon}</span>
            <span><strong className="block text-sm text-stone-900">{title}</strong><span className="text-xs text-stone-500">{detail}</span></span>
          </div>
        ))}
      </div>
    </section>
  );
}
