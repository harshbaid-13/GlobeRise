import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supportService } from '../../services/supportService';
import { formatDate } from '../../utils/formatters';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { FaTicketAlt, FaQuestionCircle, FaPlus, FaCheckCircle, FaClock, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const TICKET_CATEGORIES = [
  { value: 'TECHNICAL', label: 'Technical' },
  { value: 'FINANCIAL', label: 'Financial' },
  { value: 'ACCOUNT', label: 'Account' },
  { value: 'INVESTMENT', label: 'Investment' },
  { value: 'WITHDRAWAL', label: 'Withdrawal' },
  { value: 'OTHER', label: 'Other' }
];

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' }
];

const ClientSupport = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('create'); // 'create', 'tickets', 'faqs'
  const [tickets, setTickets] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(0);
  
  // Form fields
  const [category, setCategory] = useState('TECHNICAL');
  const [priority, setPriority] = useState('MEDIUM');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'tickets') {
      loadTickets();
    } else if (activeTab === 'faqs') {
      loadFAQs();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedCategory !== 'ALL') {
      loadFAQs(selectedCategory);
    } else {
      loadFAQs();
    }
  }, [selectedCategory]);

  const loadTickets = async () => {
    try {
      setTicketsLoading(true);
      const data = await supportService.getMyTickets();
      const ticketsList = data || [];
      setTickets(ticketsList);
      setTicketCount(ticketsList.length);
    } catch (err) {
      console.error('Error loading tickets:', err);
      setError('Failed to load tickets');
    } finally {
      setTicketsLoading(false);
    }
  };

  const loadFAQs = async (category) => {
    try {
      setFaqsLoading(true);
      const data = await supportService.getFAQs(category);
      setFaqs(data || []);
    } catch (err) {
      console.error('Error loading FAQs:', err);
    } finally {
      setFaqsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await supportService.createTicket({
        category,
        subject,
        message,
        priority
      });
      setSuccess('Support ticket created successfully!');
      setSubject('');
      setMessage('');
      setCategory('TECHNICAL');
      setPriority('MEDIUM');
      // Switch to tickets tab after creation
      setTimeout(() => {
        setActiveTab('tickets');
        loadTickets();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = async (ticketId) => {
    try {
      const ticket = await supportService.getTicket(ticketId);
      setSelectedTicket(ticket);
    } catch (err) {
      setError('Failed to load ticket details');
    }
  };

  const handleAddResponse = async () => {
    if (!responseMessage.trim()) return;

    try {
      setLoading(true);
      await supportService.addResponse(selectedTicket.id, responseMessage);
      setResponseMessage('');
      await handleViewTicket(selectedTicket.id);
      setSuccess('Response added successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add response');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to cancel this ticket?')) return;

    try {
      setLoading(true);
      await supportService.cancelTicket(ticketId);
      setSuccess('Ticket cancelled successfully!');
      await loadTickets();
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel ticket');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      OPEN: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: FaClock, label: 'Open' },
      IN_PROGRESS: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: FaExclamationTriangle, label: 'In Progress' },
      ANSWERED: { bg: 'bg-green-500/20', text: 'text-green-400', icon: FaCheckCircle, label: 'Answered' },
      CLOSED: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: FaTimes, label: 'Closed' }
    };
    const badge = badges[status] || badges.OPEN;
    const Icon = badge.icon;
    return (
      <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${badge.bg} ${badge.text}`}>
        <Icon /> {badge.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      LOW: 'bg-gray-500/20 text-gray-400',
      MEDIUM: 'bg-blue-500/20 text-blue-400',
      HIGH: 'bg-orange-500/20 text-orange-400',
      URGENT: 'bg-red-500/20 text-red-400'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${badges[priority] || badges.MEDIUM}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
          <FaTicketAlt className="text-blue-500" />
          Support & Help
        </h1>
      </div>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-[var(--border-color)]">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'create'
              ? 'text-[#00ADB5] border-b-2 border-[#00ADB5]'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <FaPlus className="inline mr-2" />
          Create Ticket
        </button>
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'tickets'
              ? 'text-[#00ADB5] border-b-2 border-[#00ADB5]'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <FaTicketAlt className="inline mr-2" />
          My Tickets {ticketCount > 0 && `(${ticketCount})`}
        </button>
        <button
          onClick={() => setActiveTab('faqs')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'faqs'
              ? 'text-[#00ADB5] border-b-2 border-[#00ADB5]'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <FaQuestionCircle className="inline mr-2" />
          FAQs
        </button>
      </div>

      {/* Create Ticket Tab */}
      {activeTab === 'create' && (
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] p-6 transition-colors duration-200">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Create Support Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] transition-colors duration-200"
                  required
                >
                  {TICKET_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] transition-colors duration-200"
                  required
                >
                  {PRIORITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] transition-colors duration-200"
                placeholder="Enter ticket subject"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] transition-colors duration-200"
                placeholder="Describe your issue in detail..."
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? 'Submitting...' : 'Submit Ticket'}
            </Button>
          </form>
        </div>
      )}

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <>
          {ticketsLoading ? (
            <Loading />
          ) : tickets.length === 0 ? (
            <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] p-12 text-center transition-colors duration-200">
              <FaTicketAlt className="mx-auto text-5xl text-[var(--text-muted)] mb-4" />
              <p className="text-[var(--text-tertiary)] text-lg">No tickets yet</p>
              <p className="text-[var(--text-muted)] text-sm mt-2">Create a support ticket to get help</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] p-6 hover:border-[#00ADB5] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => handleViewTicket(ticket.id)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{ticket.subject}</h3>
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.priority)}
                      </div>
                      <p className="text-[var(--text-tertiary)] text-sm mb-2 line-clamp-2">{ticket.message}</p>
                      <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                        <span>Category: {TICKET_CATEGORIES.find(c => c.value === ticket.category)?.label || ticket.category}</span>
                        <span>Created: {formatDate(ticket.createdAt)}</span>
                      </div>
                    </div>
                    {ticket.status === 'OPEN' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelTicket(ticket.id);
                        }}
                        className="ml-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm font-medium"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* FAQs Tab */}
      {activeTab === 'faqs' && (
        <>
          <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] p-4 mb-6 transition-colors duration-200">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-64 px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] transition-colors duration-200"
            >
              <option value="ALL">All Categories</option>
              {TICKET_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {faqsLoading ? (
            <Loading />
          ) : faqs.length === 0 ? (
            <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] p-12 text-center transition-colors duration-200">
              <FaQuestionCircle className="mx-auto text-5xl text-[var(--text-muted)] mb-4" />
              <p className="text-[var(--text-tertiary)]">No FAQs available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] p-6 transition-colors duration-200"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <FaQuestionCircle className="text-blue-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{faq.question}</h3>
                      <p className="text-[var(--text-secondary)] whitespace-pre-wrap">{faq.answer}</p>
                      <span className="inline-block mt-3 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                        {TICKET_CATEGORIES.find(c => c.value === faq.category)?.label || faq.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedTicket.subject}</h2>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {getStatusBadge(selectedTicket.status)}
                  {getPriorityBadge(selectedTicket.priority)}
                  <span className="text-[var(--text-tertiary)] text-sm">
                    {TICKET_CATEGORIES.find(c => c.value === selectedTicket.category)?.label || selectedTicket.category}
                  </span>
                </div>
                <div className="bg-[var(--bg-primary)] rounded-lg p-4 mb-4 border border-[var(--border-color)]">
                  <p className="text-[var(--text-primary)] whitespace-pre-wrap">{selectedTicket.message}</p>
                  <p className="text-[var(--text-muted)] text-xs mt-2">Created: {formatDate(selectedTicket.createdAt)}</p>
                </div>
              </div>

              {selectedTicket.adminResponse && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Admin Response</h3>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <p className="text-[var(--text-secondary)] whitespace-pre-wrap">{selectedTicket.adminResponse}</p>
                    {selectedTicket.respondedAt && (
                      <p className="text-[var(--text-muted)] text-xs mt-2">Responded: {formatDate(selectedTicket.respondedAt)}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedTicket.status !== 'CLOSED' && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Add Response</h3>
                  <textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] mb-3 transition-colors duration-200"
                    placeholder="Type your response..."
                  />
                  <Button onClick={handleAddResponse} disabled={loading || !responseMessage.trim()}>
                    {loading ? 'Sending...' : 'Send Response'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientSupport;
