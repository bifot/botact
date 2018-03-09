export interface BotactSettings {
    confirmation: string;
    token: string;
    group_id?: number;
    flowTimeout?: number;
    redis?: boolean;
    redisConfig?: any;
}

// TODO: Add botact context interface

export declare class Botact {
    private /* async */ handler(ctx: any): void;
    private execute(method: string, settings?: any, callback?: () => void);
    private executeHandler(ctx: any): void;

    // core
    public constructor(settings: BotactSettings);
    public /* async */ listen(req: any, res: any): Promise<Botact>;
    public /* async */ api(method: string, options?: any /* = {}*/): Promise<any>;

    // statics
    public static execute(method: string, settings?: any, callback?: () => void);

    // settings
    public /* get */ settings(): BotactSettings;
    public /* set */ settings(settings: BotactSettings): void;
    public getOptions(): BotactSettings;
    public setOptions(settings: BotactSettings): void;
    public deleteOptions(keys: string[]): void;

    // handlers
    public /* async */ reply(user_id: number, message: string, attachment?: string): Promise<any>;
    public /* async */ before(callback: () => void): Promise<Botact>;
    public use(callback: () => void): Botact;
    public command(command: string | string[], callback: () => void): Botact;
    public hears(hear: string | RegExp | (string|RegExp)[], callback: () => void): Botact;
    public event(event: string, callback: () => void): Botact;
    public on(type: () => void | string, callback?: () => void): Botact;

    // helpers
    public /* async */ uploadDocument(filepath: string, peer_id: number, type: 'doc' | 'audio_message' /* = 'doc' */): Promise<any>;
    public /* async */ uploadPhoto(filepath: string, peer_id: number): Promise<any>;
    public /* async */ uploadCover(filepath: string, settings?: any): Promise<any>;
    public getLastMessage(message: any): any;

    // flow
    public addScene(name: string, ...args: void[]): Botact;
    public /* async */ joinScene(ctx: any, scene: string, session?: any /* = {} */, step?: number /* = 0 */, instantly?: boolean /* = true */): Promise<any>;
    public /* async */ nextScene(ctx: any, session?: any): Promise<any>;
    public /* async */ leaveScene(ctx: any): Promise<any>;
}