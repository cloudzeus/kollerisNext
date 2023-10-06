export default async function handler(req, res) {
    let data = req.body;
    try {
        return res.status(200).json({ success: true, result: data, message: "Never gonna give you up Never gonna let you down Never gonna run around and desert you Never gonna make you cry Never gonna say goodbye Never gonna tell a lie and hurt you" })
    } catch (e) {
        return res.status(500).json({ success: false, result: null })
    }
}
