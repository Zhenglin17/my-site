import { Navigation } from "../components/nav";
import { StoryView } from "./StoryView";

export const metadata = {
  title: "Full Story",
};

export default function StoryPage() {
  return (
    <div className="relative min-h-screen">
      <Navigation />
      <StoryView />
    </div>
  );
}
