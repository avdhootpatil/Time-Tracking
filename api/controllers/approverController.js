import { getApproversService } from "../services/approverService.js";

export const getApprovers = async (req, res) => {
  try {
    let userId = req.user.id;
    let approvers = await getApproversService(userId);
    res.status(200).send(approvers);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
