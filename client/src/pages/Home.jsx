import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import content from "../content/siteContent.json";
import Seo from "../components/seo/Seo";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import { trackEvent } from "../utils/analytics";
import { submitLead } from "../utils/api";
import { pageContent } from "../services/api";

export default function Home() {
  const c = content;
  const navigate = useNavigate();
  
  // 1. Dynamic Hero State (Default: JSON Data)
  const [heroData, setHeroData] = useState({
    h1: c.home.hero.h1,
    supportingLine: c.home.hero.supportingLine,
    buttons: c.home.hero.buttons,
  });

  const [homeWhatWeDo, setHomeWhatWeDo] = useState(c.home.whatWeDo);
  const [homeDivisions, setHomeDivisions] = useState(c.home.divisions);
  const [homeWhy, setHomeWhy] = useState(c.home.why);
  const [homeWhoWeWorkWith, setHomeWhoWeWorkWith] = useState(c.home.whoWeWorkWith);
  const [homeLeadCapture, setHomeLeadCapture] = useState(c.home.leadCapture);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interestType: "STUDENT"
  });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  // 2. Fetch Data from Database on Load
  useEffect(() => {
    const fetchDynamicContent = async () => {
      try {
        const extractContent = (response) => {
          const apiResponse = response || {};
          const backendData = apiResponse.data;
          if (!backendData) return null;
          if (backendData.content) return backendData.content;
          return backendData;
        };

        const [
          heroRes,
          whatWeDoRes,
          divisionsRes,
          whyRes,
          whoWeWorkWithRes,
          leadCaptureRes,
        ] = await Promise.all([
          pageContent.get('home', 'hero'),
          pageContent.get('home', 'what_we_do'),
          pageContent.get('home', 'divisions'),
          pageContent.get('home', 'why'),
          pageContent.get('home', 'who_we_work_with'),
          pageContent.get('home', 'lead_capture'),
        ]);

        const heroContent = extractContent(heroRes);
        const whatWeDoContent = extractContent(whatWeDoRes);
        const divisionsContent = extractContent(divisionsRes);
        const whyContent = extractContent(whyRes);
        const whoWeWorkWithContent = extractContent(whoWeWorkWithRes);
        const leadCaptureContent = extractContent(leadCaptureRes);

        if (heroContent?.title) {
          setHeroData({
            h1: heroContent.title,
            supportingLine: heroContent.subtitle || c.home.hero.supportingLine,
            buttons: heroContent.buttons || c.home.hero.buttons,
          });
        }

        if (whatWeDoContent?.title || Array.isArray(whatWeDoContent?.items)) {
          setHomeWhatWeDo({
            title: whatWeDoContent.title || c.home.whatWeDo.title,
            items: Array.isArray(whatWeDoContent.items) ? whatWeDoContent.items : c.home.whatWeDo.items,
          });
        }

        if (divisionsContent?.title || Array.isArray(divisionsContent?.cards)) {
          setHomeDivisions({
            title: divisionsContent.title || c.home.divisions.title,
            cards: Array.isArray(divisionsContent.cards) ? divisionsContent.cards : c.home.divisions.cards,
          });
        }

        if (whyContent?.title || Array.isArray(whyContent?.points)) {
          setHomeWhy({
            title: whyContent.title || c.home.why.title,
            points: Array.isArray(whyContent.points) ? whyContent.points : c.home.why.points,
          });
        }

        if (whoWeWorkWithContent?.title || Array.isArray(whoWeWorkWithContent?.items)) {
          setHomeWhoWeWorkWith({
            title: whoWeWorkWithContent.title || c.home.whoWeWorkWith.title,
            items: Array.isArray(whoWeWorkWithContent.items) ? whoWeWorkWithContent.items : c.home.whoWeWorkWith.items,
          });
        }

        if (leadCaptureContent?.title || leadCaptureContent?.supportingLine) {
          setHomeLeadCapture({
            title: leadCaptureContent.title || c.home.leadCapture.title,
            supportingLine: leadCaptureContent.supportingLine || c.home.leadCapture.supportingLine,
          });
        }
      } catch (error) {
        console.error("Failed to load content", error);
      }
    };

    fetchDynamicContent();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });

    try {
      trackEvent("lead_submit_attempt", { page: "home", interestType: form.interestType });
      await submitLead({ ...form, sourcePage: "home" });
      setStatus({ state: "success", message: "Thanks. Your details are received. We will contact you soon." });
      setForm({ name: "", email: "", phone: "", interestType: "STUDENT" });
      trackEvent("lead_submit_success", { page: "home" });
    } catch (err) {
      setStatus({ state: "error", message: err?.response?.data?.error || err?.message || "Something went wrong. Please try again." });
      trackEvent("lead_submit_error", { page: "home" });
    }
  }

  return (
    <>
      <Seo 
        title={c.seo.home.title} 
        description={c.seo.home.description} 
        pageName="home"
      />

      {/* Hero Section */}
      <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 bg-clip-text text-transparent">
              {heroData.h1}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {heroData.supportingLine}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="primary"
              onClick={() => navigate("/realworkstudio")}
            >
              {heroData.buttons.training}
            </Button>
            <Button 
              variant="secondary"
              onClick={() => navigate("/techworksstudio")}
            >
              {heroData.buttons.services}
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/products")}
            >
              {heroData.buttons.products}
            </Button>
          </div>
        </div>
      </section>

      {/* ... Rest of the file remains exactly the same ... */}
      {/* What We Do */}
      <section className="py-7 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
            {homeWhatWeDo.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homeWhatWeDo.items.map((item) => (
              <article 
                key={item.title} 
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Our Divisions */}
      <section className="py-7 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
            {homeDivisions.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homeDivisions.cards.map((card) => (
              <article 
                key={card.id} 
                id={card.id} 
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
              >
                <h3 className="text-2xl font-bold text-primary-600 mb-4">{card.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  <strong className="text-gray-900">Who it is for:</strong> {card.for}
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  <strong className="text-gray-900">What it solves:</strong> {card.solves}
                </p>
                
                <Button
                  variant="primary"
                  onClick={() => {
                    trackEvent("division_card_cta_click", { division: card.id });
                    if (card.id === "realworkstudio") {
                      navigate("/realworkstudio");
                    } else if (card.id === "techworksstudio") {
                      navigate("/techworksstudio"); 
                    } else if (card.id === "products") {
                      navigate("/products");
                    } else {
                      navigate("/contact");
                    }
                  }}
                >
                  {card.cta}
                </Button>
                
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why JASIQ Labs */}
      <section className="py-7 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
            {homeWhy.title}
          </h2>
          <ul className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {homeWhy.points.map((p) => (
              <li 
                key={p}
                className="flex items-center space-x-3 text-lg text-gray-700"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="py-7 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
            {homeWhoWeWorkWith.title}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {homeWhoWeWorkWith.items.map((x) => (
              <span 
                key={x} 
                className="px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-700 font-medium shadow-md hover:shadow-lg transition-shadow"
              >
                {x}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section className="py-7 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
              {homeLeadCapture.title}
            </h2>
            <p className="text-xl text-center mb-8 text-primary-100">
              {homeLeadCapture.supportingLine}
            </p>

            <form 
              className="bg-white rounded-2xl p-6 shadow-xl" 
              onSubmit={onSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Field label="Name">
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900"
                  />
                </Field>

                <Field label="Email">
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900"
                  />
                </Field>

                <Field label="Phone">
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Your phone number"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900"
                  />
                </Field>

                <Field label="Interest type">
                  <select
                    value={form.interestType}
                    onChange={(e) => setForm({ ...form, interestType: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900 bg-white"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="CLIENT">Client</option>
                    <option value="PARTNER">Partner</option>
                  </select>
                </Field>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                <Button type="submit" variant="primary" className="w-full sm:w-auto">
                  {status.state === "loading" ? "Submitting..." : "Submit"}
                </Button>
                <a 
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors" 
                  href="/contact"
                >
                  Or go to Contact page
                </a>
              </div>

              {status.state !== "idle" && (
                <div 
                  className={`p-3 rounded-lg text-center font-medium text-sm ${
                    status.state === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : status.state === "error"
                      ? "bg-red-50 text-red-800 border border-red-200"
                      : "bg-blue-50 text-blue-800 border border-blue-200"
                  }`}
                >
                  {status.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}