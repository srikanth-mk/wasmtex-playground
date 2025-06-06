export enum EngineStatus {
    Init = 1,
    Ready = 2,
    Busy = 3,
    Error = 4,
}

const ENGINE_PATH = 'http://localhost:8000/wasm-builder/luatex.wasm/neoluatex.js';

export class CompileResult {
    pdf: Uint8Array | undefined = undefined;
    status: number = -254;
    log: string = 'No log';
}

export class LuaTeXEngine {
    private luatexWorker: Worker | undefined = undefined;
    private luatexWorkerStatus: EngineStatus = EngineStatus.Init;

    async loadEngine(): Promise<void> {
        if (this.luatexWorker !== undefined) {
            throw new Error('Other instance is running, abort()');
        }
        this.luatexWorkerStatus = EngineStatus.Init;
        await new Promise<void>((resolve, reject) => {
            this.luatexWorker = new Worker(ENGINE_PATH);
            this.luatexWorker.onmessage = (ev) => {
                const data = ev['data'];
                const cmd = data['result'];
                if (cmd === 'ok') {
                    this.luatexWorkerStatus = EngineStatus.Ready;
                    resolve();
                } else {
                    this.luatexWorkerStatus = EngineStatus.Error;
                    reject();
                }
            };
        });
        this.luatexWorker.onmessage = (_) => {};
        this.luatexWorker.onerror = (_) => {};
    }

    isReady(): boolean {
        return this.luatexWorkerStatus === EngineStatus.Ready;
    }

    private checkEngineStatus(): void {
        if (!this.isReady()) {
            throw Error('Engine is still spinning or not ready yet!');
        }
    }

    async compileLuaLaTeX(): Promise<CompileResult> {
        this.checkEngineStatus();
        this.luatexWorkerStatus = EngineStatus.Busy;
        const start_compile_time = performance.now();
        
        const res = await new Promise<CompileResult>((resolve, _) => {
            this.luatexWorker!.onmessage = (ev) => {
                const data = ev['data'];
                const cmd = data['cmd'];
                
                if (cmd !== "compile") return;
                
                const result = data['result'];
                const log = data['log'];
                const status = data['status'];
                this.luatexWorkerStatus = EngineStatus.Ready;
                
                console.log('LuaTeX compilation finish ' + (performance.now() - start_compile_time));
                
                const nice_report = new CompileResult();
                nice_report.status = status;
                nice_report.log = log;
                
                if (result === 'ok') {
                    const pdf = new Uint8Array(data['pdf']);
                    nice_report.pdf = pdf;
                }
                resolve(nice_report);
            };
            this.luatexWorker!.postMessage({ 'cmd': 'compileluatex', 'mode': '-interaction=nonstopmode' });
            console.log('LuaTeX compilation start');
        });
        
        this.luatexWorker!.onmessage = (_) => {};
        return res;
    }

}