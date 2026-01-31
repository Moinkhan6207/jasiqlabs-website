import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { CheckCircle2 } from "lucide-react";

export default function ServiceCard({ data }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-2xl font-bold text-primary-600">{data.title}</h3>
        {data.for && (
          <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
            {data.for}
          </span>
        )}
      </div>

      <div className="space-y-4 mb-6">
        {data.hasProblem && data.problemSolved && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong className="text-red-700">Problem:</strong> {data.problemSolved}
            </p>
          </div>
        )}

        {data.hasApproach && data.approach && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong className="text-blue-700">Approach:</strong> {data.approach}
            </p>
          </div>
        )}

        {data.hasOutcome && data.outcome && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong className="text-green-700">Outcome:</strong> {data.outcome}
            </p>
          </div>
        )}
      </div>

      <Link to="/techworksstudio/contact" className="block">
        <Button variant="primary" className="w-full">
          Get Started
        </Button>
      </Link>
    </div>
  );
}





