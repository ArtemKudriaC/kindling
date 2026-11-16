export type Activity = 'idle' | 'busy' | 'burst'
export type LookState = { look: string; recovery?: number; garden?: number }
export type Limit = { used: number; resetsAt?: string }
export type Meter = { fiveHour?: Limit; sevenDay?: Limit; cache?: number }

declare module 'claude-code' {
  interface PluginState {
    kindling: { activity: Activity; state: LookState; meter: Meter }
  }
}
