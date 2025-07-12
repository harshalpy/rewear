import axios from "axios";

export const handleSwapInit = async ({ token, itemRequested , offeredItem = null , isPointSwap = false, pointsUsed = 0,}) => {
    try {
        const res = await axios.post(
            "http://localhost:4000/api/swaps",{
                item_requested: itemRequested,
                offered_item: offeredItem,
                is_point_swap: isPointSwap,
                points_used: pointsUsed,
            },{
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        return {
            data: res.data.swap,
            message: "Swap request sent 🚀",
        };
    }
    catch (err) {
        console.error("Swap error:", err?.response?.data || err.message);
        return {
            success: false,
            message:
                err?.response?.data?.message || "Unable to create swap, please try again",
        };
    }
};