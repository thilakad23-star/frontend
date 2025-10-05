import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, ArrowLeft, Loader2, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

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

interface AnalysisResult {
  resume_skills: string[];
  job_skills_required: string[];
  missing_skills: string[];
  match_percent: number;
  verdict: string;
}

export default function IndividualAnalysis() {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile || !jobRole) return;

    setLoading(true);
    setResult(null);

    try {
      const resumeText = await resumeFile.text();

      const mockResult: AnalysisResult = {
        resume_skills: ['Python', 'Machine Learning', 'SQL', 'Data Visualization'],
        job_skills_required: ['Python', 'R', 'Machine Learning', 'SQL', 'Statistics', 'Data Visualization'],
        missing_skills: ['R', 'Statistics'],
        match_percent: 67,
        verdict: 'Suitable',
      };

      setTimeout(() => {
        setResult(mockResult);
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
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Individual Analysis</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Upload Resume</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Job Role
                </label>
                <select
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
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
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Resume File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".txt,.pdf,.doc,.docx"
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                  >
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-slate-700">
                        {resumeFile ? resumeFile.name : 'Click to upload resume'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        TXT, PDF, DOC, DOCX supported
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!resumeFile || !jobRole || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    <span>Analyze Resume</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Analysis Results</h2>

            {!result && !loading && (
              <div className="flex items-center justify-center h-full text-center py-12">
                <div>
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">
                    Upload a resume and select a role to see analysis results
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center h-full py-12">
                <div className="text-center">
                  <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-slate-600">Analyzing resume...</p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Match Score</h3>
                    {result.verdict === 'Suitable' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-end space-x-3">
                    <span className="text-5xl font-bold text-blue-600">
                      {result.match_percent}%
                    </span>
                    <span className={`text-lg font-semibold mb-2 ${
                      result.verdict === 'Suitable' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {result.verdict}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Skills Found ({result.resume_skills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.resume_skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Missing Skills ({result.missing_skills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Required Skills ({result.job_skills_required.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.job_skills_required.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
