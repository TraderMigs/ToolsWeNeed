import React, { useState } from 'react';
import { ExportButtons } from '../ExportButtons';

interface Loan {
  id: string;
  name: string;
  amount: number;
  rate: number;
  term: number;
}

export const LoanComparisonTool: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([
    { id: '1', name: 'Loan Option 1', amount: 200000, rate: 4.5, term: 30 }
  ]);
  const [newLoan, setNewLoan] = useState({
    name: '',
    amount: 0,
    rate: 0,
    term: 0
  });

  const addLoan = () => {
    try {
      if (newLoan.name && newLoan.amount > 0 && newLoan.rate > 0 && newLoan.term > 0) {
        setLoans([...loans, {
          id: Date.now().toString(),
          ...newLoan
        }]);
        setNewLoan({
          name: '',
          amount: 0,
          rate: 0,
          term: 0
        });
      }
    } catch (error) {
      console.error('Error adding loan:', error);
    }
  };

  const removeLoan = (id: string) => {
    try {
      if (loans.length > 1) { // Keep at least one loan
        setLoans(loans.filter(loan => loan.id !== id));
      }
    } catch (error) {
      console.error('Error removing loan:', error);
    }
  };

  const updateLoan = (id: string, field: keyof Loan, value: string | number) => {
    try {
      setLoans(loans.map(loan => 
        loan.id === id ? { ...loan, [field]: value } : loan
      ));
    } catch (error) {
      console.error('Error updating loan:', error);
    }
  };

  const calculateLoanDetails = (loan: Loan) => {
    try {
      if (!loan.amount || !loan.rate || !loan.term) {
        return { monthlyPayment: 0, totalInterest: 0, totalPayment: 0 };
      }
      
      const monthlyRate = loan.rate / 100 / 12;
      const numPayments = loan.term * 12;
      
      const monthlyPayment = loan.amount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
        (Math.pow(1 + monthlyRate, numPayments) - 1);
      
      const totalInterest = (monthlyPayment * numPayments) - loan.amount;
      const totalPayment = loan.amount + totalInterest;

      return {
        monthlyPayment,
        totalInterest,
        totalPayment
      };
    } catch (error) {
      console.error('Error calculating loan details:', error);
      return { monthlyPayment: 0, totalInterest: 0, totalPayment: 0 };
    }
  };

  const generateAmortizationSchedule = (loan: Loan) => {
    try {
      const monthlyRate = loan.rate / 100 / 12;
      const numPayments = loan.term * 12;
      const monthlyPayment = calculateLoanDetails(loan).monthlyPayment;
      
      const schedule = [];
      let remainingBalance = loan.amount;

      for (let month = 1; month <= numPayments; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;

        schedule.push({
          month,
          payment: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, remainingBalance)
        });
      }

      return schedule;
    } catch (error) {
      console.error('Error generating amortization schedule:', error);
      return [];
    }
  };

  const exportData = {
    loans,
    comparison: loans.map(loan => ({
      ...loan,
      ...calculateLoanDetails(loan)
    })),
    generatedAt: new Date().toISOString()
  };

  const csvData = loans.map(loan => {
    const details = calculateLoanDetails(loan);
    return {
      'Loan Name': loan.name,
      'Amount': loan.amount,
      'Rate (%)': loan.rate,
      'Term (Years)': loan.term,
      'Monthly Payment': details.monthlyPayment.toFixed(2),
      'Total Interest': details.totalInterest.toFixed(2),
      'Total Payment': details.totalPayment.toFixed(2)
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          filename="loan-comparison"
          title="Loan Comparison Analysis"
        />
      </div>

      {/* Add New Loan */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Loan for Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Loan Name"
            value={newLoan.name}
            onChange={(e) => setNewLoan({...newLoan, name: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Loan Amount"
            value={newLoan.amount || ''}
            onChange={(e) => setNewLoan({...newLoan, amount: parseFloat(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Interest Rate (%)"
            value={newLoan.rate || ''}
            onChange={(e) => setNewLoan({...newLoan, rate: parseFloat(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Term (Years)"
            value={newLoan.term || ''}
            onChange={(e) => setNewLoan({...newLoan, term: parseInt(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={addLoan}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Loan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loans.map((loan) => (
          <div key={loan.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium">{loan.name}</h4>
              {loans.length > 1 && (
                <button
                  onClick={() => removeLoan(loan.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Loan Amount</label>
                  <input
                    type="number"
                    value={loan.amount}
                    onChange={(e) => updateLoan(loan.id, 'amount', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={loan.rate}
                    onChange={(e) => updateLoan(loan.id, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Term (Years)</label>
                  <input
                    type="number"
                    value={loan.term}
                    onChange={(e) => updateLoan(loan.id, 'term', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                {(() => {
                  const details = calculateLoanDetails(loan);
                  return (
                    <>
                      <div className="text-center">
                        <p className="text-sm text-gray-400">Monthly Payment</p>
                        <p className="text-xl font-bold text-blue-400">${details.monthlyPayment.toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-400">Total Interest</p>
                        <p className="text-xl font-bold text-red-400">${details.totalInterest.toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-400">Total Payment</p>
                        <p className="text-xl font-bold text-gray-200">${details.totalPayment.toFixed(2)}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Summary */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Comparison Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2">Loan</th>
                <th className="text-right py-2">Monthly Payment</th>
                <th className="text-right py-2">Total Interest</th>
                <th className="text-right py-2">Total Payment</th>
                <th className="text-right py-2">Savings vs Best</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => {
                const details = calculateLoanDetails(loan);
                const bestTotalPayment = Math.min(...loans.map(l => calculateLoanDetails(l).totalPayment));
                const savings = details.totalPayment - bestTotalPayment;
                
                return (
                  <tr key={loan.id} className="border-b border-gray-700">
                    <td className="py-2 font-medium">{loan.name}</td>
                    <td className="text-right py-2">${details.monthlyPayment.toFixed(2)}</td>
                    <td className="text-right py-2">${details.totalInterest.toFixed(2)}</td>
                    <td className="text-right py-2">${details.totalPayment.toFixed(2)}</td>
                    <td className={`text-right py-2 ${savings === 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {savings === 0 ? 'Best Option' : `+$${savings.toFixed(2)}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};