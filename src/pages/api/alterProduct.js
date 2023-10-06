export default async function handler(req, res) {
    let data = req.body;
    try {
        return res.status(200).json({ success: true, result: data, message: "My milkshake brings all the boys to the yard And they're like, it's better than yours Damn right, it's better than yours I can teach you, but I have to charge My milkshake brings all the boys to the yard And they're like, it's better than yours Damn right, it's better than yours I can teach you, but I have to charge" })
    } catch (e) {
        return res.status(500).json({ success: false, result: null })
    }
}
