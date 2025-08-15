import { DraftWheel } from "@/components/draft/DraftWheel"
import { Analytics } from '@vercel/analytics/next';
/**
 * HomePage Component - Main entry point for the Fantasy Draft Manager
 */
export default function HomePage() {
  return (
    <>
      <DraftWheel />
      <Analytics />
    </>
)
}