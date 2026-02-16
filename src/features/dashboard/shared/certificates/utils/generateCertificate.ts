/**
 * Generate a certificate image with the student's name overlaid
 * on the template and download it as PNG.
 */
export async function generateAndDownloadCertificate(
    name: string
): Promise<void> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = "/certificate-template.png";

        image.onload = async () => {
            // Ensure the Fredoka font is loaded before drawing on canvas
            await document.fonts.load("500 400px Fredoka");
            await document.fonts.ready;

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                reject("Canvas context not available");
                return;
            }

            canvas.width = image.width;
            canvas.height = image.height;

            ctx.drawImage(image, 0, 0);

            // Student name styling — large, brand-500 cyan, centered in gap
            // between "To our beloved..." (~48%) and "For Completing..." (~64%)
            ctx.font = "500 400px Fredoka, sans-serif";
            ctx.fillStyle = "#e4ae0e";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Name position: centered in the gap area (~55% from top)
            const nameY = Math.round(canvas.height * 0.55);
            ctx.fillText(name.toUpperCase(), canvas.width / 2, nameY);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject("Failed to generate image");
                        return;
                    }

                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `certificate-${name.replace(/\s+/g, "-")}.png`;

                    document.body.appendChild(link);
                    link.click();

                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);

                    resolve();
                },
                "image/png"
            );
        };

        image.onerror = () => reject("Failed to load certificate template image");
    });
}
