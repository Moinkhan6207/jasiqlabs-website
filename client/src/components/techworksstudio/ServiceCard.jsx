import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { CheckCircle2 } from "lucide-react";

export default function ServiceCard({ data }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      <h3 className="text-2xl font-bold text-primary-600 mb-4">{data.title}</h3>
      <p className="text-gray-600 mb-6">
        <strong className="text-gray-900">For:</strong> {data.for}
      </p>

      <div className="space-y-4 mb-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-sm text-gray-700">
            <strong className="text-red-700">Problem:</strong> {data.problemSolved}
          </p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-gray-700">
            <strong className="text-blue-700">Approach:</strong> {data.approach}
          </p>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-sm text-gray-700">
            <strong className="text-green-700">Outcome:</strong> {data.outcome}
          </p>
        </div>
      </div>

      <Link to="/techworksstudio/contact" className="block">
        <Button variant="primary" className="w-full">
          Get Started
        </Button>
      </Link>
    </div>
  );
}





