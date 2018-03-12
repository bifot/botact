interface BotactSettings {
    confirmation: string;
    token: string;
    group_id?: number;

    // Flow Settings
    flowTimeout?: number;
    redis?: boolean;
    redisConfig?: any;
}


interface IBotactCore {
    /* async */ listen(req: any, res: any): Promise<Botact>;
    /* async */ api(method: string, options?: any /* = {}*/): Promise<any>;
    /* async */ handler(ctx: any): void;
    /* async */ execute(method: string, settings?: any, callback?: () => void): Promise<any>;
    executeHandler(ctx: any): void;
}

interface IBotactSettings {
    /* get */ settings(): BotactSettings;
    /* set */ settings(settings: BotactSettings): void;
    getOptions(): BotactSettings;
    setOptions(settings: BotactSettings): void;
    deleteOptions(keys: string[]): void;
}

interface IBotactHandlers {
    /* async */ reply(user_id: number, message: string, attachment?: string): Promise<any>;
    /* async */ before(callback: () => void): Promise<Botact>;
    use(callback: () => void): Botact;
    command(command: string | string[], callback: () => void): Botact;
    hears(hear: string | RegExp | (string|RegExp)[], callback: () => void): Botact;
    event(event: string, callback: () => void): Botact;
    on(type: () => void | string, callback?: () => void): Botact;
}

interface IBotactHelpers {
    /* async */ uploadDocument(filepath: string, peer_id: number, type: 'doc' | 'audio_message' /* = 'doc' */): Promise<any>;
    /* async */ uploadPhoto(filepath: string, peer_id: number): Promise<any>;
    /* async */ uploadCover(filepath: string, settings?: any): Promise<any>;
    getLastMessage(message: any): any;
}

interface IBotactFlow {
    addScene(name: string, ...args: void[]): Botact;
    /* async */ joinScene(ctx: any, scene: string, session?: any /* = {} */, step?: number /* = 0 */, instantly?: boolean /* = true */): Promise<any>;
    /* async */ nextScene(ctx: any, session?: any): Promise<any>;
    /* async */ leaveScene(ctx: any): Promise<any>;
}

export declare class Botact implements IBotactCore, IBotactSettings, IBotactHandlers, IBotactHelpers, IBotactFlow {
    // core
    public constructor(settings: BotactSettings);
    /* async */ listen(req: any, res: any): Promise<Botact>;
    /* async */ api(method: string, options?: any /* = {}*/): Promise<any>;
    /* async */ handler(ctx: any): void;
    /* async */ execute(method: string, settings?: any, callback?: () => void): Promise<any>;
    executeHandler(ctx: any): void;

    // statics
    public static /* async */ execute(method: string, settings?: any, callback?: () => void): Promise<any>;

    // settings
    /* get */ settings(): BotactSettings;
    /* set */ settings(settings: BotactSettings): void;
    getOptions(): BotactSettings;
    setOptions(settings: BotactSettings): void;
    deleteOptions(keys: string[]): void;

    // handlers
    /* async */ reply(user_id: number, message: string, attachment?: string): Promise<any>;
    /* async */ before(callback: () => void): Promise<Botact>;
    use(callback: () => void): Botact;
    command(command: string | string[], callback: () => void): Botact;
    hears(hear: string | RegExp | (string|RegExp)[], callback: () => void): Botact;
    event(event: string, callback: () => void): Botact;
    on(type: () => void | string, callback?: () => void): Botact;

    // helpers
    /* async */ uploadDocument(filepath: string, peer_id: number, type: 'doc' | 'audio_message' /* = 'doc' */): Promise<any>;
    /* async */ uploadPhoto(filepath: string, peer_id: number): Promise<any>;
    /* async */ uploadCover(filepath: string, settings?: any): Promise<any>;
    getLastMessage(message: any): any;

    // flow
    addScene(name: string, ...args: void[]): Botact;
    /* async */ joinScene(ctx: any, scene: string, session?: any /* = {} */, step?: number /* = 0 */, instantly?: boolean /* = true */): Promise<any>;
    /* async */ nextScene(ctx: any, session?: any): Promise<any>;
    /* async */ leaveScene(ctx: any): Promise<any>;
}

export declare function /* async */ api(method: string, options?: any /* = {}*/): Promise<any>;
export declare function getLastMessage(message: any): any;