export default function HeroMockup() {
  return (
    <div
      className="w-full rounded-[20px] overflow-hidden border border-[#1a1a1a]"
      style={{
        background: "#0d0d0d",
        boxShadow: "inset 0px 1px 0px 0px rgba(23,23,23,0.15), inset 0px -1px 0px 0px rgba(23,23,23,0.15), 0px 1px 2px 0px rgba(23,23,23,0.4), 0px 3px 8px 0px rgba(23,23,23,0.19), 0px 6px 4px 0px rgba(23,23,23,0.05), 0px 11px 4px 0px rgba(23,23,23,0.01), 0px 16px 5px 0px rgba(23,23,23,0)",
      }}
    >
      <div className="p-6">
        {/* Top row: avatar + name + balance */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-clario-accent to-[#5a9e1e] flex items-center justify-center">
              <span className="text-[#0d0d0d] font-bold text-sm">DM</span>
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Danielle M.</p>
              <p className="text-white/40 text-xs">Freelance UX Designer</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#171717] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8cff2e" strokeWidth="2">
                <path d="M12 2v20M2 12h20" />
              </svg>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#171717] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8cff2e" strokeWidth="2">
                <path d="M7 17l9.2-9.2M17 17V8H8" />
              </svg>
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="mb-6">
          <p className="text-white/40 text-xs mb-1">Total Balance</p>
          <p className="text-white text-3xl font-semibold" style={{ letterSpacing: "-1px" }}>$12,847.50</p>
        </div>

        {/* Cards row */}
        <div className="grid grid-cols-3 gap-3">
          {/* Credit card */}
          <div className="col-span-2 rounded-xl p-4 bg-gradient-to-br from-[#1a2e05] to-[#0d0d0d] border border-[#2a3f10]">
            <div className="flex justify-between items-start mb-8">
              <span className="text-clario-accent text-xs font-semibold">CREDIT</span>
              <div className="w-8 h-6 rounded bg-[#0d0d0d]/50" />
            </div>
            <p className="text-white text-lg font-semibold">$430,000</p>
            <p className="text-white/30 text-xs mt-1">•••• 4242</p>
          </div>

          {/* Daily limit card */}
          <div className="rounded-xl p-4 bg-[#171717] border border-[#1f1f1f]">
            <p className="text-white/40 text-xs mb-2">Daily Limit</p>
            <p className="text-white text-sm font-semibold mb-3">$2,500.00</p>
            <div className="w-full h-1.5 rounded-full bg-[#0d0d0d]">
              <div className="h-full rounded-full bg-clario-accent" style={{ width: "12.5%" }} />
            </div>
            <p className="text-clario-accent text-xs mt-2 font-medium">12.5% used</p>
          </div>
        </div>
      </div>
    </div>
  );
}
