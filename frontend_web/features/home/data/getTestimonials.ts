export interface Testimonial {
  quote: string;
  title: string;
  description: string;
  avatarSrc: string;
}

/**
 * Get testimonials data
 * This is a server-side function that can be used in RSC
 * In the future, this could fetch from a CMS or API
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  // Simulate async data fetching
  // In production, this could be:
  // - Fetching from a CMS (Contentful, Strapi, etc.)
  // - API call to backend
  // - Database query

  return [
    {
      quote: "This product has completely transformed how we work. Highly recommended!",
      title: "Sarah Johnson",
      description: "CEO, TechCorp",
      avatarSrc: "https://i.pravatar.cc/150?img=1",
    },
    {
      quote: "The best investment we've made for our business this year.",
      title: "Michael Chen",
      description: "Product Manager, StartupXYZ",
      avatarSrc: "https://i.pravatar.cc/150?img=2",
    },
    {
      quote: "Outstanding service and support. The team really cares about their customers.",
      title: "Emma Wilson",
      description: "Designer, Creative Agency",
      avatarSrc: "https://i.pravatar.cc/150?img=3",
    },
    {
      quote: "Simple, powerful, and intuitive. Everything we needed in one place.",
      title: "James Martinez",
      description: "CTO, Innovation Labs",
      avatarSrc: "https://i.pravatar.cc/150?img=4",
    },
    {
      quote: "The collaboration features have streamlined our entire design process.",
      title: "Lisa Anderson",
      description: "Design Lead, Digital Studios",
      avatarSrc: "https://i.pravatar.cc/150?img=5",
    },
    {
      quote: "Exceptional quality and attention to detail. Worth every penny.",
      title: "David Kim",
      description: "Founder, Creative Co",
      avatarSrc: "https://i.pravatar.cc/150?img=6",
    },
  ];
}
