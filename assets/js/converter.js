const fs = require("fs");

let html = fs.readFileSync("certificates.html", "utf8");

let translations = {};

let titleIndex = 1;
let issuerIndex = 1;
let dateIndex = 1;

// -------------------
// Certificate Titles
// -------------------

html = html.replace(
    /data-i18n="cert_placeholder_title">([\s\S]*?)<\/h3>/g,
    (match, text) => {

        const value = text.trim().replace(/\s+/g, " ");

        const key = `cert_title_${titleIndex++}`;

        translations[key] = value;

        return `data-i18n="${key}">${text}</h3>`;
    }
);

// -------------------
// Issuers
// -------------------

html = html.replace(
    /data-i18n="cert_placeholder_issuer">([\s\S]*?)<\/p>/g,
    (match, text) => {

        const value = text.trim().replace(/\s+/g, " ");

        const key = `cert_issuer_${issuerIndex++}`;

        translations[key] = value;

        return `data-i18n="${key}">${text}</p>`;
    }
);

// -------------------
// Dates
// -------------------

html = html.replace(
    /data-i18n="cert_placeholder_date">([\s\S]*?)<\/span>/g,
    (match, text) => {

        const value = text.trim().replace(/\s+/g, " ");

        const key = `cert_date_${dateIndex++}`;

        translations[key] = value;

        return `data-i18n="${key}">${text}</span>`;
    }
);

fs.writeFileSync("certificates.html", html);

console.log("\n========== EN ==========\n");

console.log("{");

for (const [k, v] of Object.entries(translations)) {
    console.log(`    "${k}": "${v}",`);
}

console.log("}");

console.log("\nDone.");