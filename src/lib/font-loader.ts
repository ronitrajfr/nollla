import type { TextElement } from "./thumbnail-editor";

export const loadGoogleFonts = (textElements: TextElement[]) => {
  const uniqueFonts = Array.from(
    new Set(textElements.map((el) => el.fontFamily))
  );
  
  uniqueFonts.forEach((font) => {
    if (document.fonts.check(`16px "${font}"`)) return;

    const id = `google-font-${font.replace(/\s+/g, "-")}`;
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(
      /\s+/g,
      "+"
    )}:wght@400;700&display=swap`;
    document.head.appendChild(link);
  });
};

export const waitForFontsReady = async () => {
  await (document as any).fonts.ready;
}; 