import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Users, LogOut, Sparkles } from 'lucide-react';

export default function SelectAnalysis() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">ResumeAI</h1>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Analysis</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Choose Your Analysis Type
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select how you want to analyze resumes. Get detailed insights and recommendations powered by machine learning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div
            onClick={() => navigate('/individual-analysis')}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-blue-500 overflow-hidden"
          >
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Individual Analysis</h3>
              <p className="text-blue-100">Deep dive into a single resume</p>
            </div>
            <div className="p-8">
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-1 rounded mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Comprehensive skill matching</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-1 rounded mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Detailed compatibility score</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-1 rounded mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Personalized recommendations</span>
                </li>
              </ul>
              <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200">
                Analyze Single Resume
              </button>
            </div>
          </div>

          <div
            onClick={() => navigate('/group-analysis')}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-emerald-500 overflow-hidden"
          >
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-white">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Group Analysis</h3>
              <p className="text-emerald-100">Batch process multiple resumes</p>
            </div>
            <div className="p-8">
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="bg-emerald-100 p-1 rounded mt-1">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Process multiple candidates</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="bg-emerald-100 p-1 rounded mt-1">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Compare results side-by-side</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="bg-emerald-100 p-1 rounded mt-1">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Efficient bulk screening</span>
                </li>
              </ul>
              <button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition duration-200">
                Analyze Multiple Resumes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
