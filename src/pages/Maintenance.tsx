export default function Maintenance() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-5 py-16 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(700px 320px at 15% 0%, rgba(228,207,166,0.16), transparent 55%), linear-gradient(165deg, #3c2a22 0%, #2a1e18 52%, #1a1310 100%)',
        }}
      />
      <div className="relative max-w-lg">
        <p className="text-[11px] font-semibold tracking-[0.32em] text-gold uppercase">Ajitha Collection</p>
        <h1 className="mt-4 font-script text-[4.2rem] leading-none text-champagne sm:text-[5.2rem]">
          Ajitha
        </h1>
        <p className="mt-3 text-[11px] font-semibold tracking-[0.36em] text-champagne/75 uppercase">
          Under maintenance
        </p>
      </div>
    </main>
  )
}
