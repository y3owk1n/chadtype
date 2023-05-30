import { unescape } from "html-escaper";
import { convert } from "html-to-text";

export function htmlToString(string: string) {
    const content = unescape(string);

    const converted = convert(content, { wordwrap: null });

    return converted;
}
