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
    <section className="py-12 md:py-8 bg-[#f8f7f5]">
      <div className="container-custom">
        <div className="text-center mb-8">
          <p className="text-[#0d0d0d] text-sm md:text-base font-bold tracking-[0.18em] uppercase">
            WORKS ACROSS APPS YOU ❤️
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {logos.map((logo, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3">
       <div>
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
