export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Rigsy",
    url: "https://rigsy.ai",
    logo: "https://rigsy.ai/icon.svg",
    description:
      "The voice-first AI co-pilot designed for professional truck drivers. Handle ELD compliance, get health coaching, and never drive alone again.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello-rigsy@logixtecs.com",
      contactType: "customer service",
    },
    sameAs: [],
    founder: {
      "@type": "Organization",
      name: "Logixtecs Solutions LLC",
    },
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Rigsy",
    applicationCategory: "BusinessApplication",
    operatingSystem: "iOS, Android",
    description:
      "AI-powered voice companion for truck drivers with ELD compliance, route planning, health coaching, and real-time assistance.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/ComingSoon",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "1",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "Voice-first AI companion",
      "ELD compliance assistance",
      "Real-time route guidance",
      "Health and wellness coaching",
      "Hours of Service tracking",
      "FMCSA regulation updates",
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Rigsy - AI Road Companion for Truck Drivers",
    description:
      "The voice-first AI co-pilot designed for professional truck drivers. Handle ELD compliance, get health coaching, and never drive alone again.",
    url: "https://rigsy.ai",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "Rigsy",
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", ".hero-description"],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Rigsy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rigsy is a voice-first AI co-pilot designed specifically for professional truck drivers. It helps with ELD compliance, provides health coaching, offers real-time route assistance, and keeps drivers company on long hauls.",
        },
      },
      {
        "@type": "Question",
        name: "How does Rigsy help with ELD compliance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rigsy monitors your Hours of Service in real-time, alerts you before violations occur, and provides voice-guided assistance to ensure you stay compliant with FMCSA regulations.",
        },
      },
      {
        "@type": "Question",
        name: "Is Rigsy hands-free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Rigsy is designed to be completely voice-first. You can interact with it entirely hands-free while keeping your focus on the road.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </>
  );
}
