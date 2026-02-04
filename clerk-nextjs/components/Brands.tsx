import React from "react";

const Brands = () => {
  const brands = [
    { name: "La Roche-Posay", logo: "🧴" },
    { name: "Vichy", logo: "💧" },
    { name: "CeraVe", logo: "🌿" },
    { name: "Avène", logo: "🌸" },
    { name: "Nuxe", logo: "🌺" },
    { name: "Uriage", logo: "⛰️" },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          ماركاتنا الموثوقة
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-2">{brand.logo}</div>
              <span className="text-sm font-medium text-gray-700 text-center">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brands;
