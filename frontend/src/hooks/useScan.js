import { useEffect, useState } from "react";
import { createScan, getScan } from "../services/api";

export function useScan() {
  const [scan, setScan] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!scan || ["completed", "failed"].includes(scan.status)) return;
    const timer = setTimeout(() => getScan(scan.scan_id).then(setScan).catch((err) => setError(err.message)), 1500);
    return () => clearTimeout(timer);
  }, [scan]);
  return { scan, error, startScan: async (url) => { setError(""); setScan(await createScan(url)); } };
}
