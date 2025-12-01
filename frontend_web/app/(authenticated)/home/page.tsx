import { getUserVoices } from "@/features/home/queries/getUserVoices";
import { HomeScreen } from "@/features/home/screens/HomeScreen";
import { getFeatureFlags } from "@/shared/lib/featureFlags";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [userVoices, flags] = await Promise.all([
    getUserVoices(),
    getFeatureFlags(),
  ]);

  return (
    <HomeScreen
      userVoices={userVoices}
      featureFlagShowVersionInfo={flags.showVersionInfo}
    />
  );
}
