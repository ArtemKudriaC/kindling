export type Activity = 'idle' | 'busy' | 'burst'
export type LookState = { look: string; recovery?: number; garden?: number }
/** A usage-limit window: the whole percent used and when it resets (ISO 8601). */
export type Limit = { used: number; resetsAt?: string }
/** Claude Code's own figures a look can print: the limit windows and the last turn's cache share, a whole percent. */
export type Meter = { fiveHour?: Limit; sevenDay?: Limit; cache?: number }

declare module 'claude-code' {
  interface PluginState {
    kindling: { activity: Activity; state: LookState; meter: Meter }
  }
}
