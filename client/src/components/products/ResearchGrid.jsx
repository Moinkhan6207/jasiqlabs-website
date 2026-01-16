import { motion } from 'framer-motion';
import { Code, Eye, Brain, Cpu, BarChart3, Zap, ArrowRight } from 'lucide-react';

const iconComponents = {
  code: Code,
  eye: Eye,
  brain: Brain,
  cpu: Cpu,
  chart: BarChart3,
  zap: Zap
};

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};

export default function ResearchGrid({ areas }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {areas.map((area, index) => {
        const IconComponent = iconComponents[area.icon] || Code;
        return (
          <motion.div 
            key={index}
            className="group relative h-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-xl"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Icon */}
            <div className="relative z-10 mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-600/20 text-indigo-400">
                <IconComponent className="h-7 w-7" />
              </div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                {area.title}
              </h3>
              <p className="text-slate-300 mb-6">{area.desc}</p>
              
              {area.technologies && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-xs font-medium text-slate-400 mb-2">TECHNOLOGIES</p>
                  <div className="flex flex-wrap gap-2">
                    {area.technologies.map((tech, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-slate-700/50 text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex items-center text-indigo-400 group-hover:text-indigo-300 transition-colors">
                <span className="text-sm font-medium">Learn more</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}




