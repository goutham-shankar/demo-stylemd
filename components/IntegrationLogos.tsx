"use client";

export default function IntegrationLogos() {
  const logos = [
    { name: "Replit", src: "/logos/Replit--Streamline-Svg-Logos.png" },
    { name: "Claude", src: "/logos/claude 1.png" },
    { name: "Lovable", src: "/logos/logoblack 1.png" },
    { name: "Base44", src: "/logos/Base44-logo_brandlogos.net_1a9f67 1.png" },
    { name: "Emergent", src: "/logos/emergent-logo-new 1.png" },
  ];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-8">
          <p className="text-gray-700 text-sm md:text-base font-bold tracking-wide">
            WORKS ACROSS APPS YOU ❤️
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {logos.map((logo, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl flex items-center justify-center p-2">
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
