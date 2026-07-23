const STORAGE_KEY = "privacy.checkout.access.v1";
const PASSPHRASE = "privacy-checkout-local-store";
const SALT = "privacy-checkout-salt-v1";
const PBKDF2_ITERATIONS = 100_000;

const enc = new TextEncoder();
const dec = new TextDecoder();

const isBrowser = (): boolean =>
    typeof window !== "undefined" &&
    typeof window.crypto?.subtle !== "undefined";

let keyPromise: Promise<CryptoKey> | null = null;

const getKey = (): Promise<CryptoKey> => {
    if (!keyPromise) {
        keyPromise = (async () => {
            const baseKey = await crypto.subtle.importKey(
                "raw",
                enc.encode(PASSPHRASE),
                "PBKDF2",
                false,
                ["deriveKey"],
            );
            return crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt: enc.encode(SALT),
                    iterations: PBKDF2_ITERATIONS,
                    hash: "SHA-256",
                },
                baseKey,
                { name: "AES-GCM", length: 256 },
                false,
                ["encrypt", "decrypt"],
            );
        })();
    }
    return keyPromise;
};

const toBase64 = (bytes: Uint8Array): string =>
    btoa(String.fromCharCode(...bytes));

const fromBase64 = (value: string) => {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
};

const encryptJSON = async (value: unknown): Promise<string> => {
    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        enc.encode(JSON.stringify(value)),
    );
    return JSON.stringify({
        iv: toBase64(iv),
        data: toBase64(new Uint8Array(ciphertext)),
    });
};

const decryptJSON = async (raw: string): Promise<unknown> => {
    const { iv, data } = JSON.parse(raw) as { iv: string; data: string };
    const key = await getKey();
    const plaintext = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: fromBase64(iv) },
        key,
        fromBase64(data),
    );
    return JSON.parse(dec.decode(plaintext));
};

export const saveSecureJSON = async (
    storageKey: string,
    value: unknown,
): Promise<void> => {
    if (!isBrowser()) return;
    window.localStorage.setItem(storageKey, await encryptJSON(value));
};

export const loadSecureJSON = async <T>(
    storageKey: string,
    fallback: T,
): Promise<T> => {
    if (!isBrowser()) return fallback;
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return fallback;
    try {
        return (await decryptJSON(raw)) as T;
    } catch {
        window.localStorage.removeItem(storageKey);
        return fallback;
    }
};

export const loadTokens = async (): Promise<string[]> => {
    if (!isBrowser()) return [];

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
        const { iv, data } = JSON.parse(raw) as { iv: string; data: string };
        const key = await getKey();
        const plaintext = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: fromBase64(iv) },
            key,
            fromBase64(data),
        );
        const parsed = JSON.parse(dec.decode(plaintext));
        return Array.isArray(parsed)
            ? parsed.filter((t): t is string => typeof t === "string")
            : [];
    } catch {
        window.localStorage.removeItem(STORAGE_KEY);
        return [];
    }
};

export const saveTokens = async (tokens: string[]): Promise<void> => {
    if (!isBrowser()) return;

    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        enc.encode(JSON.stringify(tokens)),
    );

    window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
            iv: toBase64(iv),
            data: toBase64(new Uint8Array(ciphertext)),
        }),
    );
};

export const clearTokens = (): void => {
    if (!isBrowser()) return;
    window.localStorage.removeItem(STORAGE_KEY);
};
