import { useState, useEffect } from 'react';
import { Users, Search, Plus, Mail, Briefcase, Globe, X, ChevronRight } from 'lucide-react';
import { LinkedinIcon } from '@/components/icons';
import { speakersApi } from '@/services/api';
import { Card, CardContent, Button, Avatar, EmptyState, Modal } from '@/components/ui/Toast';
import type { Speaker } from '@/types';

const MOCK_SPEAKERS: Speaker[] = [
  { id: '1', name: 'Dr. Emily Watson', bio: 'AI researcher and keynote speaker with 15+ years of experience in machine learning and natural language processing.', avatar: '', title: 'Chief AI Scientist', company: 'DeepMind', social_links: { twitter: 'emilywatson', linkedin: 'emilywatson', website: 'emilywatson.ai' } },
  { id: '2', name: 'Michael Chen', bio: 'Serial entrepreneur and venture capital investor focused on B2B SaaS and developer tools.', avatar: '', title: 'General Partner', company: 'Sequoia Capital', social_links: { twitter: 'mchen', linkedin: 'michaelchen' } },
  { id: '3', name: 'Sarah Johnson', bio: 'Product design leader who has shipped products used by millions. Previously at Apple and Figma.', avatar: '', title: 'VP of Design', company: 'Figma', social_links: { linkedin: 'sarahjohnson', website: 'sarahjohnson.design' } },
  { id: '4', name: 'Alex Rivera', bio: 'Cloud infrastructure expert and author of "Kubernetes in Production". Building the future of distributed systems.', avatar: '', title: 'Principal Engineer', company: 'Google Cloud', social_links: { twitter: 'alexrivera', linkedin: 'alexrivera', website: 'alexrivera.dev' } },
  { id: '5', name: 'Dr. James Park', bio: 'Neuroscientist turned entrepreneur. Exploring the intersection of brain-computer interfaces and AI.', avatar: '', title: 'Founder & CEO', company: 'NeuroLink Labs', social_links: { twitter: 'drjpark', website: 'neuro.link' } },
  { id: '6', name: 'Priya Sharma', bio: 'Building inclusive tech ecosystems. Advisor to 50+ startups on scaling engineering teams.', avatar: '', title: 'Engineering Director', company: 'Stripe', social_links: { twitter: 'priyasharma', linkedin: 'priyasharmatech' } },
];

export default function Speakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    speakersApi.list()
      .then((res) => setSpeakers(res.data.data))
      .catch(() => setSpeakers(MOCK_SPEAKERS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = speakers.filter((s) =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.company?.toLowerCase().includes(search.toLowerCase()) ||
    s.title?.toLowerCase().includes(search.toLowerCase())
  );

  const openDetail = (speaker: Speaker) => {
    setSelectedSpeaker(speaker);
    setShowDetail(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Speakers</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {speakers.length > 0 ? `${speakers.length} speakers` : 'Meet our amazing speakers'}
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Speaker
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, company, or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Speakers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-36 bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>
              <CardContent className="p-5 space-y-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4 mx-auto" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2 mx-auto" />
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No speakers found"
          description="Try adjusting your search criteria"
          action={{ label: 'Clear Search', onClick: () => setSearch('') }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((speaker) => (
            <Card
              key={speaker.id}
              hover
              className="overflow-hidden group"
              onClick={() => openDetail(speaker)}
            >
              {/* Avatar Banner */}
              <div className="relative h-28 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-purple-500/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10" />
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                  <Avatar name={speaker.name} src={speaker.avatar} size="xl" className="w-20 h-20 border-4 border-white dark:border-gray-900 shadow-xl" />
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <CardContent className="pt-12 pb-5 text-center">
                <h3 className="font-bold text-gray-900 dark:text-white text-base">{speaker.name}</h3>
                {speaker.title && (
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mt-0.5">{speaker.title}</p>
                )}
                {speaker.company && (
                  <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    {speaker.company}
                  </div>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 line-clamp-3 leading-relaxed">{speaker.bio}</p>

                {/* Social Links */}
                {speaker.social_links && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {speaker.social_links.twitter && (
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-blue-400 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    {speaker.social_links.linkedin && (
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-blue-600 transition-colors">
                        <LinkedinIcon className="w-4 h-4" />
                      </button>
                    )}
                    {speaker.social_links.website && (
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-purple-500 transition-colors">
                        <Globe className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}

                <Button variant="secondary" size="sm" className="mt-4 gap-1.5 w-full" onClick={() => openDetail(speaker)}>
                  <Mail className="w-4 h-4" />
                  Contact Speaker
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Speaker Detail Modal */}
      <Modal open={showDetail} onClose={() => setShowDetail(false)} title={selectedSpeaker?.name} size="lg">
        {selectedSpeaker && (
          <div className="space-y-6">
            <div className="flex items-start gap-5">
              <Avatar name={selectedSpeaker.name} src={selectedSpeaker.avatar} size="xl" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedSpeaker.name}</h3>
                {selectedSpeaker.title && (
                  <p className="text-purple-600 dark:text-purple-400 font-medium">{selectedSpeaker.title}</p>
                )}
                {selectedSpeaker.company && (
                  <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    {selectedSpeaker.company}
                  </p>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">About</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedSpeaker.bio}</p>
            </div>
            {selectedSpeaker.social_links && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Connect</p>
                <div className="flex gap-3">
                  {selectedSpeaker.social_links.twitter && (
                    <Button variant="secondary" size="sm" className="gap-1.5">
                      <X className="w-4 h-4" />
                      Twitter
                    </Button>
                  )}
                  {selectedSpeaker.social_links.linkedin && (
                    <Button variant="secondary" size="sm" className="gap-1.5">
                      <LinkedinIcon className="w-4 h-4" />
                      LinkedIn
                    </Button>
                  )}
                  {selectedSpeaker.social_links.website && (
                    <Button variant="secondary" size="sm" className="gap-1.5">
                      <Globe className="w-4 h-4" />
                      Website
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
