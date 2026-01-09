import { CheckCircle2, ArrowRight } from "lucide-react";

export default function ProcessStep({ step, title, desc, isLast = false }) {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {step}
        </div>
      </div>
      <div className="ml-6 flex-1 pb-8">
        <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-700 leading-relaxed">{desc}</p>
      </div>
      {!isLast && (
        <div className="hidden md:block absolute left-8 top-16 bottom-0 w-0.5 bg-primary-200"></div>
      )}
    </div>
  );
}


