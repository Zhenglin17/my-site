import { Navigation } from "../components/nav";
import { StoryMountain } from "./StoryMountain";
import { StoryMountainMobile } from "./StoryMountainMobile";

export const metadata = {
  title: "Full Story",
};

export default function StoryPage() {
  return (
    <div className="relative min-h-screen">
      <Navigation />
      <div className="hidden md:block">
        <StoryMountain />
      </div>
      <div className="md:hidden">
        <StoryMountainMobile />
      </div>
    </div>
  );
}
