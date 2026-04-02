import React, { useState } from 'react';
import { FileText, Sparkles, CheckCircle, ExternalLink } from 'lucide-react';

const features = [
  'AI-powered resume tailored to any job listing',
  '10+ professional templates (ATS-optimized)',
  'One-click cover letter generation',
  'Real-time keyword matching',
  'Instant PDF download',
  'Big Day Attire career dress guide',
];

const sampleLines = [
  'Results-driven marketing professional with 7+ years driving measurable growth...',
  '● Increased Q3 revenue by 34% through targeted digital campaigns',
  '● Led a cross-functional team of 12 to deliver project 3 weeks ahead of schedule',
  '● Reduced customer churn by 22% with data-driven retention strategies',
];

export const ResumeBuilderPro: React.FC = () => {
  const [nameInput, setNameInput] = useState('');
  const [roleInput, setRoleInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = () => {
    if (nameInput.trim() || roleInput.trim()) setShowPreview(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 mb-4">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span className="text-sm font-medium text-pink-400">AI-Powered Resume Builder</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Build a Resume That Gets Interviews</h2>
        <p className="text-gray-400">Try a quick preview below — then unlock the full AI suite on SexyResume.com</p>
      </div>

      {!showPreview ? (
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 mb-6">
          <p className="text-sm text-gray-400 mb-4">Enter your name and target job title to see a sample:</p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your name (e.g. Jordan Smith)"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
            />
            <input
              type="text"
              placeholder="Target job title (e.g. Marketing Manager)"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
            />
            <button
              onClick={handleGenerate}
              disabled={!nameInput.trim() && !roleInput.trim()}
              className="w-full py-3 bg-pink-600 hover:bg-pink-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Preview My Resume
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border-2 border-pink-400/40 p-6 mb-6 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent z-10 flex items-end justify-center pb-4">
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700 mb-1">Full resume requires SexyResume</p>
              <p className="text-xs text-gray-500">AI-tailored to any job listing, ready in 2 minutes</p>
            </div>
          </div>
          <div className="text-gray-900">
            <div className="border-b-2 border-gray-300 pb-3 mb-4">
              <h3 className="text-xl font-bold">{nameInput || 'Your Name'}</h3>
              <p className="text-gray-600 text-sm">{roleInput || 'Your Target Role'} · email@example.com · (555) 000-0000</p>
            </div>
            <div className="mb-4">
              <h4 className="font-bold text-sm uppercase tracking-wide text-gray-500 mb-1">Professional Summary</h4>
              <p className="text-sm text-gray-700">{sampleLines[0]}</p>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide text-gray-500 mb-1">Experience</h4>
              <div className="space-y-1">
                {sampleLines.slice(1).map((line, i) => (
                  <p key={i} className="text-sm text-gray-700">{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 mb-6">
        <p className="text-sm font-semibold text-white mb-4">What you get on SexyResume.com:</p>
        <div className="space-y-2">
          {features.map((f) => (
            <div key={f} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-300">{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <a
          href="https://sexyresume.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl text-lg transition-all shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40"
        >
          <FileText className="w-5 h-5" />
          Build My Full Resume on SexyResume
          <ExternalLink className="w-4 h-4" />
        </a>
        <p className="text-xs text-gray-500 mt-3">Opens SexyResume.com · AI-powered · No account required to start</p>
      </div>
    </div>
  );
};
