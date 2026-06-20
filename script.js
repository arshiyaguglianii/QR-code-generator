
const qrText = document.getElementById("qrText");
const qrCodeDiv = document.getElementById("qrCode");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const downloadBtn = document.getElementById("downloadBtn");
const svgBtn = document.getElementById("svgBtn");
const qrSize = document.getElementById("qrSize");
const counter = document.getElementById("counter");
const typeLabel = document.getElementById("type");
const historyList = document.getElementById("history");
const themeToggle = document.getElementById("themeToggle");
const qrLabel = document.querySelector(".qr-label");

let historyItems =
JSON.parse(localStorage.getItem("qrHistory")) || [];

/* =========================
   Character Counter
========================= */

qrText.addEventListener("input", () => {

    const text = qrText.value.trim();

    counter.textContent =
        `${qrText.value.length} / 500`;

    if (
        text.startsWith("http://") ||
        text.startsWith("https://") ||
        text.startsWith("www.")
    ) {
        typeLabel.textContent = "URL";
    } else {
        typeLabel.textContent = "Text";
    }
});

/* =========================
   Enter Key Generate
========================= */

qrText.addEventListener("keydown", (e) => {

    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        generateQR();
    }

});

/* =========================
   Generate QR
========================= */

generateBtn.addEventListener("click", generateQR);

function generateQR() {

    const text = qrText.value.trim();

    if (!text) {
        alert("Please enter text or URL.");
        return;
    }

    qrCodeDiv.innerHTML = "";

    const size =
        parseInt(qrSize.value);

    new QRCode(qrCodeDiv, {
        text: text,
        width: size,
        height: size,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    qrLabel.textContent =
        "QR Code Generated Successfully";

    addToHistory(text);
}

/* =========================
   Copy Text
========================= */

copyBtn.addEventListener("click", async () => {

    const text =
        qrText.value.trim();

    if (!text) {
        alert("Nothing to copy.");
        return;
    }

    try {

        await navigator.clipboard.writeText(text);

        const originalText =
            copyBtn.textContent;

        copyBtn.textContent =
            "Copied ✓";

        setTimeout(() => {

            copyBtn.textContent =
                originalText;

        }, 1500);

    } catch (error) {

        alert("Failed to copy text.");

    }

});

/* =========================
   Clear Button
========================= */

clearBtn.addEventListener("click", () => {

    qrText.value = "";

    qrCodeDiv.innerHTML = "";

    counter.textContent =
        "0 / 500";

    typeLabel.textContent =
        "Text";

    qrLabel.textContent =
        "Your QR code appears here";

});

/* =========================
   Download PNG
========================= */

downloadBtn.addEventListener("click", () => {

    const canvas =
        qrCodeDiv.querySelector("canvas");

    if (!canvas) {
        alert("Generate a QR code first.");
        return;
    }

    const link =
        document.createElement("a");

    link.href =
        canvas.toDataURL("image/png");

    link.download =
        "quickqr.png";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

});

/* =========================
   Download SVG
========================= */

svgBtn.addEventListener("click", () => {

    const canvas =
        qrCodeDiv.querySelector("canvas");

    if (!canvas) {
        alert("Generate a QR code first.");
        return;
    }

    const pngData =
        canvas.toDataURL("image/png");

    const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg"
width="500"
height="500">
<image
href="${pngData}"
width="500"
height="500"/>
</svg>
`;

    const blob =
        new Blob(
            [svgContent],
            { type: "image/svg+xml" }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;
    link.download = "quickqr.svg";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

});

/* =========================
   Theme Toggle
========================= */

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle(
        "light-mode"
    );

    if (
        document.body.classList.contains(
            "light-mode"
        )
    ) {

        themeToggle.textContent =
            "☀️ Light Mode";

        localStorage.setItem(
            "theme",
            "light"
        );

    } else {

        themeToggle.textContent =
            "🌙 Dark Mode";

        localStorage.setItem(
            "theme",
            "dark"
        );
    }

});

/* =========================
   Load Theme
========================= */

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "light") {

    document.body.classList.add(
        "light-mode"
    );

    themeToggle.textContent =
        "☀️ Light Mode";
}

/* =========================
   History Functions
========================= */

function addToHistory(text) {

    historyItems =
        historyItems.filter(
            item => item !== text
        );

    historyItems.unshift(text);

    if (
        historyItems.length > 5
    ) {
        historyItems.pop();
    }

    localStorage.setItem(
        "qrHistory",
        JSON.stringify(historyItems)
    );

    renderHistory();
}

function renderHistory() {

    historyList.innerHTML = "";

    historyItems.forEach(item => {

        const li =
            document.createElement("li");

        li.textContent = item;

        li.title = item;

        li.addEventListener(
            "click",
            () => {

                qrText.value = item;

                counter.textContent =
                    `${item.length} / 500`;

                if (
                    item.startsWith("http://") ||
                    item.startsWith("https://") ||
                    item.startsWith("www.")
                ) {
                    typeLabel.textContent =
                        "URL";
                } else {
                    typeLabel.textContent =
                        "Text";
                }

                generateQR();
            }
        );

        historyList.appendChild(li);

    });

}

/* =========================
   Initial Load
========================= */

renderHistory();

