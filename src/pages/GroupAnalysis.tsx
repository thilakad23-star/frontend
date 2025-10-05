import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, ArrowLeft, Loader2, CheckCircle2, XCircle, Users } from 'lucide-react';

const JOB_ROLES = [
  'Data Scientist',
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'DevOps Engineer',
  'AI Engineer',
  'Cloud Engineer',
  'Business Analyst',
  'Cybersecurity Analyst',
  'General',
];

interface ResumeAnalysis {
  name: string;
  match_percent: number;
  verdict: string;
  resume_skills: string[];
  missing_skills: string[];
}

export default function GroupAnalysis() {
  const navigate = useNavigate();
  const [resumeCount, setResumeCount] = useState<number>(2);
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResumeAnalysis[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > resumeCount) {
        alert(`Please upload exactly ${resumeCount} resumes`);
        return;
      }
      setResumeFiles(files);
    }
  };

  const handleAnalyze = async () => {
    if (resumeFiles.length !== resumeCount || !jobRole) {
      alert(`Please upload exactly ${resumeCount} resumes`);
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const mockResults: ResumeAnalysis[] = resumeFiles.map((file, index) => ({
        name: file.name,
        match_percent: Math.floor(Math.random() * 40) + 50,
        verdict: Math.random() > 0.5 ? 'Suitable' : 'Not Suitable',
        resume_skills: ['Python', 'JavaScript', 'SQL', 'React'],
        missing_skills: ['Docker', 'Kubernetes'],
      }));

      setTimeout(() => {
        const sorted = [...mockResults].sort((a, b) => b.match_percent - a.match_percent);
        setResults(sorted);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Analysis error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/select-analysis')}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center space-x-3 ml-8">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Group Analysis</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Configuration</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Number of Resumes
                </label>
                <input
                  type="number"
                  min="2"
                  max="20"
                  value={resumeCount}
                  onChange={(e) => setResumeCount(parseInt(e.target.value) || 2)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Job Role
                </label>
                <select
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                >
                  <option value="">Select a role</option>
                  {JOB_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Upload Resumes ({resumeFiles.length}/{resumeCount})
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".txt,.pdf,.doc,.docx"
                    multiple
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition"
                  >
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-slate-700">
                        Click to upload {resumeCount} resumes
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        TXT, PDF, DOC, DOCX supported
                      </p>
                    </div>
                  </label>
                </div>
                {resumeFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {resumeFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="truncate">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleAnalyze}
                disabled={resumeFiles.length !== resumeCount || !jobRole || loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    <span>Analyze All Resumes</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Comparison Results</h2>

            {!results.length && !loading && (
              <div className="flex items-center justify-center h-full text-center py-12">
                <div>
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">
                    Upload resumes and start analysis to see comparison results
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center h-full py-12">
                <div className="text-center">
                  <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mx-auto mb-4" />
                  <p className="text-slate-600">Analyzing {resumeCount} resumes...</p>
                </div>
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-semibold text-slate-900">
                            #{index + 1}
                          </span>
                          <h3 className="text-lg font-semibold text-slate-900 truncate">
                            {result.name}
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-600">
                            {result.match_percent}%
                          </div>
                        </div>
                        {result.verdict === 'Suitable' ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${result.match_percent}%` }}
                      ></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">
                          Skills Found ({result.resume_skills.length})
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {result.resume_skills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {result.resume_skills.length > 4 && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                              +{result.resume_skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">
                          Missing Skills ({result.missing_skills.length})
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {result.missing_skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {result.missing_skills.length > 3 && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                              +{result.missing_skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
