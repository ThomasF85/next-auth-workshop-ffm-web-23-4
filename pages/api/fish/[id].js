import fishData from "@/db/fish.json";

async function handler(req, res) {
  const { id } = req.query;
  switch (req.method) {
    case "GET":
      try {
        const fish = fishData.find((fish) => fish.id === id);
        if (!fish) {
          return res.status(404).json({ message: "fish not found" });
        }
        return res.status(200).json(fish);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "error" });
      }
    default:
      return res.status(405).json({ error: "method not allowed" });
  }
}

export default handler;
