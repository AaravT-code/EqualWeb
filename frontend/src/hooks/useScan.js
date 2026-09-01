import { useEffect, useState } from "react";
import { createScan, getScan } from "../services/api";

export const RUNNING_STATUSES = ["queued", "rendering", "scanning", "analyzing"];

export function useScan() {
  const [scan, setScan] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!scan || !RUNNING_STATUSES.includes(scan.status)) return undefined;
    const timer = setTimeout(() => {
      getScan(scan.scan_id)
        .then(setScan)
        .catch((err) => setError(err.message));
    }, 1500);
    return () => clearTimeout(timer);
  }, [scan]);

  async function startScan(url) {
    setError("");
    setScan(null);
    try {
      setScan(await createScan(url));
    } catch (err) {
      setError(err.message);
    }
  }

  return { scan, error, startScan };
}
