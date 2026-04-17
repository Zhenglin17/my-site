"use client";

import { StoryMountain } from "./StoryMountain";
import { StoryMountainMobile } from "./StoryMountainMobile";

export function StoryView() {
  return (
    <>
      <div className="hidden md:block">
        <StoryMountain />
      </div>
      <div className="md:hidden">
        <StoryMountainMobile />
      </div>
    </>
  );
}
