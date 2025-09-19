import crypto from "crypto";

const syllabusColors = [
  "#ac725e",
  "#d06b64",
  "#f83a22",
  "#fa573c",
  "#ff7537",
  "#ffad46",
  "#42d692",
  "#16a765",
  "#7bd148",
  "#b3dc6c",
  "#fbe983",
  "#fad165",
  "#92e1c0",
  "#9fe1e7",
  "#9fc6e7",
  "#4986e7",
  "#9a9cff",
  "#b99aff",
  "#c2c2c2",
  "#cabdbf",
  "#cca6ac",
  "#f691b2",
  "#cd74e6",
  "#a47ae2",
];

function hashToInt(input: string) {
  const hash = crypto.createHash("sha1").update(input).digest();
  return hash.readUInt32BE(0);
}

const syllabusColorChooser = async () => {
  const id = crypto.randomUUID();

  const idx = hashToInt(id) % syllabusColors.length;
  const color = syllabusColors[idx];

  return color;
};

export default syllabusColorChooser;
