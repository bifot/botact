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
    /* async */ api(method: string, options?: any /* = {}*/): Promise<any>;
    /* async */ uploadDocument(filepath: string, peer_id: number, type: 'doc' | 'audio_message' /* = 'doc' */): Promise<any>;
    /* async */ uploadPhoto(filepath: string, peer_id: number): Promise<any>;
    /* async */ uploadCover(filepath: string, settings?: any): Promise<any>;
    /* async */ execute(method: string, settings?: any, callback?: () => void): Promise<any>;

    inital?: any
}

interface IBotactMsg {
    body: string

    attachments?: any[]
    forwarded?: IBotactMsg
}

interface IBotactCtx extends IBotactCore, IBotactMsg {
    /* async */ reply(message: string, attachment?: string): Promise<any>;
    /* async */ sendMessage(user_id: number, message: string, attachment?: string): Promise<any>

    scene: {
        join(ctx: any, scene: string, session?: any /* = {} */, step?: number /* = 0 */, instantly?: boolean /* = true */): Promise<any>;
        next(ctx: any, session?: any): Promise<any>;
        leave(ctx: any): Promise<any>;
    }

    group_id?: number | undefined
}

export declare class Botact implements IBotactCore {
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