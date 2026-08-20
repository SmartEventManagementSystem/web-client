import { useState, useEffect } from 'react';
import { Ticket as TicketIcon, QrCode, Calendar, MapPin, Download } from 'lucide-react';
import { ticketsApi } from '@/services/api';
import { Card, Badge, Button, EmptyState, Tabs, Modal } from '@/components/ui/Toast';
import type { Ticket } from '@/types';
import { formatDate, cn } from '@/lib/utils';

const MOCK_TICKETS: Ticket[] = [
  { id: '1', event_id: 'e1', user_id: 'u1', ticket_type: 'VIP Pass', status: 'active', price: 299, created_at: new Date().toISOString() },
  { id: '2', event_id: 'e2', user_id: 'u1', ticket_type: 'General Admission', status: 'active', price: 79, created_at: new Date().toISOString() },
  { id: '3', event_id: 'e3', user_id: 'u1', ticket_type: 'Early Bird', status: 'used', price: 49, created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: '4', event_id: 'e4', user_id: 'u1', ticket_type: 'Premium', status: 'active', price: 199, created_at: new Date().toISOString() },
  { id: '5', event_id: 'e5', user_id: 'u1', ticket_type: 'General', status: 'refunded', price: 59, created_at: new Date(Date.now() - 86400000 * 10).toISOString() },
];

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    ticketsApi.list()
      .then((res) => setTickets(res.data.data))
      .catch(() => setTickets(MOCK_TICKETS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tickets.filter((t) =>
    filter === 'all' ? true : t.status === filter
  );

  const statusConfig = {
    active: { label: 'Active', variant: 'success' as const, dot: true },
    used: { label: 'Used', variant: 'default' as const, dot: false },
    cancelled: { label: 'Cancelled', variant: 'error' as const, dot: false },
    refunded: { label: 'Refunded', variant: 'warning' as const, dot: false },
  };

  const openQR = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowQRModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">My Tickets</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {tickets.length > 0 ? `${tickets.length} tickets across your events` : 'Your purchased tickets will appear here'}
          </p>
        </div>
        <Button className="gap-2">
          <TicketIcon className="w-4 h-4" />
          Find Events
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'all', label: 'All', count: tickets.length },
          { id: 'active', label: 'Active', count: tickets.filter((t) => t.status === 'active').length },
          { id: 'used', label: 'Used', count: tickets.filter((t) => t.status === 'used').length },
          { id: 'refunded', label: 'Refunded', count: tickets.filter((t) => t.status === 'refunded').length },
        ]}
        activeTab={filter}
        onChange={setFilter}
      />

      {/* Tickets */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="flex">
                <div className="w-2 bg-gradient-to-b from-purple-500 to-blue-600" />
                <div className="flex-1 p-5 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={TicketIcon}
          title={filter === 'all' ? 'No tickets yet' : `No ${filter} tickets`}
          description={filter === 'all' ? 'Browse events to purchase tickets' : `You don't have any ${filter} tickets`}
          action={{ label: 'Find Events', onClick: () => {} }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((ticket) => {
            const config = statusConfig[ticket.status] || statusConfig.active;
            return (
              <Card
                key={ticket.id}
                hover
                className="overflow-hidden group"
              >
                <div className="flex">
                  {/* Left accent bar */}
                  <div className="w-1.5 bg-gradient-to-b from-purple-500 to-blue-600 flex-shrink-0" />

                  {/* Main content */}
                  <div className="flex-1 p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant={config.variant} dot={config.dot}>
                          {config.label}
                        </Badge>
                        <Badge variant="purple">{ticket.ticket_type}</Badge>
                      </div>
                      <button
                        onClick={() => openQR(ticket)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <QrCode className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Event info */}
                    <h3 className="font-bold text-gray-900 dark:text-white text-base mb-3">
                      {ticket.event?.title || `Event #${ticket.event_id.slice(0, 8)}`}
                    </h3>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>{formatDate(ticket.created_at)}</span>
                      </div>
                      {ticket.event?.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{ticket.event.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Ticket ID */}
                    <p className="text-xs text-gray-400 font-mono mb-4">
                      #{ticket.id.slice(0, 12).toUpperCase()}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                      <div>
                        <p className="text-xs text-gray-400">Price</p>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          ${ticket.price}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => openQR(ticket)}>
                          <QrCode className="w-4 h-4" />
                          View QR
                        </Button>
                        <Button variant="secondary" size="sm" className="gap-1.5">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* QR Modal */}
      <Modal open={showQRModal} onClose={() => setShowQRModal(false)} title="Ticket QR Code" size="sm">
        {selectedTicket && (
          <div className="text-center space-y-4">
            <div className="w-48 h-48 mx-auto bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
              <div className="grid grid-cols-8 gap-0.5 p-4">
                {/* Simulated QR code */}
                {Array.from({ length: 64 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'w-1.5 h-1.5 rounded-[2px]',
                      Math.random() > 0.5 ? 'bg-gray-900 dark:bg-white' : 'bg-transparent'
                    )}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-mono text-gray-500">{selectedTicket.id}</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{selectedTicket.ticket_type}</p>
            </div>
            <p className="text-xs text-gray-400">Present this QR code at the event entrance</p>
            <Button className="w-full gap-2">
              <Download className="w-4 h-4" />
              Download Ticket
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
