"use client";

import { ChamferedContainer } from "@/components/ui";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-voidBlack p-8">
      <div className="max-w-4xl mx-auto">
        <ChamferedContainer className="p-8">
          <h1 className="text-4xl font-bold text-electricCyan mb-4 tracking-wider">
            SCAN HISTORY
          </h1>
          <p className="text-electricCyan/70 mb-8">
            Your previous artifact appraisals will appear here
          </p>

          {/* Placeholder for history items */}
          <div className="space-y-4">
            <div className="border border-electricCyan/20 rounded-lg p-4 bg-slateGrey/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-electricCyan font-bold">Ancient Relic</h3>
                  <p className="text-sm text-electricCyan/50">Scanned on Jan 10, 2026</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-acidGreen">A-TIER</div>
                  <div className="text-sm text-electricCyan/70">$850</div>
                </div>
              </div>
            </div>

            <div className="text-center py-12 text-electricCyan/50">
              <p className="text-sm font-mono">[NO MORE HISTORY]</p>
            </div>
          </div>
        </ChamferedContainer>
      </div>
    </div>
  );
}
