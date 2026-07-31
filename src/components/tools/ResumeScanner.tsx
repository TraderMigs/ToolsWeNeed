import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, AlertTriangle, FileText, Briefcase } from 'lucide-react';
import { saveToolData, loadToolData, clearToolData } from '../../utils/storageUtils';
import { AutoSaveIndicator } from '../AutoSaveIndicator';

// Words too common to count as meaningful job-description keywords.
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'but', 'by', 'can', 'do',
  'for', 'from', 'has', 'have', 'in', 'is', 'it', 'its', 'of', 'on', 'or',
  'our', 'that', 'the', 'their', 'them', 'they', 'this', 'to', 'was', 'we',
  'will', 'with', 'you', 'your', 'must', 'should', 'would', 'may', 'might',
  'about', 'across', 'after', 'all', 'also', 'am', 'any', 'both', 'each',
  'etc', 'if', 'into', 'more', 'most', 'not', 'other', 'over', 'per', 'plus',
  'some', 'such', 'than', 'then', 'these', 'those', 'through', 'under', 'up',
  'us', 'use', 'using', 'via', 'well', 'what', 'when', 'where', 'which',
  'while', 'who', 'why', 'within', 'work', 'working', 'years', 'year',
  'experience', 'experienced', 'strong', 'ability', 'able', 'including',
  'required', 'requirements', 'preferred', 'looking', 'seeking', 'role',
  'position', 'candidate', 'team', 'skills', 'knowledge', 'related',
]);

const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .split(/[^a-z0-9+#./-]+/)
    .map(w => w.replace(/^[./-]+|[./-]+$/g, ''))
    .filter(w => w.length >= 2 && !STOPWORDS.has(w) && !/^\d+$/.test(w));

export const ResumeScanner: React.FC<{ toolId?: string }> = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [hasSavedData, setHasSavedData] = useState(false);

  useEffect(() => {
    try {
      const saved = loadToolData('resume_scanner');
      if (saved?.resumeText || saved?.jobText) {
        setResumeText(saved.resumeText || '');
        setJobText(saved.jobText || '');
        setHasSavedData(true);
      }
    } catch { /* fresh start */ }
  }, []);

  useEffect(() => {
    try {
      if (resumeText || jobText) {
        saveToolData('resume_scanner', { resumeText, jobText });
        setHasSavedData(true);
      }
    } catch { /* storage unavailable */ }
  }, [resumeText, jobText]);

  const analysis = useMemo(() => {
    if (!resumeText.trim() || !jobText.trim()) return null;

    // Rank job keywords by how often the posting repeats them.
    const counts = new Map<string, number>();
    tokenize(jobText).forEach(w => counts.set(w, (counts.get(w) || 0) + 1));
    const keywords = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([word]) => word);

    const resumeWords = new Set(tokenize(resumeText));
    const matched = keywords.filter(k => resumeWords.has(k));
    const missing = keywords.filter(k => !resumeWords.has(k));
    const score = keywords.length > 0 ? Math.round((matched.length / keywords.length) * 100) : 0;

    return { keywords, matched, missing, score };
  }, [resumeText, jobText]);

  const scoreColor = analysis
    ? analysis.score >= 70 ? 'text-green-400' : analysis.score >= 50 ? 'text-amber-400' : 'text-red-400'
    : '';

  const clearAll = () => {
    clearToolData('resume_scanner');
    setResumeText('');
    setJobText('');
    setHasSavedData(false);
  };

  return (
    <div className="space-y-5">
      <AutoSaveIndicator toolName="Resume Scanner" hasData={hasSavedData} onClearData={clearAll} />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
            <FileText className="h-4 w-4 text-blue-400" /> Your resume
          </label>
          <textarea
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            rows={10}
            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
            <Briefcase className="h-4 w-4 text-purple-400" /> Job description
          </label>
          <textarea
            value={jobText}
            onChange={e => setJobText(e.target.value)}
            placeholder="Paste the job posting here..."
            rows={10}
            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {!analysis && (
        <p className="text-center text-sm text-gray-500">
          Paste both texts above — your match score appears instantly, nothing to click.
        </p>
      )}

      {analysis && (
        <div className="space-y-4 rounded-xl border border-gray-700 bg-gray-900/60 p-4 sm:p-6">
          <div className="text-center">
            <p className={`text-5xl font-bold ${scoreColor}`}>{analysis.score}%</p>
            <p className="mt-1 text-sm text-gray-400">
              keyword match — {analysis.matched.length} of the {analysis.keywords.length} most important terms in this posting appear in your resume
            </p>
          </div>

          {analysis.missing.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-400">
                <AlertTriangle className="h-4 w-4" /> Missing from your resume
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.missing.map(word => (
                  <span key={word} className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
                    {word}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Add the ones you genuinely have — worked into real accomplishments, not just listed.
              </p>
            </div>
          )}

          {analysis.matched.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-400">
                <CheckCircle2 className="h-4 w-4" /> Already covered
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.matched.map(word => (
                  <span key={word} className="rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs text-green-300">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
