import { useState, useEffect } from 'react';
import content from "../content/siteContent.json";
import Seo from "../components/seo/Seo";
import { pageContent } from "../services/api";
import parse from 'html-react-parser';
import { decodeHTMLEntities } from '../utils/htmlUtils';

// Icons (You can replace these with your actual icons)
const CultureIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const MissionIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const VisionIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export default function About() {
  const c = content;
  const [isMounted, setIsMounted] = useState(false);

  // Safe parse function that decodes HTML entities
  const safeParse = (content) => {
    if (!content || typeof content !== 'string') return content;
    try {
      const decoded = decodeHTMLEntities(content);
      return parse(decoded);
    } catch (error) {
      console.error('Error parsing HTML:', error);
      return content;
    }
  };

  // 🟢 Dynamic Hero State (Default: JSON Data)
  const [heroData, setHeroData] = useState({
    title: c.about.h1,
    subtitle: "Empowering innovation through technology, training, and transformative solutions."
  });

  // 🟢 Dynamic Mission State (Default: JSON Data)
  const [missionData, setMissionData] = useState({
    missionTitle: c.about.missionTitle,
    missionDesc: c.about.missionText,
    visionTitle: "Our Vision",
    visionDesc: "To be the leading force in technological innovation, transforming ideas into impactful solutions that drive progress and create sustainable value for our clients and communities worldwide."
  });

  const [storyData, setStoryData] = useState({
    title: c.about.storyTitle,
    paragraphs: [
      c.about.storyText,
      "Our journey has been marked by continuous learning, innovation, and a relentless pursuit of excellence. From our humble beginnings to becoming a trusted technology partner, we've remained committed to delivering exceptional value to our clients while fostering a culture of integrity and innovation.",
    ],
  });

  const [differentData, setDifferentData] = useState({
    title: c.about.differentTitle,
    subtitle: "We stand out from the crowd with our unique approach and unwavering commitment to excellence.",
    items: (c.about.differentItems || []).map((item, index) => ({
      title: item,
      desc: c.about.differentDescriptions && c.about.differentDescriptions[index]
        ? c.about.differentDescriptions[index]
        : 'We deliver exceptional value through innovative solutions and dedicated service.',
    })),
  });

  const [cultureData, setCultureData] = useState({
    title: c.about.cultureTitle,
    subtitle: "Our culture is built on a foundation of shared values that guide our decisions and actions every day.",
    items: (c.about.cultureItems || []).map((item) => {
      if (typeof item === 'string') {
        // Check if it's rich text or doesn't contain colon
        if (item.includes('<') || item.includes('>') || !item.includes(':')) {
          return {
            title: item.trim(),
            desc: 'We believe in the power of collaboration and innovation.',
          };
        }
        const [t, d] = String(item).split(':');
        return {
          title: (t || '').trim(),
          desc: (d || 'We believe in the power of collaboration and innovation.').trim(),
        };
      }
      return {
        title: item?.title || '',
        desc: item?.desc || 'We believe in the power of collaboration and innovation.',
      };
    }),
  });

  const [leadershipData, setLeadershipData] = useState({
    leadershipTitle: c.about.leadershipTitle,
    leadershipParagraphs: [
      c.about.leadershipText,
      "Our leadership team brings together decades of combined experience in technology, business strategy, and innovation to guide our company's vision and growth.",
    ],
    complianceTitle: c.about.complianceTitle,
    complianceParagraphs: [
      c.about.complianceText,
      "We are committed to maintaining the highest standards of ethical business practices, data protection, and regulatory compliance across all our operations.",
    ],
  });

  const [ctaData, setCtaData] = useState({
    title: 'Ready to start your next project?',
    subtitle: 'Get in touch with our team to discuss how we can help bring your ideas to life.',
    buttonText: 'Contact Us Today',
    buttonLink: '/contact',
  });

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Debug: Log leadership data
  useEffect(() => {
    console.log('Leadership Data:', leadershipData);
    console.log('Compliance Title:', leadershipData.complianceTitle);
    console.log('Compliance Paragraphs:', leadershipData.complianceParagraphs);
    console.log('Leadership Title:', leadershipData.leadershipTitle);
    console.log('Leadership Paragraphs:', leadershipData.leadershipParagraphs);
  }, [leadershipData]);

  // 🟢 Fetch Data from Database on Load
  useEffect(() => {
    const fetchDynamicContent = async () => {
      try {
        const extractContent = (response) => {
          const backendData = response?.data;
          if (!backendData) return null;
          if (backendData.content) return backendData.content;
          return backendData;
        };

        const [
          heroRes,
          storyRes,
          differentRes,
          cultureRes,
          leadershipRes,
          ctaRes,
        ] = await Promise.all([
          pageContent.get('about', 'hero'),
          pageContent.get('about', 'story'),
          pageContent.get('about', 'different'),
          pageContent.get('about', 'culture'),
          pageContent.get('about', 'leadership'),
          pageContent.get('about', 'cta'),
        ]);

        const heroContent = extractContent(heroRes);
        const storyContent = extractContent(storyRes);
        const differentContent = extractContent(differentRes);
        const cultureContent = extractContent(cultureRes);
        const leadershipContent = extractContent(leadershipRes);
        const ctaContent = extractContent(ctaRes);

        if (heroContent?.title || heroContent?.subtitle || heroContent?.missionTitle || heroContent?.visionTitle) {
          setHeroData({
            title: heroContent.title || c.about.h1,
            subtitle: heroContent.subtitle || "Empowering innovation through technology, training, and transformative solutions.",
          });

          setMissionData({
            missionTitle: heroContent.missionTitle || c.about.missionTitle,
            missionDesc: heroContent.missionDesc || c.about.missionText,
            visionTitle: heroContent.visionTitle || "Our Vision",
            visionDesc: heroContent.visionDesc || "To be the leading force in technological innovation, transforming ideas into impactful solutions that drive progress and create sustainable value for our clients and communities worldwide.",
          });
        }

        if (storyContent?.title || Array.isArray(storyContent?.paragraphs)) {
          setStoryData({
            title: storyContent.title || c.about.storyTitle,
            paragraphs: Array.isArray(storyContent.paragraphs) && storyContent.paragraphs.length > 0
              ? storyContent.paragraphs
              : storyData.paragraphs,
          });
        }

        if (differentContent?.title || Array.isArray(differentContent?.items)) {
          const items = Array.isArray(differentContent.items) ? differentContent.items : [];
          const normalizedItems = items.map((it) => {
            if (typeof it === 'string') {
              return {
                title: it,
                desc: 'We deliver exceptional value through innovative solutions and dedicated service.',
              };
            }
            return {
              title: it?.title || '',
              desc: it?.desc || 'We deliver exceptional value through innovative solutions and dedicated service.',
            };
          });

          setDifferentData({
            title: differentContent.title || c.about.differentTitle,
            subtitle: differentContent.subtitle || differentData.subtitle,
            items: normalizedItems.length > 0 ? normalizedItems : differentData.items,
          });
        }

        if (cultureContent?.title || Array.isArray(cultureContent?.items)) {
          const items = Array.isArray(cultureContent.items) ? cultureContent.items : [];
          const normalizedItems = items.map((it) => {
            if (typeof it === 'string') {
              // Try to split by colon first, but if it fails or if the string looks like rich text,
              // treat it as a title with default description
              if (it.includes('<') || it.includes('>') || !it.includes(':')) {
                return {
                  title: it.trim(),
                  desc: 'We believe in the power of collaboration and innovation.',
                };
              }
              const [t, d] = String(it).split(':');
              return {
                title: (t || '').trim(),
                desc: (d || 'We believe in the power of collaboration and innovation.').trim(),
              };
            }
            return {
              title: it?.title || '',
              desc: it?.desc || 'We believe in the power of collaboration and innovation.',
            };
          });

          setCultureData({
            title: cultureContent.title || c.about.cultureTitle,
            subtitle: cultureContent.subtitle || cultureData.subtitle,
            items: normalizedItems.length > 0 ? normalizedItems : cultureData.items,
          });
        }

        if (leadershipContent?.leadershipTitle || leadershipContent?.complianceTitle || Array.isArray(leadershipContent?.leadershipParagraphs) || Array.isArray(leadershipContent?.complianceParagraphs)) {
          setLeadershipData({
            leadershipTitle: leadershipContent.leadershipTitle || c.about.leadershipTitle,
            leadershipParagraphs: Array.isArray(leadershipContent.leadershipParagraphs) && leadershipContent.leadershipParagraphs.length > 0
              ? leadershipContent.leadershipParagraphs
              : leadershipData.leadershipParagraphs,
            complianceTitle: leadershipContent.complianceTitle || c.about.complianceTitle,
            complianceParagraphs: Array.isArray(leadershipContent.complianceParagraphs) && leadershipContent.complianceParagraphs.length > 0
              ? leadershipContent.complianceParagraphs
              : leadershipData.complianceParagraphs,
          });
        }

        if (ctaContent?.title || ctaContent?.subtitle || ctaContent?.buttonText || ctaContent?.buttonLink) {
          setCtaData({
            title: ctaContent.title || ctaData.title,
            subtitle: ctaContent.subtitle || ctaData.subtitle,
            buttonText: ctaContent.buttonText || ctaData.buttonText,
            buttonLink: ctaContent.buttonLink || ctaData.buttonLink,
          });
        }
      } catch (error) {
        console.error("Failed to load About page content", error);
      }
    };

    fetchDynamicContent();
  }, []);

  // Animation classes that will be applied when component mounts
  const fadeInUp = 'transition-all duration-700 transform opacity-0 translate-y-4';
  const fadeInUpActive = 'opacity-100 translate-y-0';

  return (
    <div className="min-h-screen bg-gray-50">
      <Seo 
        title={c.seo.about.title} 
        description={c.seo.about.description} 
        pageName="about"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 md:py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isMounted ? fadeInUpActive : fadeInUp}`}>
              {/* 🟢 Dynamic Hero Title */}
              {safeParse(heroData.title)}
            </h1>
            <p className={`text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto ${isMounted ? fadeInUpActive : fadeInUp}`} style={{ transitionDelay: '100ms' }}>
              {/* 🟢 Dynamic Hero Subtitle */}
              {safeParse(heroData.subtitle)}
            </p>
          </div>
        </div>
      </section>

      {/* Leadership & Compliance */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{safeParse(leadershipData.complianceTitle)}</h3>
              <div className="prose prose-sm max-w-none text-gray-600 space-y-3">
                {(leadershipData.complianceParagraphs || []).map((p, idx) => (
                  <div key={idx}>{safeParse(p)}</div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{safeParse(leadershipData.leadershipTitle)}</h2>
              <div className="prose prose-sm max-w-none text-gray-600 space-y-3">
                {(leadershipData.leadershipParagraphs || []).map((p, idx) => (
                  <div key={idx}>{safeParse(p)}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Mission */}
            <div className={`bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 transform hover:scale-[1.02] transition-all duration-300 ${isMounted ? fadeInUpActive : fadeInUp}`} style={{ transitionDelay: '200ms' }}>
              <div className="bg-primary-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MissionIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-3 text-primary-800">{safeParse(missionData.missionTitle)}</h2>
              <div className="text-gray-700 text-center">{safeParse(missionData.missionDesc)}</div>
            </div>

            {/* Vision */}
            <div className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 transform hover:scale-[1.02] transition-all duration-300 ${isMounted ? fadeInUpActive : fadeInUp}`} style={{ transitionDelay: '300ms' }}>
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <VisionIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-3 text-blue-800">{safeParse(missionData.visionTitle)}</h2>
              <div className="text-gray-700 text-center">
                {safeParse(missionData.visionDesc)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{safeParse(storyData.title)}</h2>
            <div className="w-16 h-1 bg-primary-500 mx-auto"></div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none text-gray-600">
              {(storyData.paragraphs || []).map((p, idx) => (
                <div key={idx} className={idx === 0 ? "mb-4" : "mb-4"}>
                  {safeParse(p)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{safeParse(differentData.title)}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {differentData.subtitle}
            </p>
            <div className="w-16 h-1 bg-primary-500 mx-auto mt-3"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentData.items.map((item, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center mb-3">
                  <div className="bg-primary-100 p-2 rounded-full mr-3">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{safeParse(item.title)}</h3>
                </div>
                <div className="text-gray-600 pl-8 text-sm">
                  {safeParse(item.desc)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Culture & Values */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{safeParse(cultureData.title)}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {safeParse(cultureData.subtitle)}
            </p>
            <div className="w-16 h-1 bg-primary-500 mx-auto mt-3"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cultureData.items.map((item, index) => (
              <div 
                key={`${index}-${item.title || 'item'}`} 
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-center"
              >
                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CultureIcon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{safeParse(item.title || '')}</h3>
                <div className="text-gray-600 text-sm">
                  {safeParse(item.desc || '')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{safeParse(ctaData.title)}</h2>
          <p className="text-xl text-primary-100 mb-6 max-w-2xl mx-auto">
            {safeParse(ctaData.subtitle)}
          </p>
          <a 
            href={ctaData.buttonLink} 
            className="inline-block bg-white text-primary-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            {ctaData.buttonText}
          </a>
        </div>
      </section>
    </div>
  );
}












