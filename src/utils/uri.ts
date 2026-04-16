import { Uri as VscodeUri } from "vscode";

export class Uri {
    private readonly uriString: string;
    private readonly path: string;

    get uri(): string {
        return this.uriString;
    }

    get fsPath(): string {
        return this.path;
    }

    static fromUriString(uriString: string): Uri {
        return new Uri(uriString);
    }

    /** Use for workspace documents so the string matches LSP / VS Code (encoding, authority). */
    static fromVscodeUri(uri: VscodeUri): Uri {
        return new Uri(uri.toString());
    }

    static fromPath(path: string): Uri {
        return new Uri(`file://${path}`);
    }

    private constructor(uri: string) {
        this.uriString = uri;
        this.path = this.uriString.startsWith("file://")
            ? decodeURI(this.uriString.substring("file://".length))
            : this.uriString;
    }
}
