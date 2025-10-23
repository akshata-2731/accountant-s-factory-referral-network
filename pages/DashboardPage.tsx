import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { User, Referral, CommissionWallet, Payout } from '../types';
import { getUserData, submitReferral } from '../services/mockApiService';
import Card from '../components/Card';
import Button from '../components/Button';
import { ReferralStatus } from '../types';

const StatusBadge: React.FC<{ status: ReferralStatus }> = ({ status }) => {
    const colorClasses = {
        [ReferralStatus.LeadReceived]: 'bg-blue-100 text-blue-800',
        [ReferralStatus.ProposalSent]: 'bg-indigo-100 text-indigo-800',
        [ReferralStatus.Accepted]: 'bg-purple-100 text-purple-800',
        [ReferralStatus.WorkInProgress]: 'bg-yellow-100 text-yellow-800',
        [ReferralStatus.Completed]: 'bg-green-100 text-green-800',
        [ReferralStatus.Paid]: 'bg-teal-100 text-teal-800',
    };
    return (
        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${colorClasses[status]}`}>
            {status}
        </span>
    );
};


const CommissionWalletSection: React.FC<{ wallet: CommissionWallet | null }> = ({ wallet }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
            <p className="text-sm text-gray-500">Total Earned</p>
            <p className="text-3xl font-bold text-brand-teal">₹{wallet?.totalEarned.toLocaleString() ?? '...'}</p>
        </Card>
        <Card>
            <p className="text-sm text-gray-500">Pending Commission</p>
            <p className="text-3xl font-bold text-brand-gray">₹{wallet?.pending.toLocaleString() ?? '...'}</p>
        </Card>
        <Card>
            <p className="text-sm text-gray-500">Total Paid Out</p>
            <p className="text-3xl font-bold text-brand-gray">₹{wallet?.paid.toLocaleString() ?? '...'}</p>
        </Card>
    </div>
);

const EarningsChart: React.FC<{data: {month: string, earnings: number}[]}> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.earnings), 1); // Avoid division by zero
    return (
        <Card>
            <h2 className="text-2xl font-bold font-serif text-brand-gray mb-4">Monthly Earnings (Last 6 Months)</h2>
            <div className="flex justify-around items-end h-48 pt-6 space-x-2 sm:space-x-4">
                {data.map(item => (
                    <div key={item.month} className="flex flex-col items-center flex-1 group" title={`₹${item.earnings.toLocaleString()}`}>
                        <div className="relative w-full h-full flex items-end">
                            <div
                                className="w-full bg-brand-teal rounded-t-md hover:bg-brand-teal-dark transition-colors duration-300"
                                style={{ height: `${(item.earnings / maxValue) * 100}%` }}
                            >
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-gray text-white text-xs px-2 py-1 rounded-md pointer-events-none">
                                    ₹{item.earnings.toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <span className="text-xs text-gray-500 mt-2 font-medium">{item.month}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const ReferralForm: React.FC<{ user: User; onReferralSubmitted: (newReferral: Referral) => void }> = ({ user, onReferralSubmitted }) => {
    const [clientName, setClientName] = useState('');
    const [mobile, setMobile] = useState('');
    const [expectedCommission, setExpectedCommission] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientName || !mobile || !expectedCommission) {
            setMessage("Please fill in all fields.");
            return;
        }
        setIsSubmitting(true);
        setMessage('');
        try {
            // Pass null for referrerName if not used, ensures 4 arguments
           const newReferral = await submitReferral(clientName, mobile, Number(expectedCommission));


onReferralSubmitted(newReferral);

            onReferralSubmitted(newReferral);
            setClientName('');
            setMobile('');
            setExpectedCommission('');
            setMessage("Referral submitted successfully!");
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage("Failed to submit referral. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold font-serif text-brand-gray mb-4">Submit a New Referral</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client's Full Name</label>
                    <input type="text" id="clientName" value={clientName} onChange={e => setClientName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-teal focus:border-brand-teal" required />
                </div>
                <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Client's Mobile Number</label>
                    <input type="tel" id="mobile" value={mobile} onChange={e => setMobile(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-teal focus:border-brand-teal" required />
                </div>
                <div>
                    <label htmlFor="expectedCommission" className="block text-sm font-medium text-gray-700">Expected Commission (₹)</label>
                    <input
                        type="number"
                        id="expectedCommission"
                        value={expectedCommission}
                        onChange={e => setExpectedCommission(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-teal focus:border-brand-teal"
                        required
                    />
                </div>
                <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Referral'}
                </Button>
                {message && <p className={`text-sm text-center mt-2 ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
            </form>
        </Card>
    );
};


const ReferralsTable: React.FC<{ referrals: Referral[]; filterStatus: ReferralStatus | 'all'; onFilterChange: (status: ReferralStatus | 'all') => void; }> = ({ referrals, filterStatus, onFilterChange }) => {
    const filterOptions: (ReferralStatus | 'all')[] = ['all', ...Object.values(ReferralStatus)];

    return (
    <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-2xl font-bold font-serif text-brand-gray">My Referrals</h2>
            <div className="flex flex-wrap gap-2">
                {filterOptions.map(status => (
                    <button
                        key={status}
                        onClick={() => onFilterChange(status)}
                        className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${filterStatus === status ? 'bg-brand-teal text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        {status === 'all' ? 'All' : status}
                    </button>
                ))}
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Client Name</th>
                        <th scope="col" className="px-6 py-3">Date Submitted</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3 text-right">Expected Commission</th>
                    </tr>
                </thead>
                <tbody>
                    {referrals.length > 0 ? referrals.map(referral => (
                        <tr key={referral.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{referral.clientName}</td>
                            <td className="px-6 py-4">{referral.dateSubmitted}</td>
                            <td className="px-6 py-4"><StatusBadge status={referral.status} /></td>
                            <td className="px-6 py-4 text-right font-semibold text-brand-gray">₹{referral.expectedCommission.toLocaleString()}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="text-center py-8 text-gray-500">No referrals match the current filter.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </Card>
)};


const PayoutsTable: React.FC<{ payouts: Payout[] }> = ({ payouts }) => (
    <Card className="h-full flex flex-col">
        <h2 className="text-2xl font-bold font-serif text-brand-gray mb-4">Payout History</h2>
        <div className="overflow-y-auto flex-grow">
            <table className="w-full text-sm text-left text-gray-500">
                 <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                    <tr>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Client</th>
                        <th scope="col" className="px-6 py-3 text-right">Amount</th>
                        <th scope="col" className="px-6 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                 <tbody className="divide-y divide-gray-200">
                    {payouts.length > 0 ? payouts.map(payout => (
                        <tr key={payout.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{payout.date}</td>
                            <td className="px-6 py-4 font-medium text-gray-700">{payout.clientName}</td>
                            <td className="px-6 py-4 text-right font-semibold text-brand-teal">₹{payout.amount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-center">
                                <Button variant="outline" className="text-xs py-1 px-3">
                                    View Details
                                </Button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="text-center py-8 text-gray-500">No payouts have been processed yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </Card>
);

interface DashboardPageProps {
  user: User;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user }) => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [wallet, setWallet] = useState<CommissionWallet | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ReferralStatus | 'all'>('all');

  const fetchUserData = useCallback(async () => {
    // Only set loading on initial fetch
    if (!wallet) setIsLoading(true);
    setError(null);
    try {
      const data = await getUserData(user);
      setReferrals(data.referrals);
      setWallet(data.wallet);
      setPayouts(data.payouts);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user, wallet]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleReferralSubmitted = (newReferral: Referral) => {
    setReferrals(prevReferrals => [newReferral, ...prevReferrals]);
    // Refetch all data to ensure wallet and other stats are consistent
    fetchUserData();
  };

  const filteredReferrals = useMemo(() => {
    if (filterStatus === 'all') {
        return referrals;
    }
    return referrals.filter(r => r.status === filterStatus);
  }, [referrals, filterStatus]);
  
  const chartData = useMemo(() => {
    const monthlyEarnings: { [key: string]: number } = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
        monthlyEarnings[monthKey] = 0;
    }

    payouts.forEach(payout => {
        const payoutDate = new Date(payout.date);
        const monthKey = `${payoutDate.getFullYear()}-${payoutDate.getMonth()}`;
        if (monthlyEarnings.hasOwnProperty(monthKey)) {
            monthlyEarnings[monthKey] += payout.amount;
        }
    });

    return Object.entries(monthlyEarnings).map(([key, earnings]) => {
        const [year, month] = key.split('-');
        return {
            month: monthNames[parseInt(month, 10)],
            earnings,
        };
    });
  }, [payouts]);
  
  if (isLoading) {
    return <div className="text-center p-10">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-brand-light-gray min-h-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-serif text-brand-gray">Partner Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome back, {user.name}. Here's an overview of your referral activity.</p>
        </div>

        <div className="mb-8">
            <EarningsChart data={chartData} />
        </div>
        
        <CommissionWalletSection wallet={wallet} />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
                <ReferralForm user={user} onReferralSubmitted={handleReferralSubmitted} />
            </div>
            <div className="lg:col-span-2">
                <PayoutsTable payouts={payouts} />
            </div>
        </div>
        
        <div className="mt-8">
            <ReferralsTable referrals={filteredReferrals} filterStatus={filterStatus} onFilterChange={setFilterStatus} />
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;