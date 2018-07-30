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
    hears: ({ command: string | RegExp | (string | RegExp)[], callback:(ctx: IBotactCtx) => any })[];
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
    /* async */ execute(method: string, settings?: any, callback?: (response: any) => any): Promise<any>;

    flow: IBotactFlow
    inital?: any
    redis?: any // TODO: add typings for redis
}


interface IBotactCtx extends IBotactCore, IBotactMsg {
    /* async */ reply(message: string, attachment?: string): Promise<any>;
    /* async */ sendMessage(userId: number, message: string, attachment?: string): Promise<any>

    scene: {
        join(scene: string, session?: any /* = {} */, step?: number /* = 0 */, instantly?: boolean /* = true */): Promise<any>;
        next(session?: any): Promise<any>;
        leave(): Promise<any>;
    }

    body?: string;
    group_id?: number | undefined
    user_id?: number | undefined
}

export declare class Botact implements IBotactCore {
    // fields
    private actions: IBotactActions;
    private methods: IBotactExecuteMethods[];
    inital?: any;
    flow: IBotactFlow;
    redis?: any; // TODO: add typings for redis
    settings: BotactSettings;

    // core
    constructor(settings: BotactSettings);
    private executeHandler(methods: IBotactExecuteMethods[]): void;
    private /* async */ handler(ctx: IBotactCtx): any;
    /* async */ api(method: string, options?: any /* = {}*/): Promise<any>;
    /* async */ execute(method: string, settings?: any, callback?: (response: any) => any): Promise<any>;
    /* async */ listen(req: any, res: any): Promise<Botact>; // TODO: add typings for Express Request & Response
    /* async */ reply(userId: number, message: string, attachment?: string): Promise<any>;

    // settings
    getOptions(): BotactSettings;
    setOptions(settings: BotactSettings): void;
    deleteOptions(keys: string[]): Botact;

    // actions
    command(command: string | string[], callback: (ctx: IBotactCtx) => any): Botact;
    event(event: string | string[], callback: (ctx: IBotactCtx) => any): Botact;
    hears(hear: string | RegExp | (string | RegExp)[], callback: (ctx: IBotactCtx) => any): Botact;
    on(type: (ctx: IBotactCtx) => any | string, callback?: (ctx: IBotactCtx) => any): Botact;  // TODO: change this D:
    use(callback: (ctx: IBotactCtx) => any): Botact;

    // helpers
    private getLastMessage(message: any): any;
    /* async */ uploadCover(filepath: string, settings?: any): Promise<any>;
    /* async */ uploadDocument(filepath: string, peer_id: number, type: 'doc' | 'audio_message' /* = 'doc' */): Promise<any>;
    /* async */ uploadPhoto(filepath: string, peer_id: number): Promise<any>;

    // flow
    addScene(name: string, ...args: ((ctx: IBotactCtx) => any)[]): Botact;
    /* async */ joinScene(ctx: IBotactCtx, scene: string, session?: any /* = {} */, step?: number /* = 0 */, instantly?: boolean /* = true */): Promise<Botact>;
    /* async */ nextScene(ctx: IBotactCtx, session?: any /* = {} */): Promise<Botact>;
    /* async */ leaveScene(ctx: IBotactCtx): Promise<Botact>;
}

export declare function /* async */ api(method: string, options?: any /* = {}*/): Promise<any>;
export declare function getLastMessage(message: any): any;
