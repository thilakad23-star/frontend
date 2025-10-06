import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AnalysisRequest {
  resumeText: string;
  jobRole: string;
  jobDescription?: string;
}

interface AnalysisResult {
  resume_skills: string[];
  job_skills_required: string[];
  missing_skills: string[];
  match_percent: number;
  verdict: string;
}

const SKILL_DATABASE: Record<string, string[]> = {
  "Data Scientist": [
    "Python",
    "R",
    "Machine Learning",
    "Deep Learning",
    "SQL",
    "Statistics",
    "Data Visualization",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "TensorFlow",
    "PyTorch",
    "Tableau",
    "Power BI",
    "Big Data",
    "Spark",
    "AWS",
    "Azure",
    "Data Mining",
    "NLP"
  ],
  "Software Engineer": [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "Git",
    "Data Structures",
    "Algorithms",
    "OOP",
    "System Design",
    "API Design",
    "Testing",
    "CI/CD",
    "Agile",
    "Docker",
    "SQL",
    "NoSQL",
    "React",
    "Node.js",
    "Linux",
    "Problem Solving"
  ],
  "Frontend Developer": [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Vue.js",
    "Angular",
    "Responsive Design",
    "UI/UX",
    "Webpack",
    "Git",
    "REST APIs",
    "GraphQL",
    "Testing",
    "Accessibility",
    "Performance Optimization",
    "Tailwind CSS",
    "SASS",
    "Redux",
    "Next.js"
  ],
  "Backend Developer": [
    "Node.js",
    "Python",
    "Java",
    "Go",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "REST APIs",
    "GraphQL",
    "Microservices",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "Redis",
    "Message Queues",
    "Authentication",
    "Security",
    "System Design",
    "Git"
  ],
  "DevOps Engineer": [
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Jenkins",
    "GitLab CI",
    "AWS",
    "Azure",
    "GCP",
    "Terraform",
    "Ansible",
    "Linux",
    "Shell Scripting",
    "Python",
    "Monitoring",
    "Prometheus",
    "Grafana",
    "Networking",
    "Security",
    "Git",
    "Infrastructure as Code"
  ],
  "AI Engineer": [
    "Python",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "NLP",
    "Computer Vision",
    "Neural Networks",
    "Model Deployment",
    "MLOps",
    "Data Processing",
    "Statistics",
    "Mathematics",
    "Algorithms",
    "Research",
    "Cloud Services",
    "Docker",
    "Git",
    "Problem Solving"
  ],
  "Cloud Engineer": [
    "AWS",
    "Azure",
    "GCP",
    "Cloud Architecture",
    "Serverless",
    "Docker",
    "Kubernetes",
    "Networking",
    "Security",
    "IAM",
    "Infrastructure as Code",
    "Terraform",
    "CloudFormation",
    "Monitoring",
    "Cost Optimization",
    "CI/CD",
    "Linux",
    "Python",
    "Automation"
  ],
  "Business Analyst": [
    "Requirements Gathering",
    "Data Analysis",
    "SQL",
    "Excel",
    "Power BI",
    "Tableau",
    "Process Modeling",
    "BPMN",
    "Stakeholder Management",
    "Documentation",
    "Agile",
    "JIRA",
    "User Stories",
    "Gap Analysis",
    "Problem Solving",
    "Communication",
    "Critical Thinking",
    "Domain Knowledge"
  ],
  "Cybersecurity Analyst": [
    "Network Security",
    "Penetration Testing",
    "Vulnerability Assessment",
    "SIEM",
    "Incident Response",
    "Security Frameworks",
    "Firewalls",
    "Cryptography",
    "Risk Assessment",
    "Compliance",
    "Linux",
    "Windows",
    "Security Tools",
    "Threat Intelligence",
    "Forensics",
    "Python",
    "Scripting",
    "Cloud Security"
  ],
  "General": [
    "Communication",
    "Problem Solving",
    "Teamwork",
    "Time Management",
    "Leadership",
    "Critical Thinking",
    "Adaptability",
    "Project Management",
    "Microsoft Office",
    "Data Analysis",
    "Research",
    "Presentation",
    "Writing",
    "Organization",
    "Attention to Detail"
  ]
};

function extractSkills(text: string, skillList: string[]): string[] {
  const normalizedText = text.toLowerCase();
  const foundSkills: string[] = [];

  for (const skill of skillList) {
    const normalizedSkill = skill.toLowerCase();
    if (normalizedText.includes(normalizedSkill)) {
      foundSkills.push(skill);
    }
  }

  return foundSkills;
}

function analyzeResume(request: AnalysisRequest): AnalysisResult {
  const jobSkills = SKILL_DATABASE[request.jobRole] || SKILL_DATABASE["General"];

  let allRelevantSkills = [...jobSkills];

  if (request.jobDescription) {
    const descriptionSkills = extractSkills(
      request.jobDescription,
      Object.values(SKILL_DATABASE).flat()
    );
    allRelevantSkills = [...new Set([...jobSkills, ...descriptionSkills])];
  }

  const resumeSkills = extractSkills(request.resumeText, allRelevantSkills);

  const missingSkills = allRelevantSkills.filter(
    skill => !resumeSkills.includes(skill)
  );

  const matchPercent = allRelevantSkills.length > 0
    ? Math.round((resumeSkills.length / allRelevantSkills.length) * 100)
    : 0;

  const verdict = matchPercent >= 60 ? "Suitable" : "Not Suitable";

  return {
    resume_skills: resumeSkills,
    job_skills_required: allRelevantSkills,
    missing_skills: missingSkills,
    match_percent: matchPercent,
    verdict: verdict
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const requestData: AnalysisRequest = await req.json();

    if (!requestData.resumeText || !requestData.jobRole) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: resumeText and jobRole" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const result = analyzeResume(requestData);

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error analyzing resume:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
