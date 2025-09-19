export default function handler(req, res) {
  console.log("tiny health invoked");
  return res.status(200).json({ ok: true, now: new Date().toISOString() });
}
