"use client";

import { ChamferedContainer } from "@/components/ui";
import { TrapezoidButton } from "@/components/ui";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-voidBlack/80 backdrop-blur-xl p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <ChamferedContainer className="p-8">
          <h1 className="text-4xl font-bold text-electricCyan mb-4 tracking-wider text-center">
            SETTINGS
          </h1>
          <p className="text-electricCyan/70 mb-8 text-center">
            Configure your artifact analyzer experience
          </p>

          {/* Settings sections */}
          <div className="space-y-6">
            {/* Audio Settings */}
            <div className="border border-electricCyan/20 rounded-lg p-4 bg-slateGrey/30 backdrop-blur-md">
              <h2 className="text-xl font-bold text-electricCyan mb-4">AUDIO</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-electricCyan/80">Master Volume</span>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="50"
                      className="w-32 accent-electricCyan"
                    />
                    <span className="text-sm font-mono text-electricCyan">50%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-electricCyan/80">Sound Effects</span>
                  <input type="checkbox" defaultChecked className="accent-electricCyan w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div className="border border-electricCyan/20 rounded-lg p-4 bg-slateGrey/30 backdrop-blur-md">
              <h2 className="text-xl font-bold text-electricCyan mb-4">DISPLAY</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-electricCyan/80">Particle Effects</span>
                  <input type="checkbox" defaultChecked className="accent-electricCyan w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-electricCyan/80">Post-Processing</span>
                  <input type="checkbox" defaultChecked className="accent-electricCyan w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-electricCyan/80">Scanline Effect</span>
                  <input type="checkbox" defaultChecked className="accent-electricCyan w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Performance Settings */}
            <div className="border border-electricCyan/20 rounded-lg p-4 bg-slateGrey/30 backdrop-blur-md">
              <h2 className="text-xl font-bold text-electricCyan mb-4">PERFORMANCE</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-electricCyan/80">Quality Preset</span>
                  <select defaultValue="High" className="bg-voidBlack border border-electricCyan/30 text-electricCyan px-4 py-2 rounded">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Ultra</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-electricCyan/80">Max Particles</span>
                  <select defaultValue="500" className="bg-voidBlack border border-electricCyan/30 text-electricCyan px-4 py-2 rounded">
                    <option>100</option>
                    <option>250</option>
                    <option>500</option>
                    <option>1000</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 justify-center">
              <TrapezoidButton variant="primary">Save Changes</TrapezoidButton>
              <TrapezoidButton variant="secondary">Reset to Defaults</TrapezoidButton>
            </div>
          </div>
        </ChamferedContainer>
      </div>
    </div>
  );
}
