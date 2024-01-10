import loyaltyModel from "../models/loyaltyModel.js";

//addLoyalty
export const addLoyalty = async (req, res) => {
  try {
    const { purchaseAmount, loyaltyRewardAmount } = req.body;
    switch(true){
        case !purchaseAmount:
            return res.status(500).send({success: false, message: "purchase Amount can't be empty"});
        case !loyaltyRewardAmount:
            return res.status(500).send({success: false, message: "Loyalty Reward Amount can't be empty"});
    }
    await loyaltyModel.create({
        purchaseAmount,
        loyaltyRewardAmount
    })
    res.status(200).send({success: true, message:"New Loyalty Created Successfully"});
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error when creating loyalty",
    });
  }
};

//update Loyalty
export const updateLoyalty = async (req, res) => {
  try {
    const { purchaseAmount,  loyaltyRewardAmount} = req.body;
    const { id } = req.params;
    await loyaltyModel.findOneAndUpdate({
        _id:id
    },{
        purchaseAmount,
        loyaltyRewardAmount 
    }
    );
    res.status(200).send({
      success: true,
      messsage: "Loyalty Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating Loyalty",
    });
  }
};

//delete Loyalty
export const deleteLoyalty = async (req, res) => {
  try {
    const { id } = req.params;
    await loyaltyModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Loyalty Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while deleting Loyalty",
      error,
    });
  }
};
