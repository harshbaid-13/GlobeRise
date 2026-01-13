import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import { useState, useEffect } from 'react';
import { supportService } from '../../../services/supportService';
import { formatDate } from '../../../utils/formatters';
import Loading from '../../../components/common/Loading';
import Alert from '../../../components/common/Alert';
import { FaTicketAlt, FaCheckCircle, FaClock, FaTimes, FaExclamationTriangle, FaEye } from 'react-icons/fa';
import PermissionGuard from '../../../components/auth/PermissionGuard';
import { FEATURES, ACCESS } from '../../../utils/permissions';

const AllTicket = ({ statusFilter = null }) => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (statusFilter) {
      setFilteredTickets(tickets.filter(t => t.status === statusFilter));
    } else {
      setFilteredTickets(tickets);
    }
  }, [tickets, statusFilter]);

  const loadTickets = async () => {
    try {
      const data = await supportService.getAllTickets();
      setTickets(data || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = async (ticketId) => {
    try {
      const ticket = await supportService.getTicket(ticketId);
      setSelectedTicket(ticket);
      setAdminResponse('');
      setError('');
      setSuccess('');
    } catch (err) {
      setError('Failed to load ticket details');
    }
  };

  const handleAddResponse = async () => {
    if (!adminResponse.trim() || !selectedTicket) return;

    try {
      setSaving(true);
      setError('');
      await supportService.addResponse(selectedTicket.id, adminResponse);
      setSuccess('Response added successfully!');
      setAdminResponse('');
      await handleViewTicket(selectedTicket.id);
      await loadTickets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add response');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      setSaving(true);
      await supportService.updateTicketStatus(ticketId, newStatus);
      setSuccess('Ticket status updated successfully!');
      await loadTickets();
      if (selectedTicket && selectedTicket.id === ticketId) {
        await handleViewTicket(ticketId);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setSaving(false);
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
      <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${badge.bg} ${badge.text}`}>
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
      <span className={`px-2 py-1 rounded-full text-xs ${badges[priority] || badges.MEDIUM}`}>
        {priority}
      </span>
    );
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'User ID', accessor: 'userId' },
    { header: 'Subject', accessor: 'subject' },
    { 
      header: 'Status', 
      accessor: 'status', 
      render: (value) => getStatusBadge(value)
    },
    { 
      header: 'Priority', 
      accessor: 'priority', 
      render: (value) => getPriorityBadge(value)
    },
    { header: 'Category', accessor: 'category' },
    { header: 'Created', accessor: 'createdAt', render: (value) => formatDate(value) },
    {
      header: 'Action',
      accessor: 'id',
      render: (_, row) => (
        <Button
          size="sm"
          variant="primary"
          onClick={() => handleViewTicket(row.id)}
          className="flex items-center gap-2"
        >
          <FaEye /> View
        </Button>
      ),
    },
  ];

  if (loading) return <Loading size="lg" />;

  const title = statusFilter 
    ? `${statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase().replace('_', ' ')} Support Tickets`
    : 'All Support Tickets';

  return (
    <PermissionGuard feature={FEATURES.SUPPORT} access={ACCESS.READ}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
            <FaTicketAlt className="text-[#00ADB5]" />
            {title}
          </h1>
        </div>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <Card>
          <Table columns={columns} data={filteredTickets} />
        </Card>

        {/* Ticket Detail Modal */}
        {selectedTicket && (
          <Modal
            isOpen={!!selectedTicket}
            onClose={() => {
              setSelectedTicket(null);
              setAdminResponse('');
              setError('');
              setSuccess('');
            }}
            title={`Ticket: ${selectedTicket.subject}`}
            variant="light"
            size="lg"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedTicket.status)}
                {getPriorityBadge(selectedTicket.priority)}
                <span className="text-sm text-gray-600">Category: {selectedTicket.category}</span>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">User Message</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedTicket.message}</p>
                  <p className="text-xs text-gray-500 mt-2">Created: {formatDate(selectedTicket.createdAt)}</p>
                </div>
              </div>

              {selectedTicket.adminResponse && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Admin Response</h3>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedTicket.adminResponse}</p>
                    {selectedTicket.respondedAt && (
                      <p className="text-xs text-gray-500 mt-2">Responded: {formatDate(selectedTicket.respondedAt)}</p>
                    )}
                  </div>
                </div>
              )}

              <PermissionGuard feature={FEATURES.SUPPORT} access={ACCESS.EDIT}>
                {selectedTicket.status !== 'CLOSED' && (
                  <>
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Add Admin Response</h3>
                      <textarea
                        value={adminResponse}
                        onChange={(e) => setAdminResponse(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                        placeholder="Type your response..."
                      />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        onClick={handleAddResponse}
                        disabled={saving || !adminResponse.trim()}
                        variant="primary"
                      >
                        {saving ? 'Sending...' : 'Send Response'}
                      </Button>

                      {selectedTicket.status === 'OPEN' && (
                        <Button
                          onClick={() => handleUpdateStatus(selectedTicket.id, 'IN_PROGRESS')}
                          disabled={saving}
                          variant="warning"
                        >
                          Mark In Progress
                        </Button>
                      )}

                      {selectedTicket.status !== 'CLOSED' && (
                        <Button
                          onClick={() => handleUpdateStatus(selectedTicket.id, 'CLOSED')}
                          disabled={saving}
                          variant="danger"
                        >
                          Close Ticket
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </PermissionGuard>
            </div>
          </Modal>
        )}
      </div>
    </PermissionGuard>
  );
};

export default AllTicket;

