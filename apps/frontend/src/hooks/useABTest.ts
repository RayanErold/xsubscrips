import { useState, useEffect } from "react";

export type Variant = "A" | "B";

export function useABTest(testName: string): Variant {
  const [variant, setVariant] = useState<Variant>("A");

  useEffect(() => {
    const storageKey = `ab-test-${testName}`;
    const savedVariant = localStorage.getItem(storageKey) as Variant;

    if (savedVariant && (savedVariant === "A" || savedVariant === "B")) {
      setVariant(savedVariant);
    } else {
      // Randomly assign A or B
      const newVariant: Variant = Math.random() < 0.5 ? "A" : "B";
      localStorage.setItem(storageKey, newVariant);
      setVariant(newVariant);
      
      // Log assignment for analytics
      console.log(`[AB Test] Assigned ${testName} -> ${newVariant}`);
    }
  }, [testName]);

  return variant;
}
