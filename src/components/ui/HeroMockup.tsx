export default function HeroMockup() {
  return (
    <div
      className="w-full h-[400px] md:h-[930px] rounded-[20px] overflow-hidden border border-[#1a1a1a]"
      style={{
        background: "#0d0d0d",
        boxShadow: "inset 0px 1px 0px 0px rgba(23,23,23,0.15), inset 0px -1px 0px 0px rgba(23,23,23,0.15), 0px 1px 2px 0px rgba(23,23,23,0.4), 0px 3px 8px 0px rgba(23,23,23,0.19), 0px 6px 4px 0px rgba(23,23,23,0.05), 0px 11px 4px 0px rgba(23,23,23,0.01), 0px 16px 5px 0px rgba(23,23,23,0)",
      }}
    >
      {/* Top nav bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-clario-accent flex items-center justify-center">
            <span className="text-[#0d0d0d] font-bold text-[10px]">C</span>
          </div>
          <span className="text-white/60 text-xs font-medium">Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#171717]" />
          <div className="w-6 h-6 rounded-full bg-[#171717]" />
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-clario-accent to-[#5a9e1e]" />
        </div>
      </div>

      <div className="flex h-[calc(100%-44px)]">
        {/* Sidebar */}
        <div className="w-[180px] border-r border-[#1a1a1a] p-4 flex-col gap-3 hidden md:flex">
          {["Overview", "Transactions", "Accounts", "Goals", "Reports", "Settings"].map((item, i) => (
            <div
              key={item}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                i === 0 ? "bg-[#171717] text-clario-accent" : "text-white/40"
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-sm ${i === 0 ? "bg-clario-accent/30" : "bg-[#2f2f2f]"}`} />
              {item}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-5 overflow-hidden">
          {/* User + balance row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-clario-accent to-[#5a9e1e] flex items-center justify-center">
                <span className="text-[#0d0d0d] font-bold text-sm">DM</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Danielle M.</p>
                <p className="text-white/40 text-xs">Freelance UX Designer</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs">Total Balance</p>
              <p className="text-white text-xl font-semibold" style={{ letterSpacing: "-0.5px" }}>$12,847.50</p>
            </div>
          </div>

          {/* Stat tiles row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="rounded-xl p-3.5 bg-[#171717] border border-[#1f1f1f]">
              <p className="text-white/40 text-[10px] mb-1">Income</p>
              <p className="text-white text-sm font-semibold">$8,420.00</p>
              <p className="text-clario-accent text-[10px] mt-1">+12.5%</p>
            </div>
            <div className="rounded-xl p-3.5 bg-[#171717] border border-[#1f1f1f]">
              <p className="text-white/40 text-[10px] mb-1">Expenses</p>
              <p className="text-white text-sm font-semibold">$3,420.00</p>
              <p className="text-red-400 text-[10px] mt-1">-4.2%</p>
            </div>
            <div className="rounded-xl p-3.5 bg-[#171717] border border-[#1f1f1f]">
              <p className="text-white/40 text-[10px] mb-1">Savings</p>
              <p className="text-white text-sm font-semibold">$5,000.00</p>
              <p className="text-clario-accent text-[10px] mt-1">On track</p>
            </div>
          </div>

          {/* Chart area */}
          <div className="rounded-xl p-4 bg-[#171717] border border-[#1f1f1f] mb-5">
            <div className="flex justify-between items-center mb-3">
              <p className="text-white text-xs font-semibold">Balance Overview</p>
              <p className="text-white/40 text-[10px]">Last 8 Months</p>
            </div>
            <svg viewBox="0 0 500 120" className="w-full h-[120px]">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8cff2e" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8cff2e" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,90 C60,80 120,70 180,50 C240,30 300,40 360,35 C420,30 460,20 500,15 L500,120 L0,120 Z" fill="url(#chartGrad)" />
              <polyline
                points="0,90 60,80 120,70 180,50 240,30 300,40 360,35 420,30 460,20 500,15"
                fill="none"
                stroke="#8cff2e"
                strokeWidth="2"
              />
              <circle cx="500" cy="15" r="4" fill="#8cff2e" />
            </svg>
          </div>

          {/* Recent Transactions */}
          <div className="rounded-xl p-4 bg-[#171717] border border-[#1f1f1f] mb-5">
            <p className="text-white text-xs font-semibold mb-3">Recent Transactions</p>
            <div className="space-y-2.5">
              {[
                { name: "Figma Pro", amount: "-$12.00", cat: "Software" },
                { name: "Client Payment", amount: "+$2,400.00", cat: "Income" },
                { name: "Coffee Shop", amount: "-$4.50", cat: "Food" },
                { name: "Dribbble Pro", amount: "-$9.00", cat: "Software" },
              ].map((tx) => (
                <div key={tx.name} className="flex items-center justify-between py-1.5 border-b border-[#1f1f1f] last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#0d0d0d] flex items-center justify-center">
                      <span className="text-clario-accent text-[8px] font-bold">{tx.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-white text-[11px] font-medium">{tx.name}</p>
                      <p className="text-white/30 text-[9px]">{tx.cat}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-medium ${tx.amount.startsWith("+") ? "text-clario-accent" : "text-white/60"}`}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-4 bg-gradient-to-br from-[#1a2e05] to-[#0d0d0d] border border-[#2a3f10]">
              <div className="flex justify-between items-start mb-6">
                <span className="text-clario-accent text-[10px] font-semibold">CREDIT</span>
                <div className="w-7 h-5 rounded bg-[#0d0d0d]/50" />
              </div>
              <p className="text-white text-base font-semibold">$430,000</p>
              <p className="text-white/30 text-[10px] mt-1">•••• 4242</p>
            </div>
            <div className="rounded-xl p-4 bg-[#171717] border border-[#1f1f1f]">
              <p className="text-white/40 text-[10px] mb-1">Daily Limit</p>
              <p className="text-white text-sm font-semibold mb-3">$2,500.00</p>
              <div className="w-full h-1.5 rounded-full bg-[#0d0d0d]">
                <div className="h-full rounded-full bg-clario-accent" style={{ width: "12.5%" }} />
              </div>
              <p className="text-clario-accent text-[10px] mt-2 font-medium">12.5% used</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
