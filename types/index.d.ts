export type Activity = 'idle' | 'busy' | 'burst'
export type LookState = { look: string; recovery?: number; garden?: number }

declare module 'claude-code' {
  interface PluginState {
    looks: { activity: Activity; state: LookState }
  }
}
