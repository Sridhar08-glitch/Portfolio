"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

/**
 * Soft client-side gate. There is no backend and the admin can't publish
 * anything on its own — it only edits a local draft and produces an export the
 * developer commits — so this is a convenience lock, not a security boundary.
 * The passphrase is NEXT_PUBLIC_ADMIN_KEY (default "sridhar-admin").
 */
const KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || "sridhar-admin";
const SESSION_FLAG = "sridhar-portfolio:admin-unlocked";
/** The typed passphrase is kept for the session so auto-publish can present it
 *  to the server-side check (ADMIN_PUBLISH_KEY) without re-prompting. */
export const SESSION_KEY = "sridhar-portfolio:admin-key";

export function Gate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(SESSION_FLAG) === "1");
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!unlocked) {
    return (
      <div className="grid min-h-screen place-items-center bg-adminBg px-4 text-adminInk">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (value === KEY) {
              sessionStorage.setItem(SESSION_FLAG, "1");
              sessionStorage.setItem(SESSION_KEY, value);
              setUnlocked(true);
            } else {
              setError(true);
            }
          }}
          className="w-full max-w-sm rounded-xl border border-adminLine bg-adminPanel p-8"
        >
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-adminAccent/15 text-adminAccent">
            <Lock size={20} />
          </div>
          <h1 className="mt-5 font-display text-2xl">Content editor</h1>
          <p className="mt-2 text-sm text-adminMuted">
            Enter the admin passphrase to edit a local draft. Nothing publishes
            until you export and commit.
          </p>
          <input
            type="password"
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            placeholder="Passphrase"
            aria-label="Admin passphrase"
            className="mt-5 w-full rounded-md border border-adminLine bg-adminBg px-3 py-2.5 text-sm outline-none focus:border-adminAccent"
          />
          {error && (
            <p className="mt-2 text-sm text-red-400">Incorrect passphrase.</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-adminAccent px-4 py-2.5 text-sm font-medium text-adminBg hover:opacity-90"
          >
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
