import { CheckCircle2 } from "lucide-react";

export default function StepFlow({ steps }) {
  return (
    <div className="relative">
      {/* Vertical line for desktop */}
      <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200"></div>

      <div className="space-y-8">
        {steps.map((step, index) => {
          const stepText = typeof step === "string" ? step : step.text || step;
          const stepTitle = typeof step === "object" ? step.title : null;

          return (
            <div key={index} className="relative flex items-start">
              {/* Step number circle */}
              <div className="flex-shrink-0 w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                {index + 1}
              </div>

              {/* Content */}
              <div className="ml-6 flex-1">
                {stepTitle && (
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{stepTitle}</h4>
                )}
                <p className="text-lg text-gray-700">{stepText}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


