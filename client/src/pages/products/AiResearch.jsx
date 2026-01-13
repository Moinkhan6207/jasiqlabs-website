import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import content from "../../content/products.json";
import ResearchGrid from "../../components/products/ResearchGrid";
import { BrainCircuit, Lightbulb, Target, Zap, ArrowRight } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AiResearch() {
  const c = content;

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <Helmet>
        <title>AI Research — JASIQ Labs</title>
        <meta
          name="description"
          content="JASIQ AI Research: Generative AI, Computer Vision, and Predictive Analytics. Our philosophy and vision for AI democratization."
        />
      </Helmet>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiM0MDUzNjEiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')]"></div>
        </div>
        
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div 
            className="flex justify-center mb-6"
            variants={fadeInUp}
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-500/10 text-indigo-400">
              <Zap className="h-4 w-4 mr-2" />
              AI Research Division
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200"
            variants={fadeInUp}
          >
            {c.aiResearch.title}
          </motion.h1>
          
          <motion.p 
            className="text-xl text-slate-300 text-center max-w-3xl mx-auto mb-12"
            variants={fadeInUp}
          >
            Pioneering the next generation of AI solutions through cutting-edge research and innovation.
          </motion.p>
        </motion.div>
      </div>

      {/* Philosophy Section */}
      <section className="py-16 md:py-24 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-slate-700/50 shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 mr-4">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Our Philosophy</h2>
                <p className="text-lg text-slate-300 leading-relaxed">
                  {c.aiResearch.philosophy}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-16 md:py-24 bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Research Areas</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto rounded-full"></div>
          </motion.div>
          
          <ResearchGrid areas={c.aiResearch.areas} />
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-900/30 to-violet-900/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-indigo-500/20 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center text-white mr-4">
                  <Target className="h-6 w-6" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Our Vision</h2>
              </div>
              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                {c.aiResearch.vision}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/25 transition-all"
                >
                  Partner With Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center px-6 py-3 border border-slate-600 text-base font-medium rounded-md text-white bg-transparent hover:bg-slate-800/50 transition-colors"
                >
                  Read Our Research Papers
                </a>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-violet-500/10 rounded-full filter blur-3xl"></div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated with Our Research</h3>
            <p className="text-slate-300 mb-8">Subscribe to our newsletter for the latest insights and breakthroughs in AI research.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

