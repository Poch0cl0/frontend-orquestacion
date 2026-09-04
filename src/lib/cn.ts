import clsx, { type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge no puede distinguir `text-display` (tamaño) de `text-ink` (color),
 * así que los tamaños y familias del design system se declaran explícitamente.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "headline-lg",
            "headline-md",
            "headline-sm",
            "body-lg",
            "body-md",
            "body-sm",
            "code",
            "label-md",
            "label-micro",
          ],
        },
      ],
      "font-family": [{ font: ["sans", "body", "mono"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
