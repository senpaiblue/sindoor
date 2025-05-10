import { AnimatedTabs } from "@/components/Tabs";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" items-center justify-items-center h-screen  p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
     <AnimatedTabs />
    </div>
  );
}
