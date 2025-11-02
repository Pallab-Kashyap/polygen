export function convertDriveLink(url: string): string {
  if (!url || typeof url !== "string") return url;

  // Already in correct format
  if (url.includes("uc?export=view&id=")) return url;

  if (url.includes("drive.google.com")) {
    let fileId: string | undefined;

    // Format: /file/d/{FILE_ID}/view or /d/{FILE_ID}/
    const match = url.match(/\/d\/([^/?]+)/);
    if (match) {
      fileId = match[1];
    }

    // Format: ?id={FILE_ID} (for open links)
    if (!fileId) {
      const idMatch = url.match(/[?&]id=([^&]+)/);
      if (idMatch) {
        fileId = idMatch[1];
      }
    }

    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }

  return url;
}
