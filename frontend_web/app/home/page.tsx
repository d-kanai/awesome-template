/**
 * ============================================
 * 🎨 Home Page
 * 📅 Synced at: 2025-11-09 21:30 JST
 * 🔗 Node ID: 175-4613 (Desktop), 562-8312 (Mobile)
 * 🔗 Figma URL: https://www.figma.com/design/WoOuJeIanK8Ke56zr6muug/Simple-Design-System--Community-?node-id=175-4613
 * ============================================
 */

import { getTestimonials } from "@/features/home/data/getTestimonials";
import { HomeScreen } from "@/features/home/screens/HomeScreen";

export default async function HomePage() {
  const testimonials = await getTestimonials();

  return <HomeScreen testimonials={testimonials} />;
}
