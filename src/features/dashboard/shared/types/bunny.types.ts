export type PlayerState = {
    isPlaying: boolean;
    isEnded: boolean;
    currentTime: number; // seconds
    duration: number; // seconds
};

export interface PlayerJsInstance {
    on: (event: string, callback: (...args: unknown[]) => void) => void;
    getDuration: (callback: (duration: number) => void) => void;
    getCurrentTime: (callback: (time: number) => void) => void;
}
declare global {
    interface Window {
        playerjs?: {
            Player: new (iframe: HTMLIFrameElement) => PlayerJsInstance;
        };
    }
}
