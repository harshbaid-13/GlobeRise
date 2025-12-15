import { useState, useEffect } from 'react';
import { transactionService } from '../../services/transactionService';
import { dashboardService } from '../../services/dashboardService';
import EarningsChart from '../../components/charts/EarningsChart';
import CustomLineChart from '../../components/charts/LineChart';
import CustomPieChart from '../../components/charts/PieChart';
import StatsCard from '../../components/common/StatsCard';
import { formatCurrency } from '../../utils/formatters';
import { FaChartPie, FaMoneyBillWave, FaDownload, FaFileCsv, FaFilePdf, FaChartLine, FaCoins } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('earnings'); // 'earnings' only (removed summary)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dateRange, setDateRange] = useState(30); // days
    const [earnings, setEarnings] = useState({});
    const [earningsReport, setEarningsReport] = useState(null);
    const [investmentReport, setInvestmentReport] = useState(null);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [activeTab, dateRange]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');

            if (activeTab === 'earnings') {
                const [earningsData, earningsReportData] = await Promise.all([
                    transactionService.getEarnings(),
                    dashboardService.getEarningsReport(dateRange)
                ]);
                setEarnings(earningsData.breakdown || {});
                setEarningsReport(earningsReportData);
                setChartData(earningsReportData?.chartData || []);
            }

        } catch (err) {
            console.error('Error loading reports:', err);
            setError(err.response?.data?.message || 'Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = (data, filename) => {
        try {
            const headers = Object.keys(data[0] || {});
            const rows = data.map(row => headers.map(header => row[header] || ''));
            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export failed:', err);
            setError('Failed to export CSV');
        }
    };

    const exportToPDF = (title, data) => {
        const printWindow = window.open('', '_blank');
        const htmlContent = `
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    <p>Generated: ${new Date().toLocaleString()}</p>
                    <table>
                        <thead>
                            <tr>
                                ${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(row => `
                                <tr>
                                    ${Object.values(row).map(val => `<td>${val}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
    };

    if (loading) return <Loading />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Reports</h1>
                <div className="flex gap-2">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(Number(e.target.value))}
                        className="px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] transition-colors duration-200"
                    >
                        <option value={7}>Last 7 days</option>
                        <option value={30}>Last 30 days</option>
                        <option value={90}>Last 90 days</option>
                        <option value={180}>Last 6 months</option>
                        <option value={365}>Last year</option>
                    </select>
                </div>
            </div>

            {error && <Alert type="error" message={error} />}

            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard
                            title="Total Earnings"
                            value={formatCurrency(earningsReport?.total || 0)}
                            icon={FaMoneyBillWave}
                            color="green"
                        />
                        <StatsCard
                            title="ROI"
                            value={formatCurrency(earningsReport?.breakdown?.ROI?.total || 0)}
                            icon={FaChartLine}
                            color="blue"
                        />
                        <StatsCard
                            title="Commissions"
                            value={formatCurrency(earningsReport?.breakdown?.COMMISSION?.total || 0)}
                            icon={FaMoneyBillWave}
                            color="purple"
                        />
                        <StatsCard
                            title="Royalties"
                            value={formatCurrency(earningsReport?.breakdown?.ROYALTY?.total || 0)}
                            icon={FaChartPie}
                            color="orange"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-[var(--card-bg)] p-6 rounded-lg border border-[var(--border-color)] transition-colors duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Earnings Breakdown</h3>
                                <button
                                    onClick={() => earningsReport?.chartData && exportToCSV(earningsReport.chartData, 'earnings')}
                                    className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-sm flex items-center gap-2"
                                >
                                    <FaFileCsv /> CSV
                                </button>
                            </div>
                            {earningsReport?.breakdown ? (
                                <CustomPieChart data={earningsReport.breakdown} />
                            ) : (
                                <div className="text-center text-[var(--text-tertiary)] py-12">No data available</div>
                            )}
                        </div>

                        <div className="bg-[var(--card-bg)] p-6 rounded-lg border border-[var(--border-color)] transition-colors duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Earnings Over Time</h3>
                                <button
                                    onClick={() => chartData && exportToPDF('Earnings Report', chartData)}
                                    className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm flex items-center gap-2"
                                >
                                    <FaFilePdf /> PDF
                                </button>
                            </div>
                            {chartData.length > 0 ? (
                                <CustomLineChart data={chartData} color="#00ADB5" name="Earnings" />
                            ) : (
                                <div className="text-center text-[var(--text-tertiary)] py-12">No data available</div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Investments Tab */}
            {activeTab === 'investments' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StatsCard
                            title="Total Invested"
                            value={formatCurrency(investmentReport?.total || 0)}
                            icon={FaCoins}
                            color="blue"
                        />
                        <StatsCard
                            title="Total Packages"
                            value={investmentReport?.byType?.PACKAGE?.count || 0}
                            icon={FaChartPie}
                            color="green"
                        />
                    </div>

                    <div className="bg-[var(--card-bg)] p-6 rounded-lg border border-[var(--border-color)] transition-colors duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Investment Trend</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => investmentReport?.chartData && exportToCSV(investmentReport.chartData, 'investments')}
                                    className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-sm flex items-center gap-2"
                                >
                                    <FaFileCsv /> CSV
                                </button>
                                <button
                                    onClick={() => investmentReport?.chartData && exportToPDF('Investment Report', investmentReport.chartData)}
                                    className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm flex items-center gap-2"
                                >
                                    <FaFilePdf /> PDF
                                </button>
                            </div>
                        </div>
                        {investmentReport?.chartData && investmentReport.chartData.length > 0 ? (
                            <CustomLineChart data={investmentReport.chartData} color="#10B981" name="Investments" />
                        ) : (
                            <div className="text-center text-[var(--text-tertiary)] py-12">No investment data available</div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Reports;
