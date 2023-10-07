const { readdirSync } = require("fs");
const { join } = require("path");
const sharp = require("sharp");

const outDirFlagIndex = process.argv.indexOf('--out');
let outDir;
if (outDirFlagIndex > -1) {
    outDir = process.argv[outDirFlagIndex + 1];
} else {
    outDir = 'src';
}

const widthFlagIndex = process.argv.indexOf('--width');
let width;
if (widthFlagIndex > -1) {
    width_string = process.argv[widthFlagIndex + 1];
    width = parseInt(width_string)
} else {
    width = 1240;
}

const inDir = process.argv[process.argv.length - 1];

const jpgRegex = /\.jpe?g$/

readdirSync(inDir)
    .filter(path => jpgRegex.test(path))
    .forEach(path => {
        const inPath = join(inDir, path);
        let resized = sharp(inPath).resize({width: width});

        const avifPath = join(outDir, path.replace(jpgRegex, ".avif"));
        resized.avif().toFile(avifPath);
        console.log(`wrote ${inPath} => ${avifPath}`);

        const webpPath = join(outDir, path.replace(jpgRegex, ".webp"));
        resized.webp().toFile(webpPath);
        console.log(`wrote ${inPath} => ${webpPath}`);

        const jpegPath = join(outDir, path);
        resized.jpeg({ mozjpeg: true }).toFile(jpegPath);
        console.log(`wrote ${inPath} => ${jpegPath}`);
    });

