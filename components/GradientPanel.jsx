export default function GradientPanel() {
  return (
    <div className="relative hidden md:flex flex-col justify-between bg-gradient-to-br from-indigo-500 to-purple-300 text-white p-8 lg:p-10 overflow-hidden h-full">
      <p className="font-semibold tracking-wide">Agnos</p>

      <div>
        <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
          Agnos <span className="font-medium">For You</span>
        </h1>
        <p className="mt-4 text-lg lg:text-xl font-medium">Healthcare service . . .</p>
      </div>

    
      <div className="relative w-full overflow-hidden whitespace-nowrap">
        <div className="inline-flex animate-marquee gap-16 text-white/80 text-sm font-medium">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <span key={i} className="inline-flex gap-16">
                <span>Anytime</span>
                <span>Anywhere</span>
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
