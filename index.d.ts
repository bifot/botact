interface BotactSettings {
    confirmation: string;
    token: string;
    group_id?: number;

    // Flow Settings
    flowTimeout?: number;
    redis?: boolean;
    redisConfig?: any;
}

interface IBotactMsg {
    body: string

    attachments?: any[]
    forwarded?: IBotactMsg
}

interface IBotactFlow {
    scenes: any
    session: any
    timeout?: undefined | number
}

interface IBotactActions {
    commands: ({ command: string, callback:(ctx: IBotactCtx) => any })[];
    hears: ({ command: string | RegExp | (string|RegExp)[], callback:(ctx: IBotactCtx) => any })[];
    events: ({ event: string, callback:(ctx: IBotactCtx) => any })[];
    on: ({ type: () => void | string, callback?: (ctx: IBotactCtx) => any })[];
    middlewares: ((ctx: IBotactCtx) => any)[];
}

interface IBotactExecuteItem {
    code: string;
    callback: (response: any) => any;

    result: Promise<any>
    resolve: (value: any) => void;              // needed to resolve result after successful execution
    reject: (reason: any) => void;              // needed to reject result after execution error
}

interface IBotactExecuteMethods {
    access_token: string;
    items: IBotactExecuteItem[]
}

interface IBotactCore {
    /* async */ api(method: string, options?: any /* = {}*/): Promise<any>;
    /* async */ uploadDocument(filepath: string, peer_id: number, type: 'doc' | 'audio_message' /* = 'doc' */): Promise<any>;
    /* async */ uploadPhoto(filepath: string, peer_id: number): Promise<any>;
    /* async */ uploadCover(filepath: string, settings?: any): Promise<any>;
    /* async */ execute(method: string, settings?: any, callback?: () => void): Promise<any>;

    flow: IBotactFlow
    inital?: any
    redis?: any // TODO: add typings for redis
}


interface IBotactCtx extends IBotactCore, IBotactMsg {
    /* async */ reply(message: string, attachment?: string): Promise<any>;
    /* async */ sendMessage(user_id: number, message: string, attachment?: string): Promise<any>

    scene: {
        join(scene: string, session?: any /* = {} */, step?: number /* = 0 */, instantly?: boolean /* = true */): Promise<any>;
        next(session?: any): Promise<any>;
        leave(): Promise<any>;
    }

    group_id?: number | undefined
}

export declare class Botact implements IBotactCore {
    // fields
    flow: IBotactFlow;
    actions: IBotactActions;
    methods: IBotactExecuteMethods[];
    inital?: any;
    redis?: any; // TODO: add typings for redis

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
    addScene(name: string, ...args: (() => any)[]): Botact;
    /* async */ joinScene(ctx: IBotactCtx, scene: string, session?: any /* = {} */, step?: number /* = 0 */, instantly?: boolean /* = true */): Promise<any>;
    /* async */ nextScene(ctx: IBotactCtx, session?: any): Promise<any>;
    /* async */ leaveScene(ctx: IBotactCtx): Promise<any>;
}

export declare function /* async */ api(method: string, options?: any /* = {}*/): Promise<any>;
export declare function getLastMessage(message: any): any;