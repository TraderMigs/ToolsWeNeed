import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';

interface JobDescription {
  id: string;
  title: string;
  company: string;
  description: string;
}

interface ResumeVersion {
  id: string;
  name: string;
  content: string;
}

export const ResumeScanner: React.FC = () => {
  const [resumeVersions, setResumeVersions] = useState<ResumeVersion[]>([]);
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [analyses, setAnalyses] = useState<Record<string, any>>({});
  const [newResume, setNewResume] = useState({ name: '', content: '' });
  const [newJob, setNewJob] = useState({ title: '', company: '', description: '' });

  const addResumeVersion = () => {
    try {
      if (newResume.name && newResume.content) {
        const resume: ResumeVersion = {
          id: Date.now().toString(),
          ...newResume
        };
        setResumeVersions([...resumeVersions, resume]);
        setNewResume({ name: '', content: '' });
        if (!selectedResumeId) setSelectedResumeId(resume.id);
      }
    } catch (error) {
      console.error('Error adding resume version:', error);
    }
  };

  const addJobDescription = () => {
    try {
      if (newJob.title && newJob.description) {
        const job: JobDescription = {
          id: Date.now().toString(),
          ...newJob
        };
        setJobDescriptions([...jobDescriptions, job]);
        setNewJob({ title: '', company: '', description: '' });
        if (!selectedJobId) setSelectedJobId(job.id);
      }
    } catch (error) {
      console.error('Error adding job description:', error);
    }
  };

  const removeResumeVersion = (id: string) => {
    try {
      setResumeVersions(resumeVersions.filter(r => r.id !== id));
      if (selectedResumeId === id) {
        setSelectedResumeId(resumeVersions.length > 1 ? resumeVersions.find(r => r.id !== id)?.id || '' : '');
      }
    } catch (error) {
      console.error('Error removing resume version:', error);
    }
  };

  const removeJobDescription = (id: string) => {
    try {
      setJobDescriptions(jobDescriptions.filter(j => j.id !== id));
      if (selectedJobId === id) {
        setSelectedJobId(jobDescriptions.length > 1 ? jobDescriptions.find(j => j.id !== id)?.id || '' : '');
      }
    } catch (error) {
      console.error('Error removing job description:', error);
    }
  };

  const analyzeMatch = () => {
    try {
      const selectedResume = resumeVersions.find(r => r.id === selectedResumeId);
      const selectedJob = jobDescriptions.find(j => j.id === selectedJobId);
      
      if (!selectedResume || !selectedJob) return;

      const resumeText = selectedResume.content;
      const jobDescription = selectedJob.description;

      // Simple keyword matching algorithm
      const resumeWords = resumeText.toLowerCase().split(/\W+/).filter(word => word.length > 2);
      const jobWords = jobDescription.toLowerCase().split(/\W+/).filter(word => word.length > 2);
      
      // Remove common words
      const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'];
      
      const filteredResumeWords = resumeWords.filter(word => !commonWords.includes(word));
      const filteredJobWords = jobWords.filter(word => !commonWords.includes(word));

      // Find matching keywords
      const matchingKeywords = filteredResumeWords.filter(word => 
        filteredJobWords.includes(word)
      );

      // Find missing keywords
      const missingKeywords = filteredJobWords.filter(word => 
        !filteredResumeWords.includes(word)
      );

      // Calculate match percentage
      const uniqueJobWords = [...new Set(filteredJobWords)];
      const uniqueMatchingWords = [...new Set(matchingKeywords)];
      const matchPercentage = uniqueJobWords.length > 0 
        ? (uniqueMatchingWords.length / uniqueJobWords.length) * 100 
        : 0;

      // Analyze sections
      const sections = {
        skills: extractSection(resumeText, ['skills', 'technical skills', 'competencies']),
        experience: extractSection(resumeText, ['experience', 'work experience', 'employment']),
        education: extractSection(resumeText, ['education', 'academic', 'degree']),
        certifications: extractSection(resumeText, ['certifications', 'certificates', 'licensed'])
      };

      // Generate recommendations
      const recommendations = generateRecommendations(matchPercentage, missingKeywords.slice(0, 10));

      const analysisKey = `${selectedResumeId}-${selectedJobId}`;
      setAnalyses({
        ...analyses,
        [analysisKey]: {
          matchPercentage: Math.round(matchPercentage),
          matchingKeywords: uniqueMatchingWords.slice(0, 20),
          missingKeywords: [...new Set(missingKeywords)].slice(0, 20),
          sections,
          recommendations,
          totalResumeWords: filteredResumeWords.length,
          totalJobWords: filteredJobWords.length,
          resumeName: selectedResume.name,
          jobTitle: selectedJob.title,
          company: selectedJob.company
        }
      });
    } catch (error) {
      console.error('Error analyzing match:', error);
    }
  };

  const extractSection = (text: string, keywords: string[]) => {
    const lines = text.split('\n');
    let sectionStart = -1;
    let sectionEnd = lines.length;

    // Find section start
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (keywords.some(keyword => line.includes(keyword))) {
        sectionStart = i;
        break;
      }
    }

    if (sectionStart === -1) return '';

    // Find section end (next section or end of document)
    for (let i = sectionStart + 1; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.match(/^[a-z\s]+:?\s*$/i) && line.length < 30) {
        sectionEnd = i;
        break;
      }
    }

    return lines.slice(sectionStart, sectionEnd).join('\n').trim();
  };

  const generateRecommendations = (matchPercentage: number, missingKeywords: string[]) => {
    const recommendations = [];

    if (matchPercentage < 30) {
      recommendations.push('Your resume has a low match with this job. Consider tailoring it more specifically.');
    } else if (matchPercentage < 60) {
      recommendations.push('Good foundation, but there\'s room for improvement in keyword alignment.');
    } else if (matchPercentage < 80) {
      recommendations.push('Strong match! Consider adding a few more relevant keywords.');
    } else {
      recommendations.push('Excellent match! Your resume aligns well with this job description.');
    }

    if (missingKeywords.length > 0) {
      recommendations.push(`Consider adding these keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
    }

    recommendations.push('Ensure your experience section highlights relevant accomplishments.');
    recommendations.push('Use action verbs and quantify your achievements where possible.');

    return recommendations;
  };


  const currentAnalysis = selectedResumeId && selectedJobId ? 
    analyses[`${selectedResumeId}-${selectedJobId}`] : null;

  const exportData = {
    resumeVersions: resumeVersions.map(r => ({ ...r, content: r.content.substring(0, 500) + '...' })),
    jobDescriptions: jobDescriptions.map(j => ({ ...j, description: j.description.substring(0, 500) + '...' })),
    analyses,
    date: new Date().toISOString()
  };

  const csvData = Object.entries(analyses).map(([key, analysis]) => ({
    'Resume': analysis.resumeName,
    'Job Title': analysis.jobTitle,
    'Company': analysis.company,
    'Match Percentage': analysis.matchPercentage,
    'Matching Keywords': analysis.matchingKeywords.length,
    'Missing Keywords': analysis.missingKeywords.length,
    'Total Resume Words': analysis.totalResumeWords,
    'Total Job Words': analysis.totalJobWords
  }));

  const hasAnalysis = currentAnalysis !== null;

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          filename="resume-analysis"
          title="Resume Analysis Report"
        />
      </div>

      {/* Add Resume Versions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Resume Versions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Resume Version Name (e.g., Software Engineer Resume)"
            value={newResume.name}
            onChange={(e) => setNewResume({...newResume, name: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={addResumeVersion}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Resume Version
          </button>
        </div>
        <textarea
          value={newResume.content}
          onChange={(e) => setNewResume({...newResume, content: e.target.value})}
          placeholder="Paste your resume text here..."
          className="w-full h-32 px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
        />
        
        {resumeVersions.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Your Resume Versions</h4>
            <div className="space-y-2">
              {resumeVersions.map((resume) => (
                <div key={resume.id} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">{resume.name}</h5>
                    <p className="text-sm text-gray-400">{resume.content.length} characters</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedResumeId(resume.id)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        selectedResumeId === resume.id 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                      }`}
                    >
                      {selectedResumeId === resume.id ? 'Selected' : 'Select'}
                    </button>
                    <button
                      onClick={() => removeResumeVersion(resume.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Job Descriptions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Job Descriptions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Job Title"
            value={newJob.title}
            onChange={(e) => setNewJob({...newJob, title: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Company Name"
            value={newJob.company}
            onChange={(e) => setNewJob({...newJob, company: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={addJobDescription}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Job
          </button>
        </div>
        <textarea
          value={newJob.description}
          onChange={(e) => setNewJob({...newJob, description: e.target.value})}
          placeholder="Paste the job description here..."
          className="w-full h-32 px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
        />
        
        {jobDescriptions.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Job Descriptions</h4>
            <div className="space-y-2">
              {jobDescriptions.map((job) => (
                <div key={job.id} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">{job.title}</h5>
                    <p className="text-sm text-gray-400">{job.company} • {job.description.length} characters</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedJobId(job.id)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        selectedJobId === job.id 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                      }`}
                    >
                      {selectedJobId === job.id ? 'Selected' : 'Select'}
                    </button>
                    <button
                      onClick={() => removeJobDescription(job.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Analysis Controls */}
      {resumeVersions.length > 0 && jobDescriptions.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Analysis Setup</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Resume</label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Choose resume version</option>
                {resumeVersions.map(resume => (
                  <option key={resume.id} value={resume.id}>{resume.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Job</label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Choose job description</option>
                {jobDescriptions.map(job => (
                  <option key={job.id} value={job.id}>{job.title} - {job.company}</option>
                ))}
              </select>
            </div>
            <button
              onClick={analyzeMatch}
              disabled={!selectedResumeId || !selectedJobId}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors font-medium"
            >
              Analyze Match
            </button>
          </div>
        </div>
      )}

      {/* Analysis Matrix */}
      {resumeVersions.length > 0 && jobDescriptions.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Analysis Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2">Resume Version</th>
                  {jobDescriptions.map(job => (
                    <th key={job.id} className="text-center py-2 min-w-[120px]">
                      {job.title}<br/>
                      <span className="text-xs text-gray-400">{job.company}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resumeVersions.map(resume => (
                  <tr key={resume.id} className="border-b border-gray-700">
                    <td className="py-2 font-medium">{resume.name}</td>
                    {jobDescriptions.map(job => {
                      const analysisKey = `${resume.id}-${job.id}`;
                      const analysis = analyses[analysisKey];
                      return (
                        <td key={job.id} className="text-center py-2">
                          {analysis ? (
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              analysis.matchPercentage >= 70 ? 'bg-green-600' :
                              analysis.matchPercentage >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}>
                              {analysis.matchPercentage}%
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedResumeId(resume.id);
                                setSelectedJobId(job.id);
                                setTimeout(analyzeMatch, 100);
                              }}
                              className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-xs transition-colors"
                            >
                              Analyze
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {currentAnalysis && (
        <>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              Match Analysis: {currentAnalysis.resumeName} vs {currentAnalysis.jobTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  currentAnalysis.matchPercentage >= 70 ? 'text-green-400' :
                  currentAnalysis.matchPercentage >= 50 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {currentAnalysis.matchPercentage}%
                </div>
                <p className="text-sm text-gray-400">Match Score</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">
                  {currentAnalysis.matchingKeywords.length}
                </div>
                <p className="text-sm text-gray-400">Matching Keywords</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400 mb-2">
                  {currentAnalysis.missingKeywords.length}
                </div>
                <p className="text-sm text-gray-400">Missing Keywords</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-400">Matching Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {currentAnalysis.matchingKeywords.map((keyword: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-600 text-green-100 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-400">Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {currentAnalysis.missingKeywords.map((keyword: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-600 text-red-100 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <ul className="space-y-2">
              {currentAnalysis.recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span className="text-gray-300">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Section Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(currentAnalysis.sections).map(([section, content]) => (
                <div key={section} className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium mb-2 capitalize">{section}</h4>
                  <p className="text-sm text-gray-400">
                    {content ? `${(content as string).length} characters found` : 'Section not detected'}
                  </p>
                  <div className={`w-full h-2 rounded mt-2 ${
                    content ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};