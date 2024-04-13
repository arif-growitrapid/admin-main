import CommingSoon from "@/components/svg/comming_soon";
import React from "react";

type Props = {};

export default function page({}: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 h-full">
      <h2 className="text-2xl font-medium text-center text-muted-foreground tracking-widest uppercase">
        Manage courses and enrollments
      </h2>
      <CommingSoon className="w-full h-auto max-w-[600px] mx-auto" />
      <p className="text-lg font-medium text-muted-foreground text-center">
        This feature is comming soon
      </p>
    </div>
  );
}
