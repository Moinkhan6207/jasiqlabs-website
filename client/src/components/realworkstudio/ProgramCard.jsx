import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function ProgramCard({ data }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      <h3 className="text-2xl font-bold text-primary-600 mb-4">{data.title}</h3>
      <p className="text-gray-600 mb-6">
        <strong className="text-gray-900">For:</strong> {data.for}
      </p>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">What You'll Learn:</h4>
        <ul className="space-y-2">
          {data.whatYouLearn.map((item, index) => (
            <li key={index} className="flex items-start text-gray-700">
              <span className="text-primary-600 mr-2">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Skills You'll Gain:</h4>
        <div className="flex flex-wrap gap-2">
          {data.skillsYouGain.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong className="text-gray-900">Time Commitment:</strong> {data.commitment}
        </p>
      </div>

      <Link to={`/realworkstudio/apply?program=${data.id}`} className="block">
        <Button variant="primary" className="w-full">
          Apply Now
        </Button>
      </Link>
    </div>
  );
}







