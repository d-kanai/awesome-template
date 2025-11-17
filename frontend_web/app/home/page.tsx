import { getUserVoices } from "@/features/home/queries/getUserVoices";
import { HomeScreen } from "@/features/home/screens/HomeScreen";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const userVoices = await getUserVoices();

  return <HomeScreen userVoices={userVoices} />;
}
