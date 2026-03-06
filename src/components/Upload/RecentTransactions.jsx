export default function RecentTransactions({ S, transactions }) {
  return (
    <>
      <h2 className="text-xs font-mono text-emerald-400 tracking-[2px] mb-4">RECENT TRANSACTIONS</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-gray-500 text-xs font-mono">
              <th className="text-left pb-3 w-[100px]">Date</th>
              <th className="text-left pb-3">Details</th>
              <th className="text-right pb-3 w-[110px]">Withdrawal</th>
              <th className="text-right pb-3 w-[110px] pl-4">Deposit</th>
              <th className="text-left pb-3 w-[140px] pl-4">Category</th>
              <th className="text-left pb-3 w-[60px] pl-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0,20).map((t,i) => (
              <tr key={i} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="py-2.5 text-gray-300 text-xs">{t.DATE}</td>
                <td className="py-2.5 text-gray-300 pr-4 max-w-[220px] truncate">{t['TRANSACTION DETAILS']}</td>
                <td className="py-2.5 text-right text-white font-mono">
                  {t['WITHDRAWAL AMT']>0 ? `${S}${Math.round(t['WITHDRAWAL AMT']).toLocaleString()}` : '—'}
                </td>
                <td className="py-2.5 text-right text-emerald-400 font-mono pl-4">
                  {t['DEPOSIT AMT']>0 ? `${S}${Math.round(t['DEPOSIT AMT']).toLocaleString()}` : '—'}
                </td>
                <td className="py-2.5 text-gray-400 pl-4 text-xs">{t.CATEGORY}</td>
                <td className="py-2.5 pl-4">
                  {t.ALERT_LEVEL===3?'🔴':t.ALERT_LEVEL===2?'🟡':t.ALERT_LEVEL===1?'🔵':'✅'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}